import React, { useState, useEffect, useMemo } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Header from "../../components/Header";
import ShareButton from "../../components/ShareButton";
import styles from "../../styles/ArticlePage.module.css";

// Dynamically import SyntaxHighlighter to avoid SSR issues
const SyntaxHighlighter = dynamic(
  () => import("react-syntax-highlighter").then((mod) => mod.default),
  { ssr: false }
);

interface ArticleData {
  title: string;
  date: string;
  description: string;
  content: string;
  featuredImage?: string;
  slug: string;
}

interface ArticlePageProps {
  article: ArticleData;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article }) => {
  const [monokaiStyle, setMonokaiStyle] = useState<any>(null);
  const articleUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/articles/${article.slug}`
    : "";

  useEffect(() => {
    import("react-syntax-highlighter/dist/esm/styles/hljs").then((mod) => {
      setMonokaiStyle(mod.monokai);
    });
  }, []);

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
    <>
      <Head>
        <title>{article.title} | Vikum Warnakula</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        {article.featuredImage && (
          <meta property="og:image" content={`${typeof window !== "undefined" ? window.location.origin : ""}${article.featuredImage}`} />
        )}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className={styles.container}>
        <div className={styles.background}></div>
        <Header setHeaderHeight={() => {}} />
        <div className={styles.articleWrapper}>
          <Link href="/" className={styles.backLink}>
            ← Back to Articles
          </Link>
          
          <article className={styles.article}>
            <header className={styles.articleHeader}>
              <h1 className={styles.title}>{article.title}</h1>
              <div className={styles.meta}>
                <span className={styles.date}>{article.date}</span>
                <ShareButton url={articleUrl} title={article.title} />
              </div>
              {article.description && (
                <p className={styles.description}>{article.description}</p>
              )}
            </header>

            {article.featuredImage && (
              <div className={styles.featuredImageContainer}>
                <Image
                  src={article.featuredImage}
                  alt={article.title}
                  width={1200}
                  height={600}
                  className={styles.featuredImage}
                  priority
                />
              </div>
            )}

            <div className={styles.content}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const articlesDir = path.join(process.cwd(), "articles");
  const filenames = fs.readdirSync(articlesDir);

  const paths = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    return {
      params: { slug },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const filePath = path.join(process.cwd(), "articles", `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    props: {
      article: {
        title: data.title || "",
        date: data.date || "",
        description: data.description || "",
        content: content || "",
        featuredImage: data.featuredImage || null,
        slug,
      },
    },
  };
};

export default ArticlePage;
