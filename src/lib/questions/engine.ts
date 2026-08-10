/**
 * Sistema de Questões — Motor
 * ----------------------------------------------------------------
 * Sem backend ainda, então o histórico do aluno é persistido no
 * localStorage do navegador. A interface (`HistoricoStore`) foi desenhada
 * de propósito para que, quando houver backend, baste trocar a
 * implementação por chamadas de API — o resto do app não precisa mudar.
 *
 * MODO ADAPTATIVO — algoritmo de progressão:
 * A cada resposta, observamos os últimos N=5 resultados do aluno NO
 * ASSUNTO ATUAL (não no banco todo, pois desempenho varia por assunto):
 *   - 4 ou 5 acertos nas últimas 5  → sobe de dificuldade
 *   - 1 ou 0 acertos nas últimas 5  → desce de dificuldade
 *   - caso contrário               → mantém a dificuldade atual
 * Isso evita reagir a uma única resposta isolada (ruído) e ainda assim
 * responde rápido (janela curta de 5) a uma mudança real de domínio.
 */

import type { Assunto, Dificuldade, Questao, Resposta, TaxaAcerto } from "./types";
import { QUESTOES } from "./bank";

const STORAGE_KEY = "fisicafacil:respostas";
const DIFFICULTY_KEY = "fisicafacil:dificuldade-adaptativa";

const ORDEM_DIFICULDADE: Dificuldade[] = ["facil", "medio", "dificil"];

// ───────────────────────── Persistência (localStorage) ─────────────────────────

function lerRespostas(): Resposta[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Resposta[]) : [];
  } catch {
    return [];
  }
}

function salvarRespostas(respostas: Resposta[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(respostas));
}

export function registrarResposta(r: Resposta) {
  const respostas = lerRespostas();
  respostas.push(r);
  salvarRespostas(respostas);
}

export function obterHistorico(): Resposta[] {
  return lerRespostas();
}

export function limparHistorico() {
  salvarRespostas([]);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DIFFICULTY_KEY);
  }
}

// ───────────────────────── Seleção de questões ─────────────────────────

export function obterQuestoesPorAssunto(assunto: Assunto, dificuldade?: Dificuldade): Questao[] {
  return QUESTOES.filter(
    (q) => q.assunto === assunto && (dificuldade ? q.dificuldade === dificuldade : true),
  );
}

export function obterQuestaoPorId(id: string): Questao | undefined {
  return QUESTOES.find((q) => q.id === id);
}

