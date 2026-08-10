import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  BarChart2,
} from "lucide-react";
import type { PerfilAprendizagem } from "@/lib/profile/engine";
import { formatarDuracao } from "@/lib/profile/engine";
import { ASSUNTO_LABEL } from "@/lib/questions/types";

const ASSUNTO_EMOJI: Record<string, string> = { "lei-1": "⚖️", "lei-2": "⚡", "lei-3": "🔄" };
const ASSUNTO_ACCENT: Record<string, string> = {
  "lei-1": "#1D4ED8",
  "lei-2": "#4F46E5",
  "lei-3": "#059669",
};

/** Gráfico de atividade dos últimos 7 dias — substitui o gráfico mockado anterior. */
export function WeeklyActivityChart({ perfil }: { perfil: PerfilAprendizagem }) {
  const maxRespostas = Math.max(1, ...perfil.atividade7Dias.map((d) => d.respostas));
  const totalRespostasSemana = perfil.atividade7Dias.reduce((s, d) => s + d.respostas, 0);
  const mediaPorDia = totalRespostasSemana > 0 ? Math.round(totalRespostasSemana / 7) : 0;

  return (
    <div className="ff-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(79,70,229,0.10)]">
          <BarChart2 className="h-5 w-5 text-[#4F46E5]" />
        </div>
        <div>
          <h3 className="text-base font-black">Atividade da semana</h3>
          <p className="text-xs text-[#9CA3AF]">Questões respondidas por dia</p>
        </div>
      </div>

      {totalRespostasSemana === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] p-6 text-center text-sm text-[#9CA3AF]">
          Responda algumas questões para ver seu gráfico de atividade.
        </div>
      ) : (
        <>
          <div className="flex items-end justify-between gap-2">
            {perfil.atividade7Dias.map((dia) => (
              <div key={dia.data} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="relative flex w-full items-end justify-center"
                  style={{ height: "80px" }}
                >
                  <div
                    className="w-full rounded-lg transition-all duration-700"
                    style={{
                      height: `${Math.max((dia.respostas / maxRespostas) * 80, dia.respostas > 0 ? 8 : 4)}px`,
                      background:
                        dia.respostas > 0 ? "linear-gradient(180deg, #4F46E5, #7C3AED)" : "#F3F4F6",
                      opacity: dia.respostas > 0 ? 1 : 0.5,
                    }}
                    title={`${dia.respostas} questões, ${dia.acertos} acertos`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-[#9CA3AF]">{dia.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F9FAFB] px-3 py-2.5">
            <TrendingUp className="h-4 w-4 text-[#16A34A]" />
            <span className="text-xs font-semibold text-[#374151]">
              Média: {mediaPorDia} {mediaPorDia === 1 ? "questão" : "questões"}/dia esta semana
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/** Pontos fortes e pontos fracos — o núcleo do "Perfil de Aprendizagem" pedido. */
export function LearningProfileCard({ perfil }: { perfil: PerfilAprendizagem }) {
  return (
    <div className="ff-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[rgba(124,58,237,0.10)]">
          <Sparkles className="h-5 w-5 text-[#7C3AED]" />
        </div>
        <div>
          <h3 className="text-base font-black">Seu perfil de aprendizagem</h3>
          <p className="text-xs text-[#9CA3AF]">Baseado no seu desempenho em questões</p>
        </div>
      </div>

      {perfil.totalRespostas === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] p-6 text-center text-sm text-[#9CA3AF]">
          Responda pelo menos 3 questões de um assunto para começarmos a identificar seus pontos
          fortes e fracos.
        </div>
      ) : (
        <div className="space-y-5">
          {/* Assuntos dominados */}
          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#16A34A]">
              <CheckCircle2 className="h-3.5 w-3.5" /> Assuntos dominados
            </p>
            {perfil.dominados.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">
                Ainda nenhum assunto com 75%+ de acerto. Continue praticando!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {perfil.dominados.map((d) => (
                  <span
                    key={d.assunto}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(22,163,74,0.25)] bg-[rgba(22,163,74,0.06)] px-3 py-1.5 text-xs font-bold text-[#15803D]"
                  >
                    {ASSUNTO_EMOJI[d.assunto]}{" "}
                    {ASSUNTO_LABEL[d.assunto as keyof typeof ASSUNTO_LABEL]} — {d.taxaAcerto}%
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Assuntos que precisam de revisão */}
          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#D97706]">
              <AlertTriangle className="h-3.5 w-3.5" /> Precisam de revisão
            </p>
            {perfil.precisamRevisao.length === 0 ? (
              <p className="text-sm text-[#9CA3AF]">
                Nenhum ponto fraco identificado até agora. 🎉
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {perfil.precisamRevisao.map((d) => (
                  <Link
                    key={d.assunto}
                    to="/questoes"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(217,119,6,0.25)] bg-[rgba(217,119,6,0.06)] px-3 py-1.5 text-xs font-bold text-[#B45309] transition hover:bg-[rgba(217,119,6,0.12)]"
                  >
                    {ASSUNTO_EMOJI[d.assunto]}{" "}
                    {ASSUNTO_LABEL[d.assunto as keyof typeof ASSUNTO_LABEL]} — {d.taxaAcerto}%
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desempenho detalhado por assunto */}
          <div>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
              Detalhamento
            </p>
            <div className="space-y-2">
              {perfil.desempenho.map((d) => (
                <div key={d.assunto} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-xs font-semibold text-[#374151]">
                    {ASSUNTO_EMOJI[d.assunto]}{" "}
                    {ASSUNTO_LABEL[d.assunto as keyof typeof ASSUNTO_LABEL]}
                  </span>
                  <div className="ff-progress-track flex-1">
                    <div
                      className="ff-progress-fill"
                      style={{
                        width: `${d.taxaAcerto}%`,
                        background:
                          d.totalRespostas === 0
                            ? "#E5E7EB"
                            : d.taxaAcerto >= 75
                              ? "linear-gradient(90deg, #16A34A, #4ADE80)"
                              : d.taxaAcerto < 50
                                ? "linear-gradient(90deg, #D97706, #FBBF24)"
                                : "linear-gradient(90deg, #4F46E5, #7C3AED)",
                      }}
                    />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-bold text-[#374151]">
                    {d.totalRespostas > 0 ? `${d.taxaAcerto}%` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Card de recomendação inteligente — "o que estudar agora", calculado de verdade. */
export function RecommendationCard({ perfil }: { perfil: PerfilAprendizagem }) {
  const { recomendacao } = perfil;
  const accent = ASSUNTO_ACCENT[recomendacao.assunto];

  const TIPO_LABEL: Record<typeof recomendacao.tipo, string> = {
    revisar: "Recomendado: revisar",
    "continuar-licao": "Recomendado: continuar lição",
    "avancar-dificuldade": "Recomendado: subir o nível",
    comecar: "Recomendado: comece por aqui",
  };

  return (
    <div className="ff-card overflow-hidden" style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="ff-accent-bar" style={{ background: accent }} />
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl"
            style={{ background: `${accent}15` }}
          >
            {ASSUNTO_EMOJI[recomendacao.assunto]}
          </div>
          <div>
            <span className="ff-badge" style={{ background: `${accent}15`, color: accent }}>
              <Target className="h-3 w-3" /> {TIPO_LABEL[recomendacao.tipo]}
            </span>
            <p className="mt-2 max-w-md text-sm font-medium text-[#374151]">
              {recomendacao.motivo}
            </p>
          </div>
        </div>
        <Link to={recomendacao.to} className="ff-btn-primary w-fit shrink-0">
          Ir agora <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

/** Linha de stat cards do topo do dashboard, agora com dados reais. */
export function ProfileStatCards({ perfil }: { perfil: PerfilAprendizagem }) {
  const stats = [
    {
      emoji: "🏆",
      value: `${perfil.progressoGeralLicoes}%`,
      label: "Progresso geral",
      sub: "nas lições",
      color: "#4F46E5",
    },
    {
      emoji: "📚",
      value: `${perfil.licoes.filter((l) => l.concluida).length} / ${perfil.licoes.length}`,
      label: "Lições concluídas",
      sub: `${perfil.licoes.length - perfil.licoes.filter((l) => l.concluida).length} restantes`,
      color: "#1D4ED8",
    },
    {
      emoji: "⏱️",
      value: formatarDuracao(perfil.tempoTotalSegundos),
      label: "Tempo em questões",
      sub: `${perfil.totalRespostas} respondidas`,
      color: "#059669",
    },
    {
      emoji: "🔥",
      value: `${perfil.streak.atual}`,
      label: "Dias seguidos",
      sub: `Seu recorde: ${perfil.streak.recorde}`,
      color: "#D97706",
    },
  ];

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="ff-stat">
          <div className="ff-stat-icon" style={{ background: `${s.color}12` }}>
            <span>{s.emoji}</span>
          </div>
          <div>
            <p className="text-2xl font-black leading-none" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="mt-0.5 text-xs font-bold text-[#374151]">{s.label}</p>
            <p className="text-[11px] text-[#9CA3AF]">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
