import BackLink from "@/components/BackLink";
import Header from "@/components/Header";
import TodoForm from "@/components/TodoForm";

type Props = { params: { id: string } };

export default function TaskDetailPage({ params }: Props) {
    return (
        <>
            <Header />
            <div className="container">
                <div className="mt-6">
                    <BackLink />
                </div>
                <section className="mt-4 p-6">
                    <TodoForm mode="edit" id={Number(params.id)} />
                </section>
            </div>
        </>
    );
}
