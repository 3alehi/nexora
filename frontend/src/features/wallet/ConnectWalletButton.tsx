"use client";

import { Copy, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectWalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="glass flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium"
        >
          <span className="h-2 w-2 rounded-full bg-success" />
          {shortenAddress(address)}
        </button>

        {menuOpen ? (
          <GlassCard className="absolute right-0 top-12 z-50 flex w-64 flex-col gap-3 p-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">Connected to {chain?.name ?? "unknown network"}</span>
              <span className="font-mono text-sm">{shortenAddress(address)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => navigator.clipboard.writeText(address)}
              >
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={() => {
                  disconnect();
                  setMenuOpen(false);
                }}
              >
                <LogOut className="h-3.5 w-3.5" /> Disconnect
              </Button>
            </div>
          </GlassCard>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <Button size="sm" onClick={() => setMenuOpen((open) => !open)} disabled={isPending}>
        <Wallet className="h-4 w-4" />
        {isPending ? "Connecting..." : "Connect Wallet"}
      </Button>

      {menuOpen ? (
        <GlassCard className="absolute right-0 top-12 z-50 flex w-56 flex-col gap-1 p-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              onClick={() => {
                connect({ connector });
                setMenuOpen(false);
              }}
              className="rounded-lg px-3 py-2 text-left text-sm hover:bg-accent-soft"
            >
              {connector.name}
            </button>
          ))}
        </GlassCard>
      ) : null}
    </div>
  );
}
