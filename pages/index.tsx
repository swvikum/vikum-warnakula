import React, { useState } from "react";
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
}

interface HomeProps {
  articles: ArticleData[];
}

const Home: React.FC<HomeProps> = ({ articles }) => {
  const [expandedArticleIndex, setExpandedArticleIndex] = useState<number | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const toggleArticle = (index: number) => {
    setExpandedArticleIndex(index === expandedArticleIndex ? null : index);
  };

  return (
      <div className={styles.container}>
        <div className={styles.background}></div> {/* Background Image */}
        <Header setHeaderHeight={setHeaderHeight} />
        {articles.map((article, index) => (
            <Article
                key={index}
                title={article.title}
                date={article.date}
                description={article.description}
                content={article.content}
                isExpanded={expandedArticleIndex === index}
                onClick={() => toggleArticle(index)}
            />
        ))}
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

    return {
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      content: content || "",
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