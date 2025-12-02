import { GoogleGenAI, Type } from "@google/genai";

// We use Gemini not to generate content, but to "judge" it or help verify "messiness"
// This aligns with the prompt's theme of broken trust - using AI to police AI (ironic).

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API Key not found in environment variables");
    }
    return new GoogleGenAI({ apiKey });
};

export const analyzeTextForHumanity = async (text: string): Promise<{ score: number; reasoning: string; isAiSuspect: boolean }> => {
    try {
        const client = getClient();
        // Using flash for quick analysis
        const model = "gemini-2.5-flash"; 
        
        const prompt = `
        You are a "Humanity Verifier" engine in a dystopian future where people distrust AI. 
        Your job is to analyze the following project description text.
        
        Criteria for "Human":
        - Uses first-person experiences effectively.
        - Shows signs of struggle, iteration, or specific, messy details.
        - May have unique sentence structures or emotional depth.
        
        Criteria for "AI/Suspect":
        - Overly polished, generic corporate speak.
        - "Delve", "Landscape", "Tapestry" usage.
        - Perfectly structured lists without nuance.
        - Lack of specific contextual details.

        Text to analyze: "${text}"

        Return JSON.
        `;

        const response = await client.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER, description: "A score from 0 to 100 representing how 'human' the text sounds." },
                        reasoning: { type: Type.STRING, description: "Short, punchy explanation of the verdict." },
                        isAiSuspect: { type: Type.BOOLEAN, description: "True if it sounds too much like an LLM." }
                    }
                }
            }
        });

        const resultText = response.text;
        if (!resultText) return { score: 50, reasoning: "Analysis failed.", isAiSuspect: false };
        
        return JSON.parse(resultText);

    } catch (error) {
        console.error("Gemini analysis failed", error);
        return { score: 0, reasoning: "Verification offline.", isAiSuspect: false };
    }
};

export const generatePhilosophicalProvocation = async (): Promise<string> => {
    try {
        const client = getClient();
        const response = await client.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate a short, cryptic, single-sentence philosophical provocation about the loss of human agency to machines. Make it sound like a warning from the year 2040. Do not use quotes.",
        });
        return response.text || "A realidade é apenas um consenso processado.";
    } catch (e) {
        return "Conexão com a Oráculo perdida.";
    }
}
