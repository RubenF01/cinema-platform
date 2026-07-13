import type { Metadata } from "next";
import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";

export const metadata: Metadata = {
  title: "Create account | Cimena",
  description: "Create your Cimena account.",
};

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(9,9,11,0.98), rgba(9,9,11,0.76)), url(https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1800&q=85)",
          }}
        />
        <div className="relative z-10 w-full max-w-md">
          <Link
            aria-label="Cimena home"
            className="mb-8 inline-flex items-center gap-3"
            href="/"
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
                Join Cimena
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
                Create account
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Create an account with your email and password to save your
                movie plans.
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </section>
    </main>
  );
}
