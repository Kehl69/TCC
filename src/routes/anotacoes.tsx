import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, StickyNote } from "lucide-react";
import { NotesPanel } from "@/components/notes-panel";

export const Route = createFileRoute("/anotacoes")({
  head: () => ({
    meta: [
      { title: "Minhas Anotações — FísicaFácil" },
      {
        name: "description",
        content: "Crie e organize suas anotações pessoais de física, com salvamento automático.",
      },
    ],
  }),
  component: AnotacoesPage,
});

function AnotacoesPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="dot-bg absolute inset-x-0 top-0 h-72 opacity-60" />

      <div className="relative mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-16">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B7280] transition-colors hover:text-[#111118]"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao painel
        </Link>

        <div className="mt-7">
          <span className="ff-badge ff-badge-primary inline-flex">
            <StickyNote className="h-3.5 w-3.5" /> Anotações pessoais
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Suas anotações de física
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#6B7280]">
            Tudo é salvo automaticamente enquanto você digita. Organize por lei, busque a qualquer
            momento e recupere versões antigas se precisar.
          </p>
        </div>

        <div className="mt-8">
          <NotesPanel />
        </div>
      </div>
    </div>
  );
}
