import { authenticator } from "otplib";

export class TotpService {
  /**
   * TOTPシークレットを生成するだけの最小処理
   */
  static generateSecret(): string {
    const secret = authenticator.generateSecret();
    return secret;
  }
}
