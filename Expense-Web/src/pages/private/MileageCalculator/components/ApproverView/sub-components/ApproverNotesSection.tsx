import { Plus, X } from "lucide-react";
import React, { useState } from "react";

import { ASSET_PATH } from "@/helpers/constants/common";
import type { TripComment } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FileIcon from "@/components/common/FileIcon";
import { getFileExtension } from "@/lib/utils";
import TripNoteUploadModal from "../../TripDetails/TripNoteUploadModal";
import MileageDocumentPreviewModal from "../../TripDetails/MileageDocumentPreviewModal";

interface ApproverNotesSectionProps {
  comments: TripComment[];
  isSending: boolean;
  newComment: string;
  pendingFile: File | null;
  setNewComment: (val: string) => void;
  handleFileUpload: (file: File) => void;
  handleSendComment: () => void;
  removePendingFile: () => void;
}

const ApproverNotesSection: React.FC<ApproverNotesSectionProps> = ({
  comments,
  isSending,
  newComment,
  pendingFile,
  setNewComment,
  handleFileUpload,
  handleSendComment,
  removePendingFile,
}) => {
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
    <div className="border-frosted-white-gray rounded-3xl border bg-white p-4 shadow-sm sm:p-8">
      <div className="space-y-8 sm:space-y-12">
        <div className="scrollbar-thin max-h-[300px] space-y-6 overflow-y-auto pr-2 sm:space-y-8">
          {comments.length > 0 ? (
            comments.map((msg: TripComment, index: number) => (
              <div
                key={msg.id || index}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3">
                  <span className="text-slate-cool shrink-0 text-[10px] font-bold uppercase sm:mt-0.5 sm:text-xs sm:normal-case">
                    Notes from
                  </span>
                  <div className="flex flex-1 items-start gap-2">
                    <Avatar className="h-5 w-5 shrink-0 border border-gray-100">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-soft-rose-mist pointer-events-none text-[9px] font-bold text-rose-500 uppercase">
                        {msg.userName?.[0] || "-"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <span className="text-deep-charcoal text-[11px] font-bold sm:text-xs">
                          {msg.userName} :
                        </span>
                        <span className="text-[9px] text-gray-400 sm:text-[10px]">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="text-dim-gray text-[11px] leading-[160%] font-medium wrap-break-word sm:text-xs">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </div>

                {msg.fileName && (
                  <div
                    className="mt-1 ml-0 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:bg-gray-100 sm:mt-0 sm:ml-[100px] sm:gap-3"
                    onClick={() => onOpenPreview(msg)}
                  >
                    <FileIcon
                      type={getFileExtension(msg.fileName)}
                      classname="h-4 w-4 shrink-0"
                    />
                    <span className="max-w-[150px] truncate text-[10px] font-semibold text-gray-700 sm:max-w-[200px] sm:text-[11px]">
                      {msg.fileName}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex h-20 items-center justify-center">
              <p className="text-xs font-medium text-gray-400">No notes yet</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {pendingFile && (
            <div className="bg-azure-whisper/60 border-sky-tint animate-in fade-in slide-in-from-bottom-2 flex w-fit items-center gap-3 rounded-lg border p-2">
              <FileIcon
                type={getFileExtension(pendingFile.name)}
                classname="h-4 w-4"
              />
              <span className="max-w-[200px] truncate text-[11px] font-semibold text-gray-700">
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

          {/* Chat Input Field */}
          <div className="border-sky-tint bg-azure-whisper/60 flex items-center gap-3 rounded-2xl border p-2.5 transition-all focus-within:ring-2 focus-within:ring-cyan-100/50">
            <input
              type="text"
              placeholder="Type here to leave a message"
              className="w-full bg-transparent px-3 text-[13px] font-medium text-gray-600 italic placeholder:text-gray-400 focus:outline-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
              disabled={isSending}
            />
            <div className="flex items-center gap-3 pr-2">
              <button
                className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200"
                onClick={() => setIsUploadModalOpen(true)}
                disabled={isSending}
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={handleSendComment}
                disabled={(!newComment.trim() && !pendingFile) || isSending}
                className="bg-vivid-violet flex h-7 w-7 items-center justify-center rounded-full text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                <img
                  src={`${ASSET_PATH}/icons/send.svg`}
                  className="h-3 w-3"
                  alt="send"
                />
              </button>
            </div>
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

export default ApproverNotesSection;
