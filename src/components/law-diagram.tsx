type AssuntoVisual = "lei-1" | "lei-2" | "lei-3";

/**
 * Explicação visual — diagrama estático (SVG), complementar à animação.
 * Pensado para quem aprende melhor vendo a relação entre forças e
 * vetores de uma vez, sem precisar esperar uma simulação rodar.
 */
export function LawDiagram({ assunto }: { assunto: AssuntoVisual }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
      {assunto === "lei-1" && <DiagramaLei1 />}
      {assunto === "lei-2" && <DiagramaLei2 />}
      {assunto === "lei-3" && <DiagramaLei3 />}
    </div>
  );
}

function DiagramaLei1() {
  return (
    <svg viewBox="0 0 600 280" className="w-full">
      <rect x="0" y="0" width="600" height="280" fill="#F9FAFB" rx="12" />

      {/* Cenário A: repouso */}
      <text x="150" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">
        Repouso (ΣF = 0)
      </text>
      <line x1="40" y1="170" x2="260" y2="170" stroke="#D1D5DB" strokeWidth="2" />
      <rect x="120" y="130" width="60" height="40" rx="8" fill="#1D4ED8" />
      <text x="150" y="154" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
        m
      </text>
      {/* Vetores peso/normal equilibrados */}
      <line
        x1="150"
        y1="130"
        x2="150"
        y2="100"
        stroke="#6B7280"
        strokeWidth="2"
        markerEnd="url(#arrow-gray)"
      />
      <text x="160" y="105" fontSize="11" fill="#6B7280">
        N
      </text>
      <line
        x1="150"
        y1="170"
        x2="150"
        y2="200"
        stroke="#6B7280"
        strokeWidth="2"
        markerEnd="url(#arrow-gray)"
      />
      <text x="160" y="200" fontSize="11" fill="#6B7280">
        P
      </text>

      {/* Cenário B: MRU sem força */}
      <text x="450" y="36" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">
        Movimento (v = cte, sem força)
      </text>
      <line x1="340" y1="170" x2="560" y2="170" stroke="#D1D5DB" strokeWidth="2" />
      <rect x="380" y="130" width="60" height="40" rx="8" fill="#4F46E5" />
      <text x="410" y="154" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
        m
      </text>
      <line
        x1="450"
        y1="150"
        x2="500"
        y2="150"
        stroke="#16A34A"
        strokeWidth="3"
        markerEnd="url(#arrow-green)"
      />
      <text x="475" y="138" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16A34A">
        v
      </text>

      <line
        x1="300"
        y1="40"
        x2="300"
        y2="240"
        stroke="#E5E7EB"
        strokeWidth="1"
        strokeDasharray="4 4"
      />

      <defs>
        <marker id="arrow-gray" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#6B7280" />
        </marker>
        <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#16A34A" />
        </marker>
      </defs>
    </svg>
  );
}

function DiagramaLei2() {
  return (
    <svg viewBox="0 0 600 280" className="w-full">
      <rect x="0" y="0" width="600" height="280" fill="#F9FAFB" rx="12" />
      <text x="300" y="32" textAnchor="middle" fontSize="14" fontWeight="800" fill="#4F46E5">
        F = m · a
      </text>

      {/* Bloco leve */}
      <rect x="60" y="80" width="50" height="50" rx="8" fill="#16A34A" />
      <text x="85" y="109" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
        m
      </text>
      <line
        x1="110"
        y1="105"
        x2="170"
        y2="105"
        stroke="#FBBF24"
        strokeWidth="4"
        markerEnd="url(#arrow-yellow)"
      />
      <text x="140" y="92" textAnchor="middle" fontSize="12" fontWeight="700" fill="#B45309">
        F
      </text>
      <line
        x1="190"
        y1="100"
        x2="260"
        y2="100"
        stroke="#16A34A"
        strokeWidth="3"
        markerEnd="url(#arrow-green2)"
      />
      <text x="225" y="86" textAnchor="middle" fontSize="11" fontWeight="700" fill="#16A34A">
        a grande
      </text>

      {/* Bloco pesado, mesma força */}
      <rect x="60" y="180" width="80" height="60" rx="8" fill="#B45309" />
      <text x="100" y="214" textAnchor="middle" fontSize="12" fontWeight="700" fill="white">
        3m
      </text>
      <line
        x1="140"
        y1="210"
        x2="200"
        y2="210"
        stroke="#FBBF24"
        strokeWidth="4"
        markerEnd="url(#arrow-yellow)"
      />
      <text x="170" y="197" textAnchor="middle" fontSize="12" fontWeight="700" fill="#B45309">
        F
      </text>
      <line
        x1="220"
        y1="207"
        x2="245"
        y2="207"
        stroke="#D97706"
        strokeWidth="3"
        markerEnd="url(#arrow-orange)"
      />
      <text x="270" y="211" fontSize="11" fontWeight="700" fill="#D97706">
        a pequena
      </text>

      <text x="420" y="120" fontSize="12" fill="#374151">
        Mesma força, massa 3×
      </text>
      <text x="420" y="140" fontSize="12" fill="#374151">
        → aceleração 3× menor
      </text>

      <defs>
        <marker id="arrow-yellow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#FBBF24" />
        </marker>
        <marker id="arrow-green2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#16A34A" />
        </marker>
        <marker id="arrow-orange" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#D97706" />
        </marker>
      </defs>
    </svg>
  );
}

function DiagramaLei3() {
  return (
    <svg viewBox="0 0 600 280" className="w-full">
      <rect x="0" y="0" width="600" height="280" fill="#F9FAFB" rx="12" />
      <text x="300" y="32" textAnchor="middle" fontSize="13" fontWeight="700" fill="#374151">
        Ação e reação — mesma intensidade, sentidos opostos
      </text>

      <rect x="220" y="110" width="60" height="60" rx="8" fill="#F87171" />
      <text x="250" y="144" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
        A
      </text>

      <rect x="320" y="110" width="60" height="60" rx="8" fill="#60A5FA" />
      <text x="350" y="144" textAnchor="middle" fontSize="13" fontWeight="700" fill="white">
        B
      </text>

      {/* Força de A sobre B (para a direita) */}
      <line
        x1="280"
        y1="130"
        x2="330"
        y2="130"
        stroke="#DC2626"
        strokeWidth="3"
        markerEnd="url(#arrow-red)"
      />
      <text x="305" y="118" textAnchor="middle" fontSize="11" fontWeight="700" fill="#DC2626">
        F(A→B)
      </text>

      {/* Força de B sobre A (para a esquerda) */}
      <line
        x1="320"
        y1="155"
        x2="270"
        y2="155"
        stroke="#2563EB"
        strokeWidth="3"
        markerEnd="url(#arrow-blue)"
      />
      <text x="295" y="172" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563EB">
        F(B→A)
      </text>

      <text x="300" y="230" textAnchor="middle" fontSize="12" fill="#6B7280">
        |F(A→B)| = |F(B→A)| — mesmas intensidade e direção, sentidos opostos
      </text>

      <defs>
        <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#DC2626" />
        </marker>
        <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#2563EB" />
        </marker>
      </defs>
    </svg>
  );
}
