import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Atom,
  BookOpen,
  Lightbulb,
  Target,
  Zap,
  GraduationCap,
  Code2,
} from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — FísicaFácil" },
      {
        name: "description",
        content: "Conheça o projeto FísicaFácil — TCC Etec Monteiro Lobato 2026.",
      },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white pb-16 pt-16 md:pt-24">
        <div className="dot-bg absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-4xl px-4 text-center md:px-8">
          <span className="ff-badge ff-badge-primary mb-5 inline-flex">
            <GraduationCap className="h-3.5 w-3.5" /> TCC · Etec Monteiro Lobato · 2026
          </span>
          <h1 className="mt-4 text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Sobre o <span className="text-grad">projeto</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#6B7280]">
            O FísicaFácil nasceu como trabalho de conclusão de curso do técnico em Informática da
            Etec Monteiro Lobato. Nossa missão: tornar as Leis de Newton acessíveis, modernas e
            eficazes para estudantes do ensino médio.
          </p>
        </div>
      </section>

      <section className="py-20" style={{ background: "var(--grad-surface)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                emoji: "🎯",
                title: "Nossa missão",
                desc: "Democratizar o acesso ao conhecimento de Física, tornando conteúdos complexos simples e acessíveis para todos os estudantes.",
                border: "rgba(79,70,229,0.18)",
              },
              {
                emoji: "💡",
                title: "Inspiração",
                desc: "Inspirado no Khan Academy e no Duolingo, acreditamos que aprender pode ser gratuito, estruturado e motivador.",
                border: "rgba(217,119,6,0.18)",
              },
              {
                emoji: "👥",
                title: "Para estudantes",
                desc: "Desenvolvido pensando em jovens do ensino médio que precisam dominar as Leis de Newton para vestibulares e ENEM.",
                border: "rgba(5,150,105,0.18)",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="ff-card ff-card-lift p-7"
                style={{ borderColor: item.border }}
              >
                <div className="mb-5 text-4xl">{item.emoji}</div>
                <h3 className="text-xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <div>
              <span className="ff-badge ff-badge-primary mb-4 inline-flex">
                <BookOpen className="h-3 w-3" /> O projeto
              </span>
              <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                Uma plataforma de ensino focada
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#6B7280]">
                O FísicaFácil é uma plataforma web que reúne texto narrado em áudio e vídeo-aulas
                para as três Leis de Newton. Cada aula foi estruturada para guiar o aluno do
                conceito básico até os exemplos práticos.
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#6B7280]">
                Com sistema de progresso, conquistas e painel personalizado, o aluno acompanha sua
                evolução e retoma de onde parou em qualquer dispositivo.
              </p>
              <Link to="/lei-1" className="ff-btn-primary mt-8 w-fit">
                Explorar o conteúdo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="ff-card p-7" style={{ boxShadow: "var(--shadow-lg)" }}>
              <div
                className="relative grid h-48 place-items-center overflow-hidden rounded-2xl text-white"
                style={{ background: "var(--grad-hero)" }}
              >
                <div className="grid-bg absolute inset-0 opacity-20" />
                <Atom className="relative h-14 w-14 ff-spin text-white" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { v: "3", l: "Leis" },
                  { v: "2×", l: "Formatos" },
                  { v: "∞", l: "Acesso" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl bg-[#F9FAFB] p-3 text-center">
                    <p className="text-xl font-black text-[#4F46E5]">{s.v}</p>
                    <p className="text-[11px] font-semibold text-[#9CA3AF]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: "var(--grad-surface)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-8 text-center">
            <span className="ff-badge ff-badge-primary mb-3 inline-flex">
              <Code2 className="h-3 w-3" /> Stack
            </span>
            <h2 className="text-3xl font-black">Tecnologias utilizadas</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React",
              "TypeScript",
              "TanStack Router",
              "Tailwind CSS v4",
              "Vite",
              "Cloudflare Workers",
              "Radix UI",
              "Outfit Font",
              "JetBrains Mono",
            ].map((t) => (
              <span
                key={t}
                className="ff-card rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-bold text-[#374151] transition hover:border-[rgba(79,70,229,0.30)] hover:text-[#4F46E5]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div
            className="relative overflow-hidden rounded-3xl p-12 text-center text-white md:p-16"
            style={{
              background: "var(--grad-hero)",
              boxShadow: "0 20px 60px -12px rgba(79,70,229,0.40)",
            }}
          >
            <div className="grid-bg absolute inset-0 opacity-[0.15]" />
            <div className="relative">
              <div className="mb-4 text-4xl">📚</div>
              <h2 className="text-3xl font-black md:text-4xl">Comece a aprender agora</h2>
              <p className="mx-auto mt-3 max-w-lg text-base opacity-80">
                Gratuito, acessível e bem explicado.
              </p>
              <Link
                to="/lei-1"
                className="mt-8 inline-flex items-center gap-2.5 rounded-xl border-2 border-white bg-white px-8 py-3.5 text-sm font-black text-[#4F46E5] transition hover:bg-white/90"
              >
                <Zap className="h-4 w-4" /> Começar pela 1ª Lei
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
