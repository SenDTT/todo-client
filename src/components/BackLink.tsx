"use client";

import { LucideArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackLink() {
    const router = useRouter();
    return (
        <button title="Go back" name="back" type="button" onClick={() => router.back()} className="text-neutral-300 hover:text-white">
            <span><LucideArrowLeft className="mr-2" /></span>
        </button>
    );
}
