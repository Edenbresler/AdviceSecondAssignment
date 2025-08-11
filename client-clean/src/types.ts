export type TopProduct = {
  productName: string;
  city: string;
  salesCount: number;
};

export type OrderItem = {
  id: number;
  orderDate: string;
  requestedDeliveryDate: string;
  shippedDate: string;
  diffMinutes: number;
  severityRank: number;
};
