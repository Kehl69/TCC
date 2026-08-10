import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Trophy,
  Flame,
  CheckCircle2,
  Zap,
  Calendar,
  Award,
  Lock,
} from "lucide-react";
import {
  montarPerfilAprendizagem,
  type PerfilAprendizagem,
} from "@/lib/profile/engine";
import {
  ProfileStatCards,
  LearningProfileCard,
  WeeklyActivityChart,
  RecommendationCard,
} from "@/components/learning-profile";
import { obterStatusLei } from "@/lib/profile/curriculo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Meu Painel — FísicaFácil" },
      {
        name: "description",
        content:
          "Acompanhe seu progresso real, pontos fortes e fracos, e recomendações de estudo nas Leis de Newton.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  // O perfil depende de localStorage, então é montado no client após o mount
  // (evita mismatch de hidratação SSR e garante dados sempre atualizados ao abrir o painel).
  const [perfil, setPerfil] = useState<PerfilAprendizagem | null>(null);

  useEffect(() => {
    setPerfil(montarPerfilAprendizagem());
  }, []);

  if (!perfil) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm font-semibold text-[#9CA3AF]">
          Carregando seu painel…
        </p>
      </div>
    );
  }

  return <DashboardContent perfil={perfil} />;
}

function DashboardContent({ perfil }: { perfil: PerfilAprendizagem }) {
  return (
    <div className="pb-20">
      {/* ══ HERO DO PAINEL ══ */}
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white">
        <div className="dot-bg absolute inset-0 opacity-50" />
        <div
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
          style={{ background: "var(--grad-primary)" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              {perfil.streak.atual > 0 ? (
                <span className="ff-badge ff-badge-streak mb-4 inline-flex">
                  <Flame className="h-3.5 w-3.5" /> {perfil.streak.atual}{" "}
                  {perfil.streak.atual === 1
                    ? "dia seguido!"
                    : "dias seguidos!"}
                </span>
              ) : (
                <span className="ff-badge ff-badge-primary mb-4 inline-flex">
                  <Zap className="h-3.5 w-3.5" /> Vamos começar um novo streak
                  hoje
                </span>
              )}
              <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                Olá, estudante 👋
              </h1>
              <p className="mt-2 max-w-md text-[#6B7280]">
                {perfil.recomendacao.motivo}
              </p>
            </div>
            <Link to={perfil.recomendacao.to} className="ff-btn-primary w-fit">
              <Zap className="h-4 w-4" /> Retomar estudo
            </Link>
          </div>

          <ProfileStatCards perfil={perfil} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {/* ══ RECOMENDAÇÃO INTELIGENTE ══ */}
        <section className="mt-10">
          <RecommendationCard perfil={perfil} />
        </section>

        {/* ══ PROGRESSO DAS LEIS ══ */}
        <section className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Progresso por Lei
              </h2>
              <p className="mt-1 text-sm text-[#6B7280]">
                3 aulas no total ·{" "}
                {perfil.licoes.filter((l) => l.concluida).length} concluídas
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-bold shadow-[var(--shadow-xs)]">
              <Trophy className="h-3.5 w-3.5 text-[#4F46E5]" />{" "}
              {perfil.progressoGeralLicoes}% concluído
            </div>
          </div>

          <div className="space-y-4">
            {LEIS_META.map((meta) => {
              const licao = perfil.licoes.find(
                (l) => l.assunto === meta.assunto,
              )!;
              const desempenho = perfil.desempenho.find(
                (d) => d.assunto === meta.assunto,
              );
              const bloqueada = obterStatusLei(meta.assunto) === "bloqueada";
              const status = bloqueada
                ? "Bloqueada"
                : licao.concluida
                  ? "Concluída"
                  : licao.percentual > 0
                    ? "Em andamento"
                    : "Não iniciada";

              return (
                <div
                  key={meta.to}
                  className="ff-card overflow-hidden"
                  style={{
                    borderColor: meta.border,
                    opacity: bloqueada ? 0.65 : 1,
                  }}
                >
                  <div className="h-1 bg-[#F3F4F6]">
                    <div
                      className="h-full transition-all duration-1000"
                      style={{
                        width: `${licao.percentual}%`,
                        background: `linear-gradient(90deg, ${meta.accent}, ${meta.accent}bb)`,
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-4xl"
                        style={{ background: meta.bg }}
                      >
                        {meta.emoji}
                        {bloqueada && (
                          <div className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-[#6B7280] shadow">
                            <Lock className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="ff-formula text-[10px] font-black"
                            style={{ color: meta.accent }}
                          >
                            {meta.n}
                          </span>
                          <span
                            className="ff-badge"
                            style={{
                              background: bloqueada ? "#F3F4F6" : meta.bg,
                              color: bloqueada ? "#6B7280" : meta.accent,
                              border: `1px solid ${bloqueada ? "#E5E7EB" : meta.border}`,
                              padding: "2px 8px",
                              fontSize: "10px",
                            }}
                          >
                            {status}
                          </span>
                          {!bloqueada &&
                            desempenho &&
                            desempenho.totalRespostas > 0 && (
                              <span className="text-[11px] font-bold text-[#9CA3AF]">
                                {desempenho.taxaAcerto}% em questões
                              </span>
                            )}
                        </div>
                        <h3 className="mt-0.5 text-lg font-black tracking-tight">
                          {meta.title}
                        </h3>
                        {bloqueada && (
                          <p className="mt-0.5 text-xs text-[#9CA3AF]">
                            Complete 50% da lei anterior para desbloquear
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:w-[46%]">
                      <div className="flex-1">
                        <div className="mb-1.5 flex justify-between text-xs font-bold">
                          <span className="text-[#9CA3AF]">
                            Progresso da lição
                          </span>
                          <span style={{ color: meta.accent }}>
                            {licao.percentual}%
                          </span>
                        </div>
                        <div className="ff-progress-track">
                          <div
                            className="ff-progress-fill"
                            style={{
                              width: `${licao.percentual}%`,
                              background: `linear-gradient(90deg, ${meta.accent}, ${meta.accent}cc)`,
                            }}
                          />
                        </div>
                      </div>
                      {bloqueada ? (
                        <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs font-bold text-[#9CA3AF]">
                          <Lock className="h-3.5 w-3.5" /> Bloqueada
                        </div>
                      ) : (
                        <Link
                          to={meta.to}
                          className="ff-btn-outline shrink-0"
                          style={{ padding: "8px 14px", fontSize: "13px" }}
                        >
                          {licao.percentual === 0
                            ? "Começar"
                            : licao.concluida
                              ? "Revisar"
                              : "Continuar"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══ PERFIL DE APRENDIZAGEM + ATIVIDADE ══ */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <WeeklyActivityChart perfil={perfil} />
          <MarcosReaisCard perfil={perfil} />
        </section>

        <section className="mt-6">
          <LearningProfileCard perfil={perfil} />
        </section>

        {/* ══ PRÓXIMOS PASSOS REAIS ══ */}
        <section className="mt-10">
          <div className="ff-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(5,150,105,0.10)]">
                  <Calendar className="h-5 w-5 text-[#059669]" />
                </div>
                <div>
                  <h3 className="text-base font-black">O que fazer agora</h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Baseado no que ainda está pendente
                  </p>
                </div>
              </div>
            </div>
            <ProximosPassos perfil={perfil} />
          </div>
        </section>

        {/* ══ RECOMENDADOS ══ */}
        <section className="mt-10">
          <h2 className="mb-6 text-2xl font-black tracking-tight">
            Continue estudando
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CARDS_RECOMENDADOS.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="ff-card ff-card-lift group flex items-start gap-5 p-6"
                style={{ borderColor: c.border }}
              >
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-4xl"
                  style={{ background: c.bg }}
                >
                  {c.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-black tracking-tight">
                    {c.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6B7280]">{c.desc}</p>
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-3"
                    style={{ color: c.accent }}
                  >
                    Acessar{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[rgba(22,163,74,0.20)] bg-[rgba(22,163,74,0.05)] px-5 py-4">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-[#16A34A]" />
            <p className="text-sm text-[#374151]">
              <strong>Progresso salvo automaticamente.</strong> Continue de onde
              parou neste navegador.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

// ───────────────────────── Dados de apoio (estáticos, não-mockados: textos/cores das leis) ─────────────────────────

const LEIS_META = [
  {
    to: "/lei-1",
    assunto: "lei-1" as const,
    n: "01",
    emoji: "⚖️",
    title: "Lei da Inércia",
    accent: "#1D4ED8",
    bg: "rgba(29,78,216,0.07)",
    border: "rgba(29,78,216,0.18)",
  },
  {
    to: "/lei-2",
    assunto: "lei-2" as const,
    n: "02",
    emoji: "⚡",
    title: "Princípio Fundamental",
    accent: "#4F46E5",
    bg: "rgba(79,70,229,0.07)",
    border: "rgba(79,70,229,0.18)",
  },
  {
    to: "/lei-3",
    assunto: "lei-3" as const,
    n: "03",
    emoji: "🔄",
    title: "Ação e Reação",
    accent: "#059669",
    bg: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.18)",
  },
];

const CARDS_RECOMENDADOS = [
  {
    emoji: "🎧",
    title: "Texto narrado — 1ª Lei",
    desc: "Retome a narração de onde você parou.",
    to: "/lei-1",
    accent: "#1D4ED8",
    bg: "rgba(29,78,216,0.07)",
    border: "rgba(29,78,216,0.18)",
  },
  {
    emoji: "🎬",
    title: "Vídeo-aula — 2ª Lei",
    desc: "Visualize F = m·a com exemplos animados.",
    to: "/lei-2",
    accent: "#4F46E5",
    bg: "rgba(79,70,229,0.07)",
    border: "rgba(79,70,229,0.18)",
  },
  {
    emoji: "🧠",
    title: "Pratique com questões",
    desc: "Gabarito explicativo completo e dificuldade adaptativa.",
    to: "/questoes",
    accent: "#D97706",
    bg: "rgba(217,119,6,0.07)",
    border: "rgba(217,119,6,0.18)",
  },
  {
    emoji: "📝",
    title: "Minhas anotações",
    desc: "Salvamento automático, organizadas por lei.",
    to: "/anotacoes",
    accent: "#059669",
    bg: "rgba(5,150,105,0.07)",
    border: "rgba(5,150,105,0.18)",
  },
  {
    emoji: "✏️",
    title: "Quadro negro digital",
    desc: "Resolva exercícios desenhando, como no papel.",
    to: "/quadro",
    accent: "#7C3AED",
    bg: "rgba(124,58,237,0.07)",
    border: "rgba(124,58,237,0.18)",
  },
];

// ───────────────────────── Subcomponentes locais ─────────────────────────

/** Substitui as "Conquistas" fixas por marcos reais derivados do progresso de verdade. */
function MarcosReaisCard({ perfil }: { perfil: PerfilAprendizagem }) {
  const marcos = [
    {
      emoji: "📖",
      label: "1ª lição concluída",
      unlocked: perfil.licoes.some((l) => l.concluida),
    },
    {
      emoji: "🧠",
      label: "10 questões respondidas",
      unlocked: perfil.totalRespostas >= 10,
    },
    {
      emoji: "🔥",
      label: "3 dias seguidos",
      unlocked: perfil.streak.recorde >= 3,
    },
    {
      emoji: "🏆",
      label: "Um assunto dominado",
      unlocked: perfil.dominados.length > 0,
    },
    {
      emoji: "📝",
      label: "Primeira anotação",
      unlocked: perfil.totalNotas > 0,
    },
    {
      emoji: "🎯",
      label: "Todas as lições",
      unlocked: perfil.licoes.every((l) => l.concluida),
    },
  ];
  const desbloqueadas = marcos.filter((m) => m.unlocked).length;

  return (
    <div className="ff-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(217,119,6,0.10)]">
          <Award className="h-5 w-5 text-[#D97706]" />
        </div>
        <div>
          <h3 className="text-base font-black">Marcos</h3>
          <p className="text-xs text-[#9CA3AF]">
            {desbloqueadas} de {marcos.length} alcançados
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {marcos.map((m) => (
          <div
            key={m.label}
            className={`ff-achievement ${m.unlocked ? "unlocked" : "locked"}`}
            title={
              m.unlocked ? `Alcançado: ${m.label}` : `Pendente: ${m.label}`
            }
          >
            <span className="text-lg">{m.emoji}</span>
            <span className="text-[11px]">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Substitui a lista fixa de "Metas de hoje com XP" por pendências reais. */
function ProximosPassos({ perfil }: { perfil: PerfilAprendizagem }) {
  const passos = [
    ...perfil.licoes
      .filter((l) => !l.concluida)
      .map((l) => ({
        done: false,
        text: `Continuar a lição de ${LEIS_META.find((m) => m.assunto === l.assunto)?.title} (${l.percentual}%)`,
        to: `/${l.assunto}`,
      })),
    ...perfil.precisamRevisao.map((d) => ({
      done: false,
      text: `Revisar ${LEIS_META.find((m) => m.assunto === d.assunto)?.title} (${d.taxaAcerto}% de acerto)`,
      to: "/questoes",
    })),
  ];

  if (passos.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-[rgba(22,163,74,0.20)] bg-[rgba(22,163,74,0.06)] px-4 py-3">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#16A34A]" />
        <span className="text-sm font-semibold text-[#15803D]">
          Tudo em dia! Continue praticando questões para subir de nível.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {passos.slice(0, 4).map((passo) => (
        <Link
          key={passo.text}
          to={passo.to}
          className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 transition hover:bg-[#F3F4F6]"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#D1D5DB]" />
          <span className="flex-1 text-sm font-semibold text-[#374151]">
            {passo.text}
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
        </Link>
      ))}
    </div>
  );
}
