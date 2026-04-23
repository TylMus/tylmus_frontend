/**
 * The server stores score as 0–5000 (higher is better). We show 0–100
 * so that «86 из 100» is self-explanatory. Order is unchanged.
 */
export function toDisplayLeaderboardPoints(serverPoints: number): number {
  if (!Number.isFinite(serverPoints) || serverPoints < 0) return 0
  return Math.max(0, Math.min(100, Math.round(serverPoints / 50)))
}
