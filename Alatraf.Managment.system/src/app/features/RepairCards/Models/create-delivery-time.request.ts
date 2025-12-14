export interface CreateDeliveryTimeRequest {
  deliveryDate: string; // ISO Date string (yyyy-MM-dd)
  notes?: string | null;
}
