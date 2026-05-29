import { setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { PageHeader, GradientText } from "@/components/ui/page-header";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: "Documentation" };
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const en = locale === "en";

  const docs = await prisma.doc.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const uncategorized = en ? "General" : "Général";
  const groups = new Map<string, typeof docs>();
  for (const d of docs) {
    const key = (en ? d.category_en : d.category_fr) || uncategorized;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(d);
  }

  return (
    <>
      <PageHeader
        variant="docs"
        eyebrow="Documentation"
        title={
          en ? (
            <>
              Guides & <GradientText>resources</GradientText>
            </>
          ) : (
            <>
              Guides & <GradientText>ressources</GradientText>
            </>
          )
        }
        subtitle={
          en
            ? "Everything you need to get started and go further with our solutions."
            : "Tout ce qu'il faut pour démarrer et aller plus loin avec nos solutions."
        }
      />

      <section className="py-16 md:py-24 bg-[var(--bg)]">
        <div className="container-page">
          {docs.length === 0 ? (
            <div className="card-elevated p-12 text-center text-fg-muted">
              {en ? "No documentation yet." : "Aucune documentation pour le moment."}
            </div>
          ) : (
            <div className="space-y-16">
              {[...groups.entries()].map(([category, items]) => (
                <div key={category}>
                  <h2 className="eyebrow-line mb-6">{category}</h2>
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {items.map((d) => {
                      const title = en ? d.title_en : d.title_fr;
                      const summary = en ? d.summary_en : d.summary_fr;
                      return (
                        <Link
                          key={d.id}
                          href={`/documentation/${d.slug}` as never}
                          className="group card-elevated p-6 hover:border-brand-500 transition-colors flex flex-col"
                        >
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {title}
                          </h3>
                          {summary && (
                            <p className="mt-2 text-sm text-fg-muted leading-relaxed line-clamp-3 flex-1">
                              {summary}
                            </p>
                          )}
                          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:gap-2.5 transition-all">
                            {en ? "Read" : "Lire"}
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
