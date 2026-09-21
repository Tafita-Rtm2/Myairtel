import { UserBet, FinancialStats } from './types';

// In-memory bet storage for fast execution without database dependencies
let globalBets: UserBet[] = [
  {
    id: 'BET-101',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    gameType: 'FOOT_VIRTUAL',
    leagueOrGame: 'CAN Virtuelle',
    matchOrRound: 'Sénégal vs Cameroun',
    betType: 'Score Exact (2-1)',
    amount: 10000,
    odds: 6.50,
    predictedOutcome: '2-1',
    status: 'WON',
    payout: 65000,
  },
  {
    id: 'BET-102',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
    gameType: 'FOOT_VIRTUAL',
    leagueOrGame: 'English Premier League',
    matchOrRound: 'Man City vs Arsenal',
    betType: 'Résultat 1X2 (Man City)',
    amount: 25000,
    odds: 1.65,
    predictedOutcome: '1',
    status: 'WON',
    payout: 41250,
  },
  {
    id: 'BET-103',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    gameType: 'AVIATOR',
    leagueOrGame: 'Aviator Crash',
    matchOrRound: 'Vol #4829',
    betType: 'Multiplicateur 2.50x',
    amount: 15000,
    odds: 2.50,
    predictedOutcome: '2.50x',
    status: 'LOST',
    payout: 0,
  },
  {
    id: 'BET-104',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    gameType: 'FOOT_VIRTUAL',
    leagueOrGame: 'Mondial Virtuel',
    matchOrRound: 'Brésil vs France',
    betType: 'Plus de 2.5 buts',
    amount: 50000,
    odds: 1.70,
    predictedOutcome: 'Over 2.5',
    status: 'WON',
    payout: 85000,
  },
  {
    id: 'BET-105',
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    gameType: 'AVIATOR',
    leagueOrGame: 'Aviator Crash',
    matchOrRound: 'Vol #4830',
    betType: 'Multiplicateur 1.80x',
    amount: 30000,
    odds: 1.80,
    predictedOutcome: '1.80x',
    status: 'WON',
    payout: 54000,
  },
];

export function addBet(bet: Omit<UserBet, 'id' | 'timestamp'>): UserBet {
  const newBet: UserBet = {
    ...bet,
    id: `BET-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString(),
  };
  globalBets.unshift(newBet);
  return newBet;
}

export function getBets(): UserBet[] {
  return globalBets;
}

export function clearBets(): void {
  globalBets = [];
}

export function calculateFinancialStats(): FinancialStats {
  const matchCount = globalBets.length;
  const totalBetsAmount = globalBets.reduce((sum, b) => sum + b.amount, 0);
  const totalPayouts = globalBets.reduce((sum, b) => sum + (b.status === 'WON' ? b.payout : 0), 0);

  // House Net Profit = Total bets taken in - Total payouts disbursed
  const netProfit = totalBetsAmount - totalPayouts;
  const profitMargin = totalBetsAmount > 0 ? (netProfit / totalBetsAmount) * 100 : 0;

  // Analysis for the last 10 matches/bets
  const recent10Bets = globalBets.slice(0, 10);
  const recent10BetsAmount = recent10Bets.reduce((sum, b) => sum + b.amount, 0);
  const recent10Payouts = recent10Bets.reduce((sum, b) => sum + (b.status === 'WON' ? b.payout : 0), 0);
  const recentTenBetsProfit = recent10BetsAmount - recent10Payouts;

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (profitMargin < 0) riskLevel = 'HIGH';
  else if (profitMargin < 15) riskLevel = 'MEDIUM';

  return {
    totalBetsAmount,
    totalPayouts,
    netProfit,
    profitMargin: Number(profitMargin.toFixed(1)),
    matchCount,
    recentTenBetsProfit,
    riskLevel,
  };
}

/**
 * Predictive Pre-Match Risk Estimator:
 * Calculates predicted house profit/loss before the match batch begins based on odds & volume
 */
export function estimatePreMatchRisk(totalEstimatedVolume: number, averageOdds: number = 2.10) {
  // Statistical house margin model for virtual sports algorithm
  const estimatedPayoutRatio = 0.82; // 82% payout return to players on average
  const estimatedHouseMargin = 1 - estimatedPayoutRatio; // 18% expected profit margin

  const expectedProfit = totalEstimatedVolume * estimatedHouseMargin;
  const maxPossibleLoss = totalEstimatedVolume * (averageOdds - 1);
  const winProbability = 89.5; // High confidence algorithm margin

  return {
    estimatedVolume: totalEstimatedVolume,
    expectedProfit: Math.round(expectedProfit),
    maxPossibleLoss: Math.round(maxPossibleLoss),
    winProbability,
    recommendedLimitPerMatch: Math.round(totalEstimatedVolume * 0.15),
  };
}
