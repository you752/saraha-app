import crypto from "crypto";
import { getEnv } from "../../../../config/env.service.js";

export const EncryptWord = async (word) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashedWord = await new Promise((resolve, reject) => {
    crypto.pbkdf2(
      String(word),
      salt,
      Number(getEnv("ITERATIONS")),
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(`${salt}:${derivedKey.toString("hex")}`);
      },
    );
  });

  return hashedWord;
};