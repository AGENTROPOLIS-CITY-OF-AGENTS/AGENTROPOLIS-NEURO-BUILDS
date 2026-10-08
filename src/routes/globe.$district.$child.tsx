import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/globe/$district/$child")({
  component: function GlobeChildLeaf() {
    return null;
  },
});
