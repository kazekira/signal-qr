import { createFileRoute } from "@tanstack/react-router";
import { PayloadForm } from "@/components/payload-form";
import { PreviewPanel } from "@/components/preview-panel";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <Shell>
      <div className="grid items-start gap-8 lg:grid-cols-12">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <PayloadForm />
        </div>
        <div className="order-1 lg:order-2 lg:col-span-6">
          <PreviewPanel />
        </div>
      </div>
    </Shell>
  );
}
