export interface IVariant {
  attributes: Record<string, string>;
  price: number;
  salePrice?: number;
  status?: any;
  stock: number;
}

export interface SpecificationSub {
  key: string;
  value: string;
}

export interface Specification {
  nameGroup: string;
  specificationsSub: SpecificationSub[];
}
export interface IProduct {
  _id?: string;
  name: string;
  categoryId: string;
  brandId: string;
  description: string;
  price?: number;
  salePrice?: number;
  variants?: IVariant[];
  stock: number;
  status: any;
  isDeleted: boolean;
  imageThumbnailUrl: string;
  imageUrls: string[];
  infoProduct: string;
  specifications: Specification[];
}
