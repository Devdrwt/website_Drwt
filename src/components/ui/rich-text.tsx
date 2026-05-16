import { useTranslations } from "next-intl";
import { GradientText } from "./gradient-text";

type Namespace = Parameters<typeof useTranslations>[0];

export function RichTitle({
  namespace,
  k,
}: {
  namespace?: Namespace;
  k: string;
}) {
  const t = useTranslations(namespace);
  return t.rich(k, {
    gradient: (chunks) => <GradientText>{chunks}</GradientText>,
    br: () => <br />,
  }) as React.ReactNode;
}
