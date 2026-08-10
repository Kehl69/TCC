import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PenLine } from "lucide-react";
import { Whiteboard } from "@/components/whiteboard";

export const Route = createFileRoute("/quadro")({
  head: () => ({
    meta: [
      { title: "Quadro Negro Digital — FísicaFácil" },
      {
        name: "description",
        content:
          "Resolva exercícios de física desenhando livremente: lápis, texto, desfazer/refazer e muito mais.",
      },
    ],
  }),
  component: QuadroPage,
});

function QuadroPage() {
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
            <PenLine className="h-3.5 w-3.5" /> Quadro negro digital
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Resolva exercícios no seu próprio quadro
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#6B7280]">
            Desenhe diagramas, escreva fórmulas e trabalhe a solução passo a passo — exatamente como
            faria no papel, mas com desfazer/refazer sempre à mão.
          </p>
        </div>

        <div className="mt-8">
          <Whiteboard />
        </div>
      </div>
    </div>
  );
}
