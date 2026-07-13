"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSignUp } from "@/hooks/use-auth";
import { signUpSchema, type SignUpFormValues } from "@/lib/auth-schemas";

export function SignUpForm() {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  function onSubmit(values: SignUpFormValues) {
    signUpMutation.mutate(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    );
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
          placeholder="Create a password"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.password.message}
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
          placeholder="Confirm your password"
          type="password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword ? (
          <p className="mt-2 text-sm font-medium text-red-300">
            {errors.confirmPassword.message}
          </p>
        ) : null}
      </div>

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-60"
        disabled={signUpMutation.isPending}
        type="submit"
      >
        {signUpMutation.isPending ? "Creating account..." : "Create account"}
      </button>

      {signUpMutation.isError ? (
        <p className="rounded-md border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm font-medium text-red-200">
          {signUpMutation.error.message}
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
