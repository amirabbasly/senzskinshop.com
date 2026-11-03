export const DEFAULT_SETTINGS = {
  site_name: 'سنز اسکین شاپ',
  site_name_en: 'SENZ SKIN SHOP',
  tagline: 'مراقبت تخصصی پوست با فرمولاسیون علمی',
  announcement: 'ضمانت اصالت کالا — ارسال سریع به سراسر ایران',
  phone: '021-91006655',
  mobile: '0912-3456789',
  email: 'info@senzskinshop.com',
  address: 'تهران، خیابان ولیعصر، بالاتر از پارک ساعی، برج نگین، طبقه ۵، واحد ۱۲',
  postal_code: '',
  working_hours: 'شنبه تا پنجشنبه، ۹:۰۰ تا ۱۸:۰۰',
  instagram: 'https://instagram.com/senzskinshop',
  telegram: 'https://t.me/senzskinshop',
  whatsapp: '989121234567',
  shipping_cost: 49000,
  free_shipping_min: 1500000,
  bank_card: '',
  bank_name: '',
  about_short: '',
  about_text: '',
  footer_text: '',
  map_link: '',
  payment_online_enabled: true,
  services: [
    { title: 'ارسال سریع', desc: 'ارسال به سراسر ایران با پست پیشتاز و تیپاکس' },
    { title: 'ضمانت اصالت', desc: 'تضمین اورجینال بودن تمام محصولات' },
    { title: 'پرداخت امن', desc: 'پرداخت آنلاین از طریق درگاه بانکی معتبر' },
    { title: 'مشاوره تخصصی', desc: 'راهنمای انتخاب محصول توسط کارشناس پوست' },
    { title: '۷ روز بازگشت', desc: 'امکان بازگشت کالا تا ۷ روز بدون دلیل' },
  ],
};

export const PROVINCES = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز', 'ایلام', 'بوشهر',
  'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی', 'خراسان رضوی', 'خراسان شمالی', 'خوزستان',
  'زنجان', 'سمنان', 'سیستان و بلوچستان', 'فارس', 'قزوین', 'قم', 'کردستان', 'کرمان',
  'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان', 'لرستان', 'مازندران', 'مرکزی',
  'هرمزگان', 'همدان', 'یزد',
];

export const ORDER_STATUS = {
  pending: { label: 'در انتظار بررسی', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  confirmed: { label: 'تأیید شده', color: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' },
  preparing: { label: 'در حال آماده‌سازی', color: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500' },
  shipped: { label: 'ارسال شده', color: 'bg-violet-100 text-violet-800', dot: 'bg-violet-500' },
  delivered: { label: 'تحویل داده شده', color: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  cancelled: { label: 'لغو شده', color: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' },
  returned: { label: 'مرجوع شده', color: 'bg-stone-200 text-stone-700', dot: 'bg-stone-500' },
};

export const PAYMENT_LABELS = {
  cod: 'پرداخت در محل (هنگام تحویل)',
  card: 'کارت به کارت',
  online: 'پرداخت آنلاین',
};

export const PAYMENT_STATUS = {
  unpaid: { label: 'پرداخت نشده', color: 'bg-rose-50 text-rose-700 border-rose-100' },
  paid: { label: 'پرداخت شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  failed: { label: 'پرداخت ناموفق', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  refunded: { label: 'بازگشت وجه', color: 'bg-stone-100 text-stone-700 border-stone-200' },
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'جدیدترین' },
  { value: 'popular', label: 'محبوب‌ترین' },
  { value: 'cheapest', label: 'ارزان‌ترین' },
  { value: 'expensive', label: 'گران‌ترین' },
  { value: 'discount', label: 'بیشترین تخفیف' },
  { value: 'rating', label: 'بیشترین امتیاز' },
];

export const SKIN_TYPES = ['همه انواع پوست', 'پوست خشک', 'پوست چرب', 'پوست مختلط', 'پوست حساس'];

export const PLACEHOLDER_IMAGE = '/images/placeholder.svg';
