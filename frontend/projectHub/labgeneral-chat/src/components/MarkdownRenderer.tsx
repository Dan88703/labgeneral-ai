import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

function MarkdownRendererBase({ content }: MarkdownRendererProps) {
  return (
    <div className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, node: _node, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// Odpowiedzi AI są dopisywane fragment po fragmencie podczas streamingu —
// memo ogranicza ponowne renderowanie do wiadomości, których treść faktycznie się zmieniła.
export const MarkdownRenderer = memo(MarkdownRendererBase);
