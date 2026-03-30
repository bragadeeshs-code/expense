import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import {
  getTravelExpenseNotes,
  addTravelExpenseNote,
} from "@/services/mileage.service";
import type { TripComment } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

export const useTripComments = (expenseId: number) => {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["travel-expense-notes", expenseId],
    queryFn: () => getTravelExpenseNotes(expenseId),
    enabled: !!expenseId,
  });

  const addNoteMutation = useMutation({
    mutationFn: (variables: { notesText?: string; file?: File }) =>
      addTravelExpenseNote({
        notes: variables.notesText,
        expense_id: expenseId,
        file: variables.file,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["travel-expense-notes", expenseId],
      });
      setNewComment("");
      setPendingFile(null);
    },
  });

  const comments: TripComment[] = notes.map((note, index) => ({
    id: index,
    text: note.notes,
    userName: note.created_by,
    timestamp: format(parseISO(note.created_at), "HH:mm"),
    isCurrentUser: false,
    fileName: note.file_name,
    fileUrl: note.file_url,
  }));

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSendComment = () => {
    if ((!newComment.trim() && !pendingFile) || addNoteMutation.isPending)
      return;
    addNoteMutation.mutate({
      notesText: newComment.trim() || undefined,
      file: pendingFile || undefined,
    });
  };

  const handleUploadFile = (file: File) => {
    setPendingFile(file);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removePendingFile = () => {
    setPendingFile(null);
  };

  return {
    comments,
    newComment,
    pendingFile,
    setNewComment,
    chatContainerRef,
    inputRef,
    handleSendComment,
    handleUploadFile,
    removePendingFile,
    isLoading,
    isSending: addNoteMutation.isPending,
  };
};
