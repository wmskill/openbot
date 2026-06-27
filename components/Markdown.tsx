"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

export default function Markdown({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ className, children, ...props }) {
          const isBlock = className?.includes("language-");
          if (isBlock) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
          return (
            <code className="bg-gray-700 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return (
            <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto my-2">
              {children}
            </pre>
          );
        },
        table({ children }) {
          return (
            <div className="overflow-x-auto my-2">
              <table className="border-collapse border border-gray-600 text-xs">{children}</table>
            </div>
          );
        },
        th({ children }) {
          return <th className="border border-gray-600 px-3 py-2 bg-gray-700 font-semibold">{children}</th>;
        },
        td({ children }) {
          return <td className="border border-gray-600 px-3 py-2">{children}</td>;
        },
        a({ children, ...props }) {
          return (
            <a className="text-violet-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          );
        },
        ul({ children }) {
          return <ul className="list-disc list-inside my-1">{children}</ul>;
        },
        ol({ children }) {
          return <ol className="list-decimal list-inside my-1">{children}</ol>;
        },
        blockquote({ children }) {
          return (
            <blockquote className="border-l-4 border-violet-500 pl-3 italic text-gray-400 my-2">
              {children}
            </blockquote>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
