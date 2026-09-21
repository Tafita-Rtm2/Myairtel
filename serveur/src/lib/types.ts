export type LeagueId = 'can' | 'mondial' | 'english' | 'spanish' | 'italian';

export interface LeagueInfo {
  id: LeagueId;
  name: string;
  flag: string;
  icon: string;
  color: string;
  teams: string[];
}

export interface MatchPrediction {
  matchId: string;
  leagueId: LeagueId;
  homeTeam: string;
  awayTeam: string;
  predictedScoreHome: number;
  predictedScoreAway: number;
  predicted1X2: '1' | 'X' | '2';
  predictedOverUnder: 'Over 2.5' | 'Under 2.5';
  confidenceRate: number; // e.g. 94.5%
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  overOdds: number;
  underOdds: number;
  actualHomeScore?: number;
  actualAwayScore?: number;
}

export type MatchStatus = 'LIVE' | 'BETTING_CLOSED' | 'PREDICTION_REVEALED' | 'FINISHED';

export interface LeagueState {
  leagueId: LeagueId;
  currentMatch: MatchPrediction;
  upcomingMatch: MatchPrediction;
  cycleTimeRemaining: number; // in seconds
  phase: 'IN_PROGRESS' | 'BETTING_WAIT' | 'PREDICTION_VISIBLE';
  secondsUntilKickoff: number;
  history: MatchPrediction[];
}

export interface AviatorState {
  status: 'WAITING' | 'FLYING' | 'CRASHED';
  elapsedTime: number; // in seconds
  currentMultiplier: number;
  predictedMultiplier: number;
  recommendedCashout: number;
  confidenceRate: number;
  secondsUntilNextFlight: number;
  history: {
    id: string;
    predicted: number;
    actual: number;
    timestamp: string;
  }[];
}

export interface UserBet {
  id: string;
  timestamp: string;
  gameType: 'FOOT_VIRTUAL' | 'AVIATOR';
  leagueOrGame: string;
  matchOrRound: string;
  betType: string;
  amount: number;
  odds: number;
  predictedOutcome: string;
  status: 'PENDING' | 'WON' | 'LOST';
  payout: number;
}

export interface FinancialStats {
  totalBetsAmount: number;
  totalPayouts: number;
  netProfit: number;
  profitMargin: number;
  matchCount: number;
  recentTenBetsProfit: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
