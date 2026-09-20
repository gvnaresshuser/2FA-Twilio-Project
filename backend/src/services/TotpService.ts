import speakeasy from "speakeasy";
import QRCode from "qrcode";

import { AppDataSource } from "../config/database.js";
import { TwofaTotp } from "../entities/TwofaTotp.js";
import { TwofaUser } from "../entities/TwofaUser.js";

class TotpService {
  private totpRepository =
    AppDataSource.getRepository(TwofaTotp);

  private userRepository =
    AppDataSource.getRepository(TwofaUser);

  async setup(userId: number) {
    // 1. Find the authenticated user
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Check whether TOTP already exists
    let totp = await this.totpRepository.findOne({
      where: {
        userId,
      },
    });

    // 3. If TOTP is already enabled, don't create another secret
    if (totp?.enabled) {
      throw new Error("TOTP is already enabled for this user");
    }

    // 4. Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `2FA Demo (${user.email})`,
      issuer: "2FA Demo",
      length: 20,
    });

    if (!secret.otpauth_url) {
      throw new Error(
        "Failed to generate TOTP authentication URL",
      );
    }

    // 5. Generate QR code
    const qrCode = await QRCode.toDataURL(
      secret.otpauth_url,
    );

    // 6. Save the secret
    if (totp) {
      totp.secret = secret.base32;
      totp.enabled = false;

      await this.totpRepository.save(totp);
    } else {
      totp = this.totpRepository.create({
        userId,
        secret: secret.base32,
        enabled: false,
      });

      await this.totpRepository.save(totp);
    }

    // 7. Return setup information
    return {
      qrCode,
      otpauthUrl: secret.otpauth_url,
      enabled: false,
    };
  }
  //------------------------------
  async verify(userId: number, code: string) {
  // 1. Find the user's TOTP configuration
  const totp = await this.totpRepository.findOne({
    where: {
      userId,
    },
  });

  if (!totp) {
    throw new Error("TOTP setup not found");
  }

  // 2. Prevent verification if TOTP is already enabled
  if (totp.enabled) {
    throw new Error("TOTP is already enabled");
  }

  // 3. Verify the 6-digit TOTP code
  const verified = speakeasy.totp.verify({
    secret: totp.secret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!verified) {
    throw new Error("Invalid TOTP code");
  }

  // 4. Enable TOTP after successful verification
  totp.enabled = true;

  await this.totpRepository.save(totp);

  return {
    enabled: true,
  };
}

async getStatus(userId: number) {
  const totp = await this.totpRepository.findOne({
    where: {
      userId,
    },
  });

  return {
    configured: !!totp,
    enabled: totp?.enabled ?? false,
  };
}

async disable(userId: number, code: string) {
  // 1. Find the user's TOTP configuration
  const totp = await this.totpRepository.findOne({
    where: {
      userId,
    },
  });

  if (!totp) {
    throw new Error("TOTP setup not found");
  }

  // 2. Check whether TOTP is currently enabled
  if (!totp.enabled) {
    throw new Error("TOTP is already disabled");
  }

  // 3. Verify the current TOTP code
  const verified = speakeasy.totp.verify({
    secret: totp.secret,
    encoding: "base32",
    token: code,
    window: 1,
  });

  if (!verified) {
    throw new Error("Invalid TOTP code");
  }

  // 4. Disable TOTP
  totp.enabled = false;

  await this.totpRepository.save(totp);

  return {
    enabled: false,
  };
}
}

export default new TotpService();