"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { deleteTodo, fetchTodos } from "@/lib/api";
import { Todo } from "@/types/todo";
import EmptyState from "./EmptyState";
import TaskItem from "./TaskItem";

const LIMIT = 10;

export default function TaskList() {
    const [items, setItems] = useState<Todo[]>([]);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [itemName, setItemName] = useState("");
    const [curId, setCurId] = useState(0);
    const [page, setPage] = useState(1);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const [total, setTotal] = useState(0);

    const loadPage = useCallback(
        async (p: number) => {
            if (loading || !hasNext) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetchTodos({ limit: LIMIT, page: p });
                // append but avoid accidental dupes by id
                setItems((prev) => {
                    const seen = new Set(prev.map((t) => t.id));
                    const merged = [...prev];
                    for (const t of res.data) if (!seen.has(t.id)) merged.push(t);
                    return merged;
                });
                setHasNext(res.meta.hasNextPage);
                setPage(res.meta.page);
                setTotal(res.meta.total);
            } catch (e: any) {
                setError(e?.message ?? "Load failed");
            } finally {
                setLoading(false);
                setInitialized(true);
            }
        },
        [loading]
    );

    // initial load
    useEffect(() => {
        loadPage(1);
    }, []);

    // intersection observer to auto-load next page
    useEffect(() => {
        if (!sentinelRef.current || !hasNext) {
            setLoading(false);
            return;
        }

        const onIntersect: IntersectionObserverCallback = (entries) => {
            const entry = entries[0];
            if (entry.isIntersecting && hasNext && !loading) {
                loadPage(page + 1);
            }
        };

        const io = new IntersectionObserver(onIntersect, {
            root: null,
            rootMargin: "200px", // prefetch a bit before hitting the bottom
            threshold: 0.1,
        });

        io.observe(sentinelRef.current);
        return () => io.disconnect();
    }, [hasNext, loading, page, loadPage]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    function openConfirm(id: number, name: string) {
        setItemName(name);
        setCurId(id);
        setOpen(true);
    }

    async function handleDelete(id: number) {
        setBusy(true);
        try {
            await onConfirm(id);
        } finally {
            setBusy(false);
            setOpen(false);
        }
    }

    const onConfirm = async (id: number) => {
        await deleteTodo(id);
        await load();
    }

    async function load() {
        const data = await fetchTodos();
        setItems(data.data);
    }

    if (items === null) {
        return <div className="mt-8 text-neutral-400">Loading tasks…</div>;
    }

    const completed = items.filter((t) => t.completed).length;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between text-sm text-neutral-400 px-1 font-bold">
                <span><span className="text-sky-400">Tasks</span> <span className="ml-1 rounded-full bg-neutral-800 px-2 py-0.5 text-neutral-300">{items.length}</span></span>
                <span><span className="text-[#5E60CE]">Completed</span> <span className="ml-1 rounded-full bg-neutral-800 px-2 py-0.5 text-neutral-300">{completed} {total > 0 && `of ${total}`}</span></span>
            </div>

            <div className="flex flex-col gap-3">
                {items.length === 0 ? (
                    <div className="border-t border-t-neutral-500 rounded-t-lg"><EmptyState /></div>
                ) : (
                    <>
                        {items.map((t) => (
                            <article key={t.id} className="card border border-gray-700">
                                <TaskItem t={t} load={load} openConfirm={openConfirm} busy={busy} />
                            </article>
                        ))}
                    </>
                )}

                {open && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
                        <div
                            role="dialog"
                            aria-modal="true"
                            className="w-full max-w-sm rounded-2xl bg-neutral-900 p-6 shadow-xl ring-1 ring-white/10"
                        >
                            <h2 className="text-lg font-semibold mb-2">Delete task?</h2>
                            <p className="text-sm text-neutral-400 mb-6">
                                This action cannot be undone. You are about to delete{" "}
                                <span className="text-neutral-200">{itemName}</span>.
                            </p>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl px-4 py-2 bg-neutral-800 hover:bg-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={async () => { await handleDelete(curId); }}
                                    disabled={busy}
                                    className="rounded-xl px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-60"
                                >
                                    {busy ? "Deleting…" : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* sentinel + status */}
            <div ref={sentinelRef} />

            {error && (
                <div className="text-red-400 text-sm">{error}</div>
            )}

            {loading && (
                <div className="text-neutral-400 text-sm">Loading…</div>
            )}

            {!hasNext && initialized && items.length > 0 && !loading && (
                <div className="text-neutral-500 text-center text-sm py-3">You’re all caught up.</div>
            )}
        </div>
    );
}
