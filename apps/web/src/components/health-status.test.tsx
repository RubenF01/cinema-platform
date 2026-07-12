import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HealthStatusPanel } from "./health-status";

function renderWithClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <HealthStatusPanel />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("HealthStatusPanel", () => {
  it("renders health data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              application: "API",
              environment: "test",
              status: "ok",
              version: "0.1.0",
              database: "ok",
              redis: "ok",
            }),
        }),
      ),
    );

    renderWithClient();

    await waitFor(() => expect(screen.getByText("API")).toBeInTheDocument());
    expect(screen.getAllByText("ok")).toHaveLength(3);
  });
});
