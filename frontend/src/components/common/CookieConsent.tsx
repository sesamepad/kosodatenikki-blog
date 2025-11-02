import { useEffect } from "react";

// CookieConsent.tsx
export default function CookieConsent() {
  useEffect(() => {
    const handleConsent = () => {
      if (window.CookieConsent && window.CookieConsent.consent) {
        const adConsent = window.CookieConsent.consent.given.includes(
          "marketing"
        )
          ? "granted"
          : "denied";

        // AdSense Consent Mode 更新
        if (window.gtag) {
          window.gtag("consent", "update", { ad_storage: adConsent });
        }
      }
    };

    // Cookiebot 初期化後に発火
    window.addEventListener("CookieConsentDeclaration", handleConsent);

    // クリーンアップ
    return () => {
      window.removeEventListener("CookieConsentDeclaration", handleConsent);
    };
  }, []);

  return null; // UIは不要
}
