# سنز اسکین شاپ — SENZ SKIN SHOP

فروشگاه اینترنتی کامل محصولات مراقبت از پوست، با رابط کاربری فارسی و راست‌چین، پنل مدیریت کامل و استقرار آسان روی سرور لینوکسی با Docker.

| بخش | تکنولوژی |
| --- | --- |
| فرانت‌اند | Next.js 15 (App Router) + React 19 + TailwindCSS + فونت وزیرمتن |
| بک‌اند | Node.js (Express 4) + JWT + Multer (آپلود تصویر) |
| دیتابیس | PostgreSQL 16 |
| وب‌سرور / پروکسی | Nginx (Docker) |
| استقرار | Docker + Docker Compose (مخصوص سرور لینوکسی) |

---

## ✨ امکانات

### فروشگاه (کاربر)
- صفحه اصلی با اسلایدر مدیریت‌شده، دسته‌بندی‌های دایره‌ای، تب‌های پرفروش/پیشنهاد/جدید، بنر تخفیف، مجله و نوار مزیت‌ها
- صفحه محصول با گالری، قیمت و تخفیف، مشخصات، ترکیبات، روش استفاده، نظرات و محصولات مرتبط
- دسته‌بندی دو سطحی (دسته اصلی + زیردسته) با فیلتر قیمت، نوع پوست، تخفیف‌دار، مرتب‌سازی و صفحه‌بندی
- جست‌وجوی فارسی در نام، توضیح، برند و ترکیبات
- سبد خرید (ذخیره در مرورگر)، کد تخفیف، محاسبه هزینه ارسال و ارسال رایگان
- تسویه حساب با انتخاب استان/شهر، روش پرداخت (پرداخت در محل، کارت به کارت، پرداخت آنلاین)
- **حساب کاربری مشتری**: ثبت‌نام/ورود با شماره موبایل، پنل `/account` با سفارش‌ها، **دفترچه آدرس** (افزودن/ویرایش/حذف/پیش‌فرض)، ویرایش پروفایل و تغییر رمز
- **خرید مجدد** هر سفارش با یک کلیک (اقلام موجود دوباره به سبد اضافه می‌شوند)
- **پرداخت آنلاین** با صفحه درگاه `/payment/[code]` (درگاه نمونه/آزمایشی که با یک متغیر محیطی به درگاه واقعی وصل می‌شود)
- ثبت سفارش با کد پیگیری `SENZ-XXXXXXX`، صفحه وضعیت سفارش با تایم‌لاین، وضعیت پرداخت و فرم پیگیری
- مجله پوست (لیست + صفحه مقاله)، درباره ما، تماس با ما، سوالات متداول، خبرنامه
- راست‌چین کامل، اعداد فارسی، تاریخ شمسی، سئو (متادیتا + Schema.org محصول)، ریسپانسیو موبایل

### پنل مدیریت `/admin`
- ورود با ایمیل/رمز (JWT) و تغییر رمز عبور
- داشبورد: آمار فروش، تعداد سفارش، سفارش‌های در انتظار، نمودار ۱۴ روز اخیر، هشدار موجودی، پرفروش‌ترین‌ها
- محصولات: افزودن/ویرایش/حذف، آپلود چند تصویر، قیمت و قیمت قبل از تخفیف، موجودی، SKU، حجم، نوع پوست، مشخصات دلخواه (کلید/مقدار)، فعال/ویژه/پرفروش
- دسته‌بندی‌ها: ساخت دسته اصلی و زیردسته، تصویر، ترتیب نمایش، فعال/غیرفعال
- سفارش‌ها: جست‌وجو، فیلتر وضعیت، جزئیات کامل، تغییر وضعیت (در انتظار → تأیید → آماده‌سازی → ارسال → تحویل / لغو / مرجوع)، **وضعیت پرداخت** (پرداخت‌نشده/پرداخت‌شده/ناموفق/بازگشت وجه)، لیست تراکنش‌های پرداخت، یادداشت داخلی
- بنر و اسلایدر: عنوان، زیرعنوان، برچسب، دکمه، لینک، تصویر، ترتیب، محل نمایش
- مقالات مجله: عنوان، خلاصه، متن (تیتر با `##` و لیست با `-`)، کاور، انتشار/پیش‌نویس
- کدهای تخفیف: درصدی یا مبلغی، حداقل خرید، سقف استفاده، تاریخ انقضا
- نظرات: تأیید/لغو تأیید/حذف
- تنظیمات سایت: نام و شعار فروشگاه، متن نوار اطلاعیه، تلفن ثابت و موبایل، ایمیل، آدرس و کد پستی، ساعات کاری، لینک نقشه، اینستاگرام/تلگرام/واتس‌اپ، هزینه ارسال، حداقل مبلغ ارسال رایگان، شماره کارت، متن‌های درباره ما و فوتر، نوار مزیت‌ها

