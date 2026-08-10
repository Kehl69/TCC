import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { GravityWidget } from "@/components/gravity-widget";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-black text-grad">404</p>
      <h2 className="mt-4 text-2xl font-bold">Página não encontrada</h2>
      <p className="mt-2 text-sm text-muted-foreground">A página que você procura não existe.</p>
      <Link to="/" className="ff-btn-primary mt-8">
        Ir para o início
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-5xl">⚠️</div>
      <h1 className="text-xl font-bold">Algo deu errado</h1>
      <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte ao início.</p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="ff-btn-primary"
        >
          Tentar novamente
        </button>
        <a href="/" className="ff-btn-outline">
          Início
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FísicaFácil — Aprenda as Leis de Newton" },
      {
        name: "description",
        content:
          "Plataforma gratuita de Física para o ensino médio. Texto narrado, vídeo-aulas e acompanhamento de progresso.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <GravityWidget />
      </div>
    </QueryClientProvider>
  );
}
