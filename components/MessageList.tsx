import { Message } from "./types";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: Props) {
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Como posso ajudar?</h2>
          <p className="text-gray-400">Envie uma mensagem para começar a conversar com a IA.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <TypingIndicator />
        </div>
      )}
    </div>
  );
}
