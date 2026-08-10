import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  RotateCcw,
} from "lucide-react";
import type { QuizFormato, RespostaQuiz } from "@/lib/quiz/types";
import { MINIMO_ACERTOS } from "@/lib/quiz/types";

type Fase = "respondendo" | "revelado" | "concluido";

const FORMATO_LABEL: Record<string, string> = {
  texto: "Texto + Áudio",
  resumo: "Resumo",
  visual: "Explicação Visual",
  video: "Vídeo + Animação",
};

export function ContentQuiz({
  quiz,
  onAprovado,
  onFechar,
  accent = "#4F46E5",
}: {
  quiz: QuizFormato;
  onAprovado: () => void;
  onFechar: () => void;
  accent?: string;
}) {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [fase, setFase] = useState<Fase>("respondendo");
  const [respostas, setRespostas] = useState<RespostaQuiz[]>([]);
  const [escolhida, setEscolhida] = useState<number | null>(null);

  const perguntaAtual = quiz.perguntas[indiceAtual];
  const acertos = respostas.filter((r) => r.correta).length;
  const aprovado = acertos >= MINIMO_ACERTOS;

  function handleEscolher(indice: number) {
    if (fase === "revelado") return;
    setEscolhida(indice);
    setFase("revelado");

    const correta = indice === perguntaAtual.correta;
    setRespostas((prev) => [
      ...prev,
      { perguntaId: perguntaAtual.id, indiceEscolhido: indice, correta },
    ]);
  }

  function handleProxima() {
    if (indiceAtual < quiz.perguntas.length - 1) {
      setIndiceAtual((i) => i + 1);
      setEscolhida(null);
      setFase("respondendo");
    } else {
      setFase("concluido");
    }
  }

  function handleReiniciar() {
    setIndiceAtual(0);
    setEscolhida(null);
    setFase("respondendo");
    setRespostas([]);
  }

  // ── Tela final ──
  if (fase === "concluido") {
    return (
      <div
        className="rounded-2xl border p-6 text-center"
        style={{
          borderColor: aprovado
            ? "rgba(22,163,74,0.3)"
            : "rgba(220,38,38,0.25)",
          background: aprovado
            ? "rgba(22,163,74,0.04)"
            : "rgba(220,38,38,0.03)",
        }}
      >
        <div
          className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl"
          style={{
            background: aprovado
              ? "rgba(22,163,74,0.12)"
              : "rgba(220,38,38,0.10)",
          }}
        >
          {aprovado ? (
            <Trophy className="h-7 w-7 text-[#16A34A]" />
          ) : (
            <RotateCcw className="h-7 w-7 text-[#DC2626]" />
          )}
        </div>

        <p
          className="text-lg font-black"
          style={{ color: aprovado ? "#15803D" : "#B91C1C" }}
        >
          {aprovado ? "Quiz concluído!" : "Quase lá!"}
        </p>

        <p className="mt-1 text-sm text-[#6B7280]">
          Você acertou {acertos} de {quiz.perguntas.length} perguntas
          {aprovado
            ? " — progresso desta seção confirmado."
            : ` — precisa de ao menos ${MINIMO_ACERTOS} para confirmar o progresso.`}
        </p>

        {/* Mini resultado */}
        <div className="mt-4 flex justify-center gap-2">
          {respostas.map((r, i) => (
            <div
              key={i}
              className="grid h-8 w-8 place-items-center rounded-full text-white text-xs font-bold"
              style={{ background: r.correta ? "#16A34A" : "#DC2626" }}
            >
              {r.correta ? "✓" : "✗"}
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {aprovado ? (
            <button
              onClick={onAprovado}
              className="ff-btn-primary"
              style={{ background: accent }}
            >
              <CheckCircle2 className="h-4 w-4" /> Confirmar progresso
            </button>
          ) : (
            <button
              onClick={handleReiniciar}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold text-[#374151] transition hover:bg-[#F3F4F6]"
            >
              <RotateCcw className="h-4 w-4" /> Tentar de novo
            </button>
          )}
          <button
            onClick={onFechar}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-bold text-[#374151] transition hover:bg-[#F3F4F6]"
          >
            Fechar quiz
          </button>
        </div>
      </div>
    );
  }

  // ── Pergunta ──
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-5">
      {/* Cabeçalho */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-bold text-[#9CA3AF]">
          Quiz — {FORMATO_LABEL[quiz.formato] ?? quiz.formato}
        </span>
        <span className="text-xs font-bold" style={{ color: accent }}>
          {indiceAtual + 1} / {quiz.perguntas.length}
        </span>
      </div>

      {/* Barra de progresso */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${(indiceAtual / quiz.perguntas.length) * 100}%`,
            background: accent,
          }}
        />
      </div>

      {/* Pergunta */}
      <p className="mb-4 text-sm font-semibold leading-relaxed text-[#111118]">
        {perguntaAtual.pergunta}
      </p>

      {/* Opções */}
      <div className="space-y-2">
        {perguntaAtual.opcoes.map((opcao, i) => {
          const isCorreta = i === perguntaAtual.correta;
          const isEscolhida = i === escolhida;
          let estilo = "border-[#E5E7EB] bg-white hover:border-[#C7C9D1]";

          if (fase === "revelado") {
            if (isCorreta)
              estilo = "border-[rgba(22,163,74,0.4)] bg-[rgba(22,163,74,0.07)]";
            else if (isEscolhida)
              estilo = "border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.06)]";
            else estilo = "border-[#E5E7EB] bg-white opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleEscolher(i)}
              disabled={fase === "revelado"}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${estilo} ${fase === "revelado" ? "cursor-default" : "cursor-pointer"}`}
            >
              <span
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                style={{
                  background:
                    fase === "revelado" && isCorreta
                      ? "#16A34A"
                      : fase === "revelado" && isEscolhida
                        ? "#DC2626"
                        : "#E5E7EB",
                  color:
                    fase === "revelado" && (isCorreta || isEscolhida)
                      ? "white"
                      : "#6B7280",
                }}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-[#374151]">{opcao}</span>
              {fase === "revelado" && isCorreta && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" />
              )}
              {fase === "revelado" && isEscolhida && !isCorreta && (
                <XCircle className="h-4 w-4 shrink-0 text-[#DC2626]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explicação + Próxima */}
      {fase === "revelado" && (
        <div className="mt-4 space-y-3">
          <div
            className="rounded-xl border p-3 text-sm leading-relaxed text-[#374151]"
            style={{
              borderColor:
                escolhida === perguntaAtual.correta
                  ? "rgba(22,163,74,0.25)"
                  : "rgba(220,38,38,0.2)",
              background:
                escolhida === perguntaAtual.correta
                  ? "rgba(22,163,74,0.04)"
                  : "rgba(220,38,38,0.03)",
            }}
          >
            {perguntaAtual.explicacao}
          </div>
          <button
            onClick={handleProxima}
            className="ff-btn-primary w-full justify-center"
            style={{ background: accent }}
          >
            {indiceAtual < quiz.perguntas.length - 1
              ? "Próxima pergunta"
              : "Ver resultado"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
