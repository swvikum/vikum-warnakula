import Image from "next/image";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { monokai } from "react-syntax-highlighter/dist/cjs/styles/prism";
import styles from "../styles/Article.module.css";

interface ArticleProps {
  title: string;
  date: string;
  description: string;
  content: string;
  isExpanded: boolean;
  onClick: () => void;
}

const Article: React.FC<ArticleProps> = ({
  title,
  date,
  description,
  content,
  isExpanded,
  onClick,
}) => {
  return (
    <div className={styles.article}>
      <h2 className={styles.title} onClick={onClick}>
        {title}
      </h2>
      <p className={styles.date}>{date}</p>
      <p className={styles.description}>{description}</p>
      {isExpanded && (
        <div className={styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt }) => (
                <div className={styles.imageContainer}>
                  <Image
                    src={src || ""}
                    alt={alt || ""}
                    width={600} // adjust as necessary
                    height={400} // adjust as necessary
                    layout="responsive"
                    quality={100}
                  />
                  {alt && <p className={styles.imageDescription}>{alt}</p>}
                </div>
              ),
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    style={monokai}
                    language={match[1]}
                    PreTag="div"
                    className={styles["code-block"]}
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Article;