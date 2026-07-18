"use client";

import Link from "next/link";
import {
  type FormEvent,
  type MutableRefObject,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Movie, ScreeningDay } from "@/data/movies";
import {
  allConcessionProducts,
  concessionCategories,
  convenienceFeeCents,
  getSeatPriceCents,
  occupiedSeatIds,
  salesTaxRate,
  seatRows,
  type ConcessionProduct,
  type Seat,
} from "@/data/purchase";
import { useCurrentUser, useSignIn, useSignUp } from "@/hooks/use-auth";

type PurchaseStep = "seats" | "concessions" | "cart" | "payment";
type Quantities = Record<string, number>;

type PurchaseFlowProps = {
  movie: Movie;
  screeningDays: ScreeningDay[];
  initialDayIndex: number;
  initialTime: string;
};

type Totals = {
  ticketSubtotalCents: number;
  concessionsSubtotalCents: number;
  convenienceFeeCents: number;
  taxCents: number;
  totalCents: number;
};

const steps: { id: PurchaseStep; label: string }[] = [
  { id: "seats", label: "Seats" },
  { id: "concessions", label: "Food & drink" },
  { id: "cart", label: "Cart" },
  { id: "payment", label: "Payment" },
];

export function PurchaseFlow({
  movie,
  screeningDays,
  initialDayIndex,
  initialTime,
}: PurchaseFlowProps) {
  const currentUser = useCurrentUser();
  const user = currentUser.isSuccess ? currentUser.data : null;
  const [activeStep, setActiveStep] = useState<PurchaseStep>("seats");
  const [selectedDayIndex, setSelectedDayIndex] = useState(initialDayIndex);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Quantities>({});
  const [isConfirmed, setIsConfirmed] = useState(false);

  const fallbackDay = screeningDays[0];

  if (!fallbackDay) {
    throw new Error("Purchase flow requires at least one screening day.");
  }

  const selectedDay = screeningDays[selectedDayIndex] ?? fallbackDay;
  const seats = useMemo(() => seatRows.flat(), []);
  const selectedSeats = selectedSeatIds
    .map((seatId) => seats.find((seat) => seat.id === seatId))
    .filter((seat): seat is Seat => Boolean(seat));
  const cartItems = allConcessionProducts
    .map((product) => ({
      product,
      quantity: quantities[product.id] ?? 0,
    }))
    .filter((item) => item.quantity > 0);
  const totals = getTotals(selectedSeats, quantities);

  function toggleSeat(seat: Seat) {
    if (occupiedSeatIds.has(seat.id)) {
      return;
    }

    setSelectedSeatIds((currentSeats) =>
      currentSeats.includes(seat.id)
        ? currentSeats.filter((seatId) => seatId !== seat.id)
        : [...currentSeats, seat.id],
    );
  }

  function changeConcessionQuantity(productId: string, delta: number) {
    setQuantities((currentQuantities) => {
      const nextQuantity = Math.max(
        0,
        (currentQuantities[productId] ?? 0) + delta,
      );
      return {
        ...currentQuantities,
        [productId]: nextQuantity,
      };
    });
  }

  function selectShowtime(nextTime: string) {
    setSelectedTime(nextTime);
    setSelectedSeatIds([]);
    setActiveStep("seats");
  }

  function goToStep(step: PurchaseStep) {
    if (step === "concessions" && (!user || selectedSeatIds.length === 0)) {
      return;
    }

    if (
      (step === "cart" || step === "payment") &&
      selectedSeatIds.length === 0
    ) {
      return;
    }

    setActiveStep(step);
  }

  const leftColumn =
    activeStep === "concessions" ? (
      <CategoryRail />
    ) : (
      <MovieContextColumn
        movie={movie}
        screeningDays={screeningDays}
        selectedDay={selectedDay}
        selectedDayIndex={selectedDayIndex}
        selectedTime={selectedTime}
        setSelectedDayIndex={setSelectedDayIndex}
        selectShowtime={selectShowtime}
      />
    );

  const cart = (
    <CartSidebar
      cartItems={cartItems}
      selectedSeats={selectedSeats}
      totals={totals}
      primaryAction={
        activeStep === "seats"
          ? {
              label: "Continue",
              onClick: () => setActiveStep("concessions"),
              disabled: !user || selectedSeatIds.length === 0,
              helper: !user
                ? "Sign in to continue."
                : selectedSeatIds.length === 0
                  ? "Select at least one seat."
                  : undefined,
            }
          : activeStep === "concessions"
            ? {
                label: "Review cart",
                onClick: () => setActiveStep("cart"),
                disabled: selectedSeatIds.length === 0,
              }
            : activeStep === "cart"
              ? {
                  label: "Continue to payment",
                  onClick: () => setActiveStep("payment"),
                  disabled: selectedSeatIds.length === 0,
                }
              : undefined
      }
    />
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="border-b border-white/10 bg-zinc-950/95">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              className="inline-flex items-center gap-3"
              href={`/movies/${movie.id}`}
            >
              <span className="grid size-9 place-items-center rounded-md bg-amber-400 text-sm font-black text-zinc-950">
                C
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">
                  Cimena checkout
                </span>
                <span className="block text-xs font-medium text-zinc-500">
                  Back to movie details
                </span>
              </span>
            </Link>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{movie.title}</p>
              <p className="mt-1 text-xs font-medium text-zinc-500">
                {selectedDay.label}, {selectedDay.date} at {selectedTime}
              </p>
            </div>
          </div>
          <StepProgress activeStep={activeStep} goToStep={goToStep} />
        </div>
      </div>

      {isConfirmed ? (
        <ConfirmationState
          cartItems={cartItems}
          movie={movie}
          selectedDay={selectedDay}
          selectedSeats={selectedSeats}
          selectedTime={selectedTime}
          totals={totals}
        />
      ) : activeStep === "cart" ? (
        <TwoColumnShell
          main={
            <CartReviewStep
              cartItems={cartItems}
              changeConcessionQuantity={changeConcessionQuantity}
              movie={movie}
              selectedDay={selectedDay}
              selectedSeats={selectedSeats}
              selectedTime={selectedTime}
              setActiveStep={setActiveStep}
            />
          }
          right={cart}
        />
      ) : activeStep === "payment" ? (
        <TwoColumnShell
          main={
            <PaymentStep
              onBack={() => setActiveStep("cart")}
              onSubmit={() => setIsConfirmed(true)}
            />
          }
          right={
            <CartSidebar
              cartItems={cartItems}
              selectedSeats={selectedSeats}
              totals={totals}
            />
          }
        />
      ) : (
        <ThreeColumnShell
          left={leftColumn}
          main={
            activeStep === "seats" ? (
              <SeatsStep
                isLoadingUser={currentUser.isLoading}
                selectedSeats={selectedSeatIds}
                toggleSeat={toggleSeat}
                userEmail={user?.email}
              />
            ) : (
              <ConcessionsStep
                changeConcessionQuantity={changeConcessionQuantity}
                quantities={quantities}
                setActiveStep={setActiveStep}
              />
            )
          }
          right={cart}
        />
      )}
    </main>
  );
}

