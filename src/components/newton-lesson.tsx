import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  PlayCircle,
  Headphones,
  Pause,
  Play,
  Volume2,
  Maximize2,
  CheckCircle2,
  ChevronRight,
  BookMarked,
  Lightbulb,
  Sparkles,
  Eye,
  Wand2,
  ClipboardCheck,
} from "lucide-react";
import type { Assunto } from "@/lib/questions/types";
import {
  marcarConcluido,
  marcosConcluidos,
  percentualLicao,
  type MarcoLicao,
} from "@/lib/profile/lesson-progress";
import { LawAnimation } from "@/components/law-animation";
import { LawDiagram } from "@/components/law-diagram";
import { GravityChat } from "@/components/gravity-chat";
import { gerarResumoPerfilParaGravity } from "@/lib/gravity/perfil-resumo";
import { ContentQuiz } from "@/components/content-quiz";
import { obterQuiz } from "@/lib/quiz/bank";
import type { FormatoQuiz } from "@/lib/quiz/types";

export type LessonContent = {
  number: "1ª" | "2ª" | "3ª";
  title: string;
  subtitle: string;
  statement: string;
  paragraphs: string[];
  /** Resumo simplificado: 1 frase-chave + bullets curtos em linguagem direta */
  summary: { keyPoint: string; bullets: string[] };
  examples: { title: string; desc: string }[];
  formula?: string;
  prev?: { to: string; label: string };
  next?: { to: string; label: string };
};

type Tab = "texto" | "resumo" | "visual" | "video" | "ia";

const EMOJI_MAP: Record<string, string> = {
  "1ª": "⚖️",
  "2ª": "⚡",
  "3ª": "🔄",
};
const NUM_MAP: Record<string, string> = { "1ª": "01", "2ª": "02", "3ª": "03" };
const ACCENT_MAP: Record<string, string> = {
  "1ª": "#1D4ED8",
  "2ª": "#4F46E5",
  "3ª": "#059669",
};
const ASSUNTO_MAP: Record<string, Assunto> = {
  "1ª": "lei-1",
  "2ª": "lei-2",
  "3ª": "lei-3",
};