> تصاویر محصول، بنرها، لوگو (SVG) و آیکون‌ها به‌صورت اختصاصی برای همین پروژه طراحی شده‌اند و در `frontend/public/images` قرار دارند.

---

## 📁 ساختار پروژه

```
senzskinshop.com/
├── backend/                 # API (Node.js + Express + PostgreSQL)
│   ├── src/
│   │   ├── server.js        # ورودی، میدل‌ورها، مونتاژ مسیرها
│   │   ├── db.js            # اتصال pg (+ حالت PGlite برای توسعه محلی)
│   │   ├── schema.sql       # ساخت جداول (idempotent)
│   │   ├── seed.js          # داده‌های نمونه + ادمین اولیه
│   │   ├── auth.js          # JWT + محافظت مسیرهای ادمین
│   │   ├── helpers.js
│   │   └── routes/          # public.js (فروشگاه) و admin.js (پنل)
│   └── Dockerfile
├── frontend/                # Next.js (App Router)
│   ├── app/
│   │   ├── (site)/          # فروشگاه: خانه، محصولات، دسته، سبد، تسویه، سفارش، بلاگ، درباره، تماس، سوالات
│   │   └── admin/           # پنل مدیریت (login + (dash)/...)
│   ├── components/          # هدر، فوتر، کارت محصول، اسلایدر، فرم‌ها، UI پنل
│   ├── lib/                 # api، فرمت اعداد/تاریخ شمسی، ثابت‌ها، adminApi
│   └── public/images/       # تصاویر و لوگو
├── nginx/                   # کانفیگ پروکسی (conf/)، مسیر certs/ و acme/
├── docker-compose.yml       # postgres + api + web + nginx
├── deploy.sh                # اسکریپت استقرار یک‌دستوری
├── .env.example
└── README.md
```

---

## 🚀 اجرای محلی (توسعه)

پیش‌نیاز: Node.js 20 یا بالاتر.

```bash
# ۱) بک‌اند — بدون نیاز به نصب PostgreSQL (حالت PGlite، دیتابیس داخل خود پروژه)
cd backend
npm install
npm run dev            # http://localhost:4000  (دیتابیس در backend/.pgdata)

# ۲) فرانت‌اند — در ترمینال دیگر
cd frontend
npm install
npm run dev            # http://localhost:3000
```

در حالت توسعه، درخواست‌های `/api/*` و `/uploads/*` توسط Next به بک‌اند پروکسی می‌شوند (`next.config.mjs`).

اگر PostgreSQL محلی دارید، به‌جای حالت PGlite:

```bash
cd backend
DATABASE_URL=postgresql://senz:senz@localhost:5432/senzskinshop npm start
```

### حساب مدیر پیش‌فرض

```
ایمیل:  admin@senzskinshop.com
رمز:    Senz@12345
```

این مقادیر از `ADMIN_EMAIL` / `ADMIN_PASSWORD` خوانده می‌شوند و فقط در اولین اجرا (وقتی دیتابیس خالی است) ساخته می‌شوند. **بعد از اولین ورود، از داخل پنل → تنظیمات سایت → تغییر رمز عبور، رمز را عوض کنید.**

---

## 🐳 استقرار روی سرور لینوکسی (توصیه‌شده)

### پیش‌نیازهای سرور
- Ubuntu 22.04/24.04 یا Debian 12 (سرور با حداقل ۲ گیگ رم)
- دسترسی root/sudo و دامنه‌ای که به IP سرور اشاره کند

```bash
# نصب Docker + Compose
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker
docker --version && docker compose version

# فایروال
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### استقرار

```bash
# ۱) کد را روی سرور قرار دهید
sudo mkdir -p /var/www && cd /var/www
git clone https://github.com/amirabbasly/senzskinshop.com.git
cd senzskinshop.com

