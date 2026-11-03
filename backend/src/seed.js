import bcrypt from 'bcryptjs';
import { query, withTransaction } from './db.js';

const productSeed = [
  {
    name: 'سرم ویتامین C ۱۵٪ روشن‌کننده',
    slug: 'serum-vitamin-c-15',
    category: 'serum',
    short_desc: 'سرم روشن‌کننده و ضدلک با ویتامین C خالص و اسید فرولیک برای شفافیت و یکدست شدن رنگ پوست.',
    ingredients: 'اسکوربیل گلوکوزید ۱۵٪، اسید فرولیک، ویتامین E، عصاره پرتقال، هیالورونیک اسید',
    how_to_use: 'صبح‌ها بعد از شستشو و تونر، ۳ تا ۴ قطره روی پوست خشک بزنید و سپس از ضدآفتاب استفاده کنید. برای شروع هفته‌ای ۳ بار کافی است.',
    price: 489000,
    compare_price: 620000,
    stock: 24,
    volume: '۳۰ میلی‌لیتر',
    skin_type: 'همه انواع پوست',
    images: ['/images/products/serum-vitamin-c.jpg'],
    specs: [
      { key: 'حجم', value: '۳۰ میلی‌لیتر' },
      { key: 'نوع پوست', value: 'همه انواع پوست، پوست لک‌دار' },
      { key: 'بافت', value: 'سرم سبک و جذب‌شونده' },
      { key: 'کشور تولید', value: 'کره جنوبی' },
      { key: 'تاریخ انقضا', value: '۲۴ ماه پس از تولید' },
    ],
    featured: true,
    bestseller: true,
    rating: 4.8,
  },
  {
    name: 'سرم هیالورونیک اسید آبرسان سه‌گانه',
    slug: 'hyaluronic-acid-serum',
    category: 'serum',
    short_desc: 'آبرسان عمیق با سه وزن مولکولی هیالورونیک اسید برای پرکردن خطوط ریز و شادابی فوری پوست.',
    ingredients: 'سدیم هیالورونات، پانتنول (B5)، بتائین، عصاره آلوئه ورا، آدنوزین',
    how_to_use: 'روی پوست نیمه‌مرطوب صبح و شب ۳ قطره بزنید و با کرم آبرسان قفل کنید.',
    price: 429000,
    compare_price: 0,
    stock: 38,
    volume: '۳۰ میلی‌لیتر',
    skin_type: 'پوست خشک و کم‌آب',
    images: ['/images/products/serum-hyaluronic.jpg'],
    specs: [
      { key: 'حجم', value: '۳۰ میلی‌لیتر' },
      { key: 'نوع پوست', value: 'خشک، نرمال، حساس' },
      { key: 'اثر اصلی', value: 'آبرسانی ۷۲ ساعته' },
      { key: 'بدون', value: 'الکل، پارابن، اسانس' },
    ],
    featured: true,
    bestseller: true,
    rating: 4.9,
  },
  {
    name: 'کرم آبرسان شب پروبیوتیک',
    slug: 'probiotic-night-cream',
    category: 'cream',
    short_desc: 'کرم شب ترمیم‌کننده با پروبیوتیک و سرامید برای بازسازی سد دفاعی پوست در طول خواب.',
    ingredients: 'لیزات پروبیوتیک، سرامید NP، اسکوالان گیاهی، شی‌باتر، نیاسینامید ۲٪',
    how_to_use: 'شب‌ها به‌عنوان آخرین مرحله روتین، به میزان یک نخود روی صورت و گردن ماساژ دهید.',
    price: 520000,
    compare_price: 590000,
    stock: 19,
    volume: '۵۰ میلی‌لیتر',
    skin_type: 'پوست خشک و حساس',
    images: ['/images/products/night-cream.jpg'],
    specs: [
      { key: 'حجم', value: '۵۰ میلی‌لیتر' },
      { key: 'نوع پوست', value: 'خشک، حساس، آسیب‌دیده' },
      { key: 'بافت', value: 'کرم مخملی بدون چربی' },
      { key: 'زمان مصرف', value: 'شب' },
    ],
    featured: true,
    bestseller: false,
    rating: 4.7,
  },
  {
    name: 'ضدآفتاب مینرال SPF50 رنگی',
    slug: 'mineral-sunscreen-spf50',
    category: 'sunscreen',
    short_desc: 'ضدآفتاب فیزیکی با پوشش رنگی طبیعی، بدون رد سفید و مناسب پوست‌های حساس و مستعد جوش.',
    ingredients: 'زینک اکساید ۱۲٪، تیتانیوم دی‌اکساید، نیاسینامید، ویتامین E، عصاره چای سبز',
    how_to_use: 'هر ۲ تا ۳ ساعت و به مقدار دو بند انگشت روی صورت و گردن تجدید کنید.',
    price: 610000,
    compare_price: 0,
    stock: 31,
    volume: '۵۰ میلی‌لیتر',
    skin_type: 'پوست حساس و چرب',
    images: ['/images/products/sunscreen.jpg'],
    specs: [
      { key: 'حجم', value: '۵۰ میلی‌لیتر' },
      { key: 'SPF', value: '۵۰+ / PA++++' },
      { key: 'نوع فیلتر', value: 'فیزیکی (معدنی)' },
      { key: 'رنگ', value: 'بژ روشن' },
    ],
    featured: true,
    bestseller: true,
    rating: 4.9,
  },
  {
    name: 'فوم شوینده ملایم پوست چرب',
    slug: 'gentle-cleansing-foam',
    category: 'cleanser',
    short_desc: 'شوینده فومی با pH متعادل که چربی اضافه و آلودگی را بدون خشکی پاک می‌کند.',
    ingredients: 'سورفکتانت‌های آمینواسیدی، عصاره درخت چای، پانتنول، آلانتوئین',
    how_to_use: 'صبح و شب با کمی آب کف کنید، ۳۰ ثانیه ماساژ و با آب ولرم بشویید.',
    price: 320000,
    compare_price: 380000,
    stock: 45,
    volume: '۱۵۰ میلی‌لیتر',
    skin_type: 'پوست چرب و مختلط',
    images: ['/images/products/cleansing-foam.jpg'],
    specs: [
      { key: 'حجم', value: '۱۵۰ میلی‌لیتر' },
      { key: 'نوع پوست', value: 'چرب، مختلط، مستعد جوش' },
      { key: 'pH', value: '۵.۵' },
      { key: 'بدون', value: 'سولفات، صابون' },
    ],
    featured: false,
    bestseller: true,
    rating: 4.6,
  },
  {
    name: 'تونر پاک‌کننده منافذ با عصاره چای سبز',
    slug: 'green-tea-toner',
    category: 'cleanser',
    short_desc: 'تونر آبرسان و تنظیم‌کننده چربی با چای سبز و PHA برای کوچک‌تر شدن ظاهر منافذ.',
    ingredients: 'عصاره چای سبز، گلوکونولاکتون (PHA)، روی PCA، عصاره هماملیس',
    how_to_use: 'بعد از شستشو با پد پنبه‌ای روی پوست بکشید یا در دست کف زده و به پوست بزنید.',
    price: 285000,
    compare_price: 0,
    stock: 52,
    volume: '۲۰۰ میلی‌لیتر',
    skin_type: 'پوست چرب و مختلط',
    images: ['/images/products/toner.jpg'],
    specs: [
      { key: 'حجم', value: '۲۰۰ میلی‌لیتر' },
      { key: 'نوع پوست', value: 'چرب، مختلط' },
      { key: 'اثر', value: 'کنترل چربی و رفع بسته شدن منافذ' },
    ],
    featured: false,
    bestseller: false,
    rating: 4.5,
  },
  {
    name: 'ماسک لایه‌بردار آنزیمی پاپایا',
    slug: 'papaya-enzyme-peel-mask',
    category: 'mask',
    short_desc: 'لایه‌بردار ملایم آنزیمی بدون ساییدگی برای روشن شدن پوست و رفع سلول‌های مرده.',
    ingredients: 'پاپائین، بروملائین، عصاره آناناس، کائولین، پانتنول',
    how_to_use: 'هفته‌ای یک بار، لایه‌ای نازک روی پوست خشک بزنید، ۱۰ دقیقه صبر کنید و با آب ولرم بشویید.',
    price: 375000,
    compare_price: 450000,
    stock: 27,
    volume: '۷۵ میلی‌لیتر',
    skin_type: 'همه انواع پوست',
    images: ['/images/products/enzyme-mask.jpg'],
    specs: [
      { key: 'حجم', value: '۷۵ میلی‌لیتر' },
      { key: 'دفعات مصرف', value: 'هفته‌ای ۱ تا ۲ بار' },
      { key: 'نوع پوست', value: 'همه انواع پوست' },
    ],
    featured: true,
    bestseller: false,
    rating: 4.7,
  },
  {
    name: 'کرم دور چشم کافئین و پپتید',
    slug: 'caffeine-eye-cream',
    category: 'cream',
    short_desc: 'کاهش پف و تیرگی دور چشم با کافئین ۵٪، پپتید مس و ویتامین K.',
    ingredients: 'کافئین ۵٪، پپتید مس، ویتامین K، هیالورونیک اسید، عصاره خیار',
    how_to_use: 'صبح و شب مقدار کمی را با انگشت حلقه دور چشم بزنید تا جذب شود.',
    price: 450000,
    compare_price: 0,
    stock: 22,
    volume: '۱۵ میلی‌لیتر',
    skin_type: 'همه انواع پوست',
    images: ['/images/products/eye-cream.jpg'],
    specs: [
      { key: 'حجم', value: '۱۵ میلی‌لیتر' },
      { key: 'اثر اصلی', value: 'ضد پف و روشن‌کننده' },
      { key: 'مناسب برای', value: 'استفاده روزانه' },
    ],
    featured: false,
    bestseller: false,
    rating: 4.4,
  },
  {
    name: 'روغن آرگان و رزماری تقویت مو',
    slug: 'argan-rosemary-hair-oil',
    category: 'hair',
    short_desc: 'ترکیب خالص آرگان مراکشی و عصاره رزماری برای تقویت ریشه و درخشندگی ساقه مو.',
    ingredients: 'روغن آرگان خالص، عصاره رزماری، روغن جوجوبا، ویتامین E',
    how_to_use: 'شب‌ها چند قطره را روی ریشه ماساژ دهید و صبح بشویید، یا بعد از حمام روی ساقه مو بزنید.',
    price: 390000,
    compare_price: 460000,
    stock: 33,
    volume: '۱۰۰ میلی‌لیتر',
    skin_type: 'موی خشک و آسیب‌دیده',
    images: ['/images/products/argan-hair-oil.jpg'],
    specs: [
      { key: 'حجم', value: '۱۰۰ میلی‌لیتر' },
      { key: 'مناسب برای', value: 'ریزش مو، موی خشک' },
      { key: 'بدون', value: 'سیلیکون و پارابن' },
    ],
    featured: false,
    bestseller: true,
    rating: 4.6,
  },
  {
    name: 'لوسیون بدن آبرسان ویتامین B5',
    slug: 'body-lotion-b5',
    category: 'body',
    short_desc: 'لوسیون سبک و سریع‌جذب برای آبرسانی ۲۴ ساعته بدن با پانتنول و اوره ۵٪.',
    ingredients: 'پانتنول (B5)، اوره ۵٪، شی‌باتر، گلیسیرین، عصاره جو',
    how_to_use: 'بعد از حمام روی پوست نیمه‌مرطوب بدن ماساژ دهید.',
    price: 340000,
    compare_price: 0,
    stock: 41,
    volume: '۳۰۰ میلی‌لیتر',
    skin_type: 'همه انواع پوست',
    images: ['/images/products/body-lotion.jpg'],
    specs: [
      { key: 'حجم', value: '۳۰۰ میلی‌لیتر' },
      { key: 'نوع پوست', value: 'خشک و نرمال' },
      { key: 'اثر', value: 'آبرسانی ۲۴ ساعته' },
    ],
    featured: false,
    bestseller: false,
    rating: 4.5,
  },
  {
    name: 'سرم رتینول ۰.۳٪ شب',
    slug: 'retinol-serum-03',
    category: 'serum',
    short_desc: 'سرم ضدچین و ضدلک شب با رتینول کپسوله ۰.۳٪ و بافت کرمی بدون تحریک.',
    ingredients: 'رتینول کپسوله ۰.۳٪، اسکوالان، بیزابولول، نیاسینامید، ویتامین E',
    how_to_use: 'شب‌ها، هفته‌ای ۲ بار شروع کنید و کم‌کم افزایش دهید. صبح حتماً ضدآفتاب بزنید.',
    price: 560000,
    compare_price: 640000,
    stock: 16,
    volume: '۳۰ میلی‌لیتر',
    skin_type: 'پوست دارای چین و لک',
    images: ['/images/products/retinol-serum.jpg'],
    specs: [
      { key: 'حجم', value: '۳۰ میلی‌لیتر' },
      { key: 'غلظت', value: 'رتینول ۰.۳٪' },
      { key: 'زمان مصرف', value: 'شب' },
      { key: 'هشدار', value: 'در دوران بارداری استفاده نشود' },
    ],
    featured: true,
    bestseller: false,
    rating: 4.6,
  },
  {
    name: 'کلاژن هیدرولیز شده پوست، مو و ناخن',
    slug: 'collagen-skin-hair-nails',
    category: 'supplement',
    short_desc: 'پودر کلاژن پپتید با ویتامین C و بیوتین برای استحکام مو و ناخن و افزایش کشسانی پوست.',
    ingredients: 'کلاژن پپتید نوع I و III، ویتامین C، بیوتین، زینک، هیالورونیک اسید خوراکی',
    how_to_use: 'روزانه یک پیمانه (۵ گرم) را در آب یا آبمیوه حل کرده و میل کنید. مصرف مداوم ۸ هفته‌ای توصیه می‌شود.',
    price: 690000,
    compare_price: 780000,
    stock: 25,
    volume: '۳۰۰ گرم',
    skin_type: 'همه انواع پوست',
    images: ['/images/products/supplements.jpg'],
    specs: [
      { key: 'وزن', value: '۳۰۰ گرم (۳۰ سروینگ)' },
      { key: 'نوع کلاژن', value: 'پپتید نوع I و III' },
      { key: 'طعم', value: 'بدون طعم' },
      { key: 'روش مصرف', value: 'روزانه یک پیمانه' },
    ],
    featured: false,
    bestseller: false,
    rating: 4.5,
  },
  {
    name: 'ماسک خاک رس پاک‌کننده منافذ',
    slug: 'clay-pore-mask',
    category: 'mask',
    short_desc: 'ماسک خاک رس بنتونیت و کائولین برای جذب چربی اضافه و پاکسازی عمیق منافذ.',
    ingredients: 'بنتونیت، کائولین، عصاره چای سبز، روی، گلیسیرین',
    how_to_use: 'هفته‌ای ۱ بار روی ناحیه T بزنید، ۱۰ دقیقه صبر کنید (نه بیشتر) و بشویید.',
    price: 295000,
    compare_price: 350000,
    stock: 29,
    volume: '۱۰۰ میلی‌لیتر',
    skin_type: 'پوست چرب',
    images: ['/images/products/clay-mask.jpg'],
    specs: [
      { key: 'حجم', value: '۱۰۰ میلی‌لیتر' },
      { key: 'نوع پوست', value: 'چرب، مختلط، مستعد جوش' },
      { key: 'دفعات مصرف', value: 'هفته‌ای ۱ بار' },
    ],
    featured: false,
    bestseller: false,
    rating: 4.3,
  },
];

