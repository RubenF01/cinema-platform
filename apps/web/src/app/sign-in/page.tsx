import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in | Cimena",
  description: "Sign in to your Cimena account.",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(9,9,11,0.98), rgba(9,9,11,0.76)), url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85)",
          }}
        />
        <div className="relative z-10 w-full max-w-md">
          <Link
            className="mb-8 inline-flex items-center gap-3"
            href="/"
            aria-label="Cimena home"
          >
            <span className="grid size-9 place-items-center rounded-md bg-amber-400 text-sm font-black text-zinc-950">
              C
            </span>
            <span className="text-base font-semibold tracking-wide text-white">
              Cimena
            </span>
          </Link>

          <div className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-md sm:p-8">
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
                Welcome back
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
                Sign in
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Use your Cimena username and password. Account authentication
                will be connected later.
              </p>
            </div>

            <SignInForm />
          </div>
        </div>
      </section>
    </main>
  );
}
