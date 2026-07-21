"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { SiteHeader } from "@/components/site-header";
import {
  useCurrentUser,
  useSignOut,
  useUpdateEmail,
  useUpdatePassword,
} from "@/hooks/use-auth";
import {
  updateEmailSchema,
  type UpdateEmailFormValues,
  updatePasswordSchema,
  type UpdatePasswordFormValues,
} from "@/lib/auth-schemas";

type AccountSection =
  | "profile"
  | "security"
  | "orders"
  | "watchlist"
  | "favorites";

const accountSections: { id: AccountSection; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "orders", label: "Orders" },
  { id: "watchlist", label: "Watchlist" },
  { id: "favorites", label: "Favorites" },
];

export function AccountPanel() {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const user = currentUser.isSuccess ? currentUser.data : null;
  const [activeSection, setActiveSection] =
    useState<AccountSection>("profile");

  useEffect(() => {
    if (currentUser.isSuccess && !user) {
      router.replace("/sign-in");
    }
  }, [currentUser.isSuccess, router, user]);

  if (currentUser.isLoading || (currentUser.isSuccess && !user)) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <SiteHeader />
        <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-5 text-sm font-semibold text-zinc-300">
            Loading account...
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 border-b border-zinc-800 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
              Cimena account
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Account
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Manage your profile, security settings, purchase history, and
              saved movie lists.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
              Signed in as
            </p>
            <p className="mt-1 max-w-72 truncate text-sm font-semibold text-white">
              {user.email}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <AccountNavigation
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
          <div>
            {activeSection === "profile" ? (
              <ProfileSection createdAt={user.created_at} email={user.email} />
            ) : null}
            {activeSection === "security" ? <SecuritySection /> : null}
            {activeSection === "orders" ? (
              <EmptyAccountSection
                description="Completed ticket purchases will appear here once checkout history is connected."
                title="No orders yet"
              />
            ) : null}
            {activeSection === "watchlist" ? (
              <EmptyAccountSection
                description="Save upcoming releases and movies you want to watch when watchlist support is connected."
                title="Your watchlist is empty"
              />
            ) : null}
            {activeSection === "favorites" ? (
              <EmptyAccountSection
                description="Favorite movies will live here once saved movie preferences are connected."
                title="No favorites yet"
              />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function AccountNavigation({
  activeSection,
  setActiveSection,
}: {
  activeSection: AccountSection;
  setActiveSection: (section: AccountSection) => void;
}) {
  return (
    <nav aria-label="Account sections">
      <div className="flex gap-2 overflow-x-auto border-b border-zinc-800 pb-3 lg:hidden">
        {accountSections.map((section) => (
          <button
            className={`min-h-10 shrink-0 rounded-md px-4 text-sm font-semibold transition ${
              activeSection === section.id
                ? "bg-amber-400 text-zinc-950"
                : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            type="button"
          >
            {section.label}
          </button>
        ))}
      </div>
      <div className="hidden rounded-lg border border-zinc-800 bg-zinc-900 p-2 lg:block">
        {accountSections.map((section) => (
          <button
            className={`mb-1 flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm font-semibold transition last:mb-0 ${
              activeSection === section.id
                ? "bg-amber-400 text-zinc-950"
                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
            }`}
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            type="button"
          >
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

function ProfileSection({
  createdAt,
  email,
}: {
  createdAt: string;
  email: string;
}) {
  const updateEmail = useUpdateEmail();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const createdDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
      }).format(new Date(createdAt)),
    [createdAt],
  );
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email,
      password: "",
    },
  });

  useEffect(() => {
    reset({
      email,
      password: "",
    });
  }, [email, reset]);

  function onSubmit(values: UpdateEmailFormValues) {
    setSuccessMessage(null);
    updateEmail.mutate(values, {
      onSuccess: () => {
        setSuccessMessage("Email updated.");
        reset({
          email: values.email,
          password: "",
        });
      },
    });
  }

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20 sm:p-6">
      <SectionHeader
        description="Keep your account email current. Your current password is required before changing it."
        eyebrow="Profile"
        title="Account information"
      />

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <AccountFact label="Email" value={email} />
        <AccountFact label="Member since" value={createdDate} />
      </dl>

      <form
        className="mt-8 grid gap-5"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <FormField
          autoComplete="email"
          error={errors.email?.message}
          label="New email"
          placeholder="you@example.com"
          registerProps={register("email")}
          type="email"
        />
        <FormField
          autoComplete="current-password"
          error={errors.password?.message}
          label="Current password"
          placeholder="Enter your current password"
          registerProps={register("password")}
          type="password"
        />
        <button
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-60 sm:w-fit"
          disabled={updateEmail.isPending}
          type="submit"
        >
          {updateEmail.isPending ? "Updating email..." : "Update email"}
        </button>
        <MutationMessage
          error={updateEmail.isError ? updateEmail.error.message : null}
          success={successMessage}
        />
      </form>
    </section>
  );
}

function SecuritySection() {
  const router = useRouter();
  const updatePassword = useUpdatePassword();
  const signOut = useSignOut();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
  });

  function onSubmit(values: UpdatePasswordFormValues) {
    setSuccessMessage(null);
    updatePassword.mutate(
      {
        current_password: values.currentPassword,
        new_password: values.newPassword,
      },
      {
        onSuccess: () => {
          reset();
          setSuccessMessage("Password updated.");
        },
      },
    );
  }

  function handleSignOut() {
    signOut.mutate(undefined, {
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
    });
  }

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 shadow-xl shadow-black/20 sm:p-6">
      <SectionHeader
        description="Change your password or end your current session."
        eyebrow="Security"
        title="Password and session"
      />

      <form
        className="mt-6 grid gap-5"
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
      >
        <FormField
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          label="Current password"
          placeholder="Enter your current password"
          registerProps={register("currentPassword")}
          type="password"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            autoComplete="new-password"
            error={errors.newPassword?.message}
            label="New password"
            placeholder="Create a new password"
            registerProps={register("newPassword")}
            type="password"
          />
          <FormField
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            label="Confirm new password"
            placeholder="Confirm your new password"
            registerProps={register("confirmPassword")}
            type="password"
          />
        </div>
        <button
          className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-60 sm:w-fit"
          disabled={updatePassword.isPending}
          type="submit"
        >
          {updatePassword.isPending ? "Updating password..." : "Update password"}
        </button>
        <MutationMessage
          error={updatePassword.isError ? updatePassword.error.message : null}
          success={successMessage}
        />
      </form>

      <div className="mt-8 border-t border-zinc-800 pt-6">
        <h3 className="text-base font-bold text-white">Current session</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
          Sign out of this browser when you are finished managing your account.
        </p>
        <button
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-amber-300 hover:text-zinc-950 disabled:pointer-events-none disabled:opacity-60"
          disabled={signOut.isPending}
          onClick={handleSignOut}
          type="button"
        >
          {signOut.isPending ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </section>
  );
}

function EmptyAccountSection({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/70 p-8 text-center shadow-xl shadow-black/20">
      <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400">
        {description}
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-amber-400 px-4 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
        href="/#movies"
      >
        Browse movies
      </Link>
    </section>
  );
}

function SectionHeader({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
        {description}
      </p>
    </div>
  );
}

function AccountFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-semibold text-white">
        {value}
      </dd>
    </div>
  );
}

function FormField({
  autoComplete,
  error,
  label,
  placeholder,
  registerProps,
  type,
}: {
  autoComplete: string;
  error?: string;
  label: string;
  placeholder: string;
  registerProps: UseFormRegisterReturn;
  type: "email" | "password";
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div>
      <label className="text-sm font-semibold text-zinc-200" htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
        id={id}
        placeholder={placeholder}
        type={type}
        {...registerProps}
      />
      {error ? (
        <p className="mt-2 text-sm font-medium text-red-300">{error}</p>
      ) : null}
    </div>
  );
}

function MutationMessage({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (error) {
    return (
      <p className="rounded-md border border-red-300/30 bg-red-300/10 px-4 py-3 text-sm font-medium text-red-200">
        {error}
      </p>
    );
  }

  if (success) {
    return (
      <p className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-4 py-3 text-sm font-medium text-emerald-200">
        {success}
      </p>
    );
  }

  return null;
}
