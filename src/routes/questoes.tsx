import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Brain, ListChecks } from "lucide-react";
import { QuestionPractice, ResetHistoricoButton } from "@/components/question-practice";
import { limparHistorico } from "@/lib/questions/engine";
import type { Assunto } from "@/lib/questions/types";
import { ASSUNTO_LABEL } from "@/lib/questions/types";

export const Route = createFileRoute("/questoes")({
  head: () => ({
    meta: [
      { title: "Pratique com Questões — FísicaFácil" },
      {
        name: "description",
        content:
          "Resolva questões sobre as Leis de Newton com gabarito explicativo completo e dificuldade adaptativa.",
      },
    ],
  }),
  component: QuestoesPage,
});

const ASSUNTOS: { id: Assunto; emoji: string; accent: string }[] = [
  { id: "lei-1", emoji: "⚖️", accent: "#1D4ED8" },
  { id: "lei-2", emoji: "⚡", accent: "#4F46E5" },
  { id: "lei-3", emoji: "🔄", accent: "#059669" },
];

function QuestoesPage() {
  const [assunto, setAssunto] = useState<Assunto>("lei-1");
  const [resetKey, setResetKey] = useState(0);

  function handleReset() {
    limparHistorico();
    setResetKey((k) => k + 1);
  }

  return (
    <div className="relative overflow-hidden">
      <div className="dot-bg absolute inset-x-0 top-0 h-72 opacity-60" />

      <div className="relative mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#111118]"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao painel
        </Link>

        <div className="mt-7">
          <span className="ff-badge ff-badge-primary inline-flex">
            <Brain className="h-3.5 w-3.5" /> Sistema de questões
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Pratique e veja o porquê de cada resposta
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#6B7280]">
            Escolha a lei, o nível de dificuldade (ou deixe no modo adaptativo) e responda. Toda
            questão vem com explicação completa — da alternativa certa e de todas as erradas.
          </p>
        </div>

        {/* Seletor de assunto */}
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          {ASSUNTOS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAssunto(a.id)}
              className="ff-card flex items-center gap-3 p-4 text-left transition"
              style={{
                borderColor: assunto === a.id ? `${a.accent}55` : undefined,
                background: assunto === a.id ? `${a.accent}08` : undefined,
                boxShadow: assunto === a.id ? "var(--shadow-sm)" : undefined,
              }}
            >
              <span className="text-2xl">{a.emoji}</span>
              <span
                className="text-sm font-bold"
                style={{ color: assunto === a.id ? a.accent : "#374151" }}
              >
                {ASSUNTO_LABEL[a.id]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <QuestionPractice key={`${assunto}-${resetKey}`} assunto={assunto} />
        </div>

        <div className="mt-8 flex items-center justify-between rounded-2xl bg-[#F9FAFB] px-4 py-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#9CA3AF]">
            <ListChecks className="h-3.5 w-3.5" /> Seu progresso é salvo neste navegador.
          </div>
          <ResetHistoricoButton onReset={handleReset} />
        </div>
      </div>
    </div>
  );
}
