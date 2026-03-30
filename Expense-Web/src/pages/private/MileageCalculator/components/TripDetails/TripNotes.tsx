import { Plus, X } from "lucide-react";
import React, { useState } from "react";

import { ASSET_PATH } from "@/helpers/constants/common";
import type { TripComment } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FileIcon from "@/components/common/FileIcon";
import { getFileExtension } from "@/lib/utils";
import TripNoteUploadModal from "./TripNoteUploadModal";
import MileageDocumentPreviewModal from "./MileageDocumentPreviewModal";

interface TripNotesProps {
  comments: TripComment[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  isSending?: boolean;
  newComment: string;
  pendingFile: File | null;
  isLoading?: boolean;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
  setNewComment: (value: string) => void;
  handleSendComment: () => void;
  handleFileUpload: (file: File) => void;
  removePendingFile: () => void;
}

const TripNotes = ({
  comments,
  inputRef,
  isSending,
  isLoading,
  newComment,
  pendingFile,
  chatContainerRef,
  setNewComment,
  handleSendComment,
  handleFileUpload,
  removePendingFile,
}: TripNotesProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    url: string;
    name: string;
    format: string;
  } | null>(null);

  const onOpenPreview = (msg: TripComment) => {
    if (msg.fileUrl && msg.fileName) {
      setPreviewData({
        url: msg.fileUrl,
        name: msg.fileName,
        format: getFileExtension(msg.fileName),
      });
    }
  };

  const onFileSelected = (file: File) => {
    handleFileUpload(file);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-4xl bg-white p-4 shadow-sm ring-1 ring-gray-50 sm:gap-6 sm:p-6">
      <div
        ref={chatContainerRef}
        className="scrollbar-hide scrollbar-thin flex max-h-[350px] flex-col gap-6 overflow-y-auto scroll-smooth pb-4 sm:gap-8"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-2">
            <p className="text-sm text-gray-400">Loading notes...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarFallback className="bg-iced-lavender text-vivid-violet text-[10px] font-bold uppercase">
                    {msg.userName?.[0] || "-"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <span className="bg-mint-whisper rounded px-2 py-0.5 text-[11px] font-semibold text-gray-700 sm:text-xs">
                    {msg.userName}
                  </span>
                  <span className="text-xs text-gray-400">:</span>
                </div>
              </div>

              {msg.text && (
                <p className="pl-0 text-xs leading-relaxed font-medium wrap-break-word text-gray-900 sm:pl-8 sm:text-sm">
                  {msg.text}
                </p>
              )}

              {msg.fileName && (
                <div
                  className="ml-0 flex w-fit cursor-pointer items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:bg-gray-100 sm:ml-8"
                  onClick={() => onOpenPreview(msg)}
                >
                  <FileIcon
                    type={getFileExtension(msg.fileName)}
                    classname="h-4 w-4 sm:h-5 sm:w-5 shrink-0"
                  />
                  <span className="max-w-[150px] truncate text-[11px] font-semibold text-gray-700 sm:max-w-[200px] sm:text-xs">
                    {msg.fileName}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-2">
            <p className="text-sm text-gray-400">No notes yet</p>
          </div>
        )}
      </div>

      {/* Input Box Area */}
      <div className="group relative space-y-3">
        {/* Pinned File Preview */}
        {pendingFile && (
          <div className="bg-misty-azure border-pale-sky animate-in fade-in slide-in-from-bottom-2 flex w-fit items-center gap-3 rounded-lg border p-2">
            <FileIcon
              type={getFileExtension(pendingFile.name)}
              classname="h-5 w-5"
            />
            <span className="max-w-[200px] truncate text-xs font-semibold text-gray-700">
              {pendingFile.name}
            </span>
            <button
              onClick={removePendingFile}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        <div className="border-pale-sky bg-misty-azure flex h-10 items-center gap-3 rounded-lg border p-2 pr-2 shadow-sm transition-all focus-within:ring-2 focus-within:ring-cyan-100">
          <input
            ref={inputRef}
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            placeholder="Type here to leave a message"
            className="placeholder:text-cool-gray w-full bg-transparent px-2 text-xs font-medium text-gray-700 placeholder:italic focus:outline-none"
            disabled={isSending}
          />
          <div className="flex items-center gap-2">
            <button
              className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
              disabled={isSending}
              onClick={() => setIsUploadModalOpen(true)}
            >
              <Plus className="h-3 w-3" />
            </button>
            <button
              onClick={handleSendComment}
              disabled={(!newComment.trim() && !pendingFile) || isSending}
              className="bg-vivid-violet/90 hover:bg-vivid-violet flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              <img src={`${ASSET_PATH}/icons/send.svg`} alt="Send" />
            </button>
          </div>
        </div>
      </div>

      <TripNoteUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={onFileSelected}
      />

      {previewData && (
        <MileageDocumentPreviewModal
          url={previewData.url}
          name={previewData.name}
          format={previewData.format}
          isOpen={!!previewData}
          onClose={() => setPreviewData(null)}
        />
      )}
    </div>
  );
};

export default TripNotes;
