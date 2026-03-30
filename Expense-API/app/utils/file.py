"""Utility functions for file handling."""

import io
import math
import mimetypes
import os
import zipfile

import filetype
import pandas as pd
from fastapi import HTTPException, UploadFile, status

from app.constants.expenses import OOXML_MIME_TO_EXT
from app.constants.file import ACCEPTED_EXT, ACCEPTED_MIME_TYPES


def normalize_filename(name: str) -> str:
    """Normalize filename by stripping whitespace and replacing newlines."""
    return name.strip().replace("\n", "_").replace("\r", "_")


def _get_ooxml_mime_type(namelist: list[str], content_types_xml: str) -> str | None:
    """Determine MIME type for OOXML files based on ZIP structure."""
    if any(name.startswith("xl/") for name in namelist):
        if "macroEnabled" in content_types_xml:
            return "application/vnd.ms-excel.sheet.macroEnabled.12"
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    if any(name.startswith("word/") for name in namelist):
        if "macroEnabled" in content_types_xml:
            return "application/vnd.ms-word.document.macroEnabled.12"
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if any(name.startswith("ppt/") for name in namelist):
        if "macroEnabled" in content_types_xml:
            return "application/vnd.ms-powerpoint.presentation.macroEnabled.12"
        return (
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        )

    return None


def handle_office_zip_formats(file_data: bytes) -> str | None:
    """Identify MIME type for Office Open XML files (docx, xlsx, pptx)."""
    if not zipfile.is_zipfile(io.BytesIO(file_data)):
        return None

    try:
        with zipfile.ZipFile(io.BytesIO(file_data)) as z:
            namelist = z.namelist()
            if "[Content_Types].xml" in namelist:
                try:
                    content_types_xml = z.read("[Content_Types].xml").decode(
                        "utf-8", errors="ignore"
                    )
                    return _get_ooxml_mime_type(namelist, content_types_xml)
                except Exception:
                    return _get_ooxml_mime_type(namelist, "")
            else:
                return _get_ooxml_mime_type(namelist, "")
    except zipfile.BadZipFile:
        return None
    except Exception:
        return None


def guess_file_metadata(
    file_data: bytes, fallback_filename: str = ""
) -> tuple[str, str]:
    """Guess file extension and MIME type based on content or filename."""
    container_mime = handle_office_zip_formats(file_data)
    if container_mime:
        ext = (
            OOXML_MIME_TO_EXT.get(container_mime)
            or mimetypes.guess_extension(container_mime)
            or os.path.splitext(fallback_filename)[1].lower().lstrip(".")
            or "bin"
        )
        return ext, container_mime

    kind = filetype.guess(file_data)
    if kind:
        return kind.extension, kind.mime

    mime, _ = mimetypes.guess_type(fallback_filename)
    ext = os.path.splitext(fallback_filename)[1].lower().lstrip(".")
    return ext or "unknown", mime or "application/octet-stream"


def read_upload_file(
    file: UploadFile,
    required_columns: set[str],
) -> pd.DataFrame:
    """Read an uploaded CSV/XLSX file and validates required headers."""
    file_data = file.file.read()
    ext, mime = guess_file_metadata(file_data, file.filename)
    ext = ext.lstrip(".").lower()

    if mime not in ACCEPTED_MIME_TYPES and ext not in ACCEPTED_EXT:
        raise HTTPException(
            400, detail=f"Unsupported file. Detected type: ext={ext}, mime={mime}"
        )

    try:
        if ext == "csv":
            text = file_data.decode("utf-8")
            df = pd.read_csv(io.StringIO(text))
        else:
            df = pd.read_excel(io.BytesIO(file_data), engine="openpyxl")
    except Exception:
        raise HTTPException(400, "Invalid file format. Unable to read data.")

    missing = required_columns - set(df.columns)
    if missing:
        raise HTTPException(
            400, detail=f"Missing required fields: {', '.join(missing)}"
        )

    return df


def generate_sample_excel(columns: list[str]) -> io.BytesIO:
    """Generate an empty Excel template with the given columns."""
    df = pd.DataFrame(columns=columns)
    buffer = io.BytesIO()
    df.to_excel(buffer, index=False)
    buffer.seek(0)
    return buffer


def required_cell(row, key: str, row_no: int, raise_exc: bool = True) -> str | None:
    """Return a required cell value or raise 422 if missing."""
    value = row.get(key)
    if value is None or (isinstance(value, (int, float)) and math.isnan(value)):
        if not raise_exc:
            return None
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Missing {key} at row {row_no}",
        )
    value = str(value).strip()
    if not value:
        if not raise_exc:
            return None
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail=f"Missing {key} at row {row_no}",
        )
    return value


def is_empty_cell(value) -> bool:
    """Return True if the cell value is considered empty (None, NaN, or blank)."""
    return (
        value is None
        or (isinstance(value, float) and math.isnan(value))
        or str(value).strip() == ""
    )
