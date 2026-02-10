import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "../styles/ArticleCard.module.css";

interface ArticleCardProps {
  title: string;
  date: string;
  description: string;
  featuredImage?: string;
  slug: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  date,
  description,
  featuredImage,
  slug,
}) => {
  return (
    <Link href={`/articles/${slug}`} className={styles.card}>
      {featuredImage && (
        <div className={styles.imageWrapper}>
          <Image
            src={featuredImage}
            alt={title}
            width={400}
            height={250}
            className={styles.image}
            quality={90}
          />
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.date}>{date}</p>
        <p className={styles.description}>{description}</p>
        <span className={styles.readMore}>Read more →</span>
      </div>
    </Link>
  );
};

export default ArticleCard;
