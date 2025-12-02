
export interface IPromotion {
  nameEvent: string;
  imageHeader: string;
  banner: string;
  background: string;
  colorNavigation: string;
  startDate: string;
  endDate: string;
  discountType: string;
  discountPercent: number;
  discountMoney: number;
  listProducts: any[];
  listImageEvent: any[];
  categoryQuantity?: number;
}
