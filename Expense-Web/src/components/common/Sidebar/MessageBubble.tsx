import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  isUser?: boolean;
  text: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  isUser = false,
}) => {
  return (
    <div
      className={cn(
        "border-orchid-frost text-ash-gray w-fit rounded-t-lg border px-4 py-2",
        isUser ? "self-end rounded-bl-lg" : "bg-bloom-lilac rounded-br-lg",
      )}
    >
      {text}
    </div>
  );
};

export default MessageBubble;
