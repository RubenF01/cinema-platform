"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSignIn } from "@/hooks/use-auth";
import { signInSchema, type SignInFormValues } from "@/lib/auth-schemas";

export function SignInForm() {
  const router = useRouter();
  const signInMutation = useSignIn();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  function onSubmit(values: SignInFormValues) {
    signInMutation.mutate(values, {
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
    });
  }

  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
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
          placeholder="you@example.com"
          type="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.email.message}
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
          placeholder="Enter your password"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-60"
        disabled={signInMutation.isPending}
        type="submit"
      >
        {signInMutation.isPending ? "Signing in..." : "Sign in"}
      </button>

      {signInMutation.isError ? (
        <p className="rounded-md border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm font-medium text-red-200">
          {signInMutation.error.message}
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
