import { getApiBaseUrl } from "@/lib/env";

export default function Home() {
  const apiBaseUrl = getApiBaseUrl();

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-2xl space-y-8 rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
            Hackathon Juin 2026
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Frontend Next.js
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            Projet initialisé sur la branche{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
              frontend
            </code>
            . Le backend Spring Boot est sur la branche{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
              backend
            </code>
            .
          </p>
        </div>

        <section className="space-y-3 rounded-xl bg-zinc-50 p-5 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Connexion API
          </h2>
          <dl className="grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex flex-wrap gap-2">
              <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                Base URL :
              </dt>
              <dd>
                <code className="break-all rounded bg-white px-2 py-1 dark:bg-zinc-900">
                  {apiBaseUrl}
                </code>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-zinc-700 dark:text-zinc-300">
                Proxy dev
              </dt>
              <dd className="mt-1">
                Les routes <code>/api/*</code> sont proxifiées vers le backend
                (port 8080).
              </dd>
            </div>
          </dl>
        </section>

        <ul className="list-inside list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            Copier <code>.env.local.example</code> vers{" "}
            <code>.env.local</code>
          </li>
          <li>
            Lancer le backend :{" "}
            <code>./mvnw spring-boot:run</code> (branche backend)
          </li>
          <li>
            Appels HTTP via <code>src/lib/api/client.ts</code>
          </li>
        </ul>
      </main>
    </div>
  );
}
