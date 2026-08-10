/**
 * Sistema de Anotações — Store
 * ----------------------------------------------------------------
 * CRUD completo + autosave + histórico simples + recuperação de conteúdo,
 * tudo em localStorage (vinculado ao usuário logado quando houver auth real;
 * por enquanto, vinculado ao navegador).
 *
 * HISTÓRICO SIMPLES / RECUPERAÇÃO DE CONTEÚDO:
 * Antes de cada autosave sobrescrever o conteúdo de uma nota, guardamos a
 * versão anterior em uma pilha por nota (máx. 10 versões). Isso permite
 * desfazer uma edição ruim ou recuperar um parágrafo apagado por engano —
 * sem precisar de um sistema de versionamento completo.
 */

import type { Nota, HistoricoEdicao } from "./types";
import type { Assunto } from "@/lib/questions/types";

const NOTAS_KEY = "fisicafacil:notas";
const HISTORICO_KEY = "fisicafacil:notas-historico";
const MAX_VERSOES_POR_NOTA = 10;

function gerarId(): string {
  return `nota-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ler<T>(key: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : padrao;
  } catch {
    return padrao;
  }
}

function salvar<T>(key: string, valor: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(valor));
}

// ───────────────────────── CRUD ─────────────────────────

export function listarNotas(): Nota[] {
  const notas = ler<Nota[]>(NOTAS_KEY, []);
  return notas.sort((a, b) => b.atualizadaEm.localeCompare(a.atualizadaEm));
}

export function obterNota(id: string): Nota | undefined {
  return listarNotas().find((n) => n.id === id);
}

export function criarNota(assunto: Nota["assunto"] = "geral"): Nota {
  const agora = new Date().toISOString();
  const nova: Nota = {
    id: gerarId(),
    titulo: "Nova anotação",
    conteudo: "",
    assunto,
    criadaEm: agora,
    atualizadaEm: agora,
  };
  const notas = ler<Nota[]>(NOTAS_KEY, []);
  notas.push(nova);
  salvar(NOTAS_KEY, notas);
  return nova;
}

/** Atualiza título/conteúdo/assunto de uma nota e registra a versão anterior no histórico. */
export function atualizarNota(
  id: string,
  dados: Partial<Pick<Nota, "titulo" | "conteudo" | "assunto">>,
): Nota | null {
  const notas = ler<Nota[]>(NOTAS_KEY, []);
  const idx = notas.findIndex((n) => n.id === id);
  if (idx === -1) return null;

  const anterior = notas[idx];

  // Só vale a pena guardar histórico se o conteúdo de fato mudou.
  if (dados.conteudo !== undefined && dados.conteudo !== anterior.conteudo) {
    registrarVersaoAnterior(id, anterior.conteudo);
  }

  const atualizada: Nota = {
    ...anterior,
    ...dados,
    atualizadaEm: new Date().toISOString(),
  };
  notas[idx] = atualizada;
  salvar(NOTAS_KEY, notas);
  return atualizada;
}

export function excluirNota(id: string) {
  const notas = ler<Nota[]>(NOTAS_KEY, []).filter((n) => n.id !== id);
  salvar(NOTAS_KEY, notas);

  const historico = ler<HistoricoEdicao[]>(HISTORICO_KEY, []).filter((h) => h.notaId !== id);
  salvar(HISTORICO_KEY, historico);
}

// ───────────────────────── Busca e filtro ─────────────────────────

export function buscarNotas(termo: string, assunto?: Nota["assunto"]): Nota[] {
  const termoNormalizado = termo.trim().toLowerCase();
  return listarNotas().filter((n) => {
    const passaAssunto = assunto ? n.assunto === assunto : true;
    const passaBusca =
      termoNormalizado.length === 0 ||
      n.titulo.toLowerCase().includes(termoNormalizado) ||
      n.conteudo.toLowerCase().includes(termoNormalizado);
    return passaAssunto && passaBusca;
  });
}

export function contarNotasPorAssunto(): Record<Assunto | "geral", number> {
  const contagem: Record<string, number> = { geral: 0, "lei-1": 0, "lei-2": 0, "lei-3": 0 };
  for (const n of listarNotas()) {
    contagem[n.assunto] = (contagem[n.assunto] ?? 0) + 1;
  }
  return contagem as Record<Assunto | "geral", number>;
}

// ───────────────────────── Histórico simples / recuperação ─────────────────────────

function registrarVersaoAnterior(notaId: string, conteudoAnterior: string) {
  // Não vale a pena guardar versões vazias (ex: nota recém-criada).
  if (conteudoAnterior.trim().length === 0) return;

  const historico = ler<HistoricoEdicao[]>(HISTORICO_KEY, []);
  historico.push({ notaId, conteudoAnterior, salvoEm: new Date().toISOString() });

  // Mantém só as últimas MAX_VERSOES_POR_NOTA versões de cada nota, pra não crescer sem limite.
  const dessaNota = historico.filter((h) => h.notaId === notaId);
  if (dessaNota.length > MAX_VERSOES_POR_NOTA) {
    const excedente = dessaNota.length - MAX_VERSOES_POR_NOTA;
    const idsParaRemover = new Set(dessaNota.slice(0, excedente).map((h) => h.salvoEm));
    const filtrado = historico.filter(
      (h) => !(h.notaId === notaId && idsParaRemover.has(h.salvoEm)),
    );
    salvar(HISTORICO_KEY, filtrado);
  } else {
    salvar(HISTORICO_KEY, historico);
  }
}

export function obterHistoricoDaNota(notaId: string): HistoricoEdicao[] {
  return ler<HistoricoEdicao[]>(HISTORICO_KEY, [])
    .filter((h) => h.notaId === notaId)
    .sort((a, b) => b.salvoEm.localeCompare(a.salvoEm));
}

/** Restaura uma versão anterior do conteúdo, guardando a versão atual no histórico antes de sobrescrever. */
export function restaurarVersao(notaId: string, conteudoParaRestaurar: string): Nota | null {
  return atualizarNota(notaId, { conteudo: conteudoParaRestaurar });
}
