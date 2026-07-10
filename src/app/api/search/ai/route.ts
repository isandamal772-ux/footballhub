import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    let matchData: any = null;

    // 1. Try real Gemini API if key is available
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";
    if (apiKey) {
      try {
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `You are an expert football historian. Search and retrieve the correct details for this match query: "${query}". 
If it is a real match from history, output the actual details. If it is a hypothetical match or query with no match, output a highly realistic simulated match.
Output format must be a raw JSON object with this exact structure:
{
  "teamAName": "Home Team Name",
  "teamBName": "Away Team Name",
  "teamAScore": 3,
  "teamBScore": 3,
  "date": "2022-12-18",
  "venue": "Lusail Stadium, Lusail",
  "stage": "World Cup Final",
  "groupName": "Final",
  "stats": {
    "possession": { "teamA": 54, "teamB": 46 },
    "shots": { "teamA": 20, "teamB": 10 },
    "shotsOnTarget": { "teamA": 10, "teamB": 5 },
    "fouls": { "teamA": 12, "teamB": 15 },
    "yellowCards": { "teamA": 2, "teamB": 4 },
    "redCards": { "teamA": 0, "teamB": 0 },
    "corners": { "teamA": 6, "teamB": 3 }
  },
  "events": [
    { "time": 23, "type": "GOAL", "team": "teamA", "player": "Lionel Messi", "detail": "Penalty scored cleanly." },
    { "time": 36, "type": "GOAL", "team": "teamA", "player": "Angel Di Maria", "detail": "Brilliant team play finish." },
    { "time": 80, "type": "GOAL", "team": "teamB", "player": "Kylian Mbappe", "detail": "Penalty converted." },
    { "time": 81, "type": "GOAL", "team": "teamB", "player": "Kylian Mbappe", "detail": "Sensational volley into bottom right." }
  ],
  "commentary": [
    { "time": 90, "text": "Full Time! What an epic match we have witnessed today." },
    { "time": 81, "text": "GOAL! Mbappe scores an equalizer in minutes! Unbelievable!" },
    { "time": 23, "text": "GOAL! Messi converts the penalty with absolute coolness." }
  ],
  "teamALineup": [
    { "number": 23, "name": "E. Martinez", "position": "GK" },
    { "number": 10, "name": "Lionel Messi", "position": "FW" }
  ],
  "teamBLineup": [
    { "number": 1, "name": "H. Lloris", "position": "GK" },
    { "number": 10, "name": "Kylian Mbappe", "position": "FW" }
  ]
}
Return ONLY the raw JSON object. Do not wrap it in markdown code fences or write any other text.`;

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        // Clean markdown fences if model returned them
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        matchData = JSON.parse(cleaned);
      } catch (err) {
        console.error("Gemini API call failed, using heuristic fallback:", err);
      }
    }

    // 2. Fallback Heuristic Match Knowledge base
    if (!matchData) {
      matchData = getHeuristicMatchData(query);
    }

    // 3. Inject the generated match into the database store
    const generatedId = `match-ai-${Math.random().toString(36).substr(2, 5)}`;
    
    // Find or seed teams in db
    let teamA = await db.team.findFirst({ where: { name: matchData.teamAName } });
    if (!teamA) {
      teamA = await db.team.create({
        data: {
          id: `team-ai-${Math.random().toString(36).substr(2, 4)}`,
          name: matchData.teamAName,
          code: matchData.teamAName.substring(0, 3).toUpperCase(),
          flagUrl: "https://flagcdn.com/w320/un.png",
          groupName: "Friendly"
        }
      });
    }

    let teamB = await db.team.findFirst({ where: { name: matchData.teamBName } });
    if (!teamB) {
      teamB = await db.team.create({
        data: {
          id: `team-ai-${Math.random().toString(36).substr(2, 4)}`,
          name: matchData.teamBName,
          code: matchData.teamBName.substring(0, 3).toUpperCase(),
          flagUrl: "https://flagcdn.com/w320/un.png",
          groupName: "Friendly"
        }
      });
    }

    // Create custom match object
    const finalEvents = matchData.events.map((e: any) => ({
      ...e,
      team: e.team === "teamA" ? teamA.code : teamB.code
    }));

    const newMatch = {
      id: generatedId,
      teamAId: teamA.id,
      teamBId: teamB.id,
      teamAScore: matchData.teamAScore,
      teamBScore: matchData.teamBScore,
      status: "FT",
      timeElapsed: 90,
      datetime: new Date(matchData.date),
      venue: matchData.venue,
      stage: matchData.stage,
      groupName: matchData.groupName,
      stats: JSON.stringify(matchData.stats),
      events: JSON.stringify(finalEvents),
      commentary: JSON.stringify(matchData.commentary),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Push directly to mockStore.matches
    const { mockStore } = require('@/lib/db');
    mockStore.matches.unshift(newMatch);

    return NextResponse.json({ success: true, matchId: generatedId });
  } catch (error: any) {
    console.error("AI Match search error:", error);
    return NextResponse.json({ error: "Failed to generate match data" }, { status: 550 });
  }
}

