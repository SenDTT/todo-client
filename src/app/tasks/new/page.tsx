import BackLink from "@/components/BackLink";
import Header from "@/components/Header";
import TodoForm from "@/components/TodoForm";

export default function NewTaskPage() {
    return (
        <>
            <Header />
            <div className="container flex flex-col gap-12 mt-12">
                <BackLink />
                <TodoForm mode="create" />
            </div>
        </>
    );
}
