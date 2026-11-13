import { Suspense } from "react";
import { requireAdmin } from "@/lib/session";
import { PostForm } from "../../post-form";

export default function NewPostPage() {
  return (
    <>
      <h1 className="mb-6 font-serif text-3xl">New post</h1>
      <Suspense fallback={null}>
        <Form />
      </Suspense>
    </>
  );
}

async function Form() {
  await requireAdmin();
  return <PostForm />;
}
