export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minPurchase: number;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}
