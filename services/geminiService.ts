import { GoogleGenAI, Type } from "@google/genai";
import { Palette, GenerationTheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePalettes = async (theme: GenerationTheme | string, count: number = 4): Promise<Palette[]> => {
  const model = 'gemini-2.5-flash';
  
  const prompt = `Generate ${count} unique and aesthetically pleasing color palettes suitable for web design and frontend development. 
  The theme or vibe is: "${theme}".
  Each palette must have exactly 5 distinct colors.
  Provide a creative name for the palette and a short description of its use case.
  Also provide 2-3 tags related to the style (e.g., "Warm", "Minimal", "Accessibility").
  Generate realistic color names.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Creative name of the palette" },
              description: { type: Type.STRING, description: "Short description of vibe/use-case" },
              colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING, description: "Hex code like #RRGGBB" },
                    name: { type: Type.STRING, description: "Name of the color" }
                  },
                  required: ["hex", "name"]
                }
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["name", "description", "colors", "tags"]
          }
        }
      }
    });

    const rawPalettes = JSON.parse(response.text || "[]");

    // Hydrate with IDs and fake likes for UI state
    return rawPalettes.map((p: any) => ({
      ...p,
      id: crypto.randomUUID(),
      likes: Math.floor(Math.random() * 500) + 50
    }));

  } catch (error) {
    console.error("Failed to generate palettes", error);
    return [];
  }
};