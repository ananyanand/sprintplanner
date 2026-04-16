import { useState, useRef, useEffect } from "react";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string[];
  onChange: (val: string[]) => void;
  placeholder?: string;
};

export default function MultiSelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select...",
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // ✅ FIXED: use click instead of mousedown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative w-full">

      {/* 🔥 Trigger */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // ✅ CRITICAL FIX
          setOpen((prev) => !prev);
        }}
        className="w-full px-3 py-2.5 rounded-lg border border-primary/10 text-sm cursor-pointer bg-background flex flex-wrap gap-1"
      >
        {value.length === 0 ? (
          <span className="text-secondary">{placeholder}</span>
        ) : (
          value.map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
            >
              {v}
            </span>
          ))
        )}
      </div>

      {/* 🔥 Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-background border border-primary/10 rounded-lg shadow-lg z-[100]">

          {/* Search */}
          <input
            placeholder="Search..."
            className="w-full p-2 border-b border-primary/10 text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Options */}
          <div className="max-h-48 overflow-y-auto">
            {filtered.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 px-3 py-2 hover:bg-primary/5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(opt.value)}
                  onChange={() => toggleValue(opt.value)}
                />
                <span className="text-sm text-primary">
                  {opt.label}
                </span>
              </label>
            ))}

            {filtered.length === 0 && (
              <p className="text-xs text-secondary p-3">
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}