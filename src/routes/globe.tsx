import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { CityOS } from "@/components/city-os";

export const Route = createFileRoute("/globe")({ component: GlobeHome });

function GlobeHome() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const parts = pathname.split("/").filter(Boolean);
  const path = parts[0] === "globe" ? parts.slice(1) : [];
  return <CityOS globePath={path.length ? path : undefined} />;
}
