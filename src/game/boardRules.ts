import type { ConditionJudgement, Food, NutritionTotals } from "../types";
import {
  MAX_ATTEMPTS,
  TRACK_SPACES,
  level1Rounds,
  level2Missions,
  level3Missions,
  takeMissionIds,
} from "../data/missions";
import { createPlayerFoodSets } from "../utils/foodSets";

export type StageId = "level1" | "level2" | "level3";
export type PlayPhase =
  | "board"
  | "preview"
  | "study"
  | "answer"
  | "roundResult"
  | "sessionResult"
  | "moving"
  | "done";

export const PLAYER_ROLES = [
  { role: "셰프", color: "#1f9d55" },
  { role: "탐험가", color: "#ea7a2f" },
  { role: "영양 박사", color: "#2f6fed" },
  { role: "과일 친구", color: "#8b5cf6" },
] as const;

export interface Player {
  id: number;
  name: string;
  role: string;
  color: string;
  position: number;
  totalScore: number;
  foodSetId: string;
  foodSet: Food[];
}

export interface RoundNote {
  round: number;
  label: string;
  points: number;
}

export interface TurnFeedback {
  points: number;
  steps: number;
  reachedGoal: boolean;
  headline: string;
  detail: string;
  answerNames: string[];
  conditions: ConditionJudgement[];
  totals: NutritionTotals | null;
}

export interface BoardSession {
  startedAt: number;
  studyToken: number;
  playerCount: number;
  demoCards: boolean;
  players: Player[];
  stage: StageId;
  round: number;
  phase: PlayPhase;
  currentPlayerIndex: number;
  pendingPoints: number;
  roundLog: RoundNote[];
  /** LEVEL 2·3 현재 문제의 시도 횟수. 1부터 센다. */
  attempt: number;
  /** 아직 확정하지 않은 이번 문제의 최고 점수. */
  bestPoints: number;
  roundLabel: string;
  stageMissionIds: string[];
  usedMissionIds: string[];
  /** LEVEL 3 이후 LEVEL 2로 돌아왔을 때, 바뀐 문제와 카드를 다시 보여 준다. */
  reviewMissions?: boolean;
  feedback: TurnFeedback | null;
  winnerId: number | null;
}

const phases: PlayPhase[] = [
  "board",
  "preview",
  "study",
  "answer",
  "roundResult",
  "sessionResult",
  "moving",
  "done",
];

export function createPlayers(count: number, stable = false): Player[] {
  return createPlayerFoodSets(count, stable).map((set, index) => {
    const role = PLAYER_ROLES[index] ?? PLAYER_ROLES[0];
    return {
      id: set.playerId,
      name: `PLAYER ${set.playerId}`,
      role: role.role,
      color: role.color,
      position: 0,
      totalScore: 0,
      foodSetId: set.setId,
      foodSet: set.foods,
    };
  });
}

export function createSession(playerCount: number, demoCards: boolean): BoardSession {
  return {
    startedAt: Date.now(),
    studyToken: 0,
    playerCount,
    demoCards,
    players: createPlayers(playerCount, demoCards),
    stage: "level1",
    round: 1,
    phase: "board",
    currentPlayerIndex: 0,
    pendingPoints: 0,
    roundLog: [],
    attempt: 1,
    bestPoints: 0,
    roundLabel: "",
    stageMissionIds: level1Rounds.map((round) => round.id),
    usedMissionIds: [],
    reviewMissions: false,
    feedback: null,
    winnerId: null,
  };
}

export function openTurn(session: BoardSession): BoardSession {
  return {
    ...session,
    round: 1,
    pendingPoints: 0,
    roundLog: [],
    attempt: 1,
    bestPoints: 0,
    roundLabel: "",
    feedback: null,
    phase: session.stage === "level1" ? "study" : session.reviewMissions ? "preview" : "answer",
    studyToken: session.stage === "level1" ? Date.now() : 0,
  };
}

export function recordRound(
  session: BoardSession,
  points: number,
  maxPoints: number,
  result: Omit<TurnFeedback, "points" | "steps" | "reachedGoal">,
  label: string,
): BoardSession {
  const meal = session.stage !== "level1";
  const attempt = session.attempt || 1;
  const bestPoints = Math.max(session.bestPoints || 0, points);
  const canRetry = meal && attempt < MAX_ATTEMPTS && points < maxPoints;
  const feedback: TurnFeedback = {
    ...result,
    points,
    steps: 0,
    reachedGoal: false,
  };

  if (canRetry) {
    return {
      ...session,
      phase: "roundResult",
      bestPoints,
      roundLabel: label,
      feedback,
    };
  }

  const awarded = meal ? bestPoints : points;
  return {
    ...session,
    phase: "roundResult",
    bestPoints: 0,
    roundLabel: label,
    pendingPoints: session.pendingPoints + awarded,
    roundLog: [...session.roundLog, { round: session.round, label, points: awarded }],
    feedback: { ...feedback, points: awarded },
  };
}

/** 기회를 남긴 채 결과를 본 뒤, 최고 점수로 이번 문제를 확정한다. */
function commitPendingRound(session: BoardSession): BoardSession {
  if (!session.feedback) return session;
  if (session.roundLog.some((note) => note.round === session.round)) return session;
  const points = Math.max(session.bestPoints || 0, session.feedback.points);
  return {
    ...session,
    bestPoints: 0,
    pendingPoints: session.pendingPoints + points,
    roundLog: [
      ...session.roundLog,
      { round: session.round, label: session.roundLabel || "문제", points },
    ],
    feedback: { ...session.feedback, points },
  };
}