# ۲) فایل محیطی بسازید (deploy.sh خودش هم می‌سازد)
cp .env.example .env
nano .env        # POSTGRES_PASSWORD، JWT_SECRET، ADMIN_PASSWORD را تغییر دهید

# ۳) اجرا
./deploy.sh up
```

اسکریپت `deploy.sh` این کارها را انجام می‌دهد:

1. بررسی نصب Docker و Compose
2. ساخت `.env` با رمزهای تصادفی در صورت نبود
3. `docker compose up -d --build` (postgres → api → web → nginx)
4. انتظار برای پاسخ `/api/health` و نمایش وضعیت

دستورهای دیگر:

```bash
./deploy.sh status          # وضعیت سرویس‌ها
./deploy.sh logs api        # لاگ بک‌اند (web / nginx / db هم مجاز است)
./deploy.sh update          # git pull + build مجدد
./deploy.sh backup          # بکاپ دیتابیس در backups/
./deploy.sh restore FILE    # بازگردانی بکاپ
./deploy.sh seed            # اجرای دوباره داده‌های نمونه
```

### دامنه و SSL (Let's Encrypt)

1. رکورد `A` دامنه `senzskinshop.com` و `www` را به IP سرور بدهید و صبر کنید DNS منتشر شود.
2. مطمئن شوید سایت بالا است: `./deploy.sh status` و `curl -I http://senzskinshop.com`.
3. پورت‌های ۸۰ و ۴۴۳ را در فایروال باز کنید:
   ```bash
   firewall-cmd --permanent --add-service={http,https} && firewall-cmd --reload
   ```
4. SSL را نصب کنید (روی AlmaLinux/Rocky — اسکریپت `certbot` را با `dnf` نصب می‌کند):
   ```bash
   cd /var/www/senzskinshop.com
   sudo ./scripts/ssl-certbot.sh senzskinshop.com info@senzskinshop.com
   # یا معادل آن:
   sudo ./deploy.sh ssl senzskinshop.com info@senzskinshop.com
   ```
5. اسکریپت به‌صورت خودکار: گواهی را با **webroot** (`nginx/acme`) می‌گیرد، `fullchain.pem` و `privkey.pem` را در `nginx/certs` کپی می‌کند، فایل `nginx/conf/ssl.conf` (بلوک ۴۴۳) را می‌سازد، ریدایرکت `http → https` را در `nginx/conf/default.conf` فعال می‌کند، `nginx -t` و reload را انجام می‌دهد و هوک تمدید `/etc/letsencrypt/renewal-hooks/deploy/reload-senz.sh` را نصب می‌کند.
6. تست: `curl -I https://senzskinshop.com` باید `HTTP/2 200` بدهد و `http://` باید `301` به `https://` بدهد.
7. تمدید خودکار: `sudo certbot renew --dry-run` (تایمر systemd یا cron به‌صورت خودکار گواهی را ۳۰ روز قبل از انقضا تمدید و nginx را reload می‌کند).

> اگر پشت CDN هستید (مثل Cloudflare)، حالت SSL را روی **Full (strict)** بگذارید و رکوردها را روی DNS-only نگذارید مگر در زمان صدور گواهی.

**عیب‌یابی `duplicate location "/"`:** فایل `nginx/conf/senz-app.inc` خودش `location /` دارد. بنابراین در بلاک HTTP فایل `default.conf` یا باید `include .../senz-app.inc` فعال باشد (حالت HTTP-only) یا `location /` ریدایرکت (حالت HTTPS) — نه هر دو. اسکریپت `scripts/ssl-certbot.sh` در حالت HTTPS خودش include را کامنت می‌کند، قبل از تغییر از فایل پشتیبان می‌گیرد و اگر `nginx -t` رد شود تنظیمات را برمی‌گرداند. اجرای دوباره‌ی اسکریپت بی‌خطر است و همین وضعیت را درست می‌کند.

### پرداخت آنلاین و درگاه بانکی

