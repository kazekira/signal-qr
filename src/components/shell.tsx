import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import { cn } from "@/lib/cn";
import { Button } from "./ui/button";

const NAV = [
  { to: "/", label: "Encode" },
  { to: "/history", label: "History" },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-4 pb-24 pt-5 sm:px-6 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="led" aria-hidden />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-fg">
            Signal
          </span>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.14em] text-subtle sm:inline">
            v1.0.0 · encodes live
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-150",
                  active ? "text-fg" : "text-subtle hover:text-muted",
                )}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-signal" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <AuthSlot />
      </header>

      <main className="mt-10 flex flex-1 flex-col">{children}</main>

      <footer className="mt-16 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
        <span className="led-cyan led size-1.5" />
        <span className="text-cyan">All systems live</span>
        <span>·</span>
        <span>© 2026 RAD Protocol</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">No ceremony</span>
      </footer>
    </div>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-24 animate-pulse rounded-btn bg-raised" />;
  }
  return (
    <>
      <SignedOut>
        <Button asChild variant="secondary" size="sm">
          <Link to="/login">Sign in</Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-2">
          <span className="hidden max-w-36 truncate font-mono text-[11px] uppercase tracking-[0.1em] text-muted sm:inline">
            {user?.displayName ?? user?.primaryEmail ?? "Account"}
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </SignedIn>
    </>
  );
}
