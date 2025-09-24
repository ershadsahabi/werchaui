"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import s from "./SmartFinder.module.css";

type Pet = "cat" | "dog";
type Stage = "kitten" | "adult" | "senior"; // برای سگ هم همین مپ میشه
type Price = "economy" | "mid" | "premium";
type Need =
  | "hairball"
  | "sensitive"
  | "skin-coat"
  | "dental"
  | "grainfree";

const needsMap: Record<Need, string> = {
  "hairball": "کنترل گوله مو",
  "sensitive": "گوارش حساس",
  "skin-coat": "پوست و مو",
  "dental": "دهان و دندان",
  "grainfree": "بدون غلات",
};

export default function SmartFinder() {
  const [pet, setPet] = useState<Pet>("cat");
  const [stage, setStage] = useState<Stage>("adult");
  const [price, setPrice] = useState<Price>("mid");
  const [needs, setNeeds] = useState<Need[]>([]);

  const toggleNeed = (name: Need) => {
    setNeeds((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const href = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("pet", pet);
    qs.set("stage", stage);
    qs.set("price", price);
    if (needs.length) qs.set("needs", needs.join(","));
    return `/shop?${qs.toString()}`;
  }, [pet, stage, price, needs]);

  return (
    <section className={s.wrap} aria-labelledby="finder-title" dir="rtl">
      <div className={s.head}>
        <h2 id="finder-title" className={s.title}>پیدا کن: محصول مناسب پت‌تو</h2>
        <p className={s.sub}>چند انتخاب ساده کن و نتایج فیلترشده ببین.</p>
      </div>

      <div className={s.grid}>
        {/* گروه: نوع پت */}
        <fieldset className={s.group}>
          <legend className={s.legend}>نوع پت</legend>
          <div className={s.options}>
            <label className={s.opt}>
              <input
                type="radio"
                name="pet"
                value="cat"
                checked={pet === "cat"}
                onChange={() => setPet("cat")}
              />
              <span className={s.chip}>🐱 گربه</span>
            </label>
            <label className={s.opt}>
              <input
                type="radio"
                name="pet"
                value="dog"
                checked={pet === "dog"}
                onChange={() => setPet("dog")}
              />
              <span className={s.chip}>🐶 سگ</span>
            </label>
          </div>
        </fieldset>

        {/* گروه: سن */}
        <fieldset className={s.group}>
          <legend className={s.legend}>سن</legend>
          <div className={s.options}>
            <label className={s.opt}>
              <input
                type="radio"
                name="stage"
                value="kitten"
                checked={stage === "kitten"}
                onChange={() => setStage("kitten")}
              />
              <span className={s.chip}>بچه</span>
            </label>
            <label className={s.opt}>
              <input
                type="radio"
                name="stage"
                value="adult"
                checked={stage === "adult"}
                onChange={() => setStage("adult")}
              />
              <span className={s.chip}>بالغ</span>
            </label>
            <label className={s.opt}>
              <input
                type="radio"
                name="stage"
                value="senior"
                checked={stage === "senior"}
                onChange={() => setStage("senior")}
              />
              <span className={s.chip}>سینیر</span>
            </label>
          </div>
        </fieldset>

        {/* گروه: نیازها */}
        <fieldset className={s.group}>
          <legend className={s.legend}>نیازهای خاص (اختیاری)</legend>
          <div className={s.options}>
            {(Object.keys(needsMap) as Need[]).map((n) => (
              <label key={n} className={s.opt}>
                <input
                  type="checkbox"
                  checked={needs.includes(n)}
                  onChange={() => toggleNeed(n)}
                />
                <span className={s.chip}>{needsMap[n]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* گروه: بودجه */}
        <fieldset className={s.group}>
          <legend className={s.legend}>بودجه</legend>
          <div className={s.options}>
            <label className={s.opt}>
              <input
                type="radio"
                name="price"
                value="economy"
                checked={price === "economy"}
                onChange={() => setPrice("economy")}
              />
              <span className={s.chip}>اقتصادی</span>
            </label>
            <label className={s.opt}>
              <input
                type="radio"
                name="price"
                value="mid"
                checked={price === "mid"}
                onChange={() => setPrice("mid")}
              />
              <span className={s.chip}>میانه</span>
            </label>
            <label className={s.opt}>
              <input
                type="radio"
                name="price"
                value="premium"
                checked={price === "premium"}
                onChange={() => setPrice("premium")}
              />
              <span className={s.chip}>پریمیوم</span>
            </label>
          </div>
        </fieldset>
      </div>

      <div className={s.actions}>
        <Link href={href} className="btn">
          نمایش نتایج
        </Link>
        <a
          className="btn btn--ghost"
          href="https://wa.me/989186559894"
          target="_blank"
          rel="noreferrer"
        >
          مشاوره واتس‌اپ
        </a>
      </div>
    </section>
  );
}
