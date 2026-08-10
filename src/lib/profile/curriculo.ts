/**
 * Currículo Sequenciado — Motor de Desbloqueio
 * ----------------------------------------------------------------
 * Regras de progressão:
 * - 1ª Lei: sempre disponível (ponto de entrada)
 * - 2ª Lei: disponível quando 1ª Lei ≥ LIMIAR_DESBLOQUEIO%
 * - 3ª Lei: disponível quando 2ª Lei ≥ LIMIAR_DESBLOQUEIO%
 *
 * LIMIAR_DESBLOQUEIO = 50%: exige engajamento real (pelo menos 3 dos 6
 * marcos) mas não perfeccionismo.
 */

import { percentualLicao } from "@/lib/profile/lesson-progress";
import type { Assunto } from "@/lib/questions/types";

export const LIMIAR_DESBLOQUEIO = 50;

export type StatusLei = "disponivel" | "bloqueada" | "concluida";

export type InfoLei = {
  assunto: Assunto;
  numero: string;
  titulo: string;
  emoji: string;
  to: string;
  accentColor: string;
  prerequisito?: Assunto;
};

export const CURRICULO: InfoLei[] = [
  {
    assunto: "lei-1",
    numero: "1ª",
    titulo: "Lei da Inércia",
    emoji: "⚖️",
    to: "/lei-1",
    accentColor: "#1D4ED8",
    prerequisito: undefined,
  },
  {
    assunto: "lei-2",
    numero: "2ª",
    titulo: "Princípio Fundamental",
    emoji: "⚡",
    to: "/lei-2",
    accentColor: "#4F46E5",
    prerequisito: "lei-1",
  },
  {
    assunto: "lei-3",
    numero: "3ª",
    titulo: "Ação e Reação",
    emoji: "🔄",
    to: "/lei-3",
    accentColor: "#059669",
    prerequisito: "lei-2",
  },
];

export function obterStatusLei(assunto: Assunto): StatusLei {
  const info = CURRICULO.find((c) => c.assunto === assunto);
  if (!info) return "bloqueada";

  if (!info.prerequisito) {
    const pct = percentualLicao(assunto);
    return pct >= 100 ? "concluida" : "disponivel";
  }

  const pctPrereq = percentualLicao(info.prerequisito);
  if (pctPrereq < LIMIAR_DESBLOQUEIO) return "bloqueada";

  const pct = percentualLicao(assunto);
  return pct >= 100 ? "concluida" : "disponivel";
}

export type StatusCurriculo = {
  assunto: Assunto;
  info: InfoLei;
  status: StatusLei;
  percentual: number;
  percentualPrerequisito?: number;
  faltamParaDesbloquear: number;
};

export function obterStatusCurriculo(): StatusCurriculo[] {
  return CURRICULO.map((info) => {
    const status = obterStatusLei(info.assunto);
    const percentual = percentualLicao(info.assunto);
    const percentualPrerequisito = info.prerequisito
      ? percentualLicao(info.prerequisito)
      : undefined;
    const faltamParaDesbloquear =
      percentualPrerequisito !== undefined
        ? Math.max(0, LIMIAR_DESBLOQUEIO - percentualPrerequisito)
        : 0;
    return {
      assunto: info.assunto,
      info,
      status,
      percentual,
      percentualPrerequisito,
      faltamParaDesbloquear,
    };
  });
}
