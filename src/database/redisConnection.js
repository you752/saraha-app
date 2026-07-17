import { createClient } from "redis";
import { getEnv } from "../../config/env.service.js";

export const clientRedius = createClient({
  url: getEnv("REDIS_CONNECTION"),
});

export const connectRS = async () => {
  try {
    await clientRedius.connect();
    console.log("Connected to redis");
  } catch (error) {
    console.error("Error connecting to redis", error);
  }
};
