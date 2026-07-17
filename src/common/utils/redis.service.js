import { json } from "express";
import { clientRedius } from "../../database/redisConnection.js";

export const getData = async (key) => {
  const get = await client.get(key);
  return json.parse(get) || get;
};

export const setData = async (key, value, ttl) => {
  return ttl
    ? await client.set(key, json.stringify(value), { EX: ttl })
    : await client.set(key, json.stringify(value));
};

export const existKey = async (key) => {
  return await client.exists(key);
};

export const flushAll = async () => {
  return await client.flushAll();
};

export const MGet = async (keys) => {
  return await client.mGet(keys);
};

export const revokeToken = async (token) => {
  const decoded = jwt.decode(token);

  const ttl = decoded.exp - Math.floor(Date.now() / 1000);

  if (ttl > 0) {
    await clientRedius.set(`BL:${token}`, "revoked", {
      EX: ttl,
    });
  }
};