export function retryRound(session: BoardSession): BoardSession {
  if (session.stage === "level1") return session;
  if ((session.attempt || 1) >= MAX_ATTEMPTS) return session;
  if (session.roundLog.some((note) => note.round === session.round)) return session;
  return {
    ...session,
    attempt: (session.attempt || 1) + 1,
    phase: "answer",
    feedback: null,
  };
}

export function confirmRound(session: BoardSession): BoardSession {
  const locked = commitPendingRound(session);
  const current = locked.players[locked.currentPlayerIndex];
  const projected = (current?.position ?? 0) + locked.pendingPoints;
  if (projected >= TRACK_SPACES) return beginMove(locked);

  const roundCount = Math.max(locked.stageMissionIds.length, 1);
  if (locked.round < roundCount) {
    return {
      ...locked,
      round: locked.round + 1,
      phase: "answer",
      feedback: null,
      attempt: 1,
      bestPoints: 0,
      roundLabel: "",
    };
  }
  if (locked.stage === "level1") {
    return { ...locked, phase: "sessionResult" };
  }
  return beginMove(locked);
}

export function beginMove(session: BoardSession): BoardSession {
  const current = session.players[session.currentPlayerIndex];
  if (!current) return session;

  const points = session.pendingPoints;
  const steps = Math.max(0, Math.min(points, TRACK_SPACES - current.position));
  const position = Math.min(current.position + steps, TRACK_SPACES);
  const reachedGoal = position >= TRACK_SPACES;
  const players = session.players.map((player, index) =>
    index === session.currentPlayerIndex
      ? { ...player, position, totalScore: player.totalScore + points }
      : player,
  );

  return {
    ...session,
    players,
    phase: "moving",
    pendingPoints: 0,
    winnerId: reachedGoal ? current.id : session.winnerId,
    feedback: {
      points,
      steps,
      reachedGoal,
      headline: reachedGoal ? `${current.name}가 GOAL에 도착했습니다!` : `${current.name} +${steps}칸 이동!`,
      detail: moveSentence(steps, reachedGoal),
      answerNames: [],
      conditions: session.feedback?.conditions ?? [],
      totals: session.feedback?.totals ?? null,
    },
  };
}

export function finishMove(session: BoardSession): BoardSession {
  if (session.winnerId || session.feedback?.reachedGoal) {
    return { ...session, phase: "done" };
  }

  const lastPlayer = session.currentPlayerIndex >= session.players.length - 1;
  if (!lastPlayer) {
    return {
      ...session,
      currentPlayerIndex: session.currentPlayerIndex + 1,
      round: 1,
      phase: "board",
      feedback: null,
      pendingPoints: 0,
      roundLog: [],
      attempt: 1,
      bestPoints: 0,
      roundLabel: "",
    };
  }

  if (session.stage === "level1") {
    return openStage(session, "level2", level2Missions, 4);
  }

  if (session.stage === "level2") {
    return openStage(session, "level3", level3Missions, 3);
  }

  return { ...openStage(session, "level2", level2Missions, 4), reviewMissions: true };
}

function openStage(
  session: BoardSession,
  stage: StageId,
  pool: ReadonlyArray<{ id: string }>,
  count: number,
): BoardSession {
  const deal = takeMissionIds(pool, session.usedMissionIds, count);
  return {
    ...session,
    stage,
    round: 1,
    currentPlayerIndex: 0,
    phase: "board",
    feedback: null,
    pendingPoints: 0,
    roundLog: [],
    attempt: 1,
    bestPoints: 0,
    roundLabel: "",
    stageMissionIds: deal.ids,
    usedMissionIds: deal.used,
    reviewMissions: false,
  };
}

export function moveSentence(steps: number, reachedGoal: boolean): string {
  if (reachedGoal) {
    return steps > 0 ? `말이 ${steps}칸 이동해 GOAL에 도착합니다.` : "GOAL에 도착합니다.";
  }
  if (steps === 0) return "말은 이동하지 않습니다.";
  return `말이 ${steps}칸 이동합니다.`;
}

export function stageTitle(stage: StageId): string {
  if (stage === "level1") return "영양소 비교 게임";
  if (stage === "level2") return "한 끼 구성 게임";
  return "영양조건 맞추기";
}

export function isBoardSession(value: unknown): value is BoardSession {
  if (!value || typeof value !== "object") return false;
  const session = value as BoardSession;
  return (
    Array.isArray(session.players) &&
    session.players.length > 0 &&
    session.players.every(
      (player) => Array.isArray(player.foodSet) && player.foodSet.length === 9 && player.foodSetId,
    ) &&
    Array.isArray(session.roundLog) &&
    typeof session.pendingPoints === "number" &&
    Array.isArray(session.stageMissionIds) &&
    session.stageMissionIds.length > 0 &&
    (session.stage !== "level1" || session.stageMissionIds.length === level1Rounds.length) &&
    Array.isArray(session.usedMissionIds) &&
    phases.includes(session.phase) &&
    (session.stage === "level1" || session.stage === "level2" || session.stage === "level3")
  );
}
