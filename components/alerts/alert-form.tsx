"use client";

import { useActionState, useState } from "react";

import { createAlert } from "@/lib/actions/alerts";
import { REVIEW_OPTIONS } from "@/lib/alert-options";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AlertForm() {
  const [error, formAction, pending] = useActionState(createAlert, null);
  const [preview, setPreview] = useState<string | null>(null);

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Captura de Snapshot</Label>
        <input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          onChange={onImageChange}
          className="rounded-md border border-[var(--borde)] bg-[var(--superficie-2)] p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--acento-fuerte)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
        />
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Vista previa"
            className="mt-1 max-h-64 w-full rounded-md border border-[var(--borde)] object-contain"
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="comment">¿Qué estás viendo?</Label>
        <Textarea
          id="comment"
          name="comment"
          required
          rows={4}
          placeholder="Explica a los demás qué te hace pensar que puede pasar algo…"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="reviewMinutes">Revisar en</Label>
        <Select name="reviewMinutes" defaultValue={String(REVIEW_OPTIONS[0].minutes)}>
          <SelectTrigger id="reviewMinutes" className="w-40">
            {/*
              SelectValue con children-función: por defecto resuelve la
              etiqueta buscando el SelectItem ya montado, y como
              SelectContent vive en un portal que no está montado hasta
              abrirlo, en el render inicial caía al valor crudo (minutos).
              Mapeamos la etiqueta nosotros mismos para que sea fiable
              siempre, no solo tras abrir el desplegable una vez.
            */}
            <SelectValue>
              {(value: string) =>
                REVIEW_OPTIONS.find((o) => String(o.minutes) === value)?.label ?? value
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {REVIEW_OPTIONS.map((o) => (
              <SelectItem key={o.minutes} value={String(o.minutes)}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Pasado este tiempo, vuelve tú mismo a marcar si la alerta fue cierta
          o incierta.
        </p>
      </div>

      {error && <p className="text-sm text-[var(--rojo)]">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Publicando…" : "Publicar alerta"}
      </Button>
    </form>
  );
}
