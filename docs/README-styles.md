# Werch UI — Style System Guide (Petshop)

> **هدف**: یک مرجع واحد برای تغییر استایل کل سایت. با ویرایش `variables.css` (پالت و تم) و این دو فایل: `app/tokens.css` (توکن‌ها) و `app/utilities.css` (کلاس‌های یوتیلیتی/کامپوننت‌های پایه)، ظاهر کل سیستم یک‌دست و قابل‌پیش‌بینی تغییر می‌کند.

---

## 1) معماری و لایه‌ها

* **Design Tokens (پایهٔ تم):** در `app/variables.css` — شامل پالت رنگ، سایه‌ها، تایپوگرافی، گرادیان‌ها، شعاع‌ها، و … برای **Dark (پیش‌فرض)** و **Light**.
* **Component Tokens (قابل override):** در `app/tokens.css` — توکن‌های سطح کامپوننت (دکمه، لینک، بَج، فرم، کارت، جداول، ناوبری، مودال/دراور، هشدار/توست، پروداکت‌کارت، قیمت/موجودی، ریتینگ، و …).
* **Utilities & Base Classes:** در `app/utilities.css` — کلاس‌های آمادهٔ مصرف که روی توکن‌ها سوارند. رفتارها و اندازه‌ها از `tokens.css` می‌آیند.
* **CSS Modules (اختصاصی هر کامپوننت):** فقط در صورت نیاز، **توکن‌های مرتبط** را در محدودهٔ همان کامپوننت override کنید (بدون دست‌کاری کلاس‌های پایه).

> اصل کلیدی: **اول توکن → بعد utility → در نهایت override محلی**.

---

## 2) نصب و مسیر فایل‌ها

* فایل‌ها:

  * `app/variables.css` (قبلاً دارید)
  * `app/tokens.css`
  * `app/utilities.css`
* ترتیب ایمپورت در `app/globals.css`:

```css
@import "./variables.css";   /* تم و پالت */
@import "./tokens.css";      /* توکن‌های کامپوننتی */
@import "./utilities.css";   /* کلاس‌های پایه/یوتیلیتی */
```

* **این راهنما**: پیشنهاد می‌شود در مسیر ریشهٔ مخزن پروژه قرار بگیرد: `docs/README-styles.md`.

---

## 3) سوئیچ تم (Dark/Light)

* حالت پیش‌فرض: **Dark** از `:root` در `variables.css`.
* برای روشن: روی `<html>` کلاس `light` بگذارید:

```tsx
<html lang="fa" className={`${vazirmatn.variable} light`}>
```

> همهٔ توکن‌ها و یوتیلیتی‌ها خودکار با مقادیر تم روشن هماهنگ می‌شوند. هر تفاوت ظریفِ لازم را می‌توانید در بلوک `html.light { ... }` داخل `tokens.css` دقیق‌تر کنید.

---

## 4) دسته‌بندی توکن‌ها (tokens.css)

توکن‌ها در این بخش‌ها تعریف شده‌اند (همه قابل override محلی هستند):

* **Breakpoints & Scales**: سایزها، فاصله‌ها، رادیوس، زمان‌بندی ترنزیشن‌ها.
* **Icons**: اندازه، رنگ‌های وضعیت (primary/success/warning/danger)، ضخامت استروک.
* **Links (LO)**: رنگ متن، هاور، پس‌زمینهٔ هاور، بردر، دکوریشن.
* **Buttons**: سایزبندی (sm/md/lg)، رادیوس، سایه، رینگ فوکوس، واریانت‌ها (solid/secondary/ghost/outline/danger) + رنگ متن و پس‌زمینه و حالت فشرده.
* **Badges/Chips/Tags**: قد/پدینگ/رادیوس/سایز فونت، و واریانت‌های info/tip، و **برچسب‌های فروشگاهی** (sale/new/hot).
* **Cards/Surfaces**: پس‌زمینه، بردر، رادیوس، پدینگ، شَدو، فاصلهٔ داخلی، تیتر.
* **Forms**: ورودی‌ها، انتخاب‌گرها، لیبل/راهنما، placeholder، رنگ حلقهٔ فوکوس، سوییچ، چک‌باکس/رادیو، دراپ‌داون.
* **Table**: پس‌زمینه، مرز، رادیوس، پدینگ سلول، ارتفاع ردیف، خط‌راهنما/استرایپ.
* **Navigation**: ارتفاع ناوبری، پس‌زمینه، رنگ لینک فعال، رادیوس.
* **Breadcrumb / Pagination / Tabs**: جداسازها، فاصله‌ها، واریانت تب فعال/غیرفعال.
* **Tooltip / Popover / Modal / Drawer**: رنگ‌ها، رادیوس، سایه‌ها، بک‌دراپ.
* **Alerts / Toasts**: پدینگ، رادیوس، موقعیت و سایهٔ توست.
* **Feedback**: اسکلتون (shimmer)، پروگرس‌بار، ریتینگ.
* **Commerce**: قیمت فعلی/قدیمی/تخفیف، رنگ وضعیت موجودی (ok/low/out).
* **Product Card (Petshop)**: نسبت تصویر، فاصله‌ها، رادیوس، مرز/سایه.
* **Avatars/Media**: اندازه و رینگ.

