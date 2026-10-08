import { createFileRoute } from "@tanstack/react-router";
import { CtaLabShowcase } from "@/components/app/ctas";

export const Route = createFileRoute("/ctas")({
  component: CtaLabPage,
});

function CtaLabPage() {
  return <CtaLabShowcase />;
}
