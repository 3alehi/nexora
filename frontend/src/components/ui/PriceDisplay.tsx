interface PriceDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
}

export function PriceDisplay({ amount, currency = "ETH", className }: PriceDisplayProps) {
  return (
    <span className={className}>
      {amount.toLocaleString(undefined, { maximumFractionDigits: 4 })} {currency}
    </span>
  );
}
