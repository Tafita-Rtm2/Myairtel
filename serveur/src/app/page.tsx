'use client';

import React, { useState, useEffect } from 'react';
import { LEAGUES, getLeagueCycleStatus, generatePrediction } from '@/lib/virtualFootball';
import { getAviatorStatus } from '@/lib/aviatorEngine';
import { LeagueId, UserBet, FinancialStats } from '@/lib/types';
import {
  Trophy,
  Plane,
  TrendingUp,
  BarChart3,
  Clock,
  ShieldCheck,
  Zap,
  DollarSign,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Percent,
  Layers,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'predictions' | 'finance'>('predictions');
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>('can');
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Financial State
  const [financeStats, setFinanceStats] = useState<FinancialStats | null>(null);
  const [betsList, setBetsList] = useState<UserBet[]>([]);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [preMatchSimVolume, setPreMatchSimVolume] = useState<number>(100000);

  // New Bet Form
  const [betGameType, setBetGameType] = useState<'FOOT_VIRTUAL' | 'AVIATOR'>('FOOT_VIRTUAL');
  const [betLeague, setBetLeague] = useState('CAN Virtuelle');
  const [betMatch, setBetMatch] = useState('Sénégal vs Cameroun');
  const [betType, setBetType] = useState('Score Exact 2-1');
  const [betAmount, setBetAmount] = useState<number>(10000);
  const [betOdds, setBetOdds] = useState<number>(2.20);
  const [betStatus, setBetStatus] = useState<'WON' | 'LOST'>('WON');

  // Pulse Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Finance Data
  const fetchFinanceData = async () => {
    try {
      const res = await fetch('/api/finance');
      const data = await res.json();
      setFinanceStats(data.stats);
      setBetsList(data.bets);
    } catch (e) {
      console.error('Error fetching finance data', e);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  // Handle Add Bet
  const handleAddBet = async (e: React.FormEvent) => {
    e.preventDefault();
    const payout = betStatus === 'WON' ? Math.round(betAmount * betOdds) : 0;
    try {
      await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: betGameType,
          leagueOrGame: betLeague,
          matchOrRound: betMatch,
          betType,
          amount: betAmount,
          odds: betOdds,
          status: betStatus,
          payout,
        }),
      });
      setIsBetModalOpen(false);
      fetchFinanceData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Clear History
  const handleClearHistory = async () => {
    if (confirm('Voulez-vous vraiment effacer tout l\'historique des mises ?')) {
      await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CLEAR_HISTORY' }),
      });
      fetchFinanceData();
    }
  };

  // Virtual Football Engine Calculations
  const cycleStatus = getLeagueCycleStatus(nowMs);
  const currentPrediction = generatePrediction(selectedLeague, 0);
  const aviatorState = getAviatorStatus(nowMs);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-amber-500 to-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
              <Zap className="h-6 w-6 text-slate-950 font-bold" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                PREDICTOR PRO VIRTUAL
              </h1>
              <p className="text-xs text-slate-400">Prédicteur IA 90%+ &amp; Analyseur de Risque Boss</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('predictions')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'predictions'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Prédictions en Direct</span>
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'finance'
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Bilan &amp; Risque (Boss)</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div className="space-y-8">
            {/* Live Indicator Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div>
                  <h2 className="font-bold text-slate-200">MOTEUR IA HAUTE PRÉCISION SYNC EN TEMPS RÉEL</h2>
                  <p className="text-xs text-slate-400">Révélation des scores exacts 50 secondes avant le coup d&apos;envoi</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-slate-900 border border-emerald-500/40 px-3 py-1.5 rounded-lg flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Précision Algorithme: 94.8%</span>
                </div>
              </div>
            </div>

            {/* SECTION 1: FOOTBALL VIRTUEL */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center space-x-2 text-slate-200">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span>Foot Virtuel - Choix de la Ligue</span>
                </h2>
                <div className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Cycle global: 3 mins</span>
                </div>
              </div>

              {/* League Selectors */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {(Object.keys(LEAGUES) as LeagueId[]).map((id) => {
                  const league = LEAGUES[id];
                  const isSelected = selectedLeague === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedLeague(id)}
                      className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/20'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{league.flag}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                          {league.icon}
                        </span>
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
                          {league.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Main Match Prediction Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Match Status Header */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{LEAGUES[selectedLeague].flag}</span>
                    <div>
                      <h3 className="font-extrabold text-lg text-white">{LEAGUES[selectedLeague].name}</h3>
                      <p className="text-xs text-slate-400">Match ID: {currentPrediction.matchId}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {cycleStatus.status === 'LIVE' && (
                      <span className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 animate-pulse">
                        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                        <span>EN COURS ({cycleStatus.matchMinute}&apos;)</span>
                      </span>
                    )}

                    {cycleStatus.status === 'BETTING_CLOSED' && (
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>PREPARATION DANS {cycleStatus.secondsUntilKickoff - 50}s (REVELATION A -50s)</span>
                      </span>
                    )}

                    {cycleStatus.status === 'PREDICTION_REVEALED' && (
                      <span className="bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs px-3 py-1.5 rounded-full font-bold flex items-center space-x-1.5 animate-pulse">
                        <Zap className="h-3.5 w-3.5" />
                        <span>REVELE ! DÉBUT DANS {cycleStatus.secondsUntilKickoff}s</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Match Teams &amp; Score Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center my-4">
                  {/* Home Team */}
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-xl font-black text-amber-400 shadow-inner">
                      {currentPrediction.homeTeam.substring(0, 3).toUpperCase()}
                    </div>
                    <h4 className="font-bold text-lg text-slate-100">{currentPrediction.homeTeam}</h4>
                    <span className="inline-block text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      Cote Vainqueur: {currentPrediction.homeOdds}
                    </span>
                  </div>

                  {/* Prediction Score / Timer Display */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative shadow-inner space-y-3">
                    {cycleStatus.isPredictionVisible ? (
                      <div className="space-y-2">
                        <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full inline-block shadow">
                          SCORE EXACT PRÉDIT
                        </span>
                        <div className="text-5xl font-black text-white tracking-widest my-2 drop-shadow-md">
                          {currentPrediction.predictedScoreHome} - {currentPrediction.predictedScoreAway}
                        </div>
                        <div className="flex justify-center items-center space-x-2 text-xs font-semibold text-slate-300">
                          <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                            1X2: <strong className="text-amber-400">{currentPrediction.predicted1X2}</strong>
                          </span>
                          <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
                            Buts: <strong className="text-emerald-400">{currentPrediction.predictedOverUnder}</strong>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 space-y-3">
                        <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
                          <Clock className="h-4 w-4 animate-spin" />
                          <span>Calcul IA en cours...</span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">
                          Le résultat exact sera dévoilé <strong className="text-slate-200">50 secondes</strong> avant le coup d&apos;envoi du match.
                        </p>
                        <div className="text-2xl font-extrabold text-amber-400 font-mono">
                          {cycleStatus.secondsUntilKickoff - 50}s restantes
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-xl font-black text-emerald-400 shadow-inner">
                      {currentPrediction.awayTeam.substring(0, 3).toUpperCase()}
                    </div>
                    <h4 className="font-bold text-lg text-slate-100">{currentPrediction.awayTeam}</h4>
                    <span className="inline-block text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                      Cote Vainqueur: {currentPrediction.awayOdds}
                    </span>
                  </div>
                </div>

                {/* Predictions Details Grid */}
                {cycleStatus.isPredictionVisible && (
                  <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Taux de Confiance IA:</span>
                      <span className="text-sm font-extrabold text-emerald-400 flex items-center space-x-1">
                        <Percent className="h-3.5 w-3.5" />
                        <span>{currentPrediction.confidenceRate}%</span>
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Pari Recommandé:</span>
                      <span className="text-sm font-bold text-amber-400">
                        {currentPrediction.predicted1X2 === '1'
                          ? `Victoire ${currentPrediction.homeTeam}`
                          : currentPrediction.predicted1X2 === '2'
                          ? `Victoire ${currentPrediction.awayTeam}`
                          : 'Match Nul'}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Total Buts estimé:</span>
                      <span className="text-sm font-bold text-teal-400">{currentPrediction.predictedOverUnder}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* SECTION 2: PRÉDICTEUR AVIATOR */}
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center space-x-2 text-slate-200">
                  <Plane className="h-5 w-5 text-rose-500" />
                  <span>Prédicteur Aviator Crash</span>
                </h2>
                <div className="text-xs text-slate-400 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Prochain vol: dans {aviatorState.secondsUntilNextFlight}s</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl">
                {/* Multiplier / Radar visual */}
                <div className="md:col-span-2 bg-slate-950 border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Plane className="h-4 w-4 text-rose-500" />
                      <span>Radar de Crash en Direct</span>
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                      aviatorState.status === 'FLYING'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse'
                        : aviatorState.status === 'CRASHED'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {aviatorState.status === 'FLYING' && 'AVION EN VOL'}
                      {aviatorState.status === 'CRASHED' && 'L\'AVION A EXPLOSÉ'}
                      {aviatorState.status === 'WAITING' && 'EN ATTENTE DU PROCHAIN VOL'}
                    </span>
                  </div>

                  {/* Big Multiplier Display */}
                  <div className="my-8 text-center z-10">
                    {aviatorState.status === 'FLYING' ? (
                      <div className="text-6xl font-black text-rose-500 tracking-tight font-mono animate-pulse">
                        {aviatorState.currentMultiplier.toFixed(2)}x
                      </div>
                    ) : aviatorState.status === 'CRASHED' ? (
                      <div className="text-5xl font-black text-slate-500 font-mono">
                        CRASH à {aviatorState.predictedMultiplier.toFixed(2)}x
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-xs text-amber-400 font-semibold uppercase">Prédiction Vol Suivant</div>
                        <div className="text-5xl font-black text-emerald-400 font-mono">
                          {aviatorState.predictedMultiplier.toFixed(2)}x
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cashout instruction */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-xs z-10">
                    <span className="text-slate-400">Encaissement Sécurisé Conseillé:</span>
                    <span className="font-extrabold text-amber-400 text-sm">
                      @ {aviatorState.recommendedCashout.toFixed(2)}x (Avant Crash)
                    </span>
                  </div>
                </div>

                {/* Aviator Stats &amp; History */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                      <span>Analyse IA Aviator</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Fiabilité de la prédiction:</span>
                        <span className="text-emerald-400 font-bold">{aviatorState.confidenceRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Point de Crash estimé:</span>
                        <span className="text-rose-400 font-bold">{aviatorState.predictedMultiplier.toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Derniers Crashs Enregistrés</h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {aviatorState.history.map((h) => (
                        <span
                          key={h.id}
                          className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
                            h.actual >= 2.0
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {h.actual.toFixed(2)}x
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FINANCE &amp; RISK TAB (BOSS DASHBOARD) */}
        {activeTab === 'finance' && (
          <div className="space-y-8">
            {/* Header &amp; Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-amber-400" />
                  <span>TABLEAU DE BORD FINANCIER &amp; GESTION DES RISQUES (BOÎTE)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Suivi des entrées/sorties, calcul du bénéfice net par vague de 10 matchs et estimation prédictive
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsBetModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-950 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Enregistrer une Mise</span>
                </button>
                <button
                  onClick={handleClearHistory}
                  className="bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-2 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Effacer l&apos;Historique</span>
                </button>
              </div>
            </div>

            {/* Financial Stats KPI Cards */}
            {financeStats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Total Mises Utilisateurs</span>
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {financeStats.totalBetsAmount.toLocaleString()} FCFA
                  </div>
                  <p className="text-xs text-slate-500">Chiffre d&apos;Affaires Brut</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Gains Réglés aux Joueurs</span>
                    <XCircle className="h-4 w-4 text-rose-400" />
                  </div>
                  <div className="text-2xl font-black text-rose-400 font-mono">
                    {financeStats.totalPayouts.toLocaleString()} FCFA
                  </div>
                  <p className="text-xs text-slate-500">Total Sorties / Payouts</p>
                </div>

                <div className={`border p-5 rounded-2xl space-y-2 shadow-lg ${
                  financeStats.netProfit >= 0
                    ? 'bg-emerald-950/30 border-emerald-500/40'
                    : 'bg-rose-950/30 border-rose-500/40'
                }`}>
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>BÉNÉFICE NET BOÎTE</span>
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className={`text-2xl font-black font-mono ${
                    financeStats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {financeStats.netProfit >= 0 ? '+' : ''}{financeStats.netProfit.toLocaleString()} FCFA
                  </div>
                  <p className="text-xs text-slate-400">Marge: <strong className="text-white">{financeStats.profitMargin}%</strong></p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2 shadow-lg">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Bilan des 10 Derniers Matchs</span>
                    <Layers className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className={`text-2xl font-black font-mono ${
                    financeStats.recentTenBetsProfit >= 0 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {financeStats.recentTenBetsProfit >= 0 ? '+' : ''}{financeStats.recentTenBetsProfit.toLocaleString()} FCFA
                  </div>
                  <p className="text-xs text-slate-500">Solde net sur la vague actuelle</p>
                </div>
              </div>
            )}

            {/* PRE-MATCH RISK SIMULATOR */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>SIMULATEUR PRÉDICTIF DE RISQUE &amp; RENTABILITÉ AVANT MATCH</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-semibold block">
                    Volume Total Estimé des Mises sur la Prochaine Vague (FCFA):
                  </label>
                  <input
                    type="number"
                    value={preMatchSimVolume}
                    onChange={(e) => setPreMatchSimVolume(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-amber-400 font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 block">Bénéfice Estimé pour la Boîte:</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">
                    +{(preMatchSimVolume * 0.18).toLocaleString()} FCFA
                  </span>
                  <span className="text-xs text-slate-500 block">Marge algorithmique garantie: ~18%</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 block">Indice de Sécurité Entreprise:</span>
                  <span className="text-xl font-extrabold text-teal-400 font-mono">
                    98.2% SÉCURISÉ
                  </span>
                  <span className="text-xs text-slate-500 block">Risque de perte globale: Très Faible</span>
                </div>
              </div>
            </div>

            {/* BETS HISTORY TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-200 text-sm">Historique Récent des Mises et Résultats</h3>
                <span className="text-xs text-slate-400">Total enregistrements: {betsList.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Jeu / Ligue</th>
                      <th className="p-3">Match / Vol</th>
                      <th className="p-3">Pari</th>
                      <th className="p-3">Mise</th>
                      <th className="p-3">Cote</th>
                      <th className="p-3">Résultat</th>
                      <th className="p-3">Gain/Sortie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {betsList.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-850/50">
                        <td className="p-3 font-mono font-bold text-slate-400">{b.id}</td>
                        <td className="p-3 font-semibold text-slate-200">{b.leagueOrGame}</td>
                        <td className="p-3 text-slate-300">{b.matchOrRound}</td>
                        <td className="p-3 text-amber-400 font-medium">{b.betType}</td>
                        <td className="p-3 font-mono font-bold">{b.amount.toLocaleString()} FCFA</td>
                        <td className="p-3 font-mono">{b.odds}</td>
                        <td className="p-3">
                          {b.status === 'WON' ? (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold inline-flex items-center space-x-1">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>GAGNÉ</span>
                            </span>
                          ) : (
                            <span className="bg-rose-950 text-rose-400 border border-rose-800 px-2 py-0.5 rounded font-bold inline-flex items-center space-x-1">
                              <XCircle className="h-3 w-3" />
                              <span>PERDU</span>
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-100">
                          {b.payout.toLocaleString()} FCFA
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL FOR ADDING BET */}
      {isBetModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Enregistrer une Nouvelle Mise</h3>

            <form onSubmit={handleAddBet} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Type de Jeu</label>
                <select
                  value={betGameType}
                  onChange={(e) => setBetGameType(e.target.value as 'FOOT_VIRTUAL' | 'AVIATOR')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="FOOT_VIRTUAL">Foot Virtuel</option>
                  <option value="AVIATOR">Aviator Crash</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Ligue / Intitulé</label>
                <input
                  type="text"
                  value={betLeague}
                  onChange={(e) => setBetLeague(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Match / Tour</label>
                <input
                  type="text"
                  value={betMatch}
                  onChange={(e) => setBetMatch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Intitulé Pari</label>
                <input
                  type="text"
                  value={betType}
                  onChange={(e) => setBetType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Montant Misé (FCFA)</label>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Cote du Pari</label>
                  <input
                    type="number"
                    step="0.01"
                    value={betOdds}
                    onChange={(e) => setBetOdds(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Statut du Pari</label>
                <select
                  value={betStatus}
                  onChange={(e) => setBetStatus(e.target.value as 'WON' | 'LOST')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
                >
                  <option value="WON">Gagné (Payé au joueur)</option>
                  <option value="LOST">Perdu (Gagné par la boîte)</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBetModalOpen(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold p-2.5 rounded-xl transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2.5 rounded-xl transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
