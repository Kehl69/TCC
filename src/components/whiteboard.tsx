import { useEffect, useRef, useState, useCallback } from "react";
import { Pencil, Eraser, Type, Undo2, Redo2, Trash2, Palette, Minus, Plus, X } from "lucide-react";

type Ferramenta = "lapis" | "borracha" | "texto";

const CORES = ["#FFFFFF", "#F87171", "#60A5FA", "#4ADE80", "#FBBF24"];

type CaixaTexto = {
  id: string;
  x: number;
  y: number;
  texto: string;
  cor: string;
};

/**
 * Quadro negro virtual.
 *
 * Estratégia de undo/redo: guardamos um snapshot (ImageData) do canvas de
 * desenho inteiro a cada traço concluído (mouse/touch up). É uma abordagem
 * mais simples e robusta que re-jogar vetores de pontos, ao custo de mais
 * memória — aceitável aqui pois limitamos o histórico a 30 passos.
 *
 * Texto é mantido como uma camada separada (array de CaixaTexto) renderizada
 * em divs sobre o canvas, para que cada caixa de texto continue editável
 * depois de criada — desenhar texto direto no canvas o "congelaria" como
 * pixels, perdendo a edição.
 */
export function Whiteboard({ compact = false }: { compact?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [ferramenta, setFerramenta] = useState<Ferramenta>("lapis");
  const [cor, setCor] = useState(CORES[0]);
  const [espessura, setEspessura] = useState(4);
  const [desenhando, setDesenhando] = useState(false);

  const historicoRef = useRef<ImageData[]>([]);
  const indiceHistoricoRef = useRef(-1);
  const [podeDesfazer, setPodeDesfazer] = useState(false);
  const [podeRefazer, setPodeRefazer] = useState(false);

  const [caixasTexto, setCaixasTexto] = useState<CaixaTexto[]>([]);
  const [editandoTextoId, setEditandoTextoId] = useState<string | null>(null);

  // ───────────────────────── Setup do canvas ─────────────────────────

  useEffect(() => {
    const canvasEl = canvasRef.current;
    const containerEl = containerRef.current;
    if (!canvasEl || !containerEl) return;

    const ajustarTamanho = () => {
      const canvas = canvasEl;
      const container = containerEl;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Preserva o desenho atual ao redimensionar (ex: rotação de tela)
      const dadosAtuais = canvas.width > 0 ? canvas.toDataURL() : null;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctxRef.current = ctx;

      if (dadosAtuais) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
        img.src = dadosAtuais;
      }
    };

    ajustarTamanho();
    const resizeObserver = new ResizeObserver(ajustarTamanho);
    resizeObserver.observe(containerEl);
    return () => resizeObserver.disconnect();
  }, []);

  // ───────────────────────── Histórico (undo/redo) ─────────────────────────

  const salvarEstado = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const historico = historicoRef.current.slice(0, indiceHistoricoRef.current + 1);
    historico.push(snapshot);

    // limite de 30 passos de histórico para não crescer demais em memória
    const excedente = historico.length - 30;
    if (excedente > 0) historico.splice(0, excedente);

    historicoRef.current = historico;
    indiceHistoricoRef.current = historico.length - 1;
    setPodeDesfazer(indiceHistoricoRef.current > 0);
    setPodeRefazer(false);
  }, []);

  function restaurarEstado(indice: number) {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const snapshot = historicoRef.current[indice];
    if (!ctx || !canvas || !snapshot) return;
    ctx.putImageData(snapshot, 0, 0);
  }

  function desfazer() {
    if (indiceHistoricoRef.current <= 0) return;
    indiceHistoricoRef.current -= 1;
    restaurarEstado(indiceHistoricoRef.current);
    setPodeDesfazer(indiceHistoricoRef.current > 0);
    setPodeRefazer(true);
  }

  function refazer() {
    if (indiceHistoricoRef.current >= historicoRef.current.length - 1) return;
    indiceHistoricoRef.current += 1;
    restaurarEstado(indiceHistoricoRef.current);
    setPodeDesfazer(true);
    setPodeRefazer(indiceHistoricoRef.current < historicoRef.current.length - 1);
  }

  function limparQuadro() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCaixasTexto([]);
    salvarEstado();
  }

  // Salva o estado inicial (vazio) no histórico, uma vez que o canvas estiver pronto.
  useEffect(() => {
    const id = requestAnimationFrame(() => salvarEstado());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───────────────────────── Desenho ─────────────────────────

  function obterPosicao(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (ferramenta === "texto") {
      const { x, y } = obterPosicao(e);
      const novaCaixa: CaixaTexto = { id: `txt-${Date.now()}`, x, y, texto: "", cor };
      setCaixasTexto((prev) => [...prev, novaCaixa]);
      setEditandoTextoId(novaCaixa.id);
      // Volta para o lápis: evita que um clique posterior (ex: pra sair do campo
      // de texto) crie acidentalmente uma segunda caixa de texto em sequência.
      setFerramenta("lapis");
      return;
    }

    const ctx = ctxRef.current;
    if (!ctx) return;
    setDesenhando(true);
    const { x, y } = obterPosicao(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = ferramenta === "borracha" ? "#0F0F14" : cor;
    ctx.lineWidth = ferramenta === "borracha" ? espessura * 4 : espessura;
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!desenhando) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const { x, y } = obterPosicao(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handlePointerUp() {
    if (!desenhando) return;
    setDesenhando(false);
    salvarEstado();
  }

  function atualizarTextoCaixa(id: string, texto: string) {
    setCaixasTexto((prev) => prev.map((c) => (c.id === id ? { ...c, texto } : c)));
  }

  function removerCaixaTexto(id: string) {
    setCaixasTexto((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Barra de ferramentas */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E5E7EB] bg-white p-2.5 shadow-[var(--shadow-xs)]">
        <ToolButton
          ativo={ferramenta === "lapis"}
          onClick={() => setFerramenta("lapis")}
          title="Lápis"
        >
          <Pencil className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          ativo={ferramenta === "borracha"}
          onClick={() => setFerramenta("borracha")}
          title="Borracha"
        >
          <Eraser className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          ativo={ferramenta === "texto"}
          onClick={() => setFerramenta("texto")}
          title="Adicionar texto"
        >
          <Type className="h-4 w-4" />
        </ToolButton>

        <div className="mx-1 h-6 w-px bg-[#E5E7EB]" />

        <div className="flex items-center gap-1.5">
          <Palette className="h-3.5 w-3.5 text-[#9CA3AF]" />
          {CORES.map((c) => (
            <button
              key={c}
              onClick={() => setCor(c)}
              aria-label={`Cor ${c}`}
              className="h-6 w-6 rounded-full border-2 transition"
              style={{ background: c, borderColor: cor === c ? "#4F46E5" : "transparent" }}
            />
          ))}
        </div>

        <div className="mx-1 h-6 w-px bg-[#E5E7EB]" />

        <div className="flex items-center gap-1">
          <button
            onClick={() => setEspessura((e) => Math.max(2, e - 2))}
            className="grid h-7 w-7 place-items-center rounded-lg text-[#6B7280] transition hover:bg-[#F3F4F6]"
            title="Diminuir espessura"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-5 text-center text-xs font-bold text-[#6B7280]">{espessura}</span>
          <button
            onClick={() => setEspessura((e) => Math.min(20, e + 2))}
            className="grid h-7 w-7 place-items-center rounded-lg text-[#6B7280] transition hover:bg-[#F3F4F6]"
            title="Aumentar espessura"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ToolButton ativo={false} disabled={!podeDesfazer} onClick={desfazer} title="Desfazer">
            <Undo2 className="h-4 w-4" />
          </ToolButton>
          <ToolButton ativo={false} disabled={!podeRefazer} onClick={refazer} title="Refazer">
            <Redo2 className="h-4 w-4" />
          </ToolButton>
          <ToolButton ativo={false} onClick={limparQuadro} title="Limpar quadro" destrutivo>
            <Trash2 className="h-4 w-4" />
          </ToolButton>
        </div>
      </div>

      {/* Área de desenho */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl"
        style={{
          background: "#1A1A22",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          height: compact ? "320px" : "min(640px, 70vh)",
          touchAction: "none",
        }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="absolute inset-0"
          style={{ cursor: ferramenta === "texto" ? "text" : "crosshair" }}
        />

        {caixasTexto.map((c) => (
          <div
            key={c.id}
            className="group absolute"
            style={{ left: c.x, top: c.y, maxWidth: "260px" }}
          >
            {editandoTextoId === c.id ? (
              <CaixaDeTextoEditavel
                texto={c.texto}
                cor={c.cor}
                onChange={(texto) => atualizarTextoCaixa(c.id, texto)}
                onBlur={() => setEditandoTextoId(null)}
              />
            ) : (
              <div
                onClick={() => setEditandoTextoId(c.id)}
                className="relative cursor-text whitespace-pre-wrap rounded-lg p-1.5 text-sm font-medium hover:bg-white/5"
                style={{ color: c.cor }}
              >
                {c.texto || "Clique para editar"}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removerCaixaTexto(c.id);
                  }}
                  className="absolute -right-2 -top-2 hidden h-5 w-5 place-items-center rounded-full bg-[#DC2626] text-white group-hover:grid"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CaixaDeTextoEditavel({
  texto,
  cor,
  onChange,
  onBlur,
}: {
  texto: string;
  cor: string;
  onChange: (texto: string) => void;
  onBlur: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Foca a textarea só depois que o ciclo de eventos do pointerdown/pointerup que
  // criou esta caixa já terminou — usar `autoFocus` direto entrava em race com o
  // próprio canvas tentando recuperar o foco, fechando a edição quase instantaneamente.
  useEffect(() => {
    const id = requestAnimationFrame(() => textareaRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={texto}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder="Digite..."
      rows={2}
      className="resize-none rounded-lg border-2 border-[#4F46E5] bg-[#1A1A22]/90 p-1.5 text-sm font-medium outline-none"
      style={{ color: cor, minWidth: "140px" }}
    />
  );
}

function ToolButton({
  ativo,
  onClick,
  title,
  children,
  disabled,
  destrutivo,
}: {
  ativo: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  destrutivo?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="grid h-9 w-9 place-items-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-30"
      style={{
        background: ativo ? "rgba(79,70,229,0.12)" : "transparent",
        color: ativo ? "#4F46E5" : destrutivo ? "#DC2626" : "#6B7280",
      }}
      onMouseEnter={(e) => {
        if (!ativo && !disabled) e.currentTarget.style.background = "#F3F4F6";
      }}
      onMouseLeave={(e) => {
        if (!ativo) e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}
