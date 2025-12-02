import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image using the Gemini API based on a text prompt.
 * 
 * @param base64ImageData The base64 string of the image (excluding the data URL prefix).
 * @param mimeType The MIME type of the image.
 * @param prompt The text prompt describing the desired change.
 * @returns The base64 data URL of the generated image.
 */
export const editImageWithGemini = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
        ],
      },
    });

    let generatedImageBase64: string | undefined;

    // Iterate through parts to find the image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break; // Found the image, stop searching
        }
      }
    }

    if (!generatedImageBase64) {
        // Fallback: check if there's text explanation if no image
        const textOutput = response.text;
        if (textOutput) {
            throw new Error(`Model returned text instead of image: ${textOutput.substring(0, 100)}...`);
        }
        throw new Error("No image data found in the response.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Helper to strip the data URL prefix (e.g., "data:image/png;base64,")
 */
export const stripDataUrlPrefix = (dataUrl: string): string => {
  return dataUrl.split(',')[1];
};