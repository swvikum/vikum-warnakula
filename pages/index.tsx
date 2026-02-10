import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Header from "../components/Header";
import Article from "../components/Article";
import styles from "../styles/Home.module.css";

interface ArticleData {
  title: string;
  date: string;
  description: string;
  content: string;
  featuredImage?: string;
  slug: string;
}

interface HomeProps {
  articles: ArticleData[];
}

const Home: React.FC<HomeProps> = ({ articles }) => {
  const router = useRouter();
  const [expandedArticleSlug, setExpandedArticleSlug] = useState<string | null>(null);

  // Read article slug from URL query params on mount and when router is ready
  useEffect(() => {
    if (router.isReady) {
      const articleSlug = router.query.article as string | undefined;
      if (articleSlug) {
        setExpandedArticleSlug(articleSlug);
        // Scroll to the article after a short delay to ensure it's rendered
        setTimeout(() => {
          const element = document.getElementById(`article-${articleSlug}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
    }
  }, [router.isReady, router.query.article]);

  const toggleArticle = (slug: string) => {
    const newSlug = expandedArticleSlug === slug ? null : slug;
    setExpandedArticleSlug(newSlug);
    
    // Update URL without page reload
    if (newSlug) {
      router.push(`/?article=${slug}`, undefined, { shallow: true });
    } else {
      router.push("/", undefined, { shallow: true });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}></div>
      <Header setHeaderHeight={() => {}} />
      <div className={styles.articlesGrid}>
        {articles.map((article) => (
          <div key={article.slug} id={`article-${article.slug}`}>
            <Article
              slug={article.slug}
              title={article.title}
              date={article.date}
              description={article.description}
              content={article.content}
              featuredImage={article.featuredImage}
              isExpanded={expandedArticleSlug === article.slug}
              onClick={() => toggleArticle(article.slug)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const articlesDir = path.join(process.cwd(), "articles");
  const filenames = fs.readdirSync(articlesDir);

  const articles = filenames.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const slug = filename.replace(/\.md$/, "");

    return {
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      content: content || "",
      featuredImage: data.featuredImage || null,
      slug,
    };
  });

  // Sort articles by date in descending order
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    props: {
      articles,
    },
  };
}

export default Home;