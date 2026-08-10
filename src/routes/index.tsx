import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Headphones,
  Sparkles,
  Zap,
  TrendingUp,
  Users,
  BookOpen,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FísicaFácil — As 3 Leis de Newton" },
      {
        name: "description",
        content:
          "Plataforma gratuita para aprender as Leis de Newton com texto narrado, vídeo-aulas e progresso de estudos.",
      },
    ],
  }),
  component: Home,
});

const laws = [
  {
    to: "/lei-1",
    n: "01",
    emoji: "⚖️",
    tag: "1ª Lei",
    title: "Lei da Inércia",
    desc: "Objetos em repouso ficam em repouso; em movimento, permanecem em movimento. Entenda por que forças são necessárias para mudar esse estado.",
    accent: "#1D4ED8",
    accentBg: "rgba(29,78,216,0.07)",
    accentBorder: "rgba(29,78,216,0.18)",
  },
  {
    to: "/lei-2",
    n: "02",
    emoji: "⚡",
    tag: "2ª Lei",
    title: "Princípio Fundamental",
    desc: "F = m · a. A equação que conecta força, massa e aceleração e governa cada movimento no universo físico.",
    accent: "#4F46E5",
    accentBg: "rgba(79,70,229,0.07)",
    accentBorder: "rgba(79,70,229,0.18)",
  },
  {
    to: "/lei-3",
    n: "03",
    emoji: "🔄",
    tag: "3ª Lei",
    title: "Ação e Reação",
    desc: "Para toda ação existe uma reação de mesma intensidade e sentido oposto. Foguetes, caminhada, natação — tudo obedece essa lei.",
    accent: "#059669",
    accentBg: "rgba(5,150,105,0.07)",
    accentBorder: "rgba(5,150,105,0.18)",
  },
];

