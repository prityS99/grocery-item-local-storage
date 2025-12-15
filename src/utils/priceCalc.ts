import { GroceryItem } from "@/component/hooks/redux/slice/cartSlice";


export const calculateSubtotal = (items: GroceryItem[]) =>
  items.reduce((sum, i) => sum + i.price, 0);

export const calculateThresholdDiscount = (subtotal: number) =>
  subtotal > 200 ? subtotal * 0.1 : 0;

export const calculateCouponDiscount = (
  subtotal: number,
  coupon: string,
  coupons: Record<string, number>
) =>
  coupons[coupon] ? (subtotal * coupons[coupon]) / 100 : 0;

export const calculateTotal = (
  subtotal: number,
  threshold: number,
  coupon: number
) => subtotal - threshold - coupon;
