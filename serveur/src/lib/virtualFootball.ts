import { LeagueId, LeagueInfo, MatchPrediction, MatchStatus } from './types';

export const LEAGUES: Record<LeagueId, LeagueInfo> = {
  can: {
    id: 'can',
    name: 'CAN Virtuelle',
    flag: '🌍',
    icon: '🏆',
    color: 'from-amber-600 to-emerald-700',
    teams: ['Sénégal', 'Côte d\'Ivoire', 'Maroc', 'Algérie', 'Cameroun', 'Égypte', 'Nigéria', 'Mali', 'Burkina Faso', 'Ghana'],
  },
  mondial: {
    id: 'mondial',
    name: 'Mondial Virtuel',
    flag: '🌐',
    icon: '⚽',
    color: 'from-blue-600 to-indigo-800',
    teams: ['Brésil', 'France', 'Argentine', 'Allemagne', 'Espagne', 'Angleterre', 'Portugal', 'Pays-Bas', 'Croatie', 'Belgique'],
  },
  english: {
    id: 'english',
    name: 'English Premier League',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    icon: '👑',
    color: 'from-purple-700 to-pink-600',
    teams: ['Man City', 'Arsenal', 'Liverpool', 'Real Chelsea', 'Man United', 'Tottenham', 'Newcastle', 'Aston Villa', 'West Ham', 'Brighton'],
  },
  spanish: {
    id: 'spanish',
    name: 'La Liga Española',
    flag: '🇪🇸',
    icon: '🔥',
    color: 'from-red-600 to-amber-500',
    teams: ['Real Madrid', 'FC Barcelone', 'Atlético Madrid', 'Séville FC', 'Real Sociedad', 'Villarreal', 'Athletic Bilbao', 'Betis', 'Valence', 'Gérone'],
  },
  italian: {
    id: 'italian',
    name: 'Serie A Italiana',
    flag: '🇮🇹',
    icon: '⚡',
    color: 'from-sky-600 to-blue-800',
    teams: ['Inter Milan', 'AC Milan', 'Juventus', 'Naples', 'AS Rome', 'Lazio', 'Atalanta', 'Fiorentina', 'Torino', 'Bologne'],
  },
};

// Generate deterministic-looking yet realistic high accuracy predictions
export function generatePrediction(leagueId: LeagueId, seedOffset: number = 0): MatchPrediction {
  const league = LEAGUES[leagueId];
  const homeIdx = (Math.floor(Date.now() / 180000) + seedOffset) % league.teams.length;
  let awayIdx = (homeIdx + 3 + seedOffset) % league.teams.length;
  if (awayIdx === homeIdx) awayIdx = (homeIdx + 1) % league.teams.length;

  const homeTeam = league.teams[homeIdx];
  const awayTeam = league.teams[awayIdx];

  // Weighted realistic score outcomes
  const scores = [
    [2, 1], [1, 0], [2, 0], [3, 1], [1, 1], [0, 1], [1, 2], [3, 2], [2, 2], [0, 0]
  ];
  const selectedScore = scores[(homeIdx * 3 + awayIdx * 7 + seedOffset) % scores.length];
  const homeScore = selectedScore[0];
  const awayScore = selectedScore[1];

  let outcome: '1' | 'X' | '2' = 'X';
  if (homeScore > awayScore) outcome = '1';
  else if (homeScore < awayScore) outcome = '2';

  const totalGoals = homeScore + awayScore;
  const overUnder: 'Over 2.5' | 'Under 2.5' = totalGoals > 2.5 ? 'Over 2.5' : 'Under 2.5';

  // High confidence rate (91.0% to 98.5%)
  const confidence = 91.0 + ((homeIdx + awayIdx * 2 + seedOffset) % 75) / 10;

  // Realistic decimal odds
  const homeOdds = outcome === '1' ? 1.65 : 2.45;
  const drawOdds = outcome === 'X' ? 3.10 : 3.40;
  const awayOdds = outcome === '2' ? 1.80 : 2.85;
  const overOdds = overUnder === 'Over 2.5' ? 1.70 : 2.10;
  const underOdds = overUnder === 'Under 2.5' ? 1.75 : 2.05;

  const matchId = `MATCH-${leagueId.toUpperCase()}-${Math.floor(Date.now() / 180000) + seedOffset}`;

  return {
    matchId,
    leagueId,
    homeTeam,
    awayTeam,
    predictedScoreHome: homeScore,
    predictedScoreAway: awayScore,
    predicted1X2: outcome,
    predictedOverUnder: overUnder,
    confidenceRate: Number(confidence.toFixed(1)),
    homeOdds,
    drawOdds,
    awayOdds,
    overOdds,
    underOdds,
  };
}

/**
 * Cycle timeline:
 * Total cycle = 180s
 * 0s -> 90s : Match LIVE in progress
 * 90s -> 130s : Match finished, waiting phase (Betting open, prediction pending algorithm analysis)
 * 130s -> 180s : Exactly 50 seconds before Kickoff! PREDICTION REVEALED (Score, 1X2, Over/Under)
 */
export const TOTAL_CYCLE_SECONDS = 180; // 3 mins total per cycle
export const LIVE_MATCH_DURATION = 90;  // 90s live simulation
export const PREDICTION_REVEAL_WINDOW = 50; // Revealed 50s before kickoff

export function getLeagueCycleStatus(nowMs: number = Date.now()) {
  const currentSecondInCycle = Math.floor((nowMs / 1000) % TOTAL_CYCLE_SECONDS);

  if (currentSecondInCycle < LIVE_MATCH_DURATION) {
    // Match is LIVE
    const liveTimeRemaining = LIVE_MATCH_DURATION - currentSecondInCycle;
    const matchMinute = Math.min(90, Math.floor((currentSecondInCycle / LIVE_MATCH_DURATION) * 90));
    return {
      status: 'LIVE' as MatchStatus,
      statusLabel: 'MATCH EN COURS',
      secondsRemaining: liveTimeRemaining,
      secondsUntilKickoff: TOTAL_CYCLE_SECONDS - currentSecondInCycle,
      matchMinute,
      isPredictionVisible: false,
    };
  } else {
    // Match is finished, countdown to next match
    const secondsUntilKickoff = TOTAL_CYCLE_SECONDS - currentSecondInCycle;
    const isPredictionVisible = secondsUntilKickoff <= PREDICTION_REVEAL_WINDOW;

    return {
      status: isPredictionVisible ? ('PREDICTION_REVEALED' as MatchStatus) : ('BETTING_CLOSED' as MatchStatus),
      statusLabel: isPredictionVisible
        ? '⚡ PRÉDICTION RÉVÉLÉE (50s AVANT LE MATCH)'
        : 'PAUSE - ANALYSE ALGORITHMIQUE IA...',
      secondsRemaining: secondsUntilKickoff,
      secondsUntilKickoff,
      matchMinute: 0,
      isPredictionVisible,
    };
  }
}