- به‌صورت پیش‌فرض `PAYMENT_GATEWAY=mock` است: یک **درگاه نمونه** که در صفحه `/payment/[code]` دکمه‌های «پرداخت موفق» و «انصراف» را نشان می‌دهد و کل چرخه پرداخت (ایجاد تراکنش، authority، شماره پیگیری `ref_id`، تغییر وضعیت سفارش به «پرداخت‌شده») را شبیه‌سازی می‌کند — برای تست کامل سایت بدون درگاه واقعی.
- برای اتصال درگاه واقعی (زرین‌پال، آیدی‌پی، زیبال، …) فقط فایل `backend/src/payments.js` را ویرایش کنید: در تابع `createPaymentForOrder` درخواست ساخت تراکنش را به API درگاه بزنید و در `settlePayment` تراکنش را verify کنید. سپس در `.env` مقدار `PAYMENT_GATEWAY` و کلیدهای درگاه (مثل `ZARINPAL_MERCHANT_ID`) را تنظیم کنید. بقیه سایت (صفحه پرداخت، بازگشت، وضعیت سفارش، پنل مدیریت) بدون تغییر کار می‌کند.
- فعال/غیرفعال کردن روش «پرداخت آنلاین» برای مشتریان از پنل مدیریت → تنظیمات سایت → «پرداخت آنلاین فعال» انجام می‌شود.

---

## ⚙️ متغیرهای محیطی (`.env`)

| کلید | توضیح | پیش‌فرض |
| --- | --- | --- |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | مشخصات دیتابیس | `senzskinshop` / `senz` / — |
| `JWT_SECRET` | کلید امضای توکن مدیر (حتماً تغییر دهید) | — |
| `JWT_EXPIRES_IN` | مدت اعتبار ورود | `30d` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | ادمین اولیه (فقط اولین اجرا) | `admin@senzskinshop.com` / `Senz@12345` |
| `SEED_ON_BOOT` | درج داده نمونه در دیتابیس خالی | `1` |
| `CORS_ORIGIN` | دامنه‌های مجاز | دامنه اصلی سایت |
| `HTTP_PORT` / `HTTPS_PORT` | پورت‌های Nginx | `80` / `443` |
| `PAYMENT_GATEWAY` | درگاه پرداخت: `mock` (آزمایشی) یا نام درگاه واقعی که در `backend/src/payments.js` پیاده‌سازی می‌کنید | `mock` |

---

## 🔌 مرجع API

همه مسیرها با `/api` شروع می‌شوند. مسیرهای `/api/admin/*` به هدر `Authorization: Bearer <token>` نیاز دارند.

### عمومی
| متد | مسیر | توضیح |
| --- | --- | --- |
| GET | `/health` | سلامت سرویس و دیتابیس |
| GET | `/home` | داده صفحه اصلی (بنر، دسته‌ها، محصولات، مقالات، تنظیمات) |
| GET | `/settings` | تنظیمات عمومی سایت |
| GET | `/categories` | درخت دسته‌بندی‌ها |
| GET | `/products` | لیست محصولات (`category، q، sort، min_price، max_price، featured، on_sale، bestseller، skin_type، page، limit`) |
| GET | `/products/:slug` | جزئیات محصول + مرتبط + نظرات |
| POST | `/products/:slug/reviews` | ثبت نظر (در انتظار تأیید) |
| GET | `/banners?placement=hero` | بنرها |
| GET | `/posts` , `/posts/:slug` | مجله |
| POST | `/coupons/validate` | اعتبارسنجی کد تخفیف |
| POST | `/orders` | ثبت سفارش (مهمان یا با توکن مشتری؛ در حالت آنلاین `payment.payment_url` برمی‌گردد) |
| GET | `/orders/track/:code` | پیگیری سفارش |
| POST | `/newsletter` | عضویت خبرنامه |

### احراز هویت
| متد | مسیر | توضیح |
| --- | --- | --- |
| POST | `/auth/login` | ورود مدیر |
| GET | `/auth/me` | اطلاعات مدیر جاری |
| POST | `/auth/password` | تغییر رمز |

### حساب کاربری مشتری
| متد | مسیر | توضیح |
| --- | --- | --- |
| POST | `/customer/register` | ثبت‌نام `{name, phone, password, email?}` → `{token, customer}` |
| POST | `/customer/login` | ورود `{phone, password}` |
| GET | `/customer/me` | پروفایل مشتری جاری |
| PUT | `/customer/profile` | ویرایش نام/ایمیل |
| POST | `/customer/password` | تغییر رمز `{current_password, new_password}` |
| GET | `/customer/orders` | سفارش‌های همین مشتری (به‌همراه وضعیت پرداخت) |
| GET | `/customer/orders/:code` | جزئیات یک سفارش (به‌همراه `product_id`/`slug`/`stock` برای خرید مجدد) |
| GET | `/customer/addresses` | دفترچه آدرس مشتری |
| POST | `/customer/addresses` | افزودن آدرس `{title, recipient, phone, province, city, address, postal_code, is_default}` |
| PUT | `/customer/addresses/:id` | ویرایش آدرس |
| DELETE | `/customer/addresses/:id` | حذف آدرس |

