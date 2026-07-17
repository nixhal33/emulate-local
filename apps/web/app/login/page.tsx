import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionValue } from "@/lib/auth-shared";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const cookieStore = await cookies();
  const authed = await verifySessionValue(cookieStore.get("emulate-admin-session")?.value);
  if (authed) {
    redirect("/");
  }

  const hasError = searchParams?.error === "1";

  return (
    <main className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(17,24,39,0.1),_transparent_22%),linear-gradient(135deg,_#050816,_#0b1220_55%,_#03060d)] px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/8 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <div className="mb-6 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
              Admin access
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-6xl">
              One password opens the dashboard.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              This host is locked behind a permanent admin account. Sign in once and the dashboard stays open with a
              secure session cookie.
            </p>

            <form action="/api/auth/login" method="post" className="mt-10 max-w-md space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  value="admin"
                  readOnly
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/8 px-4 text-white outline-none ring-0"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full rounded-2xl border border-white/10 bg-white/8 px-4 text-white outline-none ring-0"
                />
              </div>
              {hasError ? (
                <p className="text-sm text-rose-300">Invalid admin password.</p>
              ) : (
                <p className="text-sm text-slate-400">Use the admin password configured on the server.</p>
              )}
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 font-medium text-slate-950 transition hover:bg-slate-100"
              >
                Enter dashboard
              </button>
            </form>
          </section>

          <aside className="rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
            <h2 className="text-xl font-semibold">Security notes</h2>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-slate-300">
              <li>Admin username is fixed to `admin`.</li>
              <li>The password is checked on the server and never stored in the browser.</li>
              <li>After login, a signed HttpOnly cookie carries the session.</li>
              <li>Use HTTPS in production so the cookie is marked `Secure`.</li>
            </ul>
          </aside>
        </div>
      </div>
    </main>
  );
}
