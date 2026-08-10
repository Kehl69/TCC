import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { GravityChat } from "@/components/gravity-chat";
import { gerarResumoPerfilParaGravity } from "@/lib/gravity/perfil-resumo";

/**
 * Botão flutuante global do Gravity. Fica disponível em qualquer página
 * (montado uma vez no __root.tsx) para o aluno poder tirar uma dúvida
 * sem precisar estar dentro de uma lição específica.
 */
export function GravityWidget() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      {aberto && (
        <div
          className="fixed bottom-24 right-5 z-50 flex w-[min(380px,calc(100vw-2.5rem))] flex-col rounded-3xl border border-[#E5E7EB] bg-white p-4 shadow-2xl"
          style={{ boxShadow: "0 20px 50px -12px rgba(0,0,0,0.25)" }}
        >
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-[rgba(79,70,229,0.1)]">
                <Sparkles className="h-4 w-4 text-[#4F46E5]" />
              </div>
              <div>
                <p className="text-sm font-black leading-none">Gravity</p>
                <p className="text-[11px] text-[#9CA3AF]">Seu tutor de Física</p>
              </div>
            </div>
            <button
              onClick={() => setAberto(false)}
              className="grid h-8 w-8 place-items-center rounded-lg text-[#9CA3AF] transition hover:bg-[#F3F4F6]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <GravityChat
            context={{ resumoPerfil: gerarResumoPerfilParaGravity() }}
            alturaMensagens="320px"
          />
        </div>
      )}

      <button
        onClick={() => setAberto((v) => !v)}
        aria-label="Abrir o assistente Gravity"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition hover:scale-105"
        style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}
      >
        {aberto ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </button>
    </>
  );
}
