"use client";

import { useTransition } from "react";
import { Eye, EyeOff } from "lucide-react";

import { toggleSeen } from "@/lib/actions/alerts";
import { Button } from "@/components/ui/button";

export function SeenToggle({
  alertId,
  seen,
}: {
  alertId: string;
  seen: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => toggleSeen(alertId))}
    >
      {seen ? (
        <>
          <Eye className="size-4" /> Visto
        </>
      ) : (
        <>
          <EyeOff className="size-4" /> Marcar visto
        </>
      )}
    </Button>
  );
}
