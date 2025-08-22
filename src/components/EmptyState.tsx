import { LucideClipboardList } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="py-16 text-center gap-4 space-y-5">
            <div className="flex justify-center"><LucideClipboardList color="#a3a3a3" size={64} /></div>
            <p className="text-neutral-400 font-bold">You don’t have any tasks registered yet.</p>
            <p className="text-neutral-500">Create tasks and organize your to-do items.</p>
        </div>
    );
}
