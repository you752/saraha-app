import jwt from "jsonwebtoken";
import { getEnv } from "../../../../config/env.service.js";
import userModel from "../../../database/models/user.model.js";
import { clientRedius } from "../../../database/redisConnection.js";

export const ROLES = {
  USER: 0,
  ADMIN: 1,
};

const SIGNATURES = {
  [ROLES.USER]: getEnv("USER_SIGNATURE"),
  [ROLES.ADMIN]: getEnv("ADMIN_SIGNATURE"),
};

const REFRESH_SIGNATURES = {
  [ROLES.USER]: getEnv("USER_REFRESH_SIGNATURE"),
  [ROLES.ADMIN]: getEnv("ADMIN_REFRESH_SIGNATURE"),
};

export const generateToken = async (payload, role = ROLES.USER) => {
  const accessSignature = SIGNATURES[role];
  const refreshSignature = REFRESH_SIGNATURES[role];

  if (!accessSignature || !refreshSignature) {
    throw new Error("Invalid role or missing signature");
  }

  const accessToken = jwt.sign(payload, accessSignature, {
    expiresIn: "1h",
    audience: String(role),
  });

  const refreshToken = jwt.sign(payload, refreshSignature, {
    expiresIn: "1y",
    audience: String(role),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const verifyAccessToken = async (token, role = ROLES.USER) => {
  const signature = SIGNATURES[role];

  if (!signature) {
    throw new Error("Invalid role or missing signature");
  }

  return jwt.verify(token, signature);
};

export const verifyRefreshToken = async (token, role = ROLES.USER) => {
  const signature = REFRESH_SIGNATURES[role];

  if (!signature) {
    throw new Error("Invalid role or missing signature");
  }

  return jwt.verify(token, signature);
};

export const auth = (role = ROLES.USER) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new Error("Authorization header is required");
      }

      const [bearer, token] = authorization.split(" ");

      if (bearer !== "Bearer" || !token) {
        throw new Error("Invalid authorization format");
      }

      const isRevoked = await clientRedius.get(`BL:${token}`);

      if (isRevoked) {
        throw new Error("Token has been revoked");
      }

      const decoded = await verifyAccessToken(token, role);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        throw new Error("User not found");
      }

      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export const revokeToken = async (token) => {
  const decoded = jwt.decode(token);

  if (!decoded?.exp) {
    throw new Error("Invalid token");
  }

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);

  if (ttl > 0) {
    await clientRedius.set(`BL:${token}`, "revoked", {
      EX: ttl,
    });
  }

  return true;
};

export const generateAccessToken = async (refreshToken) => {
  const decoded = jwt.decode(refreshToken);

  if (!decoded?.aud) {
    throw new Error("Invalid refresh token");
  }

  const role = Number(decoded.aud);

  const verified = await verifyRefreshToken(refreshToken, role);

  const accessToken = jwt.sign(
    {
      id: verified.id,
      email: verified.email,
    },
    SIGNATURES[role],
    {
      expiresIn: "1h",
      audience: String(role),
    },
  );

  return {
    accessToken,
  };
};