function StepProgress({
  activeStep,
  goToStep,
}: {
  activeStep: PurchaseStep;
  goToStep: (step: PurchaseStep) => void;
}) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);

  return (
    <nav aria-label="Checkout progress" className="grid gap-2 sm:grid-cols-4">
      {steps.map((step, index) => {
        const isActive = step.id === activeStep;
        const isComplete = index < activeIndex;

        return (
          <button
            className={[
              "min-h-11 rounded-md border px-3 text-left text-sm font-bold transition",
              isActive
                ? "border-amber-300 bg-amber-300 text-zinc-950"
                : isComplete
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100 hover:border-emerald-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white",
            ].join(" ")}
            key={step.id}
            onClick={() => goToStep(step.id)}
            type="button"
          >
            <span className="mr-2 text-xs">{index + 1}</span>
            {step.label}
          </button>
        );
      })}
    </nav>
  );
}

function ThreeColumnShell({
  left,
  main,
  right,
}: {
  left: React.ReactNode;
  main: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:px-8">
      <aside className="lg:sticky lg:top-6 lg:h-fit">{left}</aside>
      <div className="min-w-0">{main}</div>
      <aside className="lg:sticky lg:top-6 lg:h-fit">{right}</aside>
    </section>
  );
}

function TwoColumnShell({
  main,
  right,
}: {
  main: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-[1320px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <div className="min-w-0">{main}</div>
      <aside className="lg:sticky lg:top-6 lg:h-fit">{right}</aside>
    </section>
  );
}

function MovieContextColumn({
  movie,
  screeningDays,
  selectedDay,
  selectedDayIndex,
  selectedTime,
  setSelectedDayIndex,
  selectShowtime,
}: {
  movie: Movie;
  screeningDays: ScreeningDay[];
  selectedDay: ScreeningDay;
  selectedDayIndex: number;
  selectedTime: string;
  setSelectedDayIndex: (dayIndex: number) => void;
  selectShowtime: (time: string) => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-4">
      <div
        className="aspect-[3/4] rounded-md bg-cover bg-center"
        style={{ backgroundImage: `url(${movie.posterImage})` }}
      />
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
          Your movie
        </p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-white">
          {movie.title}
        </h1>
        <div className="mt-4 grid gap-2 text-sm text-zinc-300">
          <p>
            {movie.rating} / {movie.duration}
          </p>
          <p>{movie.format}</p>
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Selected time
        </p>
        <p className="mt-2 text-lg font-black text-white">
          {selectedDay.label}, {selectedDay.date}
        </p>
        <p className="mt-1 text-3xl font-black text-amber-300">
          {selectedTime}
        </p>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Other times today
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedDay.times.map((time) => (
            <button
              className={[
                "min-h-10 rounded-md border px-3 text-sm font-bold transition",
                time === selectedTime
                  ? "border-amber-300 bg-amber-300 text-zinc-950"
                  : "border-zinc-700 text-zinc-100 hover:border-amber-300 hover:text-amber-200",
              ].join(" ")}
              key={time}
              onClick={() => selectShowtime(time)}
              type="button"
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Change day
        </p>
        <div className="mt-3 grid gap-2">
          {screeningDays.map((day, index) => (
            <button
              className={[
                "min-h-10 rounded-md border px-3 text-left text-sm font-semibold transition",
                index === selectedDayIndex
                  ? "border-zinc-500 bg-zinc-800 text-white"
                  : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white",
              ].join(" ")}
              disabled={day.times.length === 0}
              key={`${day.label}-${day.date}`}
              onClick={() => {
                setSelectedDayIndex(index);
                selectShowtime(day.times[0] ?? selectedTime);
              }}
              type="button"
            >
              {day.label} <span className="text-zinc-500">{day.date}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryRail() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
        Food & drink
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">Categories</h2>
      <div className="mt-5 grid gap-2">
        {concessionCategories.map((category) => (
          <a
            className="rounded-md border border-zinc-800 px-3 py-3 text-sm font-bold text-zinc-300 transition hover:border-amber-300 hover:text-amber-200"
            href={`#${category.id}`}
            key={category.id}
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}

function SeatsStep({
  isLoadingUser,
  selectedSeats,
  toggleSeat,
  userEmail,
}: {
  isLoadingUser: boolean;
  selectedSeats: string[];
  toggleSeat: (seat: Seat) => void;
  userEmail?: string;
}) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20 sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Select seats
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Choose your view
          </h2>
        </div>
        {userEmail ? (
          <p className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm font-semibold text-emerald-100">
            Signed in as {userEmail}
          </p>
        ) : null}
      </div>

      {!userEmail ? (
        <InlineAuthGate isLoadingUser={isLoadingUser} />
      ) : (
        <SeatMap selectedSeats={selectedSeats} toggleSeat={toggleSeat} />
      )}
    </section>
  );
}

function InlineAuthGate({ isLoadingUser }: { isLoadingUser: boolean }) {
  const signInMutation = useSignIn();
  const signUpMutation = useSignUp();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const activeMutation = mode === "sign-in" ? signInMutation : signUpMutation;

  function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    activeMutation.mutate({ email, password });
  }

  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
          Account required
        </p>
        <h3 className="mt-3 text-2xl font-black text-white">
          Sign in to reserve seats
        </h3>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Seat selection is locked to your Cimena account so the checkout can
          keep your order together.
        </p>
      </div>

      <form
        className="rounded-lg border border-zinc-800 bg-zinc-950 p-5"
        noValidate
        onSubmit={submitAuth}
      >
        <div className="grid grid-cols-2 rounded-md border border-zinc-800 bg-zinc-900 p-1">
          <button
            className={[
              "min-h-10 rounded px-3 text-sm font-bold transition",
              mode === "sign-in"
                ? "bg-amber-300 text-zinc-950"
                : "text-zinc-400 hover:text-white",
            ].join(" ")}
            onClick={() => setMode("sign-in")}
            type="button"
          >
            Sign in
          </button>
          <button
            className={[
              "min-h-10 rounded px-3 text-sm font-bold transition",
              mode === "sign-up"
                ? "bg-amber-300 text-zinc-950"
                : "text-zinc-400 hover:text-white",
            ].join(" ")}
            onClick={() => setMode("sign-up")}
            type="button"
          >
            Create
          </button>
        </div>
        <label className="mt-5 block text-sm font-semibold text-zinc-200">
          Email
          <input
            autoComplete="email"
            className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            type="email"
            value={email}
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-zinc-200">
          Password
          <input
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            type="password"
            value={password}
          />
        </label>
        <button
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-bold text-zinc-950 transition hover:bg-amber-300 disabled:pointer-events-none disabled:opacity-60"
          disabled={isLoadingUser || activeMutation.isPending}
          type="submit"
        >
          {activeMutation.isPending
            ? "Working..."
            : mode === "sign-in"
              ? "Sign in"
              : "Create account"}
        </button>
        {activeMutation.isError ? (
          <p className="mt-4 rounded-md border border-red-300/30 bg-red-300/10 px-3 py-2 text-sm font-medium text-red-200">
            {activeMutation.error.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function SeatMap({
  selectedSeats,
  toggleSeat,
}: {
  selectedSeats: string[];
  toggleSeat: (seat: Seat) => void;
}) {
  return (
    <div className="mt-7 overflow-x-auto pb-2">
      <div className="mx-auto min-w-[700px] max-w-4xl">
        <div className="mx-auto h-3 w-4/5 rounded-full bg-amber-300 shadow-[0_18px_45px_rgba(251,191,36,0.22)]" />
        <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Screen
        </p>

        <div className="mt-8 grid gap-3">
          {seatRows.map((row) => (
            <div
              className="grid grid-cols-[28px_1fr] items-center gap-3"
              key={row[0]?.row}
            >
              <span className="text-center text-sm font-bold text-zinc-500">
                {row[0]?.row}
              </span>
              <div
                className="grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                }}
              >
                {row.map((seat) => {
                  const isOccupied = occupiedSeatIds.has(seat.id);
                  const isSelected = selectedSeats.includes(seat.id);

                  return (
                    <button
                      aria-label={`Seat ${seat.id}`}
                      className={[
                        "aspect-square rounded-md border text-xs font-black transition",
                        isOccupied
                          ? "cursor-not-allowed border-zinc-800 bg-zinc-800 text-zinc-600"
                          : isSelected
                            ? "border-amber-300 bg-amber-300 text-zinc-950"
                            : seat.kind === "premium"
                              ? "border-sky-300/50 bg-sky-300/10 text-sky-100 hover:border-sky-200 hover:bg-sky-300/20"
                              : seat.kind === "accessible"
                                ? "border-emerald-300/50 bg-emerald-300/10 text-emerald-100 hover:border-emerald-200 hover:bg-emerald-300/20"
                                : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-amber-300 hover:text-amber-200",
                      ].join(" ")}
                      disabled={isOccupied}
                      key={seat.id}
                      onClick={() => toggleSeat(seat)}
                      type="button"
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-3 text-xs font-semibold text-zinc-400">
          <LegendDot
            className="border-zinc-700 bg-zinc-950"
            label="Available"
          />
          <LegendDot
            className="border-sky-300/50 bg-sky-300/10"
            label="Premium"
          />
          <LegendDot
            className="border-emerald-300/50 bg-emerald-300/10"
            label="Accessible"
          />
          <LegendDot
            className="border-amber-300 bg-amber-300"
            label="Selected"
          />
          <LegendDot className="border-zinc-800 bg-zinc-800" label="Occupied" />
        </div>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-3 rounded border ${className}`} />
      {label}
    </span>
  );
}

function ConcessionsStep({
  changeConcessionQuantity,
  quantities,
  setActiveStep,
}: {
  changeConcessionQuantity: (productId: string, delta: number) => void;
  quantities: Quantities;
  setActiveStep: (step: PurchaseStep) => void;
}) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20 sm:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
            Food & drink
          </p>
          <h2 className="mt-3 text-3xl font-black text-white">
            Add snacks before checkout
          </h2>
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-bold text-zinc-200 transition hover:border-amber-300 hover:text-amber-200"
          onClick={() => setActiveStep("cart")}
          type="button"
        >
          Skip food
        </button>
      </div>

      <div className="mt-6 grid gap-8">
        {concessionCategories.map((category) => (
          <section
            className="scroll-mt-6"
            id={category.id}
            key={category.id}
            ref={setSectionRef(sectionRefs, category.id)}
          >
            <div className="mb-4">
              <h3 className="text-2xl font-black text-white">
                {category.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {category.description}
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {category.products.map((product) => (
                <ProductCard
                  changeConcessionQuantity={changeConcessionQuantity}
                  key={product.id}
                  product={product}
                  quantity={quantities[product.id] ?? 0}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function setSectionRef(
  refs: MutableRefObject<Record<string, HTMLElement | null>>,
  id: string,
) {
  return (element: HTMLElement | null) => {
    refs.current[id] = element;
  };
}

function ProductCard({
  changeConcessionQuantity,
  product,
  quantity,
}: {
  changeConcessionQuantity: (productId: string, delta: number) => void;
  product: ConcessionProduct;
  quantity: number;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      <div
        className="aspect-[4/3] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(9,9,11,0.35), rgba(9,9,11,0.02)), url(${product.image})`,
        }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-base font-black leading-tight text-white">
            {product.name}
          </h4>
          <p className="shrink-0 text-sm font-black text-amber-300">
            {formatCurrency(product.priceCents)}
          </p>
        </div>
        <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-400">
          {product.description}
        </p>
        <div className="mt-4 grid grid-cols-[40px_1fr_40px] items-center gap-2">
          <button
            aria-label={`Remove ${product.name}`}
            className="grid size-10 place-items-center rounded-md border border-zinc-700 text-lg font-black text-zinc-300 transition hover:border-amber-300 hover:text-amber-200 disabled:pointer-events-none disabled:opacity-40"
            disabled={quantity === 0}
            onClick={() => changeConcessionQuantity(product.id, -1)}
            type="button"
          >
            -
          </button>
          <span className="text-center text-sm font-bold text-white">
            {quantity}
          </span>
          <button
            aria-label={`Add ${product.name}`}
            className="grid size-10 place-items-center rounded-md bg-amber-400 text-lg font-black text-zinc-950 transition hover:bg-amber-300"
            onClick={() => changeConcessionQuantity(product.id, 1)}
            type="button"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function CartReviewStep({
  cartItems,
  changeConcessionQuantity,
  movie,
  selectedDay,
  selectedSeats,
  selectedTime,
  setActiveStep,
}: {
  cartItems: { product: ConcessionProduct; quantity: number }[];
  changeConcessionQuantity: (productId: string, delta: number) => void;
  movie: Movie;
  selectedDay: ScreeningDay;
  selectedSeats: Seat[];
  selectedTime: string;
  setActiveStep: (step: PurchaseStep) => void;
}) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20 sm:p-6">
      <div className="border-b border-zinc-800 pb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
          Cart
        </p>
        <h2 className="mt-3 text-3xl font-black text-white">
          Review your order
        </h2>
      </div>

      <div className="mt-6 grid gap-4">
        <ReviewPanel
          actionLabel="Edit time"
          onAction={() => setActiveStep("seats")}
          title="Movie"
        >
          <div className="flex gap-4">
            <div
              className="h-28 w-20 shrink-0 rounded-md bg-cover bg-center"
              style={{ backgroundImage: `url(${movie.posterImage})` }}
            />
            <div>
              <h3 className="text-xl font-black text-white">{movie.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {selectedDay.label}, {selectedDay.date} at {selectedTime}
              </p>
              <p className="mt-1 text-sm font-semibold text-zinc-300">
                {movie.format} / {movie.duration}
              </p>
            </div>
          </div>
        </ReviewPanel>

        <ReviewPanel
          actionLabel="Edit seats"
          onAction={() => setActiveStep("seats")}
          title="Seats"
        >
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map((seat) => (
              <span
                className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-bold text-white"
                key={seat.id}
              >
                {seat.id} / {formatCurrency(getSeatPriceCents(seat))}
              </span>
            ))}
          </div>
        </ReviewPanel>

        <ReviewPanel
          actionLabel="Add food"
          onAction={() => setActiveStep("concessions")}
          title="Food & drink"
        >
          {cartItems.length > 0 ? (
            <div className="grid gap-3">
              {cartItems.map(({ product, quantity }) => (
                <div
                  className="grid gap-3 rounded-md border border-zinc-800 bg-zinc-950 p-3 sm:grid-cols-[1fr_128px] sm:items-center"
                  key={product.id}
                >
                  <div>
                    <p className="font-bold text-white">{product.name}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {formatCurrency(product.priceCents)} each
                    </p>
                  </div>
                  <div className="grid grid-cols-[36px_1fr_36px] items-center gap-2">
                    <button
                      className="grid size-9 place-items-center rounded-md border border-zinc-700 text-lg font-black text-zinc-300 transition hover:border-amber-300 hover:text-amber-200"
                      onClick={() => changeConcessionQuantity(product.id, -1)}
                      type="button"
                    >
                      -
                    </button>
                    <span className="text-center text-sm font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      className="grid size-9 place-items-center rounded-md bg-amber-400 text-lg font-black text-zinc-950 transition hover:bg-amber-300"
                      onClick={() => changeConcessionQuantity(product.id, 1)}
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-zinc-400">
              No food or drinks added.
            </p>
          )}
        </ReviewPanel>
      </div>
    </section>
  );
}

function ReviewPanel({
  actionLabel,
  children,
  onAction,
  title,
}: {
  actionLabel: string;
  children: React.ReactNode;
  onAction: () => void;
  title: string;
}) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-lg font-black text-white">{title}</h3>
        <button
          className="rounded-md px-3 py-2 text-sm font-bold text-amber-300 transition hover:bg-white/10"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      </div>
      {children}
    </article>
  );
}

function PaymentStep({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20 sm:p-6">
      <div className="border-b border-zinc-800 pb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-300">
          Payment
        </p>
        <h2 className="mt-3 text-3xl font-black text-white">
          Complete checkout
        </h2>
      </div>
      <form className="mt-6 grid gap-5" onSubmit={submitPayment}>
        <div className="grid gap-4 sm:grid-cols-2">
          <CheckoutInput label="Email receipt" placeholder="you@example.com" />
          <CheckoutInput label="Name on card" placeholder="Ruben Frias" />
        </div>
        <CheckoutInput label="Card number" placeholder="4242 4242 4242 4242" />
        <div className="grid gap-4 sm:grid-cols-3">
          <CheckoutInput label="Expiration" placeholder="08 / 28" />
          <CheckoutInput label="CVC" placeholder="123" />
          <CheckoutInput label="ZIP code" placeholder="10001" />
        </div>
        <label className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
          <input
            className="mt-1 size-4 accent-amber-300"
            required
            type="checkbox"
          />
          I agree to the Cimena ticket policy and understand this is a frontend
          payment mock.
        </label>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-zinc-700 px-5 text-sm font-bold text-zinc-200 transition hover:border-amber-300 hover:text-amber-200"
            onClick={onBack}
            type="button"
          >
            Back to cart
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-amber-400 px-5 text-sm font-black text-zinc-950 transition hover:bg-amber-300"
            type="submit"
          >
            Pay now
          </button>
        </div>
      </form>
    </section>
  );
}

function CheckoutInput({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block text-sm font-semibold text-zinc-200">
      {label}
      <input
        className="mt-2 min-h-12 w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20"
        placeholder={placeholder}
        required
        type="text"
      />
    </label>
  );
}

function CartSidebar({
  cartItems,
  primaryAction,
  selectedSeats,
  totals,
}: {
  cartItems: { product: ConcessionProduct; quantity: number }[];
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    helper?: string;
  };
  selectedSeats: Seat[];
  totals: Totals;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/90 p-4 shadow-xl shadow-black/20">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
        Cart
      </p>
      <h2 className="mt-2 text-2xl font-black text-white">Order summary</h2>

      <div className="mt-5 space-y-5">
        <SummaryGroup title="Seats">
          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  className="rounded-md bg-zinc-950 px-2.5 py-1.5 text-sm font-bold text-zinc-100"
                  key={seat.id}
                >
                  {seat.id}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No seats selected.</p>
          )}
        </SummaryGroup>

        <SummaryGroup title="Food & drink">
          {cartItems.length > 0 ? (
            <div className="grid gap-2">
              {cartItems.map(({ product, quantity }) => (
                <div
                  className="flex items-center justify-between gap-3 text-sm"
                  key={product.id}
                >
                  <span className="text-zinc-300">
                    {quantity}x {product.name}
                  </span>
                  <span className="font-bold text-white">
                    {formatCurrency(product.priceCents * quantity)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No concessions added.</p>
          )}
        </SummaryGroup>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-5">
        <SummaryLine
          label="Tickets"
          value={formatCurrency(totals.ticketSubtotalCents)}
        />
        <SummaryLine
          label="Food & drink"
          value={formatCurrency(totals.concessionsSubtotalCents)}
        />
        <SummaryLine
          label="Convenience fee"
          value={formatCurrency(totals.convenienceFeeCents)}
        />
        <SummaryLine label="Tax" value={formatCurrency(totals.taxCents)} />
        <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-4">
          <span className="text-base font-black text-white">Total</span>
          <span className="text-2xl font-black text-amber-300">
            {formatCurrency(totals.totalCents)}
          </span>
        </div>
      </div>

      {primaryAction ? (
        <div className="mt-5">
          <button
            className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-amber-400 px-4 py-2 text-sm font-black text-zinc-950 transition hover:bg-amber-300 disabled:pointer-events-none disabled:opacity-50"
            disabled={primaryAction.disabled}
            onClick={primaryAction.onClick}
            type="button"
          >
            {primaryAction.label}
          </button>
          {primaryAction.helper ? (
            <p className="mt-2 text-center text-xs font-medium text-zinc-500">
              {primaryAction.helper}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function SummaryGroup({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        {title}
      </h3>
      {children}
    </section>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-3 text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold text-zinc-100">{value}</span>
    </div>
  );
}

function ConfirmationState({
  cartItems,
  movie,
  selectedDay,
  selectedSeats,
  selectedTime,
  totals,
}: {
  cartItems: { product: ConcessionProduct; quantity: number }[];
  movie: Movie;
  selectedDay: ScreeningDay;
  selectedSeats: Seat[];
  selectedTime: string;
  totals: Totals;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-6 text-center shadow-xl shadow-black/20 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
          Order confirmed
        </p>
        <h1 className="mt-4 text-4xl font-black text-white">
          Your tickets are ready
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-emerald-50/80">
          This frontend checkout mock completed successfully. Your order summary
          is shown below.
        </p>
        <div className="mt-7 rounded-lg border border-white/10 bg-zinc-950 p-5 text-left">
          <p className="text-xl font-black text-white">{movie.title}</p>
          <p className="mt-2 text-sm text-zinc-400">
            {selectedDay.label}, {selectedDay.date} at {selectedTime}
          </p>
          <p className="mt-4 text-sm font-semibold text-zinc-300">
            Seats: {selectedSeats.map((seat) => seat.id).join(", ")}
          </p>
          <p className="mt-2 text-sm font-semibold text-zinc-300">
            Food items: {cartItems.length}
          </p>
          <p className="mt-5 text-2xl font-black text-amber-300">
            {formatCurrency(totals.totalCents)}
          </p>
        </div>
        <Link
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-amber-400 px-5 text-sm font-black text-zinc-950 transition hover:bg-amber-300"
          href="/"
        >
          Back to movies
        </Link>
      </div>
    </section>
  );
}

function getTotals(selectedSeats: Seat[], quantities: Quantities): Totals {
  const ticketSubtotalCents = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPriceCents(seat),
    0,
  );
  const concessionsSubtotalCents = allConcessionProducts.reduce(
    (sum, product) => sum + product.priceCents * (quantities[product.id] ?? 0),
    0,
  );
  const feeCents = selectedSeats.length > 0 ? convenienceFeeCents : 0;
  const taxableCents =
    ticketSubtotalCents + concessionsSubtotalCents + feeCents;
  const taxCents = Math.round(taxableCents * salesTaxRate);

  return {
    ticketSubtotalCents,
    concessionsSubtotalCents,
    convenienceFeeCents: feeCents,
    taxCents,
    totalCents: taxableCents + taxCents,
  };
}

function formatCurrency(cents: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(cents / 100);
}
