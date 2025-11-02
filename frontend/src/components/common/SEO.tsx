import { Helmet } from "react-helmet";

type SEOProps = {
  title: string;
  description: string;
  url?: string;
  image?: string;
};

export default function SEO({ title, description, url, image }: SEOProps) {
  const siteName = "ちゃそママ子育て日記";
  const pageUrl = url ?? window.location.href;

  return (
    <Helmet>
      <title>
        {title} | {siteName}
      </title>
      <meta name="description" content={description} />

      {/* OGP */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={pageUrl} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitterカード */}
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
