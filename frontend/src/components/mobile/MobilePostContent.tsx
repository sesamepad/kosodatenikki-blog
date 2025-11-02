import facebook from "@/assets/facebook.svg";
import line from "@/assets/line.svg";
import x from "@/assets/x.svg";
import RelationPosts from "@/components/common/RelationPosts";
import MobileCategoriesSection from "@/components/mobile/MobileCategoriesSection";
import MobileProfileSection from "@/components/mobile/MobileProfileSection";
import MobileTagsSection from "@/components/mobile/MobileTagsSection";
import "@/styles/mobile/MobileMarkdownBody.css";
import "@/styles/mobile/MobilePostContent.css";
import type { CodeProps } from "@/types/react-markdown";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import remarkGfm from "remark-gfm";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

type Props = {
  id: string | undefined;
  title: string;
  category: string;
  tags?: string[];
  updateDate: string;
  content: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MobilePostContent: React.FC<Props> = ({
  id,
  title,
  category,
  tags = [],
  updateDate,
  content,
}) => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const targetElement = document.getElementById("set-point");
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div className="mobile-markdown-body">
        <h1 id="set-point">{title}</h1>
        <img
          src={`${API_BASE_URL}/images/${id}/cover.jpg`}
          alt="サムネイル画像"
          className="mobile-post-content-thumbnail"
        />

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ inline, className, children, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  className="code-block"
                  language={match[1]}
                  PreTag="div"
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
            img({ src = "", alt }) {
              let newSrc = src;

              // .jpg / .jpeg / .png のみ対応
              const isImageFile = /^[^/]+\.(jpe?g|png)$/i.test(src);

              if (isImageFile) {
                newSrc = `${API_BASE_URL}/images/${id}/${src}`;
              }

              return <img src={newSrc} alt={alt} />;
            },
          }}
        >
          {content}
        </ReactMarkdown>

        <div className="post-footer">
          <div className="post-footer-inner">
            {/* メタ情報 */}
            <div className="post-meta">
              <span className="meta-item">
                <span role="img" aria-label="Folder icon">
                  📂
                </span>
                <a href={`/category/${category}`} className="meta-link">
                  {category}
                </a>
              </span>
              <span className="meta-item">
                <span role="img" aria-label="Clock icon">
                  🕒
                </span>
                {updateDate}
              </span>

              {tags && tags.length > 0 && (
                <div className="meta-item post-tags">
                  <span role="img" aria-label="Tag icon">
                    🏷️
                  </span>
                  {Array.isArray(tags) &&
                    tags.map((tag, index) => (
                      <a
                        key={index}
                        href={`/tags/${tag}`}
                        className="post-tag-link"
                      >
                        #{tag}
                      </a>
                    ))}
                </div>
              )}
            </div>

            {/* シェアボタン */}
            <div className="share-buttons">
              <span className="share-text">Share:</span>
              <a
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(
                  title
                )}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button twitter"
                aria-label="Share on X"
              >
                {/* Xアイコン (SVGまたはアイコンコンポーネントをここに配置) */}
                <img src={x} alt="X" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button facebook"
                aria-label="Share on Facebook"
              >
                {/* Facebookアイコン */}
                <img src={facebook} alt="Facebook" />
              </a>
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-button line"
                aria-label="Share on LINE"
              >
                {/* LINEアイコン */}
                <img src={line} alt="LINE" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <RelationPosts id={String(id)} />
      <MobileProfileSection />
      <MobileCategoriesSection />
      <MobileTagsSection />
    </>
  );
};

export default MobilePostContent;
