"use client";

import { useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import { useRouter } from "next/navigation";
import { getTodo, createTodo, updateTodo } from "@/lib/api";
import { DEFAULT_COLOR } from "@/lib/colors";
import { LucideCheck, LucidePlusCircle } from "lucide-react";

type Props =
    | { mode: "create"; id?: never }
    | { mode: "edit"; id: number };

export default function TodoForm(props: Props) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [color, setColor] = useState(DEFAULT_COLOR);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.mode === "edit") {
            (async () => {
                setLoading(true);
                try {
                    const t = await getTodo(props.id);
                    const data = t.data;
                    setTitle(data.title ?? "");
                    setColor(data.color ?? DEFAULT_COLOR);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [props]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            if (props.mode === "create") {
                await createTodo({ title: title.trim(), color });
            } else {
                await updateTodo(props.id, { title: title.trim(), color });
            }
            router.push("/");
            router.refresh();
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-neutral-300">Title</label>
                <input
                    className="input mt-2"
                    placeholder={props.mode === "create" ? "Ex. Brush your teeth" : "Title"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Color</label>
                <ColorPicker value={color} onChange={setColor} />
            </div>

            <div className="pt-2">
                <button type="submit" disabled={loading || !title.trim()} className="btn btn-primary w-full">
                    {props.mode === "create" ? (
                        <span className="inline-flex items-center">Add Task
                            <span className="ml-2">
                                <LucidePlusCircle size={16} fontWeight={700} />
                            </span>
                        </span>
                    ) : (
                        <span className="inline-flex items-center">Save
                            <span className="ml-2">
                                <LucideCheck size={16} fontWeight={700} />
                            </span>
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
}
