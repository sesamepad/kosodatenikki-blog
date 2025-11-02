import banner from "@/assets/banner.png";
import SEO from "@/components/common/SEO";
import DesktopPostContent from "@/components/desktop/DesktopPostContent";
import MobilePostContent from "@/components/mobile/MobilePostContent";
import { useIsMobile } from "@/hooks/useIsMobile";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type PostData = {
  title: string;
  category: string;
  tags: string[];
  updateDate: string;
  content: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PostPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<PostData | null>(null);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();
  const PostContent = isMobile ? MobilePostContent : DesktopPostContent;

  useEffect(() => {
    fetch(`/api/post/${id}`)
      .then((res) => res.json())
      .then((data) => setData(data ?? null))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return <div>読み込みに失敗しました。</div>;
  }

  if (!data) {
    return <div>読み込み中...</div>;
  }

  return (
    <>
      <SEO
        title={data.title}
        description={String(data.content).slice(0, 120)}
        url={`${API_BASE_URL}/images/${id}/cover.jpg`}
        image={banner}
      />
      <div className="post-wrapper">
        <PostContent
          id={id}
          title={data.title}
          category={data.category}
          tags={data.tags}
          updateDate={data.updateDate}
          content={data.content}
        />
      </div>
    </>
  );
};

export default PostPage;