توکن مشتری با هدر `Authorization: Bearer <token>` فرستاده می‌شود و از توکن مدیر جدا است.

### پرداخت (`/api/payments`)
| متد | مسیر | توضیح |
| --- | --- | --- |
| POST | `/payments/start` | `{code}` → `{gateway, authority, amount, payment_url}` (برای همان سفارش، دوباره از همان authority استفاده می‌کند) |
| GET | `/payments/status/:code` | وضعیت پرداخت سفارش + تراکنش‌ها |
| POST | `/payments/mock/complete` | فقط در حالت `mock`: `{code, authority, success}` → تسویه یا انصراف |

### پنل مدیریت
`/admin/dashboard`، `/admin/products` (+`/:id`)، `/admin/categories`، `/admin/banners`، `/admin/posts`، `/admin/coupons`، `/admin/orders` (+`/:id` patch وضعیت)، `/admin/reviews`، `/admin/settings`، `/admin/upload` (multipart، فیلد `files`)، `/admin/subscribers`

---

## 🧪 تست سلامت پس از استقرار

```bash
curl https://senzskinshop.com/api/health
curl https://senzskinshop.com/api/products?limit=2
curl https://senzskinshop.com/api/payments/status/ORDER-CODE
curl -X POST https://senzskinshop.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@senzskinshop.com","password":"Senz@12345"}'
```

پاسخ سالم `/api/health`:

```json
{"ok":true,"service":"senz-api","db":"postgresql","latency_ms":1}
```

---

## 🔐 نکات امنیتی

- حتماً `JWT_SECRET` و `POSTGRES_PASSWORD` را در `.env` تغییر دهید.
- رمز ادمین پیش‌فرض را بعد از اولین ورود عوض کنید.
- پورت دیتابیس (`5432`) در `docker-compose.yml` به بیرون باز نشده است؛ فقط شبکه داخلی Docker.
- آپلود فقط برای فایل‌های تصویری و حداکثر ۸ مگابایت مجاز است.
- پنل `/admin` با JWT محافظت می‌شود؛ برای امنیت بیشتر می‌توانید دسترسی به `/admin` را در Nginx به IP خودتان محدود کنید.

## 🩺 عیب‌یابی

| مشکل | راه‌حل |
| --- | --- |
| سایت ۵۰۲ می‌دهد | `./deploy.sh logs api` و `logs web` را ببینید؛ معمولاً دیتابیس بالا نیامده یا `DATABASE_URL` اشتباه است |
| تصاویر آپلودشده نمایش داده نمی‌شوند | حجم `senz_uploads` و مجوز پوشه را بررسی کنید: `docker volume ls` |
| ورود به پنل انجام نمی‌شود | `ADMIN_EMAIL`/`ADMIN_PASSWORD` فقط در اجرای اول اعمال می‌شوند؛ با `./deploy.sh seed` یا تغییر رمز در دیتابیس اقدام کنید |
| تغییرات کد اعمال نمی‌شود | `./deploy.sh update` (build مجدد) |
| فونت فارسی لود نمی‌شود | فونت وزیرمتن داخل بسته `@fontsource/vazirmatn` و در بیلد قرار دارد؛ اتصال اینترنت لازم نیست |

---

## 📝 یادداشت‌ها

- درگاه پرداخت آنلاین به‌صورت پیش‌فرض غیرفعال است (پرداخت در محل و کارت به کارت آماده است). برای اتصال زرین‌پال/آیدی‌پی، متغیر `payment_online_enabled` و افزاره پرداخت را در `backend/src/routes/public.js` اضافه کنید.
- ارسال ایمیل/پیامک (خبرنامه، تغییر وضعیت سفارش) به سرویس بیرونی وصل نشده است؛ خبرنامه ایمیل‌ها را در جدول `subscribers` ذخیره می‌کند و در پنل قابل مشاهده است (`/api/admin/subscribers`).
- تصاویر محصولات و بنرها نمونه هستند و می‌توانید از پنل مدیریت، تصاویر واقعی محصولات خود را جایگزین کنید.

---

© سنز اسکین شاپ — ساخته‌شده برای `senzskinshop.com`
