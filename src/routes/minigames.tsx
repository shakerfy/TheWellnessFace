import { createFileRoute } from "@tanstack/react-router";
import { MiniGamesShowcase } from "@/components/app/mini-games";

export const Route = createFileRoute("/minigames")({
  component: MiniGamesPage,
});

function MiniGamesPage() {
  return <MiniGamesShowcase />;
}
