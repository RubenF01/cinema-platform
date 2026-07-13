"use client";

import { signIn } from "@cimena/api-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type SignInErrors = {
  email?: string;
  password?: string;
};

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<SignInErrors>({});
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SignInErrors = {};
    const normalizedEmail = email.trim();
    setServerError("");

    if (!normalizedEmail) {
      nextErrors.email = "Enter your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({
        email: normalizedEmail,
        password,
      });
      setMessage("Signed in successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      setMessage("");
      setServerError(
        error instanceof Error ? error.message : "Sign in failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <div>
        <label className="text-sm font-semibold text-zinc-200" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          id="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={email}
        />
        {errors.email ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            className="text-sm font-semibold text-zinc-200"
            htmlFor="password"
          >
            Password
          </label>
          <a
            className="text-sm font-semibold text-zinc-400 transition hover:text-amber-300"
            href="#"
          >
            Forgot password?
          </a>
        </div>
        <input
          autoComplete="current-password"
          className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter your password"
          type="password"
          value={password}
        />
        {errors.password ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.password}
          </p>
        ) : null}
      </div>

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>

      {serverError ? (
        <p className="rounded-md border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm font-medium text-red-200">
          {serverError}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-md border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-200">
          {message}
        </p>
      ) : null}

      <p className="text-center text-sm text-zinc-400">
        Don&apos;t have an account?{" "}
        <Link
          className="font-semibold text-amber-300 transition hover:text-amber-200"
          href="/sign-up"
        >
          Create account
        </Link>
      </p>
    </form>
  );
}
