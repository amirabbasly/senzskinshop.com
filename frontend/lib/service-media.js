// تصاویر سرویس‌ها (به‌جای آیکون‌های پیش‌فرض) — با ترتیب ثابت
export const SERVICE_IMAGES = [
  '/images/icons/service-shipping.png', // ارسال سریع
  '/images/icons/service-authentic.png', // ضمانت اصالت
  '/images/icons/service-payment.png', // پرداخت امن
  '/images/icons/service-consult.png', // مشاوره تخصصی
  '/images/icons/service-return.png', // ۷ روز بازگشت
];

export function serviceImage(index) {
  return SERVICE_IMAGES[index % SERVICE_IMAGES.length];
}
