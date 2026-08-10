import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Atom,
  Menu,
  X,
  Zap,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Info,
  Phone,
  Github,
  Twitter,
  Brain,
  StickyNote,
  PenLine,
  Lock,
} from "lucide-react";
import { obterStatusLei } from "@/lib/profile/curriculo";

const laws = [
  {
    to: "/lei-1",
    assunto: "lei-1" as const,
    label: "1ª Lei — Inércia",
    emoji: "⚖️",
    color: "#1D4ED8",
  },
  {
    to: "/lei-2",
    assunto: "lei-2" as const,
    label: "2ª Lei — F = m·a",
    emoji: "⚡",
    color: "#4F46E5",
  },
  {
    to: "/lei-3",
    assunto: "lei-3" as const,
    label: "3ª Lei — Ação e Reação",
    emoji: "🔄",
    color: "#059669",
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Começa com lei-1 disponível e as demais bloqueadas (consistente com SSR)
  const [statusLeis, setStatusLeis] = useState<
    Record<string, "disponivel" | "bloqueada" | "concluida">
  >({
    "lei-1": "disponivel",
    "lei-2": "bloqueada",
    "lei-3": "bloqueada",
  });

  useEffect(() => {
    setStatusLeis({
      "lei-1": obterStatusLei("lei-1"),
      "lei-2": obterStatusLei("lei-2"),
      "lei-3": obterStatusLei("lei-3"),
    });
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-[#E5E7EB] bg-white/92 backdrop-blur-xl shadow-[0_1px_8px_rgba(17,17,24,0.06)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-6 px-4 md:px-8">
        {/* ─ Logo ─ */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5 group">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl transition-transform group-hover:scale-105"
            style={{
              background: "var(--grad-primary)",
              boxShadow: "var(--shadow-primary)",
            }}
          >
            <Atom className="h-[18px] w-[18px] text-white ff-spin" />
          </div>
          <div className="leading-none">
            <div className="text-[15px] font-black tracking-tight text-[#111118]">
              FísicaFácil
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">
              Leis de Newton
            </div>
          </div>
        </Link>

        {/* ─ Nav desktop ─ */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {/* Dropdown Leis */}
          <div
            className="relative"
            onMouseEnter={() => setDropdown(true)}
            onMouseLeave={() => setDropdown(false)}
          >
            <button className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111118]">
              <BookOpen className="h-4 w-4" />
              Leis
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdown ? "rotate-180" : ""}`}
              />
            </button>

            {dropdown && (
              <div className="absolute left-0 top-full mt-1.5 w-64 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[var(--shadow-lg)]">
                <div className="p-2">
                  {laws.map((l) => {
                    const bloqueada = statusLeis[l.assunto] === "bloqueada";
                    return bloqueada ? (
                      <div
                        key={l.to}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 opacity-50"
                        title="Complete a lei anterior para desbloquear"
                      >
                        <span className="text-xl">{l.emoji}</span>
                        <span className="flex-1 text-sm font-semibold text-[#374151]">
                          {l.label}
                        </span>
                        <Lock className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
                      </div>
                    ) : (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setDropdown(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#F9FAFB]"
                        activeProps={{
                          className:
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 bg-[rgba(79,70,229,0.07)]",
                        }}
                      >
                        <span className="text-xl">{l.emoji}</span>
                        <span className="text-sm font-semibold text-[#374151]">
                          {l.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-[#F3F4F6] px-4 py-3 text-[11px] text-[#9CA3AF]">
                  Mecânica Clássica · Isaac Newton
                </div>
              </div>
            )}
          </div>

          {[
            { to: "/questoes", label: "Questões", icon: Brain },
            { to: "/quadro", label: "Quadro", icon: PenLine },
            { to: "/anotacoes", label: "Anotações", icon: StickyNote },
            { to: "/dashboard", label: "Painel", icon: LayoutDashboard },
            { to: "/sobre", label: "Sobre", icon: Info },
            { to: "/contato", label: "Contato", icon: Phone },
          ].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111118]"
              activeProps={{
                className:
                  "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold ff-nav-active",
              }}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
        </nav>

        {/* ─ CTA desktop ─ */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#111118] sm:inline-flex"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="ff-btn-primary hidden sm:inline-flex"
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            <Zap className="h-3.5 w-3.5" /> Começar grátis
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-[#E5E7EB] bg-white text-[#374151] md:hidden"
            aria-label="Abrir menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* ─ Mobile drawer ─ */}
      {open && (
        <div className="border-t border-[#E5E7EB] bg-white md:hidden">
          <div className="flex flex-col gap-1 p-4">
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">
              Conteúdo
            </p>
            {laws.map((l) => {
              const bloqueada = statusLeis[l.assunto] === "bloqueada";
              return bloqueada ? (
                <div
                  key={l.to}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#374151] opacity-50"
                  title="Complete a lei anterior para desbloquear"
                >
                  <span className="text-lg">{l.emoji}</span>
                  <span className="flex-1">{l.label}</span>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
                </div>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#374151] hover:bg-[#F9FAFB]"
                  activeProps={{
                    className:
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ff-nav-active",
                  }}
                >
                  <span className="text-lg">{l.emoji}</span> {l.label}
                </Link>
              );
            })}
            <div className="my-2 h-px bg-[#F3F4F6]" />
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">
              Plataforma
            </p>
            {[
              { to: "/questoes", label: "Questões", icon: Brain },
              { to: "/quadro", label: "Quadro Negro", icon: PenLine },
              { to: "/anotacoes", label: "Anotações", icon: StickyNote },
              { to: "/dashboard", label: "Meu Painel", icon: LayoutDashboard },
              { to: "/sobre", label: "Sobre", icon: Info },
              { to: "/contato", label: "Contato", icon: Phone },
            ].map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#374151]"
                activeProps={{
                  className:
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ff-nav-active",
                }}
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-[#F3F4F6]" />
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="ff-btn-outline flex-1 justify-center"
                style={{ padding: "10px", fontSize: "13px" }}
              >
                Entrar
              </Link>
              <Link
                to="/cadastro"
                onClick={() => setOpen(false)}
                className="ff-btn-primary flex-1 justify-center"
                style={{ padding: "10px", fontSize: "13px" }}
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{
                  background: "var(--grad-primary)",
                  boxShadow: "var(--shadow-primary)",
                }}
              >
                <Atom className="h-[18px] w-[18px] text-white" />
              </div>
              <span className="text-base font-black tracking-tight">
                FísicaFácil
              </span>
            </Link>
            <p className="mt-4 max-w-[260px] text-sm leading-relaxed text-[#6B7280]">
              Plataforma gratuita de Física para o ensino médio. Desenvolvida
              como TCC — Etec Monteiro Lobato.
            </p>
            <div className="mt-5 flex gap-2">
              {[Github, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-[#E5E7EB] text-[#9CA3AF] transition-colors hover:border-[#D1D5DB] hover:text-[#374151]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-[#9CA3AF]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#16A34A]" />
              Material 100% gratuito e aberto
            </div>
          </div>

          {[
            {
              title: "Conteúdo",
              items: [
                { label: "1ª Lei — Inércia", to: "/lei-1" },
                { label: "2ª Lei — F = m·a", to: "/lei-2" },
                { label: "3ª Lei — Ação e Reação", to: "/lei-3" },
              ],
            },
            {
              title: "Plataforma",
              items: [
                { label: "Meu Painel", to: "/dashboard" },
                { label: "Criar conta", to: "/cadastro" },
                { label: "Entrar", to: "/login" },
              ],
            },
            {
              title: "Projeto",
              items: [
                { label: "Sobre nós", to: "/sobre" },
                { label: "Contato", to: "/contato" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-[#6B7280] transition-colors hover:text-[#111118]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#F3F4F6] pt-8 sm:flex-row">
          <p className="text-xs text-[#9CA3AF]">
            © 2026 FísicaFácil · TCC Etec Monteiro Lobato · Taubaté, SP
          </p>
          <p className="text-xs text-[#9CA3AF]">
            Feito com 💙 para estudantes do ensino médio
          </p>
        </div>
      </div>
    </footer>
  );
}
