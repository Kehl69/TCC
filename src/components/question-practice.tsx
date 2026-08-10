import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
  ArrowRight,
  PenLine,
  ChevronDown,
  ChevronUp,
  Calculator,
  ListChecks,
} from "lucide-react";
import type { Assunto, Dificuldade, Questao } from "@/lib/questions/types";
import type { QuestaoCalculo } from "@/lib/questions/types";
import {
  escolherProximaQuestao,
  obterDificuldadeAtual,
  registrarResposta,
  atualizarDificuldadeAdaptativa,
  calcularDesempenhoPorAssunto,
} from "@/lib/questions/engine";
import { escolherProximaQuestaoCalculo } from "@/lib/questions/engine-calculo";
import { ASSUNTO_LABEL } from "@/lib/questions/types";
import { Whiteboard } from "@/components/whiteboard";
import { CalculationCard } from "@/components/calculation-card";

const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

const DIFICULDADE_COR: Record<Dificuldade, string> = {
  facil: "#059669",
  medio: "#D97706",
  dificil: "#DC2626",
};

type Modo = Dificuldade | "adaptativo";
type TipoQuestao = "multipla" | "calculo";

export function QuestionPractice({ assunto }: { assunto: Assunto }) {
  const [modo, setModo] = useState<Modo>("adaptativo");
  const [tipo, setTipo] = useState<TipoQuestao>("multipla");

  // Múltipla escolha
  const [questaoAtual, setQuestaoAtual] = useState<Questao | null>(null);
  const [respondidoIds, setRespondidoIds] = useState<string[]>([]);
  const [selecionada, setSelecionada] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [revelado, setRevelado] = useState(false);
  const [avisoAdaptativo, setAvisoAdaptativo] = useState<string | null>(null);
  const [quadroAberto, setQuadroAberto] = useState(false);

  // Cálculo numérico
  const [questaoCalculo, setQuestaoCalculo] = useState<QuestaoCalculo | null>(null);
  const [respondidoIdsCalculo, setRespondidoIdsCalculo] = useState<string[]>([]);
  const [calcKey, setCalcKey] = useState(0);

  // Estatísticas da sessão (compartilhadas)
  const [streak, setStreak] = useState({ acertos: 0, total: 0 });
  const inicioRef = useRef<number>(Date.now());

  const dificuldadeEfetiva: Dificuldade =
    modo === "adaptativo" ? obterDificuldadeAtual(assunto) : modo;

  // ── Múltipla escolha ──
  function carregarNovaQuestao(dif: Dificuldade) {
    const q = escolherProximaQuestao(assunto, dif, respondidoIds);
    setQuestaoAtual(q);
    setSelecionada(null);
    setRevelado(false);
    setAvisoAdaptativo(null);
    inicioRef.current = Date.now();
  }

  // ── Cálculo ──
  function carregarNovaQuestaoCalculo(dif: Dificuldade) {
    const q = escolherProximaQuestaoCalculo(assunto, dif, respondidoIdsCalculo);
    setQuestaoCalculo(q);
    setCalcKey((k) => k + 1);
  }

  useEffect(() => {
    if (tipo === "multipla") {
      carregarNovaQuestao(dificuldadeEfetiva);
    } else {
      carregarNovaQuestaoCalculo(dificuldadeEfetiva);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assunto, modo, tipo]);

  function responder(letra: "A" | "B" | "C" | "D") {
    if (revelado || !questaoAtual) return;
    setSelecionada(letra);
    setRevelado(true);

    const correta = letra === questaoAtual.correta;
    const tempoSegundos = Math.max(1, Math.round((Date.now() - inicioRef.current) / 1000));

    registrarResposta({
      questaoId: questaoAtual.id,
      letraEscolhida: letra,
      correta,
      tempoSegundos,
      respondidoEm: new Date().toISOString(),
    });

    setRespondidoIds((prev) => [...prev, questaoAtual.id]);
    setStreak((s) => ({ acertos: s.acertos + (correta ? 1 : 0), total: s.total + 1 }));

    if (modo === "adaptativo") {
      const { mudou, nivelNovo, nivelAnterior } = atualizarDificuldadeAdaptativa(assunto);
      if (mudou) {
        const subiu =
          ["facil", "medio", "dificil"].indexOf(nivelNovo) >
          ["facil", "medio", "dificil"].indexOf(nivelAnterior);
        setAvisoAdaptativo(
          subiu
            ? `Você está indo bem! Nível ajustado para ${DIFICULDADE_LABEL[nivelNovo]}.`
            : `Vamos reforçar o básico. Nível ajustado para ${DIFICULDADE_LABEL[nivelNovo]}.`,
        );
      }
    }
  }

  function proximaQuestao() {
    const dif = modo === "adaptativo" ? obterDificuldadeAtual(assunto) : modo;
    carregarNovaQuestao(dif);
  }

  function proximaQuestaoCalculo() {
    if (questaoCalculo) {
      setRespondidoIdsCalculo((prev) => [...prev, questaoCalculo.id]);
    }
    const dif = modo === "adaptativo" ? obterDificuldadeAtual(assunto) : modo;
    carregarNovaQuestaoCalculo(dif);
  }

  function registrarStreakCalculo(correta: boolean) {
    setStreak((s) => ({ acertos: s.acertos + (correta ? 1 : 0), total: s.total + 1 }));
  }

  const desempenho = calcularDesempenhoPorAssunto().find((d) => d.assunto === assunto);

  return (
    <div>
      {/* Toggle Tipo de questão */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-1.5 shadow-[var(--shadow-xs)] w-fit">
        <button
          onClick={() => setTipo("multipla")}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition"
          style={
            tipo === "multipla" ? { background: "#4F46E5", color: "white" } : { color: "#6B7280" }
          }
        >
          <ListChecks className="h-4 w-4" /> Múltipla escolha
        </button>
        <button
          onClick={() => setTipo("calculo")}
          className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition"
          style={
            tipo === "calculo" ? { background: "#7C3AED", color: "white" } : { color: "#6B7280" }
          }
        >
          <Calculator className="h-4 w-4" /> Cálculo numérico
        </button>
      </div>

      {/* Seletor de dificuldade */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="ff-tabs">
          {(["facil", "medio", "dificil", "adaptativo"] as Modo[]).map((m) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              className={`ff-tab ${modo === m ? "active" : ""}`}
            >
              {m === "adaptativo" ? <Target className="h-4 w-4" /> : null}
              {m === "adaptativo" ? "Adaptativo" : DIFICULDADE_LABEL[m as Dificuldade]}
            </button>
          ))}
        </div>

        {streak.total > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-bold shadow-[var(--shadow-xs)]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
            {streak.acertos}/{streak.total} nesta sessão
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {desempenho && desempenho.totalRespostas > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#F9FAFB] px-4 py-3 text-xs font-semibold text-[#6B7280]">
          <TrendingUp className="h-4 w-4 text-[#4F46E5]" />
          Sua taxa de acerto em {ASSUNTO_LABEL[assunto]}:{" "}
          <span style={{ color: "#4F46E5" }}>{desempenho.taxaAcerto}%</span>
          <span className="text-[#9CA3AF]">({desempenho.totalRespostas} questões respondidas)</span>
        </div>
      )}

      {/* ── Questão de cálculo ── */}
      {tipo === "calculo" && (
        <>
          {questaoCalculo ? (
            <CalculationCard
              key={calcKey}
              questao={questaoCalculo}
              onProxima={proximaQuestaoCalculo}
              onRegistrado={registrarStreakCalculo}
            />
          ) : (
            <div className="ff-card p-8 text-center">
              <p className="text-sm text-[#6B7280]">
                Nenhuma questão de cálculo disponível para este nível ainda.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── Questão de múltipla escolha ── */}
      {tipo === "multipla" && (
        <>
          {!questaoAtual ? (
            <div className="ff-card p-8 text-center">
              <p className="text-sm text-[#6B7280]">
                Nenhuma questão disponível para este nível ainda.
              </p>
            </div>
          ) : (
            <div className="ff-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
              <div
                className="ff-accent-bar"
                style={{ background: DIFICULDADE_COR[questaoAtual.dificuldade] }}
              />
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="ff-badge"
                    style={{
                      background: `${DIFICULDADE_COR[questaoAtual.dificuldade]}15`,
                      color: DIFICULDADE_COR[questaoAtual.dificuldade],
                      border: `1px solid ${DIFICULDADE_COR[questaoAtual.dificuldade]}30`,
                    }}
                  >
                    {DIFICULDADE_LABEL[questaoAtual.dificuldade]}
                  </span>
                  <span className="ff-badge ff-badge-primary">{questaoAtual.subassunto}</span>
                  {modo === "adaptativo" && (
                    <span
                      className="ff-badge"
                      style={{ background: "rgba(79,70,229,0.08)", color: "#4F46E5" }}
                    >
                      <Target className="h-3 w-3" /> nível ajustado pra você
                    </span>
                  )}
                </div>

                <p className="mt-5 text-base font-semibold leading-relaxed text-[#111118] md:text-lg">
                  {questaoAtual.enunciado}
                </p>

                {questaoAtual.formula && (
                  <div className="mt-4 rounded-xl bg-[#F9FAFB] px-4 py-3 text-center">
                    <span className="ff-formula text-lg font-bold text-[#4F46E5]">
                      {questaoAtual.formula}
                    </span>
                  </div>
                )}

                {/* Alternativas */}
                <div className="mt-6 space-y-2.5">
                  {questaoAtual.alternativas.map((alt) => {
                    const isCorreta = alt.letra === questaoAtual.correta;
                    const isSelecionada = alt.letra === selecionada;

                    let estilo =
                      "border-[#E5E7EB] bg-white hover:border-[#C7C9D1] hover:bg-[#FAFAFA]";
                    if (revelado) {
                      if (isCorreta)
                        estilo = "border-[rgba(22,163,74,0.4)] bg-[rgba(22,163,74,0.06)]";
                      else if (isSelecionada)
                        estilo = "border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.06)]";
                      else estilo = "border-[#E5E7EB] bg-white opacity-60";
                    }

                    return (
                      <button
                        key={alt.letra}
                        onClick={() => responder(alt.letra)}
                        disabled={revelado}
                        className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${estilo} ${revelado ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <span
                          className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold"
                          style={{
                            background:
                              revelado && isCorreta
                                ? "#16A34A"
                                : revelado && isSelecionada
                                  ? "#DC2626"
                                  : "#F3F4F6",
                            color: revelado && (isCorreta || isSelecionada) ? "white" : "#6B7280",
                          }}
                        >
                          {alt.letra}
                        </span>
                        <span className="flex-1 text-sm font-medium leading-relaxed text-[#374151]">
                          {alt.texto}
                        </span>
                        {revelado && isCorreta && (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#16A34A]" />
                        )}
                        {revelado && isSelecionada && !isCorreta && (
                          <XCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Quadro negro retrátil */}
                <div className="mt-5">
                  <button
                    onClick={() => setQuadroAberto((v) => !v)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F3F4F6]"
                  >
                    <span className="flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-[#4F46E5]" /> Resolver no quadro negro
                    </span>
                    {quadroAberto ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {quadroAberto && (
                    <div className="mt-3">
                      <Whiteboard compact />
                    </div>
                  )}
                </div>

                {/* Gabarito explicativo */}
                {revelado && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-[#4F46E5]" />
                      <h3 className="text-sm font-bold text-[#111118]">
                        Gabarito explicativo completo
                      </h3>
                    </div>
                    {questaoAtual.alternativas.map((alt) => {
                      const isCorreta = alt.letra === questaoAtual.correta;
                      return (
                        <div
                          key={alt.letra}
                          className="rounded-2xl border p-4"
                          style={{
                            borderColor: isCorreta
                              ? "rgba(22,163,74,0.25)"
                              : "rgba(220,38,38,0.18)",
                            background: isCorreta ? "rgba(22,163,74,0.04)" : "rgba(220,38,38,0.03)",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {isCorreta ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
                            )}
                            <span
                              className="text-xs font-bold"
                              style={{ color: isCorreta ? "#15803D" : "#B91C1C" }}
                            >
                              Alternativa {alt.letra} {isCorreta ? "(correta)" : "(incorreta)"}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-[#374151]">
                            {alt.explicacao}
                          </p>
                        </div>
                      );
                    })}

                    {avisoAdaptativo && (
                      <div className="flex items-center gap-2 rounded-xl bg-[rgba(79,70,229,0.06)] px-4 py-3 text-sm font-semibold text-[#4338CA]">
                        <Target className="h-4 w-4 shrink-0" /> {avisoAdaptativo}
                      </div>
                    )}

                    <button
                      onClick={proximaQuestao}
                      className="ff-btn-primary mt-2 w-full justify-center"
                    >
                      Próxima questão <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function DifficultyTrendBadge({ assunto }: { assunto: Assunto }) {
  const dif = obterDificuldadeAtual(assunto);
  const Icon = dif === "dificil" ? TrendingUp : dif === "facil" ? TrendingDown : Minus;
  return (
    <span
      className="ff-badge"
      style={{ background: `${DIFICULDADE_COR[dif]}15`, color: DIFICULDADE_COR[dif] }}
    >
      <Icon className="h-3 w-3" /> {DIFICULDADE_LABEL[dif]}
    </span>
  );
}

export function ResetHistoricoButton({ onReset }: { onReset: () => void }) {
  return (
    <button
      onClick={onReset}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] transition hover:text-[#6B7280]"
    >
      <RotateCcw className="h-3 w-3" /> Reiniciar progresso de questões
    </button>
  );
}
