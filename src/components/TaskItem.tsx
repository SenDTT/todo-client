import { toggleTodo } from "@/lib/api";
import { Todo } from "@/types/todo";
import { LucideCheck, LucideTrash2 } from "lucide-react";
import Link from "next/link";

export default function TaskItem({ t, load, openConfirm, busy }: { t: Todo; load: () => Promise<void>; openConfirm: (id: number, name: string) => void; busy: boolean; }) {
    return (
        <div className="flex items-start gap-3">
            <button
                type="button"
                onClick={async () => { await toggleTodo(t.id, !t.completed); await load(); }}
                className="shrink-0 p-4"
                title="Toggle complete"
            >
                <span
                    className={[
                        "inline-block h-3.5 w-3.5 rounded-full ring-3 border-2 transition",
                        t.completed ? "bg-violet-500 ring-violet-300" : `ring-transparent`,
                    ].join(" ")}
                    style={{ borderColor: !t.completed ? t.color : "transparent" }}
                >
                    <LucideCheck color={t.completed ? "#fafafa" : "transparent"} size={10} className="font-bold" />
                </span>
            </button>

            <div className="flex-1 py-4">
                <Link href={`/tasks/${t.id}`}>
                    <p className={["text-sm", t.completed ? "line-through text-neutral-500" : "text-neutral-100"].join(" ")}>
                        {t.title}
                    </p>
                </Link>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => openConfirm(t.id, t.title)}
                    className={`text-neutral-400 hover:text-red-400 p-4 ${busy ? " opacity-50 cursor-not-allowed" : ""}`}
                    title="Delete"
                >
                    <LucideTrash2 color="#a3a3a3" size={16} />
                </button>
            </div>
        </div>
    )
}