export function NewtonLesson({ lesson }: { lesson: LessonContent }) {
  const assunto = ASSUNTO_MAP[lesson.number];
  const [tab, setTab] = useState<Tab>("texto");
  const [playing, setPlaying] = useState(false);
  const [progress] = useState(28);
  const [concluidos, setConcluidos] = useState<MarcoLicao[]>(() =>
    marcosConcluidos(assunto),
  );
  const [percentual, setPercentual] = useState(() => percentualLicao(assunto));
  const [quizAberto, setQuizAberto] = useState<FormatoQuiz | null>(null);

  function marcar(marco: MarcoLicao) {
    marcarConcluido(assunto, marco);
    setConcluidos(marcosConcluidos(assunto));
    setPercentual(percentualLicao(assunto));
  }

  // Recalcula ao trocar de lição, já que o componente é reaproveitado entre rotas /lei-1, /lei-2, /lei-3
  useEffect(() => {
    setConcluidos(marcosConcluidos(assunto));
    setPercentual(percentualLicao(assunto));
  }, [assunto]);

  const accent = ACCENT_MAP[lesson.number];
  const emoji = EMOJI_MAP[lesson.number];
  const num = NUM_MAP[lesson.number];

  return (
    <div className="relative overflow-hidden">
      <div className="dot-bg absolute inset-x-0 top-0 h-72 opacity-60" />

      <div className="relative mx-auto max-w-4xl px-4 py-10 md:px-8 md:py-16">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#111118]"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar para as leis
        </Link>

        {/* Header */}
        <div
          className="ff-card mt-7 overflow-hidden"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          <div
            className="ff-accent-bar"
            style={{
              background: `linear-gradient(90deg, ${accent}, ${accent}aa)`,
            }}
          />
          <div className="p-7 md:p-9">
            <div className="flex flex-wrap gap-2">
              <span className="ff-badge ff-badge-primary">
                {lesson.number} Lei de Newton
              </span>
              <span className="ff-badge ff-badge-success">
                Mecânica Clássica
              </span>
            </div>
            <div className="mt-5 flex items-start gap-5">
              <div className="hidden shrink-0 text-5xl md:block">{emoji}</div>
              <div>
                <p className="font-mono text-sm font-bold text-[#D1D5DB]">
                  {num}
                </p>
                <h1 className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
                  {lesson.title}
                </h1>
                <p className="mt-2 text-base text-[#6B7280]">
                  {lesson.subtitle}
                </p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6 rounded-2xl bg-[#F9FAFB] p-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2 text-[#6B7280]">
                  <BookMarked className="h-3.5 w-3.5" /> Progresso desta aula
                </span>
                <span style={{ color: accent }}>{percentual}% concluído</span>
              </div>
              <div className="ff-progress-track mt-2">
                <div
                  className="ff-progress-fill"
                  style={{
                    width: `${percentual}%`,
                    background: `linear-gradient(90deg, ${accent}, ${accent}cc)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 overflow-x-auto">
          <div className="ff-tabs w-fit">
            {(
              [
                { val: "texto", icon: FileText, label: "Texto + Áudio" },
                { val: "resumo", icon: Sparkles, label: "Resumo" },
                { val: "visual", icon: Eye, label: "Visual" },
                { val: "video", icon: PlayCircle, label: "Vídeo + Animação" },
                { val: "ia", icon: Wand2, label: "Explicar com IA" },
              ] as { val: Tab; icon: typeof FileText; label: string }[]
            ).map((t) => (
              <button
                key={t.val}
                onClick={() => setTab(t.val)}
                className={`ff-tab ${tab === t.val ? "active" : ""}`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── TEXTO TAB ── */}
        {tab === "texto" && (
          <article
            className="ff-card mt-5 overflow-hidden"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            {/* Player áudio */}
            <div className="flex flex-wrap items-center gap-4 border-b border-[#F3F4F6] bg-[#FAFAFA] px-6 py-4">
              <button
                onClick={() => setPlaying((p) => !p)}
                className="ff-pulse grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition hover:opacity-90 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  boxShadow: `0 4px 14px ${accent}40`,
                }}
                aria-label={playing ? "Pausar" : "Tocar"}
              >
                {playing ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="ml-0.5 h-4 w-4" />
                )}
              </button>

              <div className="flex flex-1 min-w-0 items-center gap-3">
                <Headphones className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
                <div className="flex-1 min-w-0">
                  <div className="mb-2 flex justify-between text-[11px] font-semibold text-[#9CA3AF]">
                    <span>Narração da aula</span>
                    <span className="font-mono">
                      {playing ? "01:42" : "00:00"} / 06:08
                    </span>
                  </div>
                  <div className="ff-audio-track">
                    <div
                      className="ff-audio-fill"
                      style={{ width: `${playing ? progress : 0}%` }}
                    />
                  </div>
                </div>
                <Volume2 className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Statement */}
              <blockquote
                className="rounded-2xl border-l-4 bg-[#F9FAFB] p-5"
                style={{ borderLeftColor: accent }}
              >
                <p className="text-base italic leading-relaxed text-[#374151]">
                  "{lesson.statement}"
                </p>
              </blockquote>

              {/* Parágrafos */}
              <div className="mt-7 space-y-4">
                {lesson.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="text-[15px] leading-[1.8] text-[#374151]"
                  >
                    {p}
                  </p>
                ))}
              </div>

              {/* Fórmula */}
              {lesson.formula && (
                <div
                  className="relative mt-9 overflow-hidden rounded-2xl p-9 text-center text-white"
                  style={{
                    background: "var(--grad-hero)",
                    boxShadow: "0 8px 32px rgba(79,70,229,0.25)",
                  }}
                >
                  <div className="grid-bg absolute inset-0 opacity-20" />
                  <div className="relative">
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] opacity-60">
                      Equação Fundamental
                    </p>
                    <p className="ff-formula mt-3 text-5xl md:text-6xl text-white">
                      {lesson.formula}
                    </p>
                    <p className="mt-3 text-sm opacity-60">
                      Força = Massa × Aceleração
                    </p>
                  </div>
                </div>
              )}

              {/* Dica */}
              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-[rgba(79,70,229,0.18)] bg-[rgba(79,70,229,0.05)] p-5">
                <Lightbulb
                  className="mt-0.5 h-5 w-5 shrink-0"
                  style={{ color: "#4F46E5" }}
                />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#3730A3" }}>
                    Dica de estudo
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#4B5563]">
                    Tente identificar exemplos desta lei no seu dia a dia.
                    Quanto mais você conectar o conceito à realidade, mais fácil
                    fica memorizar.
                  </p>
                </div>
              </div>

              {/* Exemplos */}
              <div className="mt-8">
                <div className="mb-5 flex items-center gap-3">
                  <h2 className="text-xl font-black">Exemplos do dia a dia</h2>
                  <span className="rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-xs font-bold text-[#6B7280]">
                    {lesson.examples.length} exemplos
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {lesson.examples.map((e) => (
                    <div
                      key={e.title}
                      className="group rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4 transition-all hover:border-[rgba(22,163,74,0.30)] hover:bg-[rgba(22,163,74,0.04)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[rgba(22,163,74,0.12)]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#111118]">
                            {e.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-[#6B7280]">
                            {e.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marcar progresso real */}
              <div className="mt-8 flex flex-wrap gap-3 border-t border-[#F3F4F6] pt-6">
                <MarcoButton
                  rotulo="Marquei como lido"
                  rotuloFeito="Marcado como lido"
                  feito={concluidos.includes("texto")}
                  onClick={() => marcar("texto")}
                  accent={accent}
                  formatoQuiz="texto"
                  assunto={assunto}
                  onAbrirQuiz={setQuizAberto}
                />
                <MarcoButton
                  rotulo="Ouvi a narração completa"
                  rotuloFeito="Narração ouvida"
                  feito={concluidos.includes("narracao")}
                  onClick={() => marcar("narracao")}
                  accent={accent}
                />
              </div>
            </div>
          </article>
        )}

        {/* ── RESUMO TAB ── */}
        {tab === "resumo" && (
          <article
            className="ff-card mt-5 overflow-hidden p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" style={{ color: accent }} />
              <span className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                Resumo simplificado — leitura de 1 minuto
              </span>
            </div>

            <div
              className="mt-5 rounded-2xl p-6 text-center text-white"
              style={{
                background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              }}
            >
              <p className="text-lg font-bold leading-snug">
                {lesson.summary.keyPoint}
              </p>
            </div>

            <ul className="mt-6 space-y-3">
              {lesson.summary.bullets.map((b, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-[#F9FAFB] px-4 py-3"
                >
                  <span
                    className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
                    style={{ background: accent }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-[#374151]">
                    {b}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap gap-3 border-t border-[#F3F4F6] pt-6">
              <MarcoButton
                rotulo="Marquei o resumo como lido"
                rotuloFeito="Resumo lido"
                feito={concluidos.includes("resumo")}
                onClick={() => marcar("resumo")}
                accent={accent}
                formatoQuiz="resumo"
                assunto={assunto}
                onAbrirQuiz={setQuizAberto}
              />
            </div>
          </article>
        )}

        {/* ── VISUAL TAB ── */}
        {tab === "visual" && (
          <article
            className="ff-card mt-5 overflow-hidden p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" style={{ color: accent }} />
              <span className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                Explicação visual — vetores e relações de força
              </span>
            </div>

            <div className="mt-5">
              <LawDiagram assunto={assunto} />
            </div>

            <div className="mt-7 flex flex-wrap gap-3 border-t border-[#F3F4F6] pt-6">
              <MarcoButton
                rotulo="Marquei o diagrama como visto"
                rotuloFeito="Diagrama visto"
                feito={concluidos.includes("visual")}
                onClick={() => marcar("visual")}
                accent={accent}
                formatoQuiz="visual"
                assunto={assunto}
                onAbrirQuiz={setQuizAberto}
              />
            </div>
          </article>
        )}

        {/* ── VÍDEO TAB ── */}
        {tab === "video" && (
          <div
            className="ff-card mt-5 overflow-hidden"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div
              className="relative aspect-video w-full overflow-hidden"
              style={{ background: "var(--grad-hero)" }}
            >
              <div className="grid-bg absolute inset-0 opacity-20" />
              <div className="absolute inset-0 grid place-items-center">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  className="grid h-20 w-20 place-items-center rounded-full border-2 border-white/25 bg-white/95 text-[#4F46E5] shadow-[var(--shadow-lg)] transition hover:scale-105 active:scale-95"
                  aria-label="Reproduzir vídeo"
                >
                  {playing ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="ml-1 h-8 w-8" />
                  )}
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-5 text-white">
                <div className="relative mb-3 h-1 cursor-pointer overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[35%] rounded-full bg-white" />
                  <div className="absolute left-[35%] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {playing ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <Volume2 className="h-4 w-4" />
                    <span className="font-mono opacity-80">02:14 / 06:32</span>
                  </div>
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>
              <span className="absolute left-4 top-4 rounded-xl border border-white/20 bg-black/35 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-sm">
                {emoji} Vídeo-aula · {lesson.number} Lei
              </span>
            </div>

            <div className="p-6 md:p-8">
              <h2 className="text-xl font-black">Sobre esta vídeo-aula</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
                Explicação completa da {lesson.number.toLowerCase()} lei de
                Newton com demonstrações visuais, exemplos práticos e síntese
                animada ao final. Duração aproximada: 6 minutos.
              </p>
              <div className="mt-5 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                  Capítulos
                </p>
                {[
                  { time: "00:00", label: "Introdução ao conceito" },
                  { time: "02:00", label: "Demonstrações visuais" },
                  { time: "04:30", label: "Resumo e conclusão" },
                ].map((ch) => (
                  <div
                    key={ch.label}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 transition hover:bg-[#F3F4F6]"
                  >
                    <span
                      className="ff-formula text-[11px] font-bold"
                      style={{ color: accent }}
                    >
                      {ch.time}
                    </span>
                    <span className="text-sm font-semibold">{ch.label}</span>
                    <ChevronRight className="ml-auto h-4 w-4 text-[#9CA3AF]" />
                  </div>
                ))}
              </div>

              {/* Animação real (não decorativa) */}
              <div className="mt-8">
                <p className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                  <Sparkles className="h-3.5 w-3.5" /> Animação interativa
                </p>
                <LawAnimation assunto={assunto} />
              </div>

              {/* Marcar progresso real */}
              <div className="mt-8 flex flex-wrap gap-3 border-t border-[#F3F4F6] pt-6">
                <MarcoButton
                  rotulo="Assisti o vídeo completo"
                  rotuloFeito="Vídeo assistido"
                  feito={concluidos.includes("video")}
                  onClick={() => marcar("video")}
                  accent={accent}
                  formatoQuiz="video"
                  assunto={assunto}
                  onAbrirQuiz={setQuizAberto}
                />
                <MarcoButton
                  rotulo="Explorei a animação"
                  rotuloFeito="Animação explorada"
                  feito={concluidos.includes("animacao")}
                  onClick={() => marcar("animacao")}
                  accent={accent}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── IA TAB ── */}
        {tab === "ia" && (
          <article
            className="ff-card mt-5 overflow-hidden p-6 md:p-8"
            style={{ boxShadow: "var(--shadow-sm)" }}
          >
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" style={{ color: accent }} />
              <span className="text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
                Converse com o Gravity sobre esta lei
              </span>
            </div>

            <div className="mt-5">
              <GravityChat
                context={{
                  leiAtual: {
                    numero: lesson.number,
                    titulo: lesson.title,
                    enunciado: lesson.statement,
                  },
                  resumoPerfil: gerarResumoPerfilParaGravity(),
                }}
                sugestoes={[
                  `Me explica a ${lesson.number} Lei com outras palavras`,
                  "Tem algum exemplo do dia a dia?",
                  "Por que isso é importante?",
                ]}
                alturaMensagens="380px"
              />
            </div>
          </article>
        )}

        {/* ── QUIZ DE VERIFICAÇÃO ── */}
        {quizAberto &&
          (() => {
            const quizData = obterQuiz(assunto, quizAberto);
            if (!quizData) return null;
            const marcoDoFormato: MarcoLicao =
              quizAberto === "texto"
                ? "texto"
                : quizAberto === "resumo"
                  ? "resumo"
                  : quizAberto === "visual"
                    ? "visual"
                    : "video";
            return (
              <div className="mt-5">
                <ContentQuiz
                  quiz={quizData}
                  accent={accent}
                  onAprovado={() => {
                    marcar(marcoDoFormato);
                    setQuizAberto(null);
                  }}
                  onFechar={() => setQuizAberto(null)}
                />
              </div>
            );
          })()}

        {/* Prev/Next */}
        <nav className="mt-10 flex flex-wrap items-center justify-between gap-3">
          {lesson.prev ? (
            <Link to={lesson.prev.to} className="ff-btn-outline group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
              {lesson.prev.label}
            </Link>
          ) : (
            <span />
          )}
          {lesson.next ? (
            <Link to={lesson.next.to} className="ff-btn-primary group">
              {lesson.next.label}{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link to="/dashboard" className="ff-btn-outline">
              Ver meu painel <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}

function MarcoButton({
  rotulo,
  rotuloFeito,
  feito,
  onClick,
  accent,
  formatoQuiz,
  assunto,
  onAbrirQuiz,
}: {
  rotulo: string;
  rotuloFeito: string;
  feito: boolean;
  onClick: () => void;
  accent: string;
  formatoQuiz?: FormatoQuiz;
  assunto?: Assunto;
  onAbrirQuiz?: (formato: FormatoQuiz) => void;
}) {
  const temQuiz =
    !!formatoQuiz &&
    !!assunto &&
    !!onAbrirQuiz &&
    !!obterQuiz(assunto, formatoQuiz);

  const handleClick = () => {
    if (feito) return;
    if (temQuiz) {
      onAbrirQuiz!(formatoQuiz!);
    } else {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={feito}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-default"
      style={
        feito
          ? {
              background: "rgba(22,163,74,0.10)",
              color: "#15803D",
              border: "1px solid rgba(22,163,74,0.25)",
            }
          : {
              background: "#F3F4F6",
              color: "#374151",
              border: "1px solid transparent",
            }
      }
      onMouseEnter={(e) => {
        if (!feito) e.currentTarget.style.background = `${accent}12`;
      }}
      onMouseLeave={(e) => {
        if (!feito) e.currentTarget.style.background = "#F3F4F6";
      }}
    >
      {feito ? (
        <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
      ) : temQuiz ? (
        <ClipboardCheck className="h-4 w-4 text-[#9CA3AF]" />
      ) : (
        <CheckCircle2 className="h-4 w-4 text-[#9CA3AF]" />
      )}
      {feito ? rotuloFeito : temQuiz ? `Fazer quiz para confirmar` : rotulo}
    </button>
  );
}
