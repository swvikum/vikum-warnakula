import Image from "next/image";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ShareButton from "./ShareButton";
import styles from "../styles/Article.module.css";

// Dynamically import SyntaxHighlighter to avoid SSR issues
const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.default),
  { ssr: false }
);

interface ArticleProps {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
  featuredImage?: string;
  isExpanded: boolean;
  onClick: () => void;
}

const Article: React.FC<ArticleProps> = ({
  slug,
  title,
  date,
  description,
  content,
  featuredImage,
  isExpanded,
  onClick,
}) => {
  const [monokaiStyle, setMonokaiStyle] = useState<any>(null);
  const articleUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/?article=${slug}`
    : "";

  useEffect(() => {
    if (isExpanded && !monokaiStyle) {
      import("react-syntax-highlighter/dist/esm/styles/hljs").then((mod) => {
        setMonokaiStyle(mod.monokai);
      });
    }
  }, [isExpanded, monokaiStyle]);

  const markdownComponents = useMemo(() => ({
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <div className={styles.imageContainer}>
        <Image
          src={src || ""}
          alt={alt || ""}
          width={800}
          height={500}
          className={styles.contentImage}
          quality={100}
        />
        {alt && <p className={styles.imageDescription}>{alt}</p>}
      </div>
    ),
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return match && monokaiStyle ? (
        <SyntaxHighlighter
          style={monokaiStyle}
          language={match[1]}
          PreTag="div"
          className={styles["code-block"]}
          {...(props as any)}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  }), [monokaiStyle]);

  return (
    <div className={styles.article}>
      <div className={styles.header} onClick={onClick}>
        {featuredImage && (
          <div className={styles.thumbnail}>
            <Image
              src={featuredImage}
              alt={title}
              width={120}
              height={80}
              className={styles.thumbnailImage}
              quality={80}
            />
          </div>
        )}
        <div className={styles.headerContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.date}>{date}</p>
          <p className={styles.description}>{description}</p>
        </div>
        <span className={styles.expandIcon}>{isExpanded ? "▼" : "▶"}</span>
      </div>
      {isExpanded && (
        <div className={styles.content}>
          <div className={styles.articleHeader}>
            <ShareButton url={articleUrl} title={title} />
          </div>
          {featuredImage && (
            <div className={styles.featuredImageContainer}>
              <Image
                src={featuredImage}
                alt={title}
                width={800}
                height={400}
                className={styles.featuredImage}
                quality={100}
              />
            </div>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Article;