> هر گروه با پیش‌فرض‌های معقول تنظیم شده و بر پالت تم شما تکیه می‌کند.

---

## 5) کاتالوگ یوتیلیتی‌ها (utilities.css)

> کلاس‌ها روی توکن‌ها ساخته شده‌اند؛ رفتارشان با تغییر توکن عوض می‌شود.

### 5.1 آیکون‌ها

* `.icon` پایه + اندازه‌ها: `--2xs, --xs, --sm, --md, --lg, --xl, --2xl`
* رنگ‌های وضعیت: `.icon--weak | --mute | --primary | --success | --warning | --danger`

### 5.2 لینک‌ها

* `.link` (با توکن‌های LO) + `.link--subtle` برای لینک بدون دکوریشن.

### 5.3 دکمه‌ها

* پایه: `.btn` + سایزها: `.btn--sm | .btn--lg` + شکل‌ها: `.btn--pill | .btn--square`
* واریانت‌ها: `.btn--secondary | .btn--ghost | .btn--outline | .btn--danger`
* حالت لودینگ: `.btn.is-loading`

### 5.4 بَج/چیب/تگ

* `.badge` + واریانت‌ها: `--info | --tip | --sale | --new | --hot`
* `.tag` با `.tag__remove`

### 5.5 کارت‌ها/سطوح

* `.card`، افکت هاور: `.card--hover`، تیتر کارت: `.card__title`

### 5.6 فرم‌ها

* Wrapper ها: `.field`, `.field__label`, `.field__help`, `.field__err`
* کنترل‌ها: `.input`, `.textarea`, `.select` (+ `.select-wrap`/indicator)
* حالت‌ها: `[aria-invalid="true"]`
* آیکون داخلی: `.input-wrap .input-icon`، **input با آیکون**: `.input--with-icon`
* چک‌باکس/رادیو: `.checkbox`, `.radio` (با `accent-color`)
* سوییچ: `.switch` + `.switch__thumb` با `[aria-checked="true"]`

### 5.7 جدول

* `.table` (+ `--stripe`)، سلول‌ها، هدِر، آخرین ردیف بدون مرز.

### 5.8 ناوبری/بردکرامب/صفحه‌بندی/تب‌ها

* `.navbar`، `.breadcrumb` + `.breadcrumb__sep`، `.pagination` + `.page[aria-current]`
* `.tabs`، `.tab[aria-selected="true"]`

### 5.9 Tooltip/Popover/Modal/Drawer

* اتریبیوت‌محور: `[data-tooltip]`
* `.popover`
* `.backdrop`, `.modal`, `.modal__panel`
* `.drawer` + `.drawer.is-open`

### 5.10 Alerts/Toasts

* `.alert` + واریانت‌ها: `--info | --success | --warning | --danger`
* `.toast-wrap` (جایگاه ثابت) + `.toast`

### 5.11 Feedback

* `.skeleton`، `.progress` + `.progress__bar`، `.rating` + `.rating__icon.is-on`

### 5.12 قیمت/موجودی

* `.price`, `.price__current`, `.price__old`, `.price__discount`
* `.stock` و حالت‌ها: `--ok | --low | --out`

### 5.13 محصول/مدیا/آواتار

* `.product-card`, `.product-media > img`
* `.avatar` + `.avatar--ring`

### 5.14 لِی‌اوت و فاصله‌ها

* `.stack` (ستونی)، `.cluster` (سطر/Wrap)، `.center`
* `.grid` + modifiers: `--2 | --3 | --4` + Media Queries داخلی
* Helpers فاصله/چیدمان: `.pad-*`, `.gap-*`, `.mbs-*`, `.mbe-*`, `.mis-*`, `.mie-*`

### 5.15 تایپو/رنگ/ظاهر

* `.t-center`, `.t-weak`, `.t-mute`, `.t-strong`, `.ellipsis`, `.clamp-2`
* `.shadow | .shadow-sm | .shadow-lg`, `.rounded | -lg | -xl | -full`, `.border | .border-strong`
* `.bg-surface | .bg-muted`, `.text-primary`, `.bg-primary`
* `.ring | .ring-inset`

### 5.16 Motion/Reduced Motion

* کی‌فریم‌های `fade-in`, `scale-pop`, `slide-up`, `shimmer` در `tokens.css` تعریف شده‌اند.
* احترام به کاهش حرکت: بلاک media در انتهای `utilities.css`.

