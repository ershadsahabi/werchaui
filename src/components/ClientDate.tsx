"use client";

import { useEffect, useState } from "react";

type Props = {
  iso?: string | null;
  /**
   * @default "fa-IR"
   * می‌تونی "fa-IR-u-nu-latn" بدی تا اعداد لاتین باشن
   */
  locale?: string;
  /**
   * @default "UTC"
   * ثابت نگه‌داشتن تایم‌زون برای جلوگیری از اختلاف سرور/کلاینت
   */
  timeZone?: string;
  /**
   * قالب‌بندی اختیاری Intl
   */
  options?: Intl.DateTimeFormatOptions;
  /**
   * متن fallback تا قبل از فرمت‌شدن کلاینت
   */
  placeholder?: string;
};

export default function ClientDate({
  iso,
  locale = "fa-IR",
  timeZone = "UTC",
  options = { year: "numeric", month: "long", day: "2-digit" },
  placeholder = "",
}: Props) {
  const [text, setText] = useState<string>(placeholder);

  useEffect(() => {
    if (!iso) { setText(""); return; }
    try {
      const d = new Date(iso);
      const fmt = new Intl.DateTimeFormat(locale, { timeZone, ...options });
      setText(fmt.format(d));
    } catch {
      setText("");
    }
  }, [iso, locale, timeZone]);

  return (
    <time dateTime={iso || undefined} suppressHydrationWarning>
      {text}
    </time>
  );
}
