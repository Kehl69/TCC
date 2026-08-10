import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Lock, User, CheckCircle2, Zap, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — FísicaFácil" }] }),
  component: CadastroPage,
});

const benefits = [
  { emoji: "📖", text: "Texto narrado + vídeo-aula das 3 Leis" },
  { emoji: "📊", text: "Painel de progresso com gráficos" },
  { emoji: "🏆", text: "Sistema de conquistas e XP" },
  { emoji: "🎯", text: "Metas de estudo diárias" },
  { emoji: "📱", text: "Funciona no celular e no computador" },
  { emoji: "♾️", text: "100% gratuito, para sempre" },
];

function CadastroPage() {
  const [showPass, setShowPass] = useState(false);
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      <div className="dot-bg absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "#84CC16" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:px-8">
        {/* Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="ff-card overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="h-1" style={{ background: "var(--grad-primary)" }} />
            <div className="p-8">
              <div className="mb-7">
                <div className="mb-5 text-4xl">🚀</div>
                <h1 className="text-3xl font-black tracking-tight">Criar conta</h1>
                <p className="mt-1 text-sm text-[#6B7280]">Grátis. Pronto em menos de 1 minuto.</p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="mb-2 block text-sm font-bold" htmlFor="nome">
                    Nome completo
                  </label>
                  <div className="ff-input-wrap">
                    <User className="h-4 w-4" />
                    <input id="nome" type="text" placeholder="Seu nome" className="ff-input" />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold" htmlFor="email">
                    E-mail
                  </label>
                  <div className="ff-input-wrap">
                    <Mail className="h-4 w-4" />
                    <input
                      id="email"
                      type="email"
                      placeholder="voce@exemplo.com"
                      className="ff-input"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold" htmlFor="senha">
                    Senha
                  </label>
                  <div className="ff-input-wrap relative">
                    <Lock className="h-4 w-4" />
                    <input
                      id="senha"
                      type={showPass ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className="ff-input"
                      style={{ paddingRight: "42px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151]"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#6B7280]">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 rounded accent-[#4F46E5]" />
                  <span>
                    Concordo com os{" "}
                    <a href="#" className="font-bold text-[#4F46E5] hover:underline">
                      termos de uso
                    </a>{" "}
                    e{" "}
                    <a href="#" className="font-bold text-[#4F46E5] hover:underline">
                      política de privacidade
                    </a>
                    .
                  </span>
                </label>
                <button type="submit" className="ff-btn-primary w-full justify-center">
                  <Zap className="h-4 w-4" /> Criar conta grátis
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-[#6B7280]">
                Já tem conta?{" "}
                <Link to="/login" className="font-black text-[#4F46E5] hover:underline">
                  Entrar
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="hidden md:block">
          <div className="ff-card p-8" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="mb-6 flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl text-2xl"
                style={{ background: "rgba(132,204,22,0.12)" }}
              >
                🎓
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                  Tudo incluso
                </p>
                <p className="text-xl font-black tracking-tight">Conta 100% gratuita</p>
              </div>
            </div>
            <ul className="space-y-3.5">
              {benefits.map((b) => (
                <li key={b.text} className="flex items-center gap-3.5">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[rgba(22,163,74,0.08)] text-lg">
                    {b.emoji}
                  </div>
                  <span className="text-sm font-semibold text-[#374151]">{b.text}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-[#F3F4F6] pt-7">
              {[
                { v: "3", l: "Leis" },
                { v: "2×", l: "Formatos" },
                { v: "∞", l: "Revisões" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-[#F9FAFB] p-3 text-center">
                  <p className="text-2xl font-black text-[#4F46E5]">{s.v}</p>
                  <p className="text-[11px] font-semibold text-[#9CA3AF]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
