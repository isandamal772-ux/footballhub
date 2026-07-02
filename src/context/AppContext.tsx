'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de';

interface AppContextType {
  favorites: {
    teams: string[];
    players: string[];
    matches: string[];
  };
  toggleFavorite: (type: 'teams' | 'players' | 'matches', id: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Translations dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    "live_scores": "Live Scores",
    "today_matches": "Today's Matches",
    "upcoming_matches": "Upcoming Matches",
    "latest_news": "Latest News",
    "top_players": "Top Players",
    "world_cup": "World Cup",
    "compare": "Compare",
    "favorites": "Favorites",
    "admin": "Admin",
    "search_placeholder": "Search teams, players or matches...",
    "match_center": "Match Center",
    "predictions": "Predictions",
    "lineups": "Lineups",
    "stats": "Statistics",
    "timeline": "Timeline",
    "possession": "Possession",
    "shots": "Total Shots",
    "shots_target": "Shots on Target",
    "fouls": "Fouls Committed",
    "yellow_cards": "Yellow Cards",
    "red_cards": "Red Cards",
    "corners": "Corners",
    "no_events": "No match events yet.",
    "no_commentary": "Waiting for match kick-off...",
    "predict_win": "Who will win?",
    "submit_prediction": "Submit Prediction",
    "trending": "Trending Now",
    "host_country": "Qatar (Host Country)",
    "stadiums": "Stadiums & Venues",
    "groups": "Groups & Standings",
    "bracket": "Knockout Bracket",
    "golden_boot": "Golden Boot Candidates",
    "team_comparison": "Team Comparison",
    "player_comparison": "Player Comparison",
    "compare_placeholder": "Select items to compare",
    "newsletter_signup": "Subscribe to our Newsletter",
    "newsletter_desc": "Get the latest live scores, breaking news, and tournament updates directly in your inbox.",
    "subscribe": "Subscribe",
    "admin_dashboard": "Admin Dashboard",
    "manage_news": "Manage News Articles",
    "add_news": "Add New Article",
    "sim_match": "Simulate Live Match Events"
  },
  es: {
    "live_scores": "Resultados en Vivo",
    "today_matches": "Partidos de Hoy",
    "upcoming_matches": "Próximos Partidos",
    "latest_news": "Últimas Noticias",
    "top_players": "Mejores Jugadores",
    "world_cup": "Copa del Mundo",
    "compare": "Comparar",
    "favorites": "Favoritos",
    "admin": "Admin",
    "search_placeholder": "Buscar equipos, jugadores o partidos...",
    "match_center": "Centro de Partido",
    "predictions": "Predicciones",
    "lineups": "Alineaciones",
    "stats": "Estadísticas",
    "timeline": "Línea de Tiempo",
    "possession": "Posesión",
    "shots": "Disparos Totales",
    "shots_target": "Disparos al Arco",
    "fouls": "Faltas Cometidas",
    "yellow_cards": "Tarjetas Amarillas",
    "red_cards": "Tarjetas Rojas",
    "corners": "Tiros de Esquina",
    "no_events": "Aún no hay eventos de partido.",
    "no_commentary": "Esperando el inicio del partido...",
    "predict_win": "¿Quién ganará?",
    "submit_prediction": "Enviar Predicción",
    "trending": "Tendencias de Hoy",
    "host_country": "Qatar (País Anfitrión)",
    "stadiums": "Estadios y Sedes",
    "groups": "Grupos y Clasificaciones",
    "bracket": "Cuadro de Eliminación",
    "golden_boot": "Candidatos Bota de Oro",
    "team_comparison": "Comparación de Equipos",
    "player_comparison": "Comparación de Jugadores",
    "compare_placeholder": "Seleccione elementos para comparar",
    "newsletter_signup": "Suscríbete a nuestro Boletín",
    "newsletter_desc": "Recibe los últimos resultados, noticias de última hora y actualizaciones en tu correo.",
    "subscribe": "Suscribirse",
    "admin_dashboard": "Panel de Administración",
    "manage_news": "Gestionar Artículos de Noticias",
    "add_news": "Añadir Artículo",
    "sim_match": "Simular Eventos en Vivo"
  },
  fr: {
    "live_scores": "Scores en Direct",
    "today_matches": "Matchs du Jour",
    "upcoming_matches": "Matchs à Venir",
    "latest_news": "Dernières Nouvelles",
    "top_players": "Meilleurs Joueurs",
    "world_cup": "Coupe du Monde",
    "compare": "Comparer",
    "favorites": "Favoris",
    "admin": "Admin",
    "search_placeholder": "Rechercher équipes, joueurs ou matchs...",
    "match_center": "Centre de Match",
    "predictions": "Pronostics",
    "lineups": "Compositions",
    "stats": "Statistiques",
    "timeline": "Chronologie",
    "possession": "Possession",
    "shots": "Tirs Totaux",
    "shots_target": "Tirs Cadrés",
    "fouls": "Fautes Commises",
    "yellow_cards": "Cartons Jaunes",
    "red_cards": "Cartons Rouges",
    "corners": "Corners",
    "no_events": "Aucun événement pour le moment.",
    "no_commentary": "En attente du coup d'envoi...",
    "predict_win": "Qui va gagner?",
    "submit_prediction": "Soumettre le Pronostic",
    "trending": "Tendances Actuelles",
    "host_country": "Qatar (Pays Hôte)",
    "stadiums": "Stades et Sites",
    "groups": "Groupes et Classements",
    "bracket": "Tableau Final",
    "golden_boot": "Course au Soulier d'Or",
    "team_comparison": "Comparaison des Équipes",
    "player_comparison": "Comparaison des Joueurs",
    "compare_placeholder": "Sélectionner des éléments",
    "newsletter_signup": "S'abonner à la Newsletter",
    "newsletter_desc": "Recevez les derniers scores en direct, actualités et mises à jour du tournoi.",
    "subscribe": "S'abonner",
    "admin_dashboard": "Tableau de Bord Admin",
    "manage_news": "Gérer les Actualités",
    "add_news": "Ajouter un Article",
    "sim_match": "Simuler des Événements"
  },
  de: {
    "live_scores": "Live-Ticker",
    "today_matches": "Spiele Heute",
    "upcoming_matches": "Kommende Spiele",
    "latest_news": "Aktuelle News",
    "top_players": "Top-Spieler",
    "world_cup": "Weltmeisterschaft",
    "compare": "Vergleichen",
    "favorites": "Favoriten",
    "admin": "Admin",
    "search_placeholder": "Suche Teams, Spieler oder Spiele...",
    "match_center": "Match-Center",
    "predictions": "Tippspiel",
    "lineups": "Aufstellungen",
    "stats": "Statistiken",
    "timeline": "Spielverlauf",
    "possession": "Ballbesitz",
    "shots": "Torschüsse",
    "shots_target": "Schüsse aufs Tor",
    "fouls": "Fouls",
    "yellow_cards": "Gelbe Karten",
    "red_cards": "Rote Karten",
    "corners": "Eckbälle",
    "no_events": "Noch keine Spielereignisse.",
    "no_commentary": "Warten auf Anpfiff...",
    "predict_win": "Wer gewinnt?",
    "submit_prediction": "Tipp abgeben",
    "trending": "Gerade Angesagt",
    "host_country": "Katar (Gastgeber)",
    "stadiums": "Stadien & Spielorte",
    "groups": "Gruppen & Tabellen",
    "bracket": "K.-o.-Runde",
    "golden_boot": "Torschützenliste",
    "team_comparison": "Team-Vergleich",
    "player_comparison": "Spieler-Vergleich",
    "compare_placeholder": "Elemente zum Vergleichen wählen",
    "newsletter_signup": "Newsletter abonnieren",
    "newsletter_desc": "Erhalten Sie die neuesten Live-Ticker, Eilmeldungen und Turnier-Updates.",
    "subscribe": "Abonnieren",
    "admin_dashboard": "Admin-Bereich",
    "manage_news": "News verwalten",
    "add_news": "Artikel hinzufügen",
    "sim_match": "Live-Spiel simulieren"
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<{ teams: string[]; players: string[]; matches: string[] }>({
    teams: [],
    players: [],
    matches: []
  });
  const [language, setLanguageState] = useState<Language>('en');

  // Load from local storage on mount
  useEffect(() => {
    const savedFavs = localStorage.getItem('wfh_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error(e);
      }
    }

    const savedLang = localStorage.getItem('wfh_lang');
    if (savedLang && (savedLang === 'en' || savedLang === 'es' || savedLang === 'fr' || savedLang === 'de')) {
      setLanguageState(savedLang);
    }
  }, []);

  const toggleFavorite = (type: 'teams' | 'players' | 'matches', id: string) => {
    setFavorites(prev => {
      const items = prev[type];
      const isFav = items.includes(id);
      const newItems = isFav ? items.filter(x => x !== id) : [...items, id];
      const updated = { ...prev, [type]: newItems };
      localStorage.setItem('wfh_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('wfh_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider value={{ favorites, toggleFavorite, language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
