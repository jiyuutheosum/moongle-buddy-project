import { GoogleGenAI } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini_model = new GoogleGenAI({
  apiKey: "AIzaSyBNw5dgR_YNr0v3UrYIG68j7XBgzj-_1D0",
});

const genAI = new GoogleGenerativeAI("AIzaSyBNw5dgR_YNr0v3UrYIG68j7XBgzj-_1D0");
export const AI_MODEL = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export default gemini_model;
