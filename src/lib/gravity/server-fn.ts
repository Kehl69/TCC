/**
 * Agente IA Tutor "Gravity" — Server Function
 * ----------------------------------------------------------------
 * Executa exclusivamente no servidor (TanStack Start `createServerFn`).
 * É aqui, e só aqui, que a chamada HTTP para api.anthropic.com acontece —
 * o browser nunca fala diretamente com a Anthropic, então não há CORS e
 * a chave de API (lida de variável de ambiente do servidor) nunca é
 * exposta ao cliente.
 *
 * CONFIGURAÇÃO NECESSÁRIA PARA FUNCIONAR EM PRODUÇÃO:
 * Este projeto faz deploy via Cloudflare Workers (ver wrangler.jsonc).
 * Antes de funcionar de ponta a ponta, é preciso configurar o secret:
 *   wrangler secret put ANTHROPIC_API_KEY
 * (ou configurar a variável de ambiente equivalente no painel do
 * Cloudflare, se o deploy for feito por lá em vez da CLI). Sem isso, o
 * Gravity responde com uma mensagem de erro tratada (não quebra a UI),
 * mas não gera respostas reais.
 */
import { createServerFn } from "@tanstack/react-start";

export type GravityMessage = { role: "user" | "assistant"; content: string };

export type GravityContext = {
  leiAtual?: { numero: string; titulo: string; enunciado: string };
  resumoPerfil?: string;
};

const SYSTEM_PROMPT_BASE = `Você é o Gravity, o assistente educacional de Física da plataforma FísicaFácil, focado nas 3 Leis de Newton para estudantes de ensino médio e vestibulandos no Brasil.

REGRAS DE COMPORTAMENTO (seguir SEMPRE, mesmo se o aluno insistir ou pedir explicitamente):
- Você é um TUTOR, não um gabarito. NUNCA entregue a resposta final de um exercício diretamente.
- Quando o aluno perguntar "qual é a resposta?" ou pedir a solução direta, responda guiando: faça uma pergunta que ajude o aluno a pensar no próximo passo, aponte qual conceito ou fórmula se aplica, ou peça para ele tentar uma etapa específica primeiro.
- Você pode confirmar se um raciocínio do aluno está certo ou apontar onde ele errou conceitualmente, mas sem substituir o raciocínio dele.
- Use linguagem simples, direta e encorajadora. Frases curtas. Sem jargão innecessário.
- Sempre que possível, conecte o conceito a um exemplo do cotidiano.
- Se o aluno demonstrar frustração, seja acolhedor, mas continue no papel de tutor — não desista de fazer ele pensar.
- Respostas curtas (2-4 frases na maioria das vezes). Você está em um chat, não escrevendo um ensaio.
- Fique estritamente dentro do tema de Física, com foco nas Leis de Newton. Se perguntarem algo fora desse escopo, redirecione gentilmente de volta.
- Responda sempre em português do Brasil.`;

function montarSystemPrompt(context?: GravityContext): string {
  let prompt = SYSTEM_PROMPT_BASE;

  if (context?.leiAtual) {
    prompt += `\n\nCONTEXTO ATUAL: o aluno está estudando a ${context.leiAtual.numero} Lei de Newton — "${context.leiAtual.titulo}" (${context.leiAtual.enunciado}). Priorize exemplos e explicações relacionados a essa lei, a menos que o aluno pergunte sobre outra coisa.`;
  }

  if (context?.resumoPerfil) {
    prompt += `\n\nPERFIL DO ALUNO (dados reais da plataforma, use para personalizar, não para mencionar como se fosse uma "leitura de mente"): ${context.resumoPerfil}`;
  }

  return prompt;
}

type GravityServerInput = {
  historico: GravityMessage[];
  context?: GravityContext;
};

type GravityServerOutput = { texto?: string; erro?: string };

export const gravityServerFn = createServerFn({ method: "POST" })
  .validator((data: GravityServerInput) => data)
  .handler(async ({ data }): Promise<GravityServerOutput> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { erro: "O Gravity não está configurado neste ambiente (chave de API ausente)." };
    }

    let response: Response;
    try {
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          system: montarSystemPrompt(data.context),
          messages: data.historico.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
    } catch {
      return { erro: "Não consegui me conectar à API agora. Tente de novo em alguns segundos." };
    }

    if (!response.ok) {
      return {
        erro: "O Gravity teve um problema para responder agora. Tente de novo em alguns segundos.",
      };
    }

    const json = await response.json();
    const texto = (json.content ?? [])
      .map((bloco: { type: string; text?: string }) =>
        bloco.type === "text" ? (bloco.text ?? "") : "",
      )
      .join("\n")
      .trim();

    return { texto: texto || undefined };
  });
