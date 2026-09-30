import type { MatchRecord } from "../types";
import type { BoardSession } from "../game/boardRules";
import { isBoardSession } from "../game/boardRules";

const MATCH_KEY = "밥상탐험대-matches";
const SESSION_KEY = "밥상탐험대-board-session";

export function loadMatches(): MatchRecord[] {
  try {
    const raw = localStorage.getItem(MATCH_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isMatchRecord).map((record) => ({
      ...record,
      players: record.players.map((player, index) => ({
        ...player,
        id: typeof player.id === "number" ? player.id : index + 1,
      })),
    }));
  } catch {
    return [];
  }
}

export function saveMatches(records: MatchRecord[]): void {
  localStorage.setItem(MATCH_KEY, JSON.stringify(records));
}

export function writeBoardSession(session: BoardSession): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function readBoardSession(): BoardSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isBoardSession(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearBoardSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

function isMatchRecord(value: unknown): value is MatchRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as MatchRecord;
  return (
    typeof record.id === "string" &&
    typeof record.playedAt === "string" &&
    typeof record.winnerName === "string" &&
    Array.isArray(record.players)
  );
}
