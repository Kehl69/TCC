/**
 * Sistema de Questões de Cálculo — Motor
 * ----------------------------------------------------------------
 * Complementa o engine.ts de múltipla escolha. As respostas de questões
 * de cálculo são salvas no MESMO localStorage de respostas (STORAGE_KEY),
 * com letraEscolhida = "CALC", para que o dashboard e o perfil de
 * aprendizagem as contabilizem junto com as de múltipla escolha.
 *
 * VERIFICAÇÃO DE RESPOSTA:
 * Aceita qualquer valor dentro de ±toleranciaPercent% do valor correto.
 * Se errar, verifica as faixas de diagnóstico na ordem em que estão
 * definidas, retornando a primeira que englobe o valor digitado.
 */

import type { Assunto, Dificuldade, QuestaoCalculo } from "./types";
import { QUESTOES_CALCULO } from "./bank-calculo";
import { registrarResposta } from "./engine";

const STORAGE_CALCULO_KEY = "fisicafacil:respostas-calculo";

export type RespostaCalculo = {
  questaoId: string;
  valorDigitado: number;
  correta: boolean;
  diagnostico?: string;
  tempoSegundos: number;
  respondidoEm: string;
};

function lerRespostasCalculo(): RespostaCalculo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_CALCULO_KEY);
    return raw ? (JSON.parse(raw) as RespostaCalculo[]) : [];
  } catch {
    return [];
  }
}

function salvarRespostasCalculo(respostas: RespostaCalculo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_CALCULO_KEY, JSON.stringify(respostas));
}

// ───────────────────────── Seleção ─────────────────────────

export function obterQuestoesCalculoPorAssunto(
  assunto: Assunto,
  dificuldade?: Dificuldade,
): QuestaoCalculo[] {
  return QUESTOES_CALCULO.filter(
    (q) => q.assunto === assunto && (dificuldade ? q.dificuldade === dificuldade : true),
  );
}

export function escolherProximaQuestaoCalculo(
  assunto: Assunto,
  dificuldade: Dificuldade,
  excluirIds: string[] = [],
): QuestaoCalculo | null {
  const candidatas = obterQuestoesCalculoPorAssunto(assunto, dificuldade).filter(
    (q) => !excluirIds.includes(q.id),
  );
  const pool =
    candidatas.length > 0 ? candidatas : obterQuestoesCalculoPorAssunto(assunto, dificuldade);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ───────────────────────── Verificação de resposta ─────────────────────────

export type ResultadoVerificacao = {
  correta: boolean;
  /** Se correta: undefined. Se errada: diagnóstico da faixa de erro, ou mensagem genérica. */
  diagnostico?: string;
};

export function verificarRespostaCalculo(
  questao: QuestaoCalculo,
  valorDigitado: number,
): ResultadoVerificacao {
  const tolerancia = questao.toleranciaPercent ?? 2;
  const margemAbsoluta = Math.abs(questao.valorCorreto) * (tolerancia / 100);
  const correta = Math.abs(valorDigitado - questao.valorCorreto) <= margemAbsoluta;

  if (correta) return { correta: true };

  // Procura um diagnóstico específico para o valor digitado
  const faixaEncontrada = questao.faixasErro.find(
    (f) => valorDigitado >= f.min && valorDigitado <= f.max,
  );

  return {
    correta: false,
    diagnostico:
      faixaEncontrada?.diagnostico ??
      `Valor incorreto. O resultado correto é ${questao.valorCorreto} ${questao.unidade}. Revise os passos de resolução acima.`,
  };
}

// ───────────────────────── Registro ─────────────────────────

export function registrarRespostaCalculo(
  questao: QuestaoCalculo,
  valorDigitado: number,
  tempoSegundos: number,
): ResultadoVerificacao {
  const resultado = verificarRespostaCalculo(questao, valorDigitado);

  // Salva no storage próprio de cálculo
  const respostas = lerRespostasCalculo();
  respostas.push({
    questaoId: questao.id,
    valorDigitado,
    correta: resultado.correta,
    diagnostico: resultado.diagnostico,
    tempoSegundos,
    respondidoEm: new Date().toISOString(),
  });
  salvarRespostasCalculo(respostas);

  // Também registra no histórico unificado (para o dashboard/perfil contabilizar)
  registrarResposta({
    questaoId: questao.id,
    letraEscolhida: "CALC",
    correta: resultado.correta,
    tempoSegundos,
    respondidoEm: new Date().toISOString(),
  });

  return resultado;
}

export function obterHistoricoCalculo(): RespostaCalculo[] {
  return lerRespostasCalculo();
}
