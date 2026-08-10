import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, Lock, Eye, EyeOff, Atom, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — FísicaFácil" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      <div className="dot-bg absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-[0.07] blur-[80px]"
        style={{ background: "var(--grad-primary)" }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:px-8">
        {/* Visual */}
        <div className="hidden md:block">
          <div className="ff-card p-8" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div
              className="relative grid h-52 place-items-center overflow-hidden rounded-2xl text-white"
              style={{ background: "var(--grad-hero)" }}
            >
              <div className="grid-bg absolute inset-0 opacity-20" />
              <Atom className="relative h-16 w-16 ff-spin text-white" />
            </div>
            <h2 className="mt-7 text-2xl font-black">Continue de onde parou</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280]">
              Seu progresso está salvo. Entre e retome exatamente de onde você parou nas Leis de
              Newton.
            </p>
            <div className="mt-6 space-y-3">
              {[
                "Progresso salvo nas 3 leis",
                "Conquistas e XP mantidos",
                "Metas de estudo personalizadas",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-[#374151]">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[#16A34A]" /> {f}
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#F3F4F6] pt-6">
              {[
                { v: "3", l: "Leis" },
                { v: "2×", l: "Formatos" },
                { v: "∞", l: "Grátis" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-[#F9FAFB] p-3 text-center">
                  <p className="text-xl font-black text-[#4F46E5]">{s.v}</p>
                  <p className="text-[11px] font-semibold text-[#9CA3AF]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-md">
          <div className="ff-card overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
            <div className="h-1" style={{ background: "var(--grad-primary)" }} />
            <div className="p-8">
              <div
                className="mb-7 grid h-12 w-12 place-items-center rounded-2xl"
                style={{ background: "var(--grad-primary)", boxShadow: "var(--shadow-primary)" }}
              >
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Entrar</h1>
              <p className="mt-1 text-sm text-[#6B7280]">Acesse sua conta gratuita.</p>

              <form className="mt-7 space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                  <div className="mb-2 flex justify-between">
                    <label className="text-sm font-bold" htmlFor="senha">
                      Senha
                    </label>
                    <a href="#" className="text-xs font-bold text-[#4F46E5] hover:underline">
                      Esqueci a senha
                    </a>
                  </div>
                  <div className="ff-input-wrap relative">
                    <Lock className="h-4 w-4" />
                    <input
                      id="senha"
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
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
                <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#6B7280]">
                  <input type="checkbox" className="h-4 w-4 rounded accent-[#4F46E5]" />
                  Manter conectado
                </label>
                <button type="submit" className="ff-btn-primary w-full justify-center">
                  Entrar <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#F3F4F6]" />
                <span className="text-xs text-[#9CA3AF]">ou</span>
                <div className="h-px flex-1 bg-[#F3F4F6]" />
              </div>
              <p className="mt-5 text-center text-sm text-[#6B7280]">
                Não tem conta?{" "}
                <Link to="/cadastro" className="font-black text-[#4F46E5] hover:underline">
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
