import React, { useState } from "react";
import styles from "../styles/ShareButton.module.css";

interface ShareButtonProps {
  url: string;
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    }
  };

  return (
    <button onClick={handleShare} className={styles.shareButton}>
      {copied ? (
        <>
          <span className={styles.icon}>✓</span>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <span className={styles.icon}>🔗</span>
          <span>Share</span>
        </>
      )}
    </button>
  );
};

export default ShareButton;