const categorySeed = [
  {
    key: 'face',
    name: 'مراقبت از صورت',
    slug: 'face',
    image: '/images/products/night-cream.jpg',
    description: 'سرم، کرم، ضدآفتاب و ماسک صورت برای روتین کامل پوست',
  },
  {
    key: 'serum',
    parent: 'face',
    name: 'سرم و آمپول',
    slug: 'serum',
    image: '/images/products/serum-vitamin-c.jpg',
    description: 'سرم‌های تخصصی ویتامین C، هیالورونیک، رتینول و نیاسینامید',
  },
  {
    key: 'cream',
    parent: 'face',
    name: 'کرم و آبرسان',
    slug: 'cream',
    image: '/images/products/night-cream.jpg',
    description: 'کرم روز و شب، آبرسان و ترمیم‌کننده',
  },
  {
    key: 'sunscreen',
    parent: 'face',
    name: 'ضد آفتاب',
    slug: 'sunscreen',
    image: '/images/products/sunscreen.jpg',
    description: 'ضدآفتاب مینرال و شیمیایی با SPF بالا',
  },
  {
    key: 'cleanser',
    parent: 'face',
    name: 'شوینده و تونر',
    slug: 'cleanser',
    image: '/images/products/cleansing-foam.jpg',
    description: 'فوم شوینده، ژل شستشو، پاک‌کننده آرایش و تونر',
  },
  {
    key: 'mask',
    parent: 'face',
    name: 'ماسک صورت',
    slug: 'mask',
    image: '/images/products/enzyme-mask.jpg',
    description: 'ماسک لایه‌بردار، خاک رس و ورقه‌ای',
  },
  {
    key: 'body',
    name: 'مراقبت از بدن',
    slug: 'body',
    image: '/images/products/body-lotion.jpg',
    description: 'لوسیون، کرم بدن، روغن و اسکراب',
  },
  {
    key: 'hair',
    name: 'مراقبت از مو',
    slug: 'hair',
    image: '/images/products/argan-hair-oil.jpg',
    description: 'شامپو، ماسک مو و روغن تقویت‌کننده',
  },
  {
    key: 'supplement',
    name: 'مکمل و زیبایی درون',
    slug: 'supplement',
    image: '/images/products/supplements.jpg',
    description: 'کلاژن، بیوتین و مولتی‌ویتامین پوست، مو و ناخن',
  },
];

