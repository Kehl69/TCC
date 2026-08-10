import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NewtonLesson, type LessonContent } from "@/components/newton-lesson";
import { LeiBlockedScreen } from "@/components/lei-blocked-screen";
import { obterStatusLei, CURRICULO, type StatusLei } from "@/lib/profile/curriculo";
import { percentualLicao } from "@/lib/profile/lesson-progress";

const lesson: LessonContent = {
  number: "3ª",
  title: "Princípio da Ação e Reação",
  subtitle: "Por que toda força aplicada gera uma força de resposta?",
  statement:
    "A toda ação corresponde uma reação de mesma intensidade, mesma direção e sentido oposto.",
  summary: {
    keyPoint:
      "Toda força vem em par: se você empurra algo, esse algo te empurra de volta — com a mesma força.",
    bullets: [
      "As duas forças do par agem em corpos DIFERENTES — por isso elas não se cancelam.",
      "Mesma intensidade, mesma direção, sentidos opostos. Sempre.",
      "Explica foguetes, caminhar e o recuo de uma arma — todos são pares ação-reação.",
      "Erro comum: achar que o par de forças se anula. Elas só se anulariam se atuassem no mesmo corpo.",
    ],
  },
  paragraphs: [
    "A 3ª Lei de Newton afirma que as forças sempre aparecem aos pares. Quando um corpo A exerce uma força sobre um corpo B, simultaneamente o corpo B exerce sobre A uma força de mesmo módulo, mesma direção, mas em sentido contrário.",
    "É importante notar que essas forças atuam em corpos diferentes — por isso elas não se anulam, mesmo tendo intensidades iguais. Cada uma produz efeito sobre o corpo em que é aplicada.",
    "Esse princípio explica fenômenos como a propulsão de foguetes, a caminhada e o recuo de uma arma de fogo: em todos os casos, há um par de forças do tipo ação-reação.",
  ],
  examples: [
    { title: "Caminhar", desc: "Você empurra o chão para trás e o chão te empurra para a frente." },
    { title: "Foguete", desc: "Os gases são lançados para baixo; a reação empurra o foguete para cima." },
    { title: "Remo no barco", desc: "O remo empurra a água para trás; a água empurra o barco para a frente." },
    { title: "Saltar de um barco", desc: "Ao pular para a frente, o barco se desloca para trás." },
  ],
  prev: { to: "/lei-2", label: "Anterior: 2ª Lei" },
};

function Lei3Page() {
  const [status, setStatus] = useState<StatusLei>("bloqueada");
  const [pctPrereq, setPctPrereq] = useState(0);

  useEffect(() => {
    setStatus(obterStatusLei("lei-3"));
    setPctPrereq(percentualLicao("lei-2"));
  }, []);

  const infoLei3 = CURRICULO.find((c) => c.assunto === "lei-3")!;
  const infoLei2 = CURRICULO.find((c) => c.assunto === "lei-2")!;

  if (status === "bloqueada") {
    return (
      <LeiBlockedScreen
        leiAtual={infoLei3}
        leiPrerequisito={infoLei2}
        percentualPrerequisito={pctPrereq}
      />
    );
  }
  return <NewtonLesson lesson={lesson} />;
}

export const Route = createFileRoute("/lei-3")({
  head: () => ({
    meta: [
      { title: "3ª Lei de Newton — Ação e Reação | FisicaFácil" },
      { name: "description", content: "Aprenda a 3ª Lei de Newton com texto narrado em áudio e vídeo-aula." },
    ],
  }),
  component: Lei3Page,
});
