import { Link } from "@tanstack/react-router";
import { ArrowLeft, Wrench } from "lucide-react";

export function StubPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      <div className="dot-bg absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-2xl px-4 py-24 text-center md:px-8">
        <div className="mb-4 text-5xl">🔧</div>
        <span className="ff-badge ff-badge-warning mb-4 inline-flex">
          <Wrench className="h-3 w-3" /> Em construção
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-[#6B7280]">
          {description}
        </p>
        <Link to="/" className="ff-btn-outline mt-8 inline-flex">
          <ArrowLeft className="h-4 w-4" /> Voltar ao início
        </Link>
      </div>
    </section>
  );
}

export function makeStubRoute(_path: string, title: string, description: string) {
  return {
    head: () => ({
      meta: [{ title: `${title} — FísicaFácil` }, { name: "description", content: description }],
    }),
    component: () => <StubPage title={title} description={description} />,
  };
}
