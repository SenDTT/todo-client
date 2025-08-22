import Header from "@/components/Header";
import TaskList from "@/components/TaskList";
import { LucidePlusCircle } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <Header />
        <div className="container -mt-7 text-center">
          <Link href="/tasks/new" className="btn btn-primary w-full mx-auto">
            Create Task
            <span className="ml-2">
              <LucidePlusCircle size={16} fontWeight={700} />
            </span>
          </Link>
        </div>
      </div>
      <section className="container mt-10">
        <TaskList />
      </section>
    </>
  );
}
