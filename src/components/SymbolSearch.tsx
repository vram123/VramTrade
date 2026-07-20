import { useEffect, useRef, useState } from "react";
import { searchSymbols } from "../api/finnhub";
import type { SymbolResult } from "../types";

export function SymbolSearch({ onSelect }: { onSelect: (symbol: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SymbolResult[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = window.setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      try {
        const r = await searchSymbols(query);
        setResults(r);
      } catch {
        setResults([]);
      }
    }, 300);
    return () => window.clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div className="search-box" ref={boxRef}>
      <input
        placeholder="Search symbol or company…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((r) => (
            <div
              key={r.symbol}
              className="search-result-row"
              onClick={() => {
                onSelect(r.symbol);
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
            >
              <span>{r.symbol}</span>
              <span className="desc">{r.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
