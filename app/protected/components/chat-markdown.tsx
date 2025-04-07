// components/ChatMarkdown.tsx
import ReactMarkdown from "react-markdown";

export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mt-4 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-base font-semibold mt-3 mb-1" {...props} />,
          p: ({ node, ...props }) => <p className="leading-relaxed mb-2" {...props} />,
          li: ({ node, ...props }) => <li className="ml-6 list-disc" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
