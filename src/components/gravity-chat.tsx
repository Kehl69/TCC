import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import {
  enviarMensagemGravity,
  GravityError,
  type GravityMessage,
  type GravityContext,
} from "@/lib/gravity/client";

const SUGESTOES_PADRAO = [
  "Por que a inércia depende da massa?",
  "Me dá um exemplo do dia a dia da 3ª Lei",
  "Não entendi a fórmula F = m·a",
];

export function GravityChat({
  context,
  sugestoes = SUGESTOES_PADRAO,
  alturaMensagens = "360px",
}: {
  context?: GravityContext;
  sugestoes?: string[];
  alturaMensagens?: string;
}) {
  const [mensagens, setMensagens] = useState<GravityMessage[]>([]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [mensagens, carregando]);

  async function enviar(texto: string) {
    const textoLimpo = texto.trim();
    if (!textoLimpo || carregando) return;

    const novoHistorico: GravityMessage[] = [...mensagens, { role: "user", content: textoLimpo }];
    setMensagens(novoHistorico);
    setInput("");
    setErro(null);
    setCarregando(true);

    try {
      const resposta = await enviarMensagemGravity(novoHistorico, context);
      setMensagens((prev) => [...prev, { role: "assistant", content: resposta }]);
    } catch (e) {
      const mensagemErro =
        e instanceof GravityError
          ? e.message
          : "Algo deu errado ao falar com o Gravity. Tente novamente.";
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  function reiniciarConversa() {
    setMensagens([]);
    setErro(null);
  }

  return (
    <div className="flex flex-col">
      <div
        ref={scrollRef}
        className="space-y-3 overflow-y-auto px-1"
        style={{ height: alturaMensagens }}
      >
        {mensagens.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[rgba(79,70,229,0.1)]">
              <Sparkles className="h-6 w-6 text-[#4F46E5]" />
            </div>
            <p className="text-sm font-semibold text-[#374151]">
              Oi! Eu sou o Gravity 👋 Posso te ajudar a entender melhor as Leis de Newton.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {sugestoes.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-semibold text-[#4B5563] transition hover:border-[#4F46E5] hover:text-[#4F46E5]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {mensagens.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                m.role === "user"
                  ? { background: "#4F46E5", color: "white" }
                  : { background: "#F3F4F6", color: "#1F2937" }
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {carregando && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl bg-[#F3F4F6] px-4 py-3">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9CA3AF] [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9CA3AF] [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9CA3AF]" />
            </div>
          </div>
        )}

        {erro && (
          <div className="flex items-start gap-2 rounded-xl border border-[rgba(220,38,38,0.25)] bg-[rgba(220,38,38,0.05)] px-3 py-2.5 text-xs font-semibold text-[#B91C1C]">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {erro}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-[#F3F4F6] pt-3">
        {mensagens.length > 0 && (
          <button
            onClick={reiniciarConversa}
            title="Reiniciar conversa"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#374151]"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              enviar(input);
            }
          }}
          placeholder="Pergunte algo sobre as Leis de Newton..."
          disabled={carregando}
          className="ff-input flex-1"
          style={{ paddingLeft: "16px" }}
        />
        <button
          onClick={() => enviar(input)}
          disabled={carregando || !input.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#4F46E5] text-white transition hover:bg-[#4338CA] disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
