// app/not-found.tsx
import { redirect } from "next/navigation";

export default function NotFound(): never {
  // 🚀 Redirects any dead or non-existent URL instantly back to your main catalog page
  redirect("/books");
}
