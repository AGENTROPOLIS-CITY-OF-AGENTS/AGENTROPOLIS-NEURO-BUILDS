import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/globe/$district")({
  component: function GlobeDistrictLeaf() {
    return null;
  },
});
