import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { AdminPageShell } from "@/components/admin/page-shell";
import { ArticleForm } from "@/components/admin/article-form";
import { updateArticle } from "@/lib/actions/articles";
import { prisma } from "@/lib/prisma";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();
  return (
    <AdminPageShell title={`Éditer · ${article.title_fr}`} backHref="/admin/articles">
      <ArticleForm
        action={async (formData) => { "use server"; await updateArticle(id, formData); }}
        initial={article}
      />
    </AdminPageShell>
  );
}