---

## 6) نام‌گذاری و قراردادها

* **Base**: نامِ کامپوننت به‌شکل ساده (`.btn`, `.badge`, `.table` …)
* **Modifier**: با `--` (`.btn--lg`, `.badge--sale`)
* **State**: با پیشوند `is-` و گاهی اتریبیوت‌ها (`.btn.is-loading`, `[aria-selected="true"]`)
* **منابع رنگ متن روی رنگ‌ها**: از توکن‌های `--on-*` در `variables.css` استفاده کنید (مثل `--on-primary`).

---

## 7) RTL/LTR

* فایل‌ها با **Logical properties** (مثل `inline-size`, `padding-inline`) نوشته شده‌اند تا RTL/LTR خودکار باشند.
* در صورت نیاز به آیکن‌های جهت‌دار، یک کلاس کمکی اضافه کنید (مثلاً `.rtl\:flip { transform: scaleX(-1) }`) و بر اساس `html[lang="fa"]` اعمال کنید.

---

## 8) دسترس‌پذیری (A11y)

* فوکوس‌ها با `:focus-visible` و رینگ‌های قابل‌مشاهده تنظیم شده‌اند.
* برای وضعیت‌ها از رنگ‌های **با کنتراست کافی** استفاده کنید؛ در صورت سفارشی‌سازی شدید، نسبت کنتراست را با ابزار مناسب بررسی کنید.
* کنترل‌های فرم از `accent-color` بومی استفاده می‌کنند؛ در صورت نیاز به سفارشی‌سازی کامل، از pseudo-element ها کمک بگیرید.

---

## 9) توسعه و سفارشی‌سازی

* **گسترش یک دستهٔ جدید توکن**: در `tokens.css` یک بلوک `:root` با نام‌گذاری همسو اضافه کنید؛ سپس یوتیلیتی‌های مرتبط را در `utilities.css` اضافه کنید.
* **واریانت سفارشی**: برای مثال، اگر دکمهٔ «tertiary» بخواهید: توکن‌های `--btn-tertiary-*` را تعریف کنید و `.btn--tertiary` را در utilities بسازید.
* **تم‌های بیشتر**: برای تم‌های اضافه (مثلاً `html.orange`)، یک بلوک جدید مثل `html.orange { --primary: ... }` در `variables.css` و هر **فاین‌تیون** لازم را در `tokens.css` اضافه کنید.

> نکته: مقادیر `color-mix(in oklab, ...)` در این سیستم به‌صورت یکنواخت در دارک/لایت رفتار پیش‌بینی‌پذیر می‌دهند. هنگام افزودن رنگ تازه، از همان الگو پیروی کنید.

---

## 10) کارایی و نگه‌داری

* کلاس‌ها «تعاملی و کوچک» هستند تا تداخل ایجاد نکنند. تغییر پالت/تم تنها با ویرایش `variables.css` انجام شود.
* از تکرار کلاس‌های جدید برای یک الگوی تکراری پرهیز کنید؛ ابتدا بررسی کنید آیا توکن مرتبط وجود دارد.
* اندازهٔ CSS را با حذف کلاس‌های بلااستفاده و بازبینی دوره‌ای کنترل کنید.

---

## 11) سوالات متداول (FAQ)

**س: می‌خواهم فقط رنگ یک دکمه در یک کامپوننت عوض شود؛ بقیهٔ رفتارها ثابت بمانند.**
ج: در CSS ماژول همان کامپوننت، فقط توکن‌های دکمه را override کنید (مثلاً `--btn-solid-bg`, `--btn-solid-text`).

**س: تم روشن کمی کنتراست کم دارد؛ کجا دقیق‌ترش کنم؟**
ج: در `html.light` داخل `variables.css` رنگ‌های پایه و در `html.light` داخل `tokens.css` ظریف‌کاری اجزای خاص را انجام دهید (مثلاً `--table-border`, `--sw-track-off`).

**س: می‌خواهم حالت‌های بیشتری برای هشدارها داشته باشم (info/success/warning/danger + neutral)**
ج: توکن‌های پس‌زمینه/متن را برای وضعیت جدید تعریف و یک کلاس modifier مثل `.alert--neutral` اضافه کنید.

---

## 12) تغییرات (Changelog)

* **v1.0.0** — ایجاد ساختار اولیه‌ی توکن‌ها و یوتیلیتی‌ها برای تمامی اجزای فروشگاه.

---

## 13) نگارش و مشارکت

* هنگام افزودن توکن/یوتیلیتی جدید:

  1. نام‌گذاری همسو با دستهٔ موجود
  2. وابستگی حداقلی به مقادیر ثابت؛ تا جای ممکن از توکن‌های سطح بالاتر استفاده کنید
  3. تست در هر دو تم دارک/لایت و در RTL

موفق باشید 💙
