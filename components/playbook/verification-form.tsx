"use client";

import { useActionState, useState } from "react";

import { createVerification } from "@/lib/actions/strategies";
import { BACKTEST_RESULT_OPTIONS, type BacktestResultValue } from "@/lib/strategy-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VerificationForm({ strategyId }: { strategyId: string }) {
  const [error, formAction, pending] = useActionState(createVerification, null);
  const [preview, setPreview] = useState<string | null>(null);
  const [backtestPreview, setBacktestPreview] = useState<string | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResultValue>(
    BACKTEST_RESULT_OPTIONS[0].value
  );

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function onBacktestImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setBacktestPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="strategyId" value={strategyId} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="image">Captura del gráfico (TradingView)</Label>
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
        <Label htmlFor="backtestImage">Captura de resultados del backtesting (opcional)</Label>
        <input
          id="backtestImage"
          name="backtestImage"
          type="file"
          accept="image/*"
          onChange={onBacktestImageChange}
          className="rounded-md border border-[var(--borde)] bg-[var(--superficie-2)] p-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[var(--acento-fuerte)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
        />
        {backtestPreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={backtestPreview}
            alt="Vista previa"
            className="mt-1 max-h-64 w-full rounded-md border border-[var(--borde)] object-contain"
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="symbol">Símbolo o valor</Label>
          <Input id="symbol" name="symbol" required maxLength={40} placeholder="p. ej. AAPL" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="takeProfit">Take profit</Label>
          <Input
            id="takeProfit"
            name="takeProfit"
            required
            maxLength={40}
            placeholder="p. ej. +3%"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stopLoss">Stop loss</Label>
          <Input
            id="stopLoss"
            name="stopLoss"
            required
            maxLength={40}
            placeholder="p. ej. -1.5%"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="backtestResult">Beneficios backtesting</Label>
        <Select
          name="backtestResult"
          value={backtestResult}
          onValueChange={(v) => setBacktestResult(v as BacktestResultValue)}
        >
          <SelectTrigger id="backtestResult" className="w-full sm:w-56">
            <SelectValue>
              {(value: string) =>
                BACKTEST_RESULT_OPTIONS.find((o) => o.value === value)?.label ?? value
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {BACKTEST_RESULT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">¿Cómo ha funcionado el backtesting?</Label>
        <Textarea
          id="description"
          name="description"
          required
          rows={5}
          placeholder="Cuenta qué has visto: aciertos, fallos, en qué condiciones lo has probado…"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pineScript">Código Pine Script (opcional)</Label>
        <Textarea
          id="pineScript"
          name="pineScript"
          rows={6}
          className="font-mono text-xs"
          placeholder={"//@version=5\nstrategy(...)"}
        />
      </div>

      {error && <p className="text-sm text-[var(--rojo)]">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Publicando…" : "Publicar verificación"}
      </Button>
    </form>
  );
}
