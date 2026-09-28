import { createFileRoute } from "@tanstack/react-router";
import { ScanPageContent } from "@/components/scan";

export const Route = createFileRoute("/scan")({
  component: ScanMealPage,
});

function ScanMealPage() {
  return <ScanPageContent />;
}
