import { setRequestLocale } from "next-intl/server";
import { AdminPageShell } from "@/components/admin/page-shell";
import { ArticleForm } from "@/components/admin/article-form";
import { createArticle } from "@/lib/actions/articles";

export default async function NewArticlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <AdminPageShell title="Nouvel article" backHref="/admin/articles">
      <ArticleForm action={createArticle} />
    </AdminPageShell>
  );
}