function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24">
        <div className="dot-bg absolute inset-0 opacity-70" />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full opacity-[0.06] blur-[90px]"
          style={{ background: "var(--grad-hero)" }}
        />
        <div
          className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-[70px]"
          style={{ background: "#84CC16" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 md:grid-cols-2 md:px-8">
          {/* Copy */}
          <div>
            <div className="ff-anim mb-7 w-fit">
              <span className="ff-badge ff-badge-primary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4F46E5]" />
                Conteúdo 100% gratuito para estudantes
              </span>
            </div>

            <h1 className="ff-anim ff-d1 text-[clamp(2.4rem,5.5vw,3.8rem)] font-black leading-[1.05] tracking-tight">
              Aprenda as <br />
              <span className="text-grad">3 Leis de Newton</span>
              <br />
              do jeito certo
            </h1>

            <p className="ff-anim ff-d2 mt-6 max-w-[460px] text-[1.05rem] leading-relaxed text-[#6B7280]">
              Texto com narração em áudio, vídeo-aulas e exemplos reais do cotidiano. Estude no seu
              ritmo e acompanhe sua evolução.
            </p>

            <div className="ff-anim ff-d3 mt-9 flex flex-wrap gap-3">
              <Link to="/lei-1" className="ff-btn-primary">
                Começar agora <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/lei-2" className="ff-btn-outline">
                <PlayCircle className="h-4 w-4 text-[#4F46E5]" /> Ver vídeo-aula
              </Link>
            </div>

            <div className="ff-anim ff-d4 mt-9 flex flex-wrap gap-5">
              {[
                { icon: CheckCircle2, color: "#16A34A", text: "Texto + narração" },
                { icon: PlayCircle, color: "#4F46E5", text: "Vídeo-aula" },
                { icon: TrendingUp, color: "#D97706", text: "Progresso salvo" },
              ].map((f) => (
                <span
                  key={f.text}
                  className="flex items-center gap-2 text-sm font-medium text-[#6B7280]"
                >
                  <f.icon className="h-4 w-4" style={{ color: f.color }} /> {f.text}
                </span>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div className="relative hidden md:flex md:justify-center">
            <div
              className="pointer-events-none absolute inset-0 m-auto h-80 w-80 rounded-full opacity-[0.15] blur-3xl"
              style={{ background: "var(--grad-primary)" }}
            />

            <div
              className="ff-float ff-card w-full max-w-[360px] p-6"
              style={{ boxShadow: "var(--shadow-lg)" }}
            >
              {/* Card header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                    Aula em destaque
                  </p>
                  <h3 className="mt-1.5 text-lg font-black">1ª Lei — Inércia</h3>
                </div>
                <span className="ff-badge ff-badge-success">Mecânica</span>
              </div>

              {/* Visual banner */}
              <div
                className="relative mt-4 grid h-44 place-items-center overflow-hidden rounded-2xl text-white"
                style={{ background: "var(--grad-hero)" }}
              >
                <div className="grid-bg absolute inset-0 opacity-30" />
                <div className="relative text-center">
                  <div className="text-5xl">⚖️</div>
                  <p className="mt-2 text-sm font-semibold opacity-90">Lei da Inércia</p>
                </div>
                {/* Progress overlay */}
                <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-black/25 px-4 py-3 backdrop-blur-sm">
                  <div className="flex justify-between text-xs text-white/80 mb-1.5">
                    <span>Seu progresso</span>
                    <span className="font-bold">80%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/25">
                    <div className="h-full w-4/5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              {/* Chips */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {[
                  { icon: Headphones, label: "Texto narrado", color: "#4F46E5" },
                  { icon: PlayCircle, label: "Vídeo-aula", color: "#059669" },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2.5 rounded-xl bg-[#F9FAFB] px-3.5 py-2.5"
                  >
                    <f.icon className="h-4 w-4" style={{ color: f.color }} />
                    <span className="text-xs font-semibold text-[#374151]">{f.label}</span>
                  </div>
                ))}
              </div>

              <Link to="/lei-1" className="ff-btn-primary mt-4 w-full justify-center">
                Estudar agora <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ 3 LEIS ══════ */}
      <section className="py-24" style={{ background: "var(--grad-surface)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-14 text-center">
            <span className="ff-badge ff-badge-primary mb-5 inline-flex">
              <Sparkles className="h-3.5 w-3.5" /> Conteúdo completo
            </span>
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">
              As três Leis de Newton
            </h2>
            <p className="mt-3 text-[#6B7280]">
              Escolha uma lei e comece agora. Cada aula tem texto + áudio e vídeo.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {laws.map((law, i) => (
              <Link
                key={law.to}
                to={law.to}
                className="ff-card ff-card-lift group relative overflow-hidden p-7"
                style={{
                  borderColor: law.accentBorder,
                  animationDelay: `${i * 80}ms`,
                }}
              >
                {/* Top accent stripe */}
                <div
                  className="absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${law.accent}, transparent)`,
                  }}
                />

                <div className="flex items-start justify-between">
                  <div
                    className="grid h-14 w-14 place-items-center rounded-2xl text-4xl"
                    style={{ background: law.accentBg }}
                  >
                    {law.emoji}
                  </div>
                  <span className="font-mono text-5xl font-black opacity-[0.05] transition-opacity group-hover:opacity-[0.10]">
                    {law.n}
                  </span>
                </div>

                <div className="mt-5">
                  <span
                    className="ff-badge"
                    style={{
                      background: law.accentBg,
                      color: law.accent,
                      border: `1px solid ${law.accentBorder}`,
                    }}
                  >
                    {law.tag}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-black tracking-tight">{law.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{law.desc}</p>

                <div
                  className="mt-6 flex items-center gap-1.5 text-sm font-bold transition-all group-hover:gap-3"
                  style={{ color: law.accent }}
                >
                  Estudar agora
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ COMO FUNCIONA ══════ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-black tracking-tight md:text-5xl">Estude do seu jeito</h2>
            <p className="mt-3 text-[#6B7280]">
              Dois formatos por aula. Você escolhe como aprender.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                emoji: "📖",
                n: "01",
                title: "Texto com narração em áudio",
                desc: "Leia e ouça ao mesmo tempo. Ideal para revisar antes de uma prova ou estudar no transporte. Todo o conteúdo pode ser acompanhado com áudio narrado.",
                tags: ["Texto completo", "Narração incluída", "Exemplos práticos"],
                badge: "Mais usado",
                badgeStyle: {
                  background: "rgba(79,70,229,0.10)",
                  color: "#3730A3",
                  border: "1px solid rgba(79,70,229,0.20)",
                },
              },
              {
                emoji: "🎬",
                n: "02",
                title: "Vídeo-aula completa",
                desc: "Explicação visual com animações, demonstrações e resumo ao final. Perfeito para quem aprende melhor vendo e ouvindo ao mesmo tempo.",
                tags: ["Exemplos visuais", "Resumo animado", "Capítulos marcados"],
                badge: null,
                badgeStyle: null,
              },
            ].map((item) => (
              <div key={item.title} className="ff-card relative p-8">
                {item.badge && (
                  <span className="absolute right-6 top-6 ff-badge" style={item.badgeStyle!}>
                    {item.badge}
                  </span>
                )}
                <div className="text-4xl">{item.emoji}</div>
                <div className="mt-4 font-mono text-[11px] font-bold text-[#9CA3AF]">{item.n}</div>
                <h3 className="mt-1 text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{item.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-xs font-semibold text-[#6B7280]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ MINI STATS ══════ */}
      <section className="py-14" style={{ background: "var(--grad-surface)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              {
                emoji: "📚",
                value: "3",
                label: "Leis de Newton",
                sub: "aulas completas",
                color: "#4F46E5",
              },
              {
                emoji: "🎯",
                value: "2×",
                label: "Formatos",
                sub: "por cada aula",
                color: "#1D4ED8",
              },
              {
                emoji: "🎧",
                value: "100%",
                label: "Áudio narrado",
                sub: "em todo conteúdo",
                color: "#059669",
              },
              {
                emoji: "⚡",
                value: "∞",
                label: "Acesso",
                sub: "totalmente grátis",
                color: "#D97706",
              },
            ].map((s) => (
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
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div
            className="relative overflow-hidden rounded-3xl p-12 text-center text-white md:p-20"
            style={{
              background: "var(--grad-hero)",
              boxShadow: "0 20px 60px -12px rgba(79,70,229,0.40)",
            }}
          >
            <div className="grid-bg absolute inset-0 opacity-[0.15]" />
            <div className="relative">
              <span className="ff-badge mb-6 inline-flex border-white/25 bg-white/15 text-white">
                <CheckCircle2 className="h-3.5 w-3.5" /> Sem cadastro obrigatório para começar
              </span>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">
                Pronto para aprender?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg opacity-80">
                Comece pela 1ª Lei e avance no seu ritmo. Conteúdo direto, com exemplos reais.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link
                  to="/lei-1"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white bg-white px-8 py-4 text-sm font-black text-[#4F46E5] transition-all hover:bg-white/90 active:scale-97"
                >
                  Estudar a 1ª Lei <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/cadastro"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/15 px-8 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/25"
                >
                  <Zap className="h-4 w-4" /> Criar conta grátis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
