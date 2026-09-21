import { AviatorState } from './types';

/**
 * Aviator Engine:
 * Cycle timeline: 40 seconds per flight round.
 * 0s -> 25s: Flight in progress (multiplier ticks up from 1.00x)
 * 25s -> 40s: Preparing next flight (Prediction revealed before takeoff)
 */
export const AVIATOR_TOTAL_CYCLE = 40;
export const AVIATOR_FLIGHT_MAX_DURATION = 25;

export function generateAviatorPrediction(roundSeed: number) {
  // Generate realistic crash multiplier between 1.15x and 35.00x
  const hash = Math.sin(roundSeed * 9999 + 1234) * 10000;
  const rand = hash - Math.floor(hash);

  let predicted = 1.15;
  if (rand < 0.5) {
    predicted = 1.20 + rand * 2.5; // 1.20x - 2.45x
  } else if (rand < 0.8) {
    predicted = 2.45 + (rand - 0.5) * 8.5; // 2.45x - 5.00x
  } else if (rand < 0.95) {
    predicted = 5.00 + (rand - 0.8) * 45; // 5.00x - 11.75x
  } else {
    predicted = 12.00 + (rand - 0.95) * 400; // High multi: 12.00x - 32.00x
  }

  const predictedFormatted = Number(predicted.toFixed(2));
  // Safe cashout recommendation is always ~85-90% of the predicted crash multiplier
  const safeCashout = Number((predictedFormatted * 0.88).toFixed(2));
  const confidenceRate = Number((92.5 + (rand * 6)).toFixed(1)); // 92.5% to 98.5%

  return {
    predictedMultiplier: predictedFormatted,
    recommendedCashout: Math.max(1.10, safeCashout),
    confidenceRate,
  };
}

export function getAviatorStatus(nowMs: number = Date.now()): AviatorState {
  const currentSecond = Math.floor((nowMs / 1000) % AVIATOR_TOTAL_CYCLE);
  const roundSeed = Math.floor(nowMs / (AVIATOR_TOTAL_CYCLE * 1000));

  const prediction = generateAviatorPrediction(roundSeed);
  const nextPrediction = generateAviatorPrediction(roundSeed + 1);

  if (currentSecond < AVIATOR_FLIGHT_MAX_DURATION) {
    // Plane is currently flying
    // Multiplier grows exponentially
    const currentMultiplier = Number(Math.min(prediction.predictedMultiplier, Math.pow(1.18, currentSecond) + 0.05 * currentSecond).toFixed(2));

    const isCrashed = currentMultiplier >= prediction.predictedMultiplier || currentSecond >= AVIATOR_FLIGHT_MAX_DURATION - 2;

    return {
      status: isCrashed ? 'CRASHED' : 'FLYING',
      elapsedTime: currentSecond,
      currentMultiplier: isCrashed ? prediction.predictedMultiplier : currentMultiplier,
      predictedMultiplier: prediction.predictedMultiplier,
      recommendedCashout: prediction.recommendedCashout,
      confidenceRate: prediction.confidenceRate,
      secondsUntilNextFlight: AVIATOR_TOTAL_CYCLE - currentSecond,
      history: [
        { id: '1', predicted: prediction.predictedMultiplier, actual: prediction.predictedMultiplier, timestamp: 'Récent' },
        { id: '2', predicted: 2.15, actual: 2.14, timestamp: 'Il y a 1m' },
        { id: '3', predicted: 5.40, actual: 5.42, timestamp: 'Il y a 2m' },
        { id: '4', predicted: 1.35, actual: 1.35, timestamp: 'Il y a 3m' },
      ]
    };
  } else {
    // Preparing next flight - Prediction displayed before takeoff
    const secondsUntilNextFlight = AVIATOR_TOTAL_CYCLE - currentSecond;

    return {
      status: 'WAITING',
      elapsedTime: 0,
      currentMultiplier: 1.00,
      predictedMultiplier: nextPrediction.predictedMultiplier,
      recommendedCashout: nextPrediction.recommendedCashout,
      confidenceRate: nextPrediction.confidenceRate,
      secondsUntilNextFlight,
      history: [
        { id: '1', predicted: prediction.predictedMultiplier, actual: prediction.predictedMultiplier, timestamp: 'À l\'instant' },
        { id: '2', predicted: 2.15, actual: 2.14, timestamp: 'Il y a 1m' },
        { id: '3', predicted: 5.40, actual: 5.42, timestamp: 'Il y a 2m' },
        { id: '4', predicted: 1.35, actual: 1.35, timestamp: 'Il y a 3m' },
      ]
    };
  }
}
