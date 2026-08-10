import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, MapPin, Send, Github, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contato")({
  head: () => ({ meta: [{ title: "Contato — FísicaFácil" }] }),
  component: ContatoPage,
});

function ContatoPage() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white pb-14 pt-16 text-center md:pb-16 md:pt-20">
        <div className="dot-bg absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-2xl px-4">
          <div className="mb-4 text-5xl">💬</div>
          <h1 className="text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Vamos <span className="text-grad">conversar</span>?
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-[#6B7280]">
            Dúvidas, sugestões ou só quer trocar uma ideia sobre Física? Adoramos ouvir estudantes!
          </p>
        </div>
      </section>

      <section className="py-16" style={{ background: "var(--grad-surface)" }}>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="space-y-4 md:col-span-2">
              {[
                {
                  emoji: "📧",
                  title: "E-mail geral",
                  value: "contato@fisicafacil.com.br",
                  desc: "Resposta em até 2 dias úteis.",
                  accent: "#1D4ED8",
                },
                {
                  emoji: "💬",
                  title: "Suporte",
                  value: "ajuda@fisicafacil.com.br",
                  desc: "Dúvidas sobre o conteúdo das aulas.",
                  accent: "#4F46E5",
                },
                {
                  emoji: "📍",
                  title: "Localização",
                  value: "Etec Monteiro Lobato",
                  desc: "Taubaté, SP · TCC 2026",
                  accent: "#059669",
                },
              ].map((c) => (
                <div key={c.title} className="ff-card p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                      style={{ background: `${c.accent}10` }}
                    >
                      {c.emoji}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                        {c.title}
                      </p>
                      <p className="text-sm font-black">{c.value}</p>
                      <p className="text-xs text-[#9CA3AF]">{c.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="ff-card p-5">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">
                  Redes sociais
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-3.5 py-2.5 text-sm font-semibold text-[#6B7280] transition hover:text-[#374151]"
                >
                  <Github className="h-4 w-4" /> @fisicafacil
                </a>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="ff-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
                <div className="h-1" style={{ background: "var(--grad-primary)" }} />
                <div className="p-7 md:p-9">
                  {sent ? (
                    <div className="flex flex-col items-center py-10 text-center">
                      <div className="mb-4 text-5xl">🎉</div>
                      <h2 className="text-2xl font-black">Mensagem enviada!</h2>
                      <p className="mt-2 max-w-xs text-sm text-[#6B7280]">
                        Responderemos em até 2 dias úteis.
                      </p>
                      <button onClick={() => setSent(false)} className="ff-btn-outline mt-7">
                        Enviar outra
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-black">Envie sua mensagem</h2>
                      <p className="mt-1 text-sm text-[#6B7280]">Preencha o formulário abaixo.</p>
                      <form
                        className="mt-6 space-y-5"
                        onSubmit={(e) => {
                          e.preventDefault();
                          setSent(true);
                        }}
                      >
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-bold" htmlFor="nome">
                              Nome
                            </label>
                            <input
                              id="nome"
                              type="text"
                              placeholder="Seu nome"
                              className="ff-input"
                            />
                          </div>
                          <div>
                            <label className="mb-2 block text-sm font-bold" htmlFor="email">
                              E-mail
                            </label>
                            <input
                              id="email"
                              type="email"
                              placeholder="voce@exemplo.com"
                              className="ff-input"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold" htmlFor="assunto">
                            Assunto
                          </label>
                          <input
                            id="assunto"
                            type="text"
                            placeholder="Como podemos ajudar?"
                            className="ff-input"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-bold" htmlFor="msg">
                            Mensagem
                          </label>
                          <textarea
                            id="msg"
                            rows={5}
                            placeholder="Escreva sua mensagem..."
                            className="ff-input resize-none"
                          />
                        </div>
                        <button type="submit" className="ff-btn-primary">
                          <Send className="h-4 w-4" /> Enviar mensagem
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
