import { Link } from "@tanstack/react-router";
import { Lock, ArrowRight } from "lucide-react";
import { LIMIAR_DESBLOQUEIO } from "@/lib/profile/curriculo";
import type { InfoLei } from "@/lib/profile/curriculo";

export function LeiBlockedScreen({
  leiAtual,
  leiPrerequisito,
  percentualPrerequisito,
}: {
  leiAtual: InfoLei;
  leiPrerequisito: InfoLei;
  percentualPrerequisito: number;
}) {
  const faltam = Math.max(0, LIMIAR_DESBLOQUEIO - percentualPrerequisito);

  return (
    <div className="relative overflow-hidden">
      <div className="dot-bg absolute inset-x-0 top-0 h-72 opacity-60" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
        <div
          className="grid h-20 w-20 place-items-center rounded-3xl text-4xl"
          style={{ background: `${leiAtual.accentColor}12` }}
        >
          <Lock className="h-10 w-10" style={{ color: leiAtual.accentColor }} />
        </div>

        <h1 className="mt-6 text-3xl font-black tracking-tight">
          {leiAtual.emoji} {leiAtual.numero} Lei — bloqueada
        </h1>

        <p className="mt-3 text-base text-[#6B7280]">
          Para acessar a{" "}
          <strong>
            {leiAtual.numero} Lei ({leiAtual.titulo})
          </strong>
          , você precisa completar pelo menos{" "}
          <strong>{LIMIAR_DESBLOQUEIO}%</strong> da{" "}
          <strong>
            {leiPrerequisito.numero} Lei ({leiPrerequisito.titulo})
          </strong>
          .
        </p>

        <div className="mt-8 w-full rounded-2xl border border-[#E5E7EB] bg-white p-5 text-left shadow-[var(--shadow-sm)]">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#374151]">
              {leiPrerequisito.emoji} {leiPrerequisito.numero} Lei —{" "}
              {leiPrerequisito.titulo}
            </span>
            <span
              className="font-bold"
              style={{ color: leiPrerequisito.accentColor }}
            >
              {percentualPrerequisito}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${percentualPrerequisito}%`,
                background: `linear-gradient(90deg, ${leiPrerequisito.accentColor}, ${leiPrerequisito.accentColor}bb)`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-[#9CA3AF]">
            {faltam > 0
              ? `Faltam ${faltam}% para desbloquear — leia o texto, faça o quiz e explore os formatos.`
              : `Pré-requisito completo! Recarregue a página para acessar esta lei.`}
          </p>
        </div>

        <Link
          to={leiPrerequisito.to}
          className="ff-btn-primary mt-8 w-full justify-center"
          style={{ background: leiPrerequisito.accentColor }}
        >
          Ir para a {leiPrerequisito.numero} Lei{" "}
          <ArrowRight className="h-4 w-4" />
        </Link>

        <Link
          to="/dashboard"
          className="mt-3 text-sm font-semibold text-[#9CA3AF] transition hover:text-[#6B7280]"
        >
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
