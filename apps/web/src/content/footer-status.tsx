"use client";

import { cn } from "@/lib/utils";
import type { StatusResponse } from "@pingora/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function FooterStatus() {
  const { data } = useQuery({
    queryKey: ["footer-status"],
    queryFn: async () => {
      const res = await fetch(
        "/api/status/status", // Assuming local proxy or API route
      );
      if (!res.ok) return { status: "unknown" as const };
      return (await res.json()) as StatusResponse;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 60000,
  });

  const status = data?.status ?? "unknown";

  return (
    <Link
      href="/status"
      className={cn(
        "flex w-full items-center gap-2 p-4 hover:bg-muted",
        STATUS[status].color,
      )}
    >
      {STATUS[status].label}
    </Link>
  );
}

const STATUS = {
  operational: { color: "text-success", label: "Operational" },
  degraded_performance: {
    color: "text-warning",
    label: "Degraded Performance",
  },
  partial_outage: { color: "text-warning", label: "Partial Outage" },
  major_outage: { color: "text-error", label: "Major Outage" },
  under_maintenance: { color: "text-info", label: "Under Maintenance" },
  unknown: { color: "text-gray-500", label: "Unknown" },
  incident: { color: "text-warning", label: "Incident" },
} satisfies Record<StatusResponse["status"], { color: string; label: string }>;
