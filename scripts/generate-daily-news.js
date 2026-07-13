const fs = require('fs');
const path = require('path');

const newsFilePath = path.join(__dirname, '../src/lib/news.json');

// Helper to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function run() {
  console.log("Starting Daily News Auto-Post Generation...");

  let existingNews = [];
  try {
    const raw = fs.readFileSync(newsFilePath, 'utf8');
    existingNews = JSON.parse(raw);
  } catch (e) {
    console.error("Could not load existing news:", e);
  }

  let generatedArticles = [];

  // Try Google Gemini AI first
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
  if (apiKey) {
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `You are a sports journalist. Write 3 fresh, highly realistic, and exciting daily football news articles for today (${new Date().toLocaleDateString()}).
Output must be a raw JSON array of objects with exactly this structure:
[
  {
    "title": "Title of the news",
    "summary": "Short 1-sentence summary of the article.",
    "content": "Detailed realistic article content with paragraphs.",
    "imageUrl": "Unsplash sports image url (use a realistic high-quality unsplash image path, e.g., starting with https://images.unsplash.com/photo-)",
    "trending": true,
    "tags": "comma-separated tags"
  }
]
Return ONLY the raw JSON array. Do not write any markdown wrappers or code fences.`;

      const response = await model.generateContent(prompt);
      const text = response.response.text();
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const articles = JSON.parse(cleaned);

      if (Array.isArray(articles) && articles.length > 0) {
        generatedArticles = articles.map((art, idx) => ({
          id: `news-auto-${Date.now()}-${idx}`,
          title: art.title,
          slug: generateSlug(art.title),
          summary: art.summary,
          content: art.content,
          imageUrl: art.imageUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
          trending: art.trending ?? false,
          tags: art.tags || "Football,News",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error("Gemini news generation failed, using template fallback:", err);
    }
  }

  // Fallback heuristic generator
  if (generatedArticles.length === 0) {
    const templates = [
      {
        title: "Kylian Mbappé Shines in Training Ahead of Champions League Opener",
        summary: "The French superstar looked sharp in training as Real Madrid prepares to begin their European title defense.",
        content: "Kylian Mbappé displayed exceptional form during Real Madrid's final training session today. Manager Carlo Ancelotti praised his adaptation to the squad, stating that Mbappé is fully fit and ready to lead the attack. Fans are highly anticipating his Champions League debut in the iconic white jersey.",
        imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
        tags: "Champions League,Mbappe,Real Madrid"
      },
      {
        title: "Erling Haaland Scores Back-to-Back Hat-tricks in League Matches",
        summary: "Manchester City's goal-scoring machine continues to break goal records in the opening weeks of the season.",
        content: "Erling Haaland secured another spectacular hat-trick today, guiding Manchester City to a comfortable 4-1 victory. His positioning, pace, and clinical finishes have left defenders struggling to cope. Pep Guardiola remarked that Haaland is looking even more dangerous than last season.",
        imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
        tags: "Premier League,Haaland,Manchester City"
      },
      {
        title: "Lionel Messi Returns to Action with Magnificent Free-kick Winner",
        summary: "The Inter Miami captain made a stunning return from injury, scoring a last-minute free-kick to secure three points.",
        content: "Lionel Messi marked his return to the pitch with a classic last-minute display of genius. Curling a free-kick into the top corner in the 93rd minute, he secured a vital win for his team. The stadium erupted in celebration, proving yet again his match-winning capabilities.",
        imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=800&auto=format&fit=crop",
        tags: "MLS,Lionel Messi,Inter Miami"
      }
    ];

    generatedArticles = templates.map((art, idx) => ({
      id: `news-auto-${Date.now()}-${idx}`,
      title: art.title + " (" + new Date().toLocaleDateString() + ")",
      slug: generateSlug(art.title + "-" + Date.now().toString().slice(-4)),
      summary: art.summary,
      content: art.content,
      imageUrl: art.imageUrl,
      trending: true,
      tags: art.tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Prepend and limit list to 15 articles to avoid bloat
  const updatedList = [...generatedArticles, ...existingNews].slice(0, 15);

  fs.writeFileSync(newsFilePath, JSON.stringify(updatedList, null, 2), 'utf8');
  console.log(`Successfully generated and posted ${generatedArticles.length} news articles!`);
}

run();
