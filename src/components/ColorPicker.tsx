"use client";

import { COLORS } from "@/lib/colors";

type Props = {
    value: string;
    onChange: (hex: string) => void;
};

export default function ColorPicker({ value, onChange }: Props) {
    return (
        <div className="flex flex-wrap gap-4">
            {COLORS.map((c) => {
                const selected = value.toLowerCase() === c.toLowerCase();
                return (
                    <button
                        key={c}
                        type="button"
                        aria-label={`color ${c}`}
                        onClick={() => onChange(c)}
                        className={[
                            "h-10 w-10 rounded-full ring-2 transition",
                            selected ? "ring-white" : "ring-white/10 hover:ring-white/30",
                        ].join(" ")}
                        style={{ backgroundColor: c }}
                    />
                );
            })}
        </div>
    );
}