/** Escolhe uma questão aleatória ainda não respondida hoje, se possível, senão qualquer uma do nível. */
export function escolherProximaQuestao(
  assunto: Assunto,
  dificuldade: Dificuldade,
  excluirIds: string[] = [],
): Questao | null {
  const candidatas = obterQuestoesPorAssunto(assunto, dificuldade).filter(
    (q) => !excluirIds.includes(q.id),
  );
  const pool = candidatas.length > 0 ? candidatas : obterQuestoesPorAssunto(assunto, dificuldade);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ───────────────────────── Métricas (taxa de acerto, tempo médio) ─────────────────────────

export function calcularMetricas(): TaxaAcerto[] {
  const respostas = lerRespostas();
  const porQuestao = new Map<string, Resposta[]>();
  for (const r of respostas) {
    const lista = porQuestao.get(r.questaoId) ?? [];
    lista.push(r);
    porQuestao.set(r.questaoId, lista);
  }

  const resultado: TaxaAcerto[] = [];
  for (const [questaoId, lista] of porQuestao) {
    const acertos = lista.filter((r) => r.correta).length;
    const tempoTotal = lista.reduce((s, r) => s + r.tempoSegundos, 0);
    resultado.push({
      questaoId,
      taxaAcerto: Math.round((acertos / lista.length) * 100),
      tempoMedioSegundos: Math.round(tempoTotal / lista.length),
    });
  }
  return resultado;
}

export type DesempenhoPorAssunto = {
  assunto: Assunto;
  totalRespostas: number;
  acertos: number;
  taxaAcerto: number; // 0-100
};

export function calcularDesempenhoPorAssunto(): DesempenhoPorAssunto[] {
  const respostas = lerRespostas();
  const assuntos: Assunto[] = ["lei-1", "lei-2", "lei-3"];

  return assuntos.map((assunto) => {
    const idsDoAssunto = new Set(QUESTOES.filter((q) => q.assunto === assunto).map((q) => q.id));
    const respostasDoAssunto = respostas.filter((r) => idsDoAssunto.has(r.questaoId));
    const acertos = respostasDoAssunto.filter((r) => r.correta).length;
    const total = respostasDoAssunto.length;
    return {
      assunto,
      totalRespostas: total,
      acertos,
      taxaAcerto: total > 0 ? Math.round((acertos / total) * 100) : 0,
    };
  });
}

/** Assuntos dominados (taxa ≥ 75% com pelo menos 3 respostas) e que precisam de revisão (taxa < 50%). */
export function identificarPontosFortesEFracos() {
  const desempenho = calcularDesempenhoPorAssunto();
  const dominados = desempenho.filter((d) => d.totalRespostas >= 3 && d.taxaAcerto >= 75);
  const precisamRevisao = desempenho.filter((d) => d.totalRespostas >= 3 && d.taxaAcerto < 50);
  return { dominados, precisamRevisao, desempenho };
}

// ───────────────────────── Dificuldade adaptativa ─────────────────────────

type EstadoAdaptativo = Record<Assunto, Dificuldade>;

function lerEstadoAdaptativo(): EstadoAdaptativo {
  const padrao: EstadoAdaptativo = { "lei-1": "facil", "lei-2": "facil", "lei-3": "facil" };
  if (typeof window === "undefined") return padrao;
  try {
    const raw = window.localStorage.getItem(DIFFICULTY_KEY);
    return raw ? { ...padrao, ...JSON.parse(raw) } : padrao;
  } catch {
    return padrao;
  }
}

function salvarEstadoAdaptativo(estado: EstadoAdaptativo) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DIFFICULTY_KEY, JSON.stringify(estado));
}

export function obterDificuldadeAtual(assunto: Assunto): Dificuldade {
  return lerEstadoAdaptativo()[assunto];
}

function moverNivel(atual: Dificuldade, passos: number): Dificuldade {
  const idx = ORDEM_DIFICULDADE.indexOf(atual);
  const novoIdx = Math.min(Math.max(idx + passos, 0), ORDEM_DIFICULDADE.length - 1);
  return ORDEM_DIFICULDADE[novoIdx];
}

/**
 * Atualiza a dificuldade adaptativa de um assunto com base nas últimas 5
 * respostas. Deve ser chamada DEPOIS de registrarResposta(). Retorna o novo
 * nível e se houve mudança, para a UI poder comunicar ao aluno.
 */
export function atualizarDificuldadeAdaptativa(assunto: Assunto): {
  nivelAnterior: Dificuldade;
  nivelNovo: Dificuldade;
  mudou: boolean;
} {
  const estado = lerEstadoAdaptativo();
  const nivelAnterior = estado[assunto];

  const idsDoAssunto = new Set(QUESTOES.filter((q) => q.assunto === assunto).map((q) => q.id));
  const respostasDoAssunto = lerRespostas()
    .filter((r) => idsDoAssunto.has(r.questaoId))
    .slice(-5);

  let nivelNovo = nivelAnterior;
  if (respostasDoAssunto.length >= 5) {
    const acertos = respostasDoAssunto.filter((r) => r.correta).length;
    if (acertos >= 4) nivelNovo = moverNivel(nivelAnterior, 1);
    else if (acertos <= 1) nivelNovo = moverNivel(nivelAnterior, -1);
  }

  estado[assunto] = nivelNovo;
  salvarEstadoAdaptativo(estado);

  return { nivelAnterior, nivelNovo, mudou: nivelNovo !== nivelAnterior };
}
