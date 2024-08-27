import React from "react";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const profileData = {
    name: "Vikum Warnakula",
    title: "Software Engineer in Test @ Deputy",
    profileImgSrc: "/profile.jpg",
    socialLinks: [
        { href: "https://www.linkedin.com/in/vikum-warnakula/", label: "LinkedIn" },
        { href: "https://github.com/swvikum", label: "GitHub" },
        {
            href: "https://www.instagram.com/sky_mantis?igsh=c2l2a3RjZXh5aGxi&utm_source=qr",
            label: "SkyMantis",
        },
    ],
};

interface HeaderProps {
    setHeaderHeight: (height: number) => void;
}

const Header: React.FC<HeaderProps> = ({ setHeaderHeight }) => {
    const { name, title, profileImgSrc, socialLinks } = profileData;

    const renderSocialLinks = () =>
        socialLinks.map((link, index) => (
            <span key={index}>
        <a href={link.href}>{link.label}</a>
                {index < socialLinks.length - 1 && " | "}
      </span>
        ));

    return (
        <header className={styles.header}>
            <Image
                src={profileImgSrc}
                alt="Profile Picture"
                className={styles.profileImg}
                width={175}
                height={175}
                quality={100} // Optional: Adjust quality as needed
            />
            <h1>{name}</h1>
            <p>{title}</p>
            <p>{renderSocialLinks()}</p>
        </header>
    );
};

export default Header;