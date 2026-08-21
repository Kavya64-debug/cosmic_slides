import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI client server-side lazily
  let aiClient: GoogleGenAI | null = null;
  function getAiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "CineSwipe", timestamp: new Date().toISOString() });
  });

  // AI Vibe Search & Film Recommendation
  app.post("/api/ai/recommend", async (req, res) => {
    try {
      const { mood, genre, query, existingMovies } = req.body;
      const ai = getAiClient();

      if (!ai) {
        // Provide rich fallback response if key is not yet set
        return res.json({
          recommendations: [
            {
              title: "Neon Pulse",
              genre: "Cyberpunk Thriller",
              year: "2024",
              matchScore: 98,
              vibeAnalysis: "Matches your craving for high-contrast neon aesthetics and synth-heavy nocturnal tension.",
              recommendedFor: "Late night immersive viewing with headphones.",
            },
            {
              title: "Quiet Contemplation",
              genre: "Indie Drama",
              year: "2023",
              matchScore: 94,
              vibeAnalysis: "Warm cinematography and meditative acoustic scores perfect for unwinding.",
              recommendedFor: "Sunday morning coffee or calming evening reflection.",
            },
            {
              title: "Ghost Shell",
              genre: "Sci-Fi Noir",
              year: "2024",
              matchScore: 91,
              vibeAnalysis: "Existential queries set against towering holographic cityscapes.",
              recommendedFor: "Fans of Blade Runner and introspective future-noir.",
            },
          ],
          aiCuratorNote: "Filtered through CineSwipe's nocturnal recommendation engine.",
        });
      }

      const prompt = `You are the lead cinematic curator at CineSwipe, a prestigious editorial cinema app with a dark, moody neon aesthetic.
The user is looking for movie recommendations matching this mood/query:
Query/Mood: "${query || mood || "Atmospheric late-night thrillers and indie contemplation"}"
Selected Genre: "${genre || "All"}"
Context of available catalog in app: ${JSON.stringify(existingMovies || [])}

Generate 3-4 distinct, highly curated movie recommendations. They can include both known classics/indies and fresh thematic recommendations.
Return a valid JSON object matching this exact structure:
{
  "recommendations": [
    {
      "title": "Title of the movie",
      "genre": "Genre (e.g. Cyberpunk Noir, Psychological Thriller)",
      "year": "2024",
      "matchScore": 98,
      "vibeAnalysis": "2 sentences explaining exactly why the cinematography, pacing, and sound design fit this mood.",
      "recommendedFor": "Ideal setting (e.g., Late night headphones, Rainy Sunday morning)",
      "moodTags": ["Neon", "Atmospheric", "Synthwave"]
    }
  ],
  "aiCuratorNote": "A stylish, poetic 1-sentence thought from the CineSwipe projectionist about this vibe."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "{}";
      try {
        const parsed = JSON.parse(responseText);
        res.json(parsed);
      } catch (parseError) {
        res.json({
          recommendations: [
            {
              title: "Tokyo Reverie",
              genre: "Neo-Noir",
              year: "2024",
              matchScore: 96,
              vibeAnalysis: "Deep rain reflections and ambient saxophone notes weaving through Shinjuku alleys.",
              recommendedFor: "Midnight solitude",
              moodTags: ["Nocturnal", "Moody", "Rain"],
            },
          ],
          aiCuratorNote: "Curated with CineSwipe's mood algorithm.",
        });
      }
    } catch (error: any) {
      console.error("AI recommend error:", error);
      res.status(500).json({ error: error.message || "Failed to generate AI recommendations" });
    }
  });

  // AI Film Vibe Breakdown
  app.post("/api/ai/vibe-breakdown", async (req, res) => {
    try {
      const { movieTitle, movieGenre, synopsis } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          cinematographyStyle: "Anamorphic lenses with high-contrast neon cyan and magenta rim lighting.",
          soundPalette: "Moog analog synthesizers, tape hiss, and sub-bass ambient drones.",
          pacing: "Deliberate slow-burn building to a crescendo.",
          idealVibe: "Darkened room with bass-boosted sound system.",
        });
      }

      const prompt = `Analyze the cinematic DNA for the film "${movieTitle}" (${movieGenre}).
Synopsis: "${synopsis || "Cinematic masterpiece"}"

Return a JSON object:
{
  "cinematographyStyle": "1 concise sentence describing the visual palette and lighting",
  "soundPalette": "1 concise sentence describing audio atmosphere and score",
  "pacing": "1 concise sentence describing narrative tempo",
  "idealVibe": "Ideal viewing atmosphere"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (err: any) {
      res.json({
        cinematographyStyle: "Saturated neon glows and moody atmospheric shadows.",
        soundPalette: "Hypnotic electronic pulses with lush orchestral undertones.",
        pacing: "Gripping atmospheric build.",
        idealVibe: "Late night immersive viewing.",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CineSwipe server running on http://localhost:${PORT}`);
  });
}

startServer();