// Fallback Knowledge Base Parser
function getHeuristicMatchData(query: string) {
  const q = query.toLowerCase();

  // Classic Match 1: Argentina vs France World Cup Final 2022
  if (q.includes("argentina") && q.includes("france") && (q.includes("2022") || q.includes("final"))) {
    return {
      teamAName: "Argentina",
      teamBName: "France",
      teamAScore: 3,
      teamBScore: 3,
      date: "2022-12-18",
      venue: "Lusail Stadium, Lusail",
      stage: "FIFA World Cup Final",
      groupName: "Final",
      stats: {
        possession: { teamA: 54, teamB: 46 },
        shots: { teamA: 20, teamB: 10 },
        shotsOnTarget: { teamA: 10, teamB: 5 },
        fouls: { teamA: 12, teamB: 15 },
        yellowCards: { teamA: 2, teamB: 4 },
        redCards: { teamA: 0, teamB: 0 },
        corners: { teamA: 6, teamB: 3 }
      },
      events: [
        { time: 23, type: "GOAL", team: "teamA", player: "Lionel Messi (P)", detail: "Converts penalty into bottom right." },
        { time: 36, type: "GOAL", team: "teamA", player: "Angel Di Maria", detail: "Clinical low finish after counter attack." },
        { time: 80, type: "GOAL", team: "teamB", player: "Kylian Mbappe (P)", detail: "Scores penalty past Martinez." },
        { time: 81, type: "GOAL", team: "teamB", player: "Kylian Mbappe", detail: "Sensational volley from inside the box." },
        { time: 108, type: "GOAL", team: "teamA", player: "Lionel Messi", detail: "Rebound shot crossing the line." },
        { time: 118, type: "GOAL", team: "teamB", player: "Kylian Mbappe (P)", detail: "Converts penalty after hand ball." }
      ],
      commentary: [
        { time: 120, text: "Full Time! Argentina wins 4-2 on penalties in the greatest World Cup final ever!" },
        { time: 118, text: "GOAL! Mbappe secures his hat-trick from the penalty spot! 3-3!" },
        { time: 108, text: "GOAL! Lionel Messi scores! The ball just crossed the line! 3-2!" },
        { time: 81, text: "GOAL! A stunning volley from Kylian Mbappe brings France level! 2-2!" },
        { time: 80, text: "GOAL! Kylian Mbappe scores the penalty to give France hope. 2-1." }
      ],
      teamALineup: [{ number: 10, name: "Lionel Messi", position: "FW" }],
      teamBLineup: [{ number: 10, name: "Kylian Mbappe", position: "FW" }]
    };
  }

  // Classic Match 2: Brazil vs Germany 2014 Semi Final
  if (q.includes("brazil") && q.includes("germany") && q.includes("2014")) {
    return {
      teamAName: "Brazil",
      teamBName: "Germany",
      teamAScore: 1,
      teamBScore: 7,
      date: "2014-07-08",
      venue: "Estádio Mineirão, Belo Horizonte",
      stage: "FIFA World Cup Semi-Final",
      groupName: "Semi-Final",
      stats: {
        possession: { teamA: 52, teamB: 48 },
        shots: { teamA: 18, teamB: 14 },
        shotsOnTarget: { teamA: 8, teamB: 10 },
        fouls: { teamA: 11, teamB: 14 },
        yellowCards: { teamA: 1, teamB: 0 },
        redCards: { teamA: 0, teamB: 0 },
        corners: { teamA: 7, teamB: 5 }
      },
      events: [
        { time: 11, type: "GOAL", team: "teamB", player: "Thomas Muller", detail: "Volley from corner kick." },
        { time: 23, type: "GOAL", team: "teamB", player: "Miroslav Klose", detail: "Record-breaking 16th World Cup goal." },
        { time: 24, type: "GOAL", team: "teamB", player: "Toni Kroos", detail: "Left-footed strike into bottom corner." },
        { time: 26, type: "GOAL", team: "teamB", player: "Toni Kroos", detail: "Tap-in after intercepting pass." },
        { time: 29, type: "GOAL", team: "teamB", player: "Sami Khedira", detail: "Neat combination inside box." },
        { time: 69, type: "GOAL", team: "teamB", player: "Andre Schurrle", detail: "Tap-in from Lahm cross." },
        { time: 79, type: "GOAL", team: "teamB", player: "Andre Schurrle", detail: "Stunning volley off the crossbar." },
        { time: 90, type: "GOAL", team: "teamA", player: "Oscar", detail: "Late consolation goal." }
      ],
      commentary: [
        { time: 90, text: "Full Time! Germany completes an unbelievable 7-1 thrashing of hosts Brazil." },
        { time: 90, text: "GOAL! Oscar pulls one back for Brazil. 1-7." },
        { time: 79, text: "GOAL! Schurrle scores another spectacular goal to make it 0-7!" }
      ],
      teamALineup: [{ number: 10, name: "Neymar Jr (Injured)", position: "FW" }],
      teamBLineup: [{ number: 18, name: "Toni Kroos", position: "MF" }]
    };
  }

  // General fallback for custom matches
  const words = q.split(" ");
  const teamsMatched = words.filter(w => w.length > 3 && !["vs", "versus", "final", "cup", "world", "match", "game", "league"].includes(w));
  const tA = teamsMatched[0] ? teamsMatched[0].charAt(0).toUpperCase() + teamsMatched[0].slice(1) : "Home Club";
  const tB = teamsMatched[1] ? teamsMatched[1].charAt(0).toUpperCase() + teamsMatched[1].slice(1) : "Away Club";
  
  return {
    teamAName: tA,
    teamBName: tB,
    teamAScore: Math.floor(Math.random() * 3),
    teamBScore: Math.floor(Math.random() * 3),
    date: "2024-05-15",
    venue: "International Sports Arena",
    stage: "Club Friendly Championship",
    groupName: "Friendly",
    stats: {
      possession: { teamA: 50, teamB: 50 },
      shots: { teamA: 12, teamB: 10 },
      shotsOnTarget: { teamA: 5, teamB: 4 },
      fouls: { teamA: 8, teamB: 9 },
      yellowCards: { teamA: 1, teamB: 1 },
      redCards: { teamA: 0, teamB: 0 },
      corners: { teamA: 4, teamB: 4 }
    },
    events: [
      { time: 14, type: "GOAL", team: "teamA", player: "Striker", detail: "Clinical low volley." },
      { time: 56, type: "GOAL", team: "teamB", player: "Forward", detail: "Header from corner." }
    ],
    commentary: [
      { time: 90, text: "Full Time. Both teams fought hard in this friendly encounter." },
      { time: 56, text: "GOAL! Equalizer scored from a set-piece!" },
      { time: 14, text: "GOAL! The home team scores the opening goal!" }
    ],
    teamALineup: [{ number: 9, name: "Striker", position: "FW" }],
    teamBLineup: [{ number: 9, name: "Forward", position: "FW" }]
  };
}
