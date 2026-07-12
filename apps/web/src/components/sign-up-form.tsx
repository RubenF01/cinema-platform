"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type SignUpErrors = {
  username?: string;
  password?: string;
  confirmPassword?: string;
};

export function SignUpForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: SignUpErrors = {};

    if (!username.trim()) {
      nextErrors.username = "Enter a username.";
    }

    if (!password) {
      nextErrors.password = "Enter a password.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (password && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      return;
    }

    setMessage("Sign up is not connected yet.");
  }

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <div>
        <label
          className="text-sm font-semibold text-zinc-200"
          htmlFor="username"
        >
          Username
        </label>
        <input
          autoComplete="username"
          className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          id="username"
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Choose a username"
          type="text"
          value={username}
        />
        {errors.username ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.username}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="text-sm font-semibold text-zinc-200"
          htmlFor="password"
        >
          Password
        </label>
        <input
          autoComplete="new-password"
          className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          id="password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Create a password"
          type="password"
          value={password}
        />
        {errors.password ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.password}
          </p>
        ) : null}
      </div>

      <div>
        <label
          className="text-sm font-semibold text-zinc-200"
          htmlFor="confirm-password"
        >
          Confirm password
        </label>
        <input
          autoComplete="new-password"
          className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
          id="confirm-password"
          name="confirmPassword"
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm your password"
          type="password"
          value={confirmPassword}
        />
        {errors.confirmPassword ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.confirmPassword}
          </p>
        ) : null}
      </div>

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        type="submit"
      >
        Create account
      </button>

      {message ? (
        <p className="rounded-md border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm font-medium text-amber-200">
          {message}
        </p>
      ) : null}

      <p className="text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          className="font-semibold text-amber-300 transition hover:text-amber-200"
          href="/sign-in"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
