"use client";

import { getVersionedHealth, type HealthResponse } from "@cimena/api-client";
import {
  Card,
  CardContent,
  CardHeader,
  ErrorMessage,
  LoadingIndicator,
} from "@cimena/ui";
import { useQuery } from "@tanstack/react-query";

async function loadHealth(): Promise<HealthResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  return getVersionedHealth(apiUrl);
}

export function HealthStatusPanel() {
  const health = useQuery({
    queryKey: ["api-health"],
    queryFn: loadHealth,
  });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-slate-950">Backend health</h2>
      </CardHeader>
      <CardContent>
        {health.isPending ? <LoadingIndicator label="Checking API" /> : null}
        {health.isError ? (
          <ErrorMessage message={health.error.message} />
        ) : null}
        {health.isSuccess ? (
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Application</dt>
              <dd className="font-medium text-slate-950">
                {health.data.application}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="font-medium text-slate-950">
                {health.data.status}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Database</dt>
              <dd className="font-medium text-slate-950">
                {health.data.database ?? "not checked"}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Redis</dt>
              <dd className="font-medium text-slate-950">
                {health.data.redis ?? "not checked"}
              </dd>
            </div>
          </dl>
        ) : null}
      </CardContent>
    </Card>
  );
}
