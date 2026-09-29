import type { ConditionJudgement, Food, NutritionTotals } from "../types";
import { TRACK_SPACES, level2Missions, level3Missions, studyNutrients, takeMissionIds } from "../data/missions";
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
    stageMissionIds: studyNutrients.map((nutrient) => nutrient.id),
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
    feedback: null,
    phase: session.stage === "level1" || session.reviewMissions ? "preview" : "answer",
    studyToken: 0,
  };
}

export function beginStudy(session: BoardSession): BoardSession {
  return {
    ...session,
    phase: "study",
    studyToken: Date.now(),
  };
}

export function recordRound(
  session: BoardSession,
  points: number,
  result: Omit<TurnFeedback, "points" | "steps" | "reachedGoal">,
  label: string,
): BoardSession {
  return {
    ...session,
    phase: "roundResult",
    pendingPoints: session.pendingPoints + points,
    roundLog: [...session.roundLog, { round: session.round, label, points }],
    feedback: {
      ...result,
      points,
      steps: 0,
      reachedGoal: false,
    },
  };
}

export function confirmRound(session: BoardSession): BoardSession {
  const current = session.players[session.currentPlayerIndex];
  const projected = (current?.position ?? 0) + session.pendingPoints;
  if (projected >= TRACK_SPACES) return beginMove(session);

  const roundCount = Math.max(session.stageMissionIds.length, 1);
  if (session.round < roundCount) {
    return {
      ...session,
      round: session.round + 1,
      phase: "answer",
      feedback: null,
    };
  }
  if (session.stage === "level1") {
    return { ...session, phase: "sessionResult" };
  }
  return beginMove(session);
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
    Array.isArray(session.usedMissionIds) &&
    phases.includes(session.phase) &&
    (session.stage === "level1" || session.stage === "level2" || session.stage === "level3")
  );
}
