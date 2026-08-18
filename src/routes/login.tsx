import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="relative grid min-h-dvh place-items-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="label-micro inline-flex items-center gap-2 text-signal">
          <span className="led" />
          RAD Protocol · signed session
        </p>
        <h1 className="mt-6 text-4xl font-medium tracking-tight text-fg sm:text-5xl">
          Trust nothing.
          <br />
          Verify <span className="text-signal">everything.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Sign in to persist marks across devices. Encoding itself never requires an account — the payload never leaves this browser unless you save it.
        </p>
        <div className="mx-auto mt-8 flex w-full max-w-xs flex-col gap-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <Button key={p.providerId} type="button" variant="secondary" size="lg" onClick={() => void signIn(p.providerId, { callbackURL: "/" })}>
                Continue with {p.label}
              </Button>
            ))
          ) : (
            <p className="text-sm text-subtle">Sign-in is disabled.</p>
          )}
          <Button asChild variant="ghost" size="sm">
            <Link to="/">Encode without an account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
