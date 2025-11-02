import banner from "@/assets/banner.png";
import SEO from "@/components/common/SEO";
import "@/styles/common/PrivacyPage.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function PrivacyPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <SEO
        title={"プライバシーポリシー"}
        description={"子育てや趣味や旅行に関する記事をブログにしています。"}
        url={""}
        image={banner}
      />
      <div className="privacy-container" id="set-point">
        <h1>プライバシーポリシー</h1>

        <p>
          当ブログでは、以下の方針に基づき、個人情報の取り扱いに細心の注意を払っています。
        </p>

        <h2>1. 個人情報の取得について</h2>
        <p>
          当ブログでは、お問い合わせフォームを通じて、名前・メールアドレス等の個人情報をご提供いただく場合があります。
          これらの情報は、お問い合わせへの回答や必要なご連絡のために使用するものであり、それ以外の目的では使用いたしません。
        </p>

        <h2>2. 個人情報の管理について</h2>
        <p>
          取得した個人情報は適切に管理し、外部への漏洩、改ざん、紛失等を防止するために合理的な安全対策を講じます。
        </p>

        <h2>3. 個人情報の第三者提供について</h2>
        <p>
          ご本人の同意がある場合、または法令に基づく場合を除き、第三者に個人情報を提供することはありません。
        </p>

        <h2>4. Cookieの使用について</h2>
        <p>
          当ブログでは、サイトの利用状況の把握や利便性向上のためにCookieを使用する場合があります。
          Cookieはユーザーのブラウザ設定により無効化できます。
        </p>

        <h2>5. アクセス解析ツールについて</h2>
        <p>
          当ブログでは、Googleアナリティクス等のアクセス解析ツールを利用する場合があります。
          これにより収集される情報は匿名であり、個人を特定するものではありません。
        </p>

        <h2>6. 免責事項</h2>
        <p>
          当ブログからリンクされている外部サイトにおける情報提供や個人情報の取り扱いについては、当ブログでは責任を負いかねます。
        </p>

        <h2>7. プライバシーポリシーの変更について</h2>
        <p>
          本ポリシーは必要に応じて見直し・改定されることがあります。
          最新の内容は本ページに常に掲載いたします。
        </p>

        <p>制定日：2025年7月16日</p>
      </div>
    </>
  );
}