const postSeed = [
  {
    title: 'روتین کامل مراقبت از پوست در ۵ گام',
    slug: 'complete-skincare-routine',
    excerpt: 'از شوینده تا ضدآفتاب؛ ترتیب درست محصولات را بشناسید تا نتیجه روتین‌تان چند برابر شود.',
    cover: '/images/blog/routine.jpg',
    content: `ترتیب استفاده از محصولات مراقبت پوست، مهم‌تر از تعداد آن‌هاست. در این مقاله روتین استاندارد صبح و شب را با هم مرور می‌کنیم.

## گام اول: شستشو
شوینده مناسب پوست‌تان انتخاب کنید. پوست چرب به فوم با pH متعادل و پوست خشک به ژل شوینده ملایم نیاز دارد.

## گام دوم: تونر
تونر تعادل pH پوست را برمی‌گرداند و آماده‌سازی برای جذب بهتر سرم‌ها انجام می‌دهد.

## گام سوم: سرم
سرم‌ها بیشترین غلظت مواد مؤثره را دارند. ویتامین C صبح، هیالورونیک اسید هر زمان و رتینول فقط شب.

## گام چهارم: آبرسان یا کرم
برای قفل کردن رطوبت، همیشه یک مرطوب‌کننده روی سرم بزنید.

## گام پنجم: ضدآفتاب
صبح‌ها بدون استثنا؛ حتی در روزهای ابری و حتی داخل خانه پشت پنجره.`,
  },
  {
    title: 'ویتامین C یا نیاسینامید؟ کدام برای لک مناسب است',
    slug: 'vitamin-c-vs-niacinamide',
    excerpt: 'دو ستاره روشن‌کننده پوست؛ تفاوت‌ها، نحوه ترکیب و اشتباه‌های رایج را بررسی می‌کنیم.',
    cover: '/images/blog/vitamin-c.jpg',
    content: `ویتامین C آنتی‌اکسیدانی قوی است که تولید ملانین را مهار می‌کند و به ساخت کلاژن کمک می‌کند.

نیاسینامید علاوه بر روشن‌کنندگی، چربی پوست را تنظیم و سد دفاعی را تقویت می‌کند.

## ترکیب درست
می‌توانید ویتامین C را صبح و نیاسینامید را شب استفاده کنید. ترکیب همزمان این دو در یک روتین هم با فرمولاسیون‌های جدید مشکلی ایجاد نمی‌کند، اما برای پوست حساس بهتر است جداگانه مصرف شوند.

## نکته مهم
هیچ روشن‌کننده‌ای بدون ضدآفتاب کار نمی‌کند.`,
  },
  {
    title: 'راهنمای انتخاب ضدآفتاب برای پوست چرب',
    slug: 'sunscreen-for-oily-skin',
    excerpt: 'ضدآفتابی که چرب نشود و جوش نزند؛ فیلترهای مینرال، ژل‌کرم و نکات مصرف روزانه.',
    cover: '/images/blog/sunscreen.jpg',
    content: `پوست چرب به ضدآفتاب سبک با فیلتر مینرال یا ژل‌کرم نیاز دارد.

## چه چیزی را بررسی کنیم
- عبارت non-comedogenic
- SPF ۳۰ تا ۵۰ و PA+++
- بدون الکل و اسانس

## مقدار مصرف
دو بند انگشت برای صورت و گردن، هر ۲ تا ۳ ساعت تجدید شود.`,
  },
];

