import { NextResponse } from 'next/server';
import { calculateFinancialStats, getBets, addBet, clearBets } from '@/lib/financialEngine';

export async function GET() {
  const stats = calculateFinancialStats();
  const bets = getBets();
  return NextResponse.json({ stats, bets });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'CLEAR_HISTORY') {
      clearBets();
      return NextResponse.json({ success: true, message: 'Historique effacé' });
    }

    const newBet = addBet({
      gameType: body.gameType || 'FOOT_VIRTUAL',
      leagueOrGame: body.leagueOrGame || 'Foot Virtuel',
      matchOrRound: body.matchOrRound || 'Match',
      betType: body.betType || '1X2',
      amount: Number(body.amount) || 1000,
      odds: Number(body.odds) || 1.80,
      predictedOutcome: body.predictedOutcome || '1',
      status: body.status || 'WON',
      payout: Number(body.payout) || 1800,
    });

    return NextResponse.json({ success: true, bet: newBet });
  } catch {
    return NextResponse.json({ success: false, error: 'Erreur requête' }, { status: 400 });
  }
}
