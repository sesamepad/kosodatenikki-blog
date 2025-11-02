import profile_img from "@/assets/about-profile.jpg";
import banner from "@/assets/banner.png";
import SEO from "@/components/common/SEO";
import "@/styles/common/AboutPage.css";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <SEO
        title={"当ブログについて"}
        description={"子育てや趣味や旅行に関する記事をブログにしています。"}
        url={""}
        image={banner}
      />
      <div className="about-container" id="set-point">
        <h1>当ブログについて</h1>
        <h2>＜プロフィール＞</h2>
        <img src={profile_img} alt="プロフィール画像" className="profile-img" />
        <p>ちゃそママ：一児のママ×パート主婦</p>
        <p>
          はじめまして！ちゃそママです。
          <br />
          一児の子育てに奮闘中な主婦です。
          <br />
          日々の暮らしの様子や旅行レポなどを発信していきます。
          <br />
          少しでも誰かの参考になったり、クスっと楽しんでもらえたら嬉しいです。
          <br />
        </p>

        <h2>＜このブログで発信していること＞</h2>
        <ul>
          <li>日々の暮らしの様子</li>
          <li>子連れ旅行レポ</li>
          <li>おすすめの料理レシピ</li>
        </ul>
        <p>などをお届けしていきます！</p>

        <h2>＜お問い合わせ・SNS＞</h2>
        <p>
          お仕事のご依頼やページに関するお問い合わせは、
          <Link to="/contact#set-point">お問い合わせページ</Link>
          よりお気軽にご連絡ください。
          <br />
          Instagramもやっていますのでお気軽にどうぞ♪
        </p>

        <h2>＜最後に＞</h2>
        <p>
          私が今まで悩んでいた時に色んな方のブログを読んで精神的に支えてもらったように
          <br />
          私のブログで少しでも誰かの役に立ったり、参考になる事ができればいいなと思っています。
          <br />
          良かったらのんびり読んでいってください♪
        </p>
      </div>
    </>
  );
}