async function getCategoryMap() {
  const { rows } = await query('SELECT id, slug FROM categories');
  const map = {};
  for (const row of rows) map[row.slug] = row.id;
  return map;
}

export async function seed({ force = false } = {}) {
  const { rows: adminRows } = await query('SELECT COUNT(*)::int AS c FROM admins');
  const { rows: productRows } = await query('SELECT COUNT(*)::int AS c FROM products');
  const isEmpty = adminRows[0].c === 0 && productRows[0].c === 0;
  if (!isEmpty && !force) {
    console.log('[seed] data already present, skipping');
    return false;
  }

  const email = process.env.ADMIN_EMAIL || 'admin@senzskinshop.com';
  const password = process.env.ADMIN_PASSWORD || 'Senz@12345';
  const hash = bcrypt.hashSync(password, 10);

  await withTransaction(async (tx) => {
    await tx.query(
      `INSERT INTO admins (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      ['مدیر سایت', email, hash]
    );

    const settings = {
      site_name: 'senzskinshop',
      site_name_en: 'SENZ SKIN SHOP',
      tagline: 'مراقبت تخصصی پوست با فرمولاسیون علمی',
      announcement: 'ضمانت اصالت کالا — ارسال سریع به سراسر ایران',
      phone: '021-91006655',
      mobile: '0912-3456789',
      email: 'info@senzskinshop.com',
      address:
        'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، برج نگین، طبقه ۵، واحد ۱۲',
      postal_code: '1234567890',
      working_hours: 'شنبه تا پنجشنبه، ۹:۰۰ تا ۱۸:۰۰',
      instagram: 'https://instagram.com/senzskinshop',
      telegram: 'https://t.me/senzskinshop',
      whatsapp: '989121234567',
      shipping_cost: 49000,
      free_shipping_min: 1500000,
      bank_card: '6219-8619-0000-0000',
      bank_name: 'بانک ملت - به نام شرکت senzskinshop',
      about_short:
        'senzskinshop از سال ۱۳۹۶ با تمرکز بر محصولات تخصصی مراقبت پوست فعالیت می‌کند. همه محصولات دارای اصالت، تست‌شده و مناسب آب‌وهوای ایران انتخاب می‌شوند.',
      about_text:
        'ما در senzskinshop باور داریم مراقبت از پوست باید ساده، علمی و قابل اعتماد باشد. تیم ما شامل کارشناسان پوست و داروسازان است که محصولات را بر اساس ترکیبات مؤثره، تست حساسیت و بازخورد واقعی مشتریان انتخاب می‌کنند.',
      footer_text: 'senzskinshop، مقصد خرید محصولات اصل و تخصصی مراقبت از پوست.',
      map_link: 'https://maps.google.com/?q=Tehran+Valiasr',
      payment_online_enabled: true,
      services: [
        { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران با پست پیشتاز و تیپاکس' },
        { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن تمام محصولات' },
        { title: 'پرداخت امن', desc: 'پرداخت آنلاین از طریق درگاه بانکی معتبر' },
        { title: 'مشاوره تخصصی', desc: 'راهنمای انتخاب محصول توسط کارشناس پوست' },
        { title: '۷ روز بازگشت', desc: 'امکان بازگشت کالا تا ۷ روز بدون دلیل' },
      ],
    };

    for (const [key, value] of Object.entries(settings)) {
      await tx.query(
        `INSERT INTO settings (key, value) VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
        [key, JSON.stringify(value)]
      );
    }

    const { rows: existingCats } = await tx.query('SELECT COUNT(*)::int AS c FROM categories');
    if (existingCats[0].c === 0) {
      for (const [i, cat] of categorySeed.entries()) {
        const parentId = cat.parent ? null : null;
        await tx.query(
          `INSERT INTO categories (parent_id, name, slug, description, image, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, true) ON CONFLICT (slug) DO NOTHING`,
          [parentId, cat.name, cat.slug, cat.description || '', cat.image || '', i]
        );
      }
      const map = await (async () => {
        const { rows } = await tx.query('SELECT id, slug FROM categories');
        return Object.fromEntries(rows.map((r) => [r.slug, r.id]));
      })();
      for (const cat of categorySeed.filter((c) => c.parent)) {
        await tx.query('UPDATE categories SET parent_id = $1 WHERE slug = $2', [
          map[cat.parent],
          cat.slug,
        ]);
      }
    }

    const { rows: existingProducts } = await tx.query('SELECT COUNT(*)::int AS c FROM products');
    if (existingProducts[0].c === 0) {
      const map = await (async () => {
        const { rows } = await tx.query('SELECT id, slug FROM categories');
        return Object.fromEntries(rows.map((r) => [r.slug, r.id]));
      })();
      for (const p of productSeed) {
        await tx.query(
          `INSERT INTO products
            (name, slug, brand, category_id, short_desc, description, ingredients, how_to_use,
             price, compare_price, stock, sku, volume, skin_type, images, specs,
             is_active, is_featured, is_bestseller, rating, sold)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb,true,$17,$18,$19,$20)`,
          [
            p.name,
            p.slug,
            'senzskinshop',
            map[p.category] || null,
            p.short_desc,
            `${p.short_desc}\n\n${p.name} با فرمولاسیون تخصصی و مواد اولیه اصل، برای استفاده روزانه طراحی شده است. تمام محصولات senzskinshop قبل از عرضه از نظر ایمنی و کیفیت بررسی می‌شوند.\n\nاین محصول بدون تست روی حیوانات است و در بسته‌بندی ایمن ارسال می‌شود.`,
            p.ingredients,
            p.how_to_use,
            p.price,
            p.compare_price,
            p.stock,
            `SENZ-${p.slug.toUpperCase().slice(0, 12)}`,
            p.volume,
            p.skin_type,
            JSON.stringify(p.images),
            JSON.stringify(p.specs),
            p.featured,
            p.bestseller,
            p.rating,
            Math.floor(20 + Math.random() * 120),
          ]
        );
      }
    }

    const { rows: existingBanners } = await tx.query('SELECT COUNT(*)::int AS c FROM banners');
    if (existingBanners[0].c === 0) {
      await tx.query(
        `INSERT INTO banners (title, subtitle, badge, image, link, btn_text, placement, sort_order, is_active)
         VALUES
         ($1,$2,$3,$4,$5,$6,'hero',1,true),
         ($7,$8,$9,$10,$11,$12,'hero',2,true),
         ($13,$14,$15,$16,$17,$18,'hero',3,true),
         ($19,$20,$21,$22,$23,$24,'hero_side',1,true),
         ($25,$26,$27,$28,$29,$30,'hero_side',2,true)`,
        [
          'پوست شفاف با سرم‌های اوردینری',
          'هیالورونیک اسید، نیاسینامید و رتینول — اورجینال با ضمانت اصالت senzskinshop',
          'THE ORDINARY',
          '/images/banners/hero-ordinary.jpg',
          '/products',
          'مشاهده محصولات',
          'پاکسازی و آبرسانی با سراوی',
          'کلینزر و مرطوب‌کننده سراوی برای پوست خشک و حساس',
          'CeraVe',
          '/images/banners/hero-cerave.jpg',
          '/products',
          'خرید محصولات سراوی',
          'آبرسانی کره‌ای با آنوا',
          'تُنر و سرم آنوا برای پوست‌های حساس و دهیدراته',
          'ANUA',
          '/images/banners/hero-1.jpg',
          '/products',
          'مشاهده کالکشن',
          'ضدآفتاب ایزدین',
          'محافظت روزانه با SPF50',
          'ISDIN',
          '/images/banners/cat-skin.jpg',
          '/category/sunscreen',
          'خرید ضدآفتاب',
          'مراقبت از مو با فینو',
          'ماسک و روغن موی ژاپنی',
          'Fino',
          '/images/banners/cat-hair.jpg',
          '/category/hair',
          'خرید محصولات مو',
        ]
      );
      await tx.query(
        `INSERT INTO banners (title, subtitle, badge, image, link, btn_text, placement, sort_order, is_active)
         VALUES ($1,$2,$3,$4,$5,$6,'strip',1,true)`,
        [
          '۱۵٪ تخفیف اولین خرید',
          'با کد SENZ15 روی همه محصولات',
          '',
          '',
          '/products',
          'شروع خرید',
        ]
      );
    }

    const { rows: existingPosts } = await tx.query('SELECT COUNT(*)::int AS c FROM posts');
    if (existingPosts[0].c === 0) {
      for (const post of postSeed) {
        await tx.query(
          `INSERT INTO posts (title, slug, excerpt, content, cover, author, is_published)
           VALUES ($1,$2,$3,$4,$5,$6,true) ON CONFLICT (slug) DO NOTHING`,
          [post.title, post.slug, post.excerpt, post.content, post.cover, 'تیم SENZ']
        );
      }
    }

    const { rows: existingCoupons } = await tx.query('SELECT COUNT(*)::int AS c FROM coupons');
    if (existingCoupons[0].c === 0) {
      await tx.query(
        `INSERT INTO coupons (code, percent, amount, min_total, is_active) VALUES
         ('SENZ15', 15, 0, 0, true),
         ('WELCOME10', 10, 0, 500000, true)
         ON CONFLICT (code) DO NOTHING`
      );
    }

    const { rows: existingReviews } = await tx.query('SELECT COUNT(*)::int AS c FROM reviews');
    if (existingReviews[0].c === 0) {
      const { rows: prods } = await tx.query('SELECT id FROM products ORDER BY id LIMIT 4');
      const texts = [
        ['سارا محمدی', 5, 'بعد از سه هفته استفاده لک‌های صورتم واقعاً روشن‌تر شد. بوی ملایمی داره و چرب هم نیست.'],
        ['نگار رضایی', 5, 'بسته‌بندی خیلی مرتب بود و سریع رسید. برای پوست حساس من هیچ سوزشی نداشت.'],
        ['امیر کاظمی', 4, 'کیفیت خوبه، فقط انتظار داشتم حجمش بیشتر باشه. در کل راضی‌ام.'],
        ['مریم احمدی', 5, 'بهترین محصولی که تا حالا برای آبرسانی استفاده کردم. حتماً دوباره می‌خرم.'],
      ];
      for (const [i, p] of prods.entries()) {
        const [name, rating, comment] = texts[i % texts.length];
        await tx.query(
          `INSERT INTO reviews (product_id, name, rating, comment, is_approved)
           VALUES ($1,$2,$3,$4,true)`,
          [p.id, name, rating, comment]
        );
      }
    }
  });

  console.log('[seed] demo data ready');
  console.log(`[seed] admin login → ${email} / ${password}`);
  return true;
}

const isMain = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isMain) {
  const { initDb, migrate, closeDb } = await import('./db.js');
  await initDb();
  await migrate();
  await seed({ force: process.argv.includes('--force') });
  await closeDb();
}
