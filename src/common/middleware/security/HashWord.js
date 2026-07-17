import bcrypt from "bcrypt";
import { getEnv } from "../../../../config/env.service.js";



export const hashWord = async (word) => {
    const hashedWord = await bcrypt.hash(String(word), Number(getEnv("SALT")));
    return hashedWord;
}

export const compareWord = async (word, hashedWord) => {
    const isMatch = await bcrypt.compare(String(word), hashedWord);
    return isMatch;
}





