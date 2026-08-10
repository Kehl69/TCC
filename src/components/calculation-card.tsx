import { useRef, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calculator,
} from "lucide-react";
import type { QuestaoCalculo } from "@/lib/questions/types";
import {
  registrarRespostaCalculo,
  type ResultadoVerificacao,
} from "@/lib/questions/engine-calculo";

type Fase = "respondendo" | "revelado";

export function CalculationCard({
  questao,
  onProxima,
  onRegistrado,
}: {
  questao: QuestaoCalculo;
  onProxima: () => void;
  onRegistrado?: (correta: boolean) => void;
}) {
  const [input, setInput] = useState("");
  const [fase, setFase] = useState<Fase>("respondendo");
  const [resultado, setResultado] = useState<ResultadoVerificacao | null>(null);
  const [mostrarPassos, setMostrarPassos] = useState(false);
  const inicioRef = useRef(Date.now());

  function handleResponder() {
    const valor = parseFloat(input.replace(",", "."));
    if (isNaN(valor)) return;

    const tempoSegundos = Math.max(1, Math.round((Date.now() - inicioRef.current) / 1000));
    const res = registrarRespostaCalculo(questao, valor, tempoSegundos);
    setResultado(res);
    setFase("revelado");
    setMostrarPassos(false); // começa fechado — aluno abre se quiser ver o desenvolvimento
    onRegistrado?.(res.correta);
  }

  function handleProxima() {
    setInput("");
    setFase("respondendo");
    setResultado(null);
    setMostrarPassos(false);
    inicioRef.current = Date.now();
    onProxima();
  }

  const valorDigitado = parseFloat(input.replace(",", "."));

  return (
    <div className="ff-card overflow-hidden" style={{ boxShadow: "var(--shadow-md)" }}>
      <div className="ff-accent-bar" style={{ background: "#7C3AED" }} />

      <div className="p-6 md:p-8">
        {/* Badge tipo */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="ff-badge"
            style={{
              background: "rgba(124,58,237,0.1)",
              color: "#7C3AED",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            <Calculator className="h-3 w-3" /> Cálculo numérico
          </span>
          <span className="ff-badge ff-badge-primary">{questao.subassunto}</span>
        </div>

        {/* Enunciado */}
        <p className="mt-5 text-base font-semibold leading-relaxed text-[#111118] md:text-lg">
          {questao.enunciado}
        </p>

        {/* Dados do problema */}
        <div className="mt-4 flex flex-wrap gap-2">
          {questao.dados.map((d) => (
            <span
              key={d.simbolo}
              className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1.5 text-sm font-bold text-[#374151]"
            >
              <span className="ff-formula text-[#7C3AED]">{d.simbolo}</span> = {d.valor}
            </span>
          ))}
        </div>

        {/* Fórmula */}
        <div className="mt-4 rounded-xl bg-[#F9FAFB] px-4 py-3 text-center">
          <span className="ff-formula text-lg font-bold text-[#7C3AED]">{questao.formula}</span>
        </div>

        {/* Campo de resposta */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-bold text-[#374151]">
            Sua resposta (em {questao.unidade}):
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="any"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && fase === "respondendo") handleResponder();
              }}
              disabled={fase === "revelado"}
              placeholder={`Ex: 9,8`}
              className="ff-input w-full max-w-xs text-lg font-bold"
              style={{ textAlign: "center" }}
            />
            <span className="text-sm font-bold text-[#6B7280]">{questao.unidade}</span>
            {fase === "respondendo" && (
              <button
                onClick={handleResponder}
                disabled={!input.trim() || isNaN(valorDigitado)}
                className="ff-btn-primary"
                style={{ background: "#7C3AED", whiteSpace: "nowrap" }}
              >
                Verificar <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Resultado */}
        {fase === "revelado" && resultado && (
          <div className="mt-6 space-y-4">
            {/* Feedback imediato */}
            <div
              className="flex items-start gap-3 rounded-2xl border p-4"
              style={
                resultado.correta
                  ? { borderColor: "rgba(22,163,74,0.3)", background: "rgba(22,163,74,0.06)" }
                  : { borderColor: "rgba(220,38,38,0.3)", background: "rgba(220,38,38,0.05)" }
              }
            >
              {resultado.correta ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#16A34A]" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0 text-[#DC2626]" />
              )}
              <div>
                <p
                  className="text-sm font-bold"
                  style={{ color: resultado.correta ? "#15803D" : "#B91C1C" }}
                >
                  {resultado.correta
                    ? `Correto! ${questao.valorCorreto} ${questao.unidade}`
                    : `Incorreto. O resultado correto é ${questao.valorCorreto} ${questao.unidade}.`}
                </p>
                {!resultado.correta && resultado.diagnostico && (
                  <p className="mt-1.5 text-sm leading-relaxed text-[#374151]">
                    {resultado.diagnostico}
                  </p>
                )}
              </div>
            </div>

            {/* Passos de resolução */}
            <div>
              <button
                onClick={() => setMostrarPassos((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2.5 text-sm font-semibold text-[#4B5563] transition hover:bg-[#F3F4F6]"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-[#7C3AED]" /> Resolução passo a passo
                </span>
                {mostrarPassos ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {mostrarPassos && (
                <div className="mt-3 space-y-2.5">
                  {questao.passos.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3.5"
                    >
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#7C3AED] text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#374151]">{p.descricao}</p>
                        <p className="mt-1 font-mono text-sm font-bold text-[#7C3AED]">
                          {p.calculo}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Explicação final */}
                  <div className="rounded-xl border border-[rgba(124,58,237,0.2)] bg-[rgba(124,58,237,0.05)] p-4">
                    <p className="text-sm leading-relaxed text-[#374151]">
                      {questao.explicacaoFinal}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleProxima}
              className="ff-btn-primary w-full justify-center"
              style={{ background: "#7C3AED" }}
            >
              Próxima questão <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
