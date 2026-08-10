import { useMemo, useState } from "react";
import { Search, Plus, Trash2, Save, History, X, FileText, RotateCcw } from "lucide-react";
import type { Nota } from "@/lib/notes/types";
import {
  listarNotas,
  criarNota,
  atualizarNota,
  excluirNota,
  buscarNotas,
  obterHistoricoDaNota,
  restaurarVersao,
} from "@/lib/notes/store";
import { useAutosave } from "@/lib/notes/use-autosave";
import type { Assunto } from "@/lib/questions/types";
import { ASSUNTO_LABEL } from "@/lib/questions/types";

type FiltroAssunto = Assunto | "geral" | "todas";

const FILTROS: { id: FiltroAssunto; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "geral", label: "Geral" },
  { id: "lei-1", label: ASSUNTO_LABEL["lei-1"] },
  { id: "lei-2", label: ASSUNTO_LABEL["lei-2"] },
  { id: "lei-3", label: ASSUNTO_LABEL["lei-3"] },
];

function formatarData(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) +
    " às " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

export function NotesPanel({ assuntoInicial }: { assuntoInicial?: Assunto } = {}) {
  const [notas, setNotas] = useState<Nota[]>(() => listarNotas());
  const [selecionadaId, setSelecionadaId] = useState<string | null>(notas[0]?.id ?? null);
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroAssunto>(assuntoInicial ?? "todas");
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const notasFiltradas = useMemo(() => {
    // `notas` não é lido diretamente aqui, mas precisa estar nas dependências:
    // buscarNotas() lê do localStorage, então é o gatilho de recálculo após qualquer CRUD.
    return buscarNotas(busca, filtro === "todas" ? undefined : filtro);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, filtro, notas]);

  const notaSelecionada = notas.find((n) => n.id === selecionadaId) ?? null;

  function recarregar() {
    setNotas(listarNotas());
  }

  function handleNovaNota() {
    const assunto = filtro === "todas" ? "geral" : filtro;
    const nova = criarNota(assunto);
    recarregar();
    setSelecionadaId(nova.id);
    setMostrarHistorico(false);
  }

  function handleExcluir(id: string) {
    excluirNota(id);
    recarregar();
    if (selecionadaId === id) {
      const restantes = listarNotas();
      setSelecionadaId(restantes[0]?.id ?? null);
    }
  }

  return (
    <div className="grid gap-5 md:grid-cols-[300px_1fr]">
      {/* Coluna: lista de notas */}
      <div className="flex flex-col gap-3">
        <div className="ff-input-wrap">
          <Search className="h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar nas anotações..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="ff-input"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className="ff-badge transition"
              style={{
                background: filtro === f.id ? "rgba(79,70,229,0.1)" : "#F3F4F6",
                color: filtro === f.id ? "#4F46E5" : "#6B7280",
                border:
                  filtro === f.id ? "1px solid rgba(79,70,229,0.25)" : "1px solid transparent",
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <button onClick={handleNovaNota} className="ff-btn-primary w-full justify-center">
          <Plus className="h-4 w-4" /> Nova anotação
        </button>

        <div className="flex flex-col gap-2 overflow-y-auto" style={{ maxHeight: "55vh" }}>
          {notasFiltradas.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#E5E7EB] p-6 text-center text-sm text-[#9CA3AF]">
              Nenhuma anotação encontrada.
            </div>
          )}
          {notasFiltradas.map((n) => (
            <button
              key={n.id}
              onClick={() => {
                setSelecionadaId(n.id);
                setMostrarHistorico(false);
              }}
              className="ff-card flex flex-col items-start gap-1 p-3.5 text-left transition"
              style={{
                borderColor: selecionadaId === n.id ? "rgba(79,70,229,0.4)" : undefined,
                background: selecionadaId === n.id ? "rgba(79,70,229,0.05)" : undefined,
              }}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="truncate text-sm font-bold text-[#111118]">
                  {n.titulo || "Sem título"}
                </span>
              </div>
              <p className="line-clamp-2 text-xs text-[#9CA3AF]">{n.conteudo || "Nota vazia"}</p>
              <span className="mt-1 text-[11px] font-semibold text-[#C7C9D1]">
                {formatarData(n.atualizadaEm)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Coluna: editor */}
      <div className="ff-card p-5 md:p-6">
        {notaSelecionada ? (
          mostrarHistorico ? (
            <HistoricoNota
              nota={notaSelecionada}
              onFechar={() => setMostrarHistorico(false)}
              onRestaurado={() => {
                recarregar();
                setMostrarHistorico(false);
              }}
            />
          ) : (
            <EditorNota
              key={notaSelecionada.id}
              nota={notaSelecionada}
              onAtualizar={recarregar}
              onExcluir={() => handleExcluir(notaSelecionada.id)}
              onAbrirHistorico={() => setMostrarHistorico(true)}
            />
          )
        ) : (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-center text-[#9CA3AF]">
            <FileText className="h-10 w-10" />
            <p className="text-sm font-semibold">Crie sua primeira anotação para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EditorNota({
  nota,
  onAtualizar,
  onExcluir,
  onAbrirHistorico,
}: {
  nota: Nota;
  onAtualizar: () => void;
  onExcluir: () => void;
  onAbrirHistorico: () => void;
}) {
  const [titulo, setTitulo] = useState(nota.titulo);
  const [conteudo, setConteudo] = useState(nota.conteudo);
  const [assunto, setAssunto] = useState<Nota["assunto"]>(nota.assunto);

  const status = useAutosave({ titulo, conteudo, assunto }, (dados) => {
    atualizarNota(nota.id, dados);
    onAtualizar();
  });

  const statusLabel: Record<typeof status, string> = {
    ocioso: "",
    digitando: "Digitando…",
    salvando: "Salvando…",
    salvo: "Salvo automaticamente",
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da anotação"
          className="w-full border-none bg-transparent text-lg font-black text-[#111118] outline-none placeholder:text-[#C7C9D1]"
        />
        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={onAbrirHistorico}
            title="Ver histórico de versões"
            className="grid h-8 w-8 place-items-center rounded-lg text-[#9CA3AF] transition hover:bg-[#F3F4F6] hover:text-[#4F46E5]"
          >
            <History className="h-4 w-4" />
          </button>
          <button
            onClick={onExcluir}
            title="Excluir anotação"
            className="grid h-8 w-8 place-items-center rounded-lg text-[#9CA3AF] transition hover:bg-[rgba(220,38,38,0.08)] hover:text-[#DC2626]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {(["geral", "lei-1", "lei-2", "lei-3"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAssunto(a)}
            className="ff-badge transition"
            style={{
              background: assunto === a ? "rgba(79,70,229,0.1)" : "#F3F4F6",
              color: assunto === a ? "#4F46E5" : "#6B7280",
              cursor: "pointer",
            }}
          >
            {a === "geral" ? "Geral" : ASSUNTO_LABEL[a]}
          </button>
        ))}
      </div>

      <textarea
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
        placeholder="Escreva sua anotação aqui..."
        className="ff-input mt-4 flex-1 resize-none leading-relaxed"
        style={{ minHeight: "280px", paddingTop: "12px" }}
      />

      <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF]">
        {status === "salvando" ? (
          <Save className="h-3.5 w-3.5 animate-pulse text-[#4F46E5]" />
        ) : null}
        {status !== "ocioso" && status !== "digitando" && statusLabel[status]}
        {status === "digitando" && <span className="text-[#C7C9D1]">{statusLabel[status]}</span>}
      </div>
    </div>
  );
}

function HistoricoNota({
  nota,
  onFechar,
  onRestaurado,
}: {
  nota: Nota;
  onFechar: () => void;
  onRestaurado: () => void;
}) {
  const versoes = obterHistoricoDaNota(nota.id);

  function handleRestaurar(conteudo: string) {
    restaurarVersao(nota.id, conteudo);
    onRestaurado();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-[#111118]">
          <History className="h-4 w-4 text-[#4F46E5]" /> Histórico de "{nota.titulo}"
        </h3>
        <button
          onClick={onFechar}
          className="grid h-8 w-8 place-items-center rounded-lg text-[#9CA3AF] transition hover:bg-[#F3F4F6]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2.5" style={{ maxHeight: "420px", overflowY: "auto" }}>
        {versoes.length === 0 && (
          <p className="text-sm text-[#9CA3AF]">
            Ainda não há versões anteriores salvas para esta nota.
          </p>
        )}
        {versoes.map((v) => (
          <div key={v.salvoEm} className="rounded-2xl border border-[#E5E7EB] p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#9CA3AF]">
                {formatarData(v.salvoEm)}
              </span>
              <button
                onClick={() => handleRestaurar(v.conteudoAnterior)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4F46E5] transition hover:text-[#4338CA]"
              >
                <RotateCcw className="h-3 w-3" /> Restaurar esta versão
              </button>
            </div>
            <p className="mt-1.5 line-clamp-3 text-xs text-[#6B7280]">{v.conteudoAnterior}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
