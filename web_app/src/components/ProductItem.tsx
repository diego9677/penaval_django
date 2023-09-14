import clsx from "clsx";
import { Product } from "../interfaces";

type Props = {
  product: Product;
};


export const ProductItem = ({ product }: Props) => {
  return (
    <>
      <div className="flex-1 flex flex-col gap-1">
        <span className="text-xs font-normal text-gray-900">{product.brand.name}</span>
        <span className="text-sm font-semibold text-gray-800">{product.code}</span>
        <span className="text-normal font-normal text-gray-700">{product.measures}</span>
        <span className="text-sm font-light text-gray-700">{product.place.name}</span>
      </div>
      <div className="w-10 sm:w-12">
        <span className={clsx('w-8 h-8 flex justify-center items-center text-sm font-medium border rounded-md', product.stock > 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600')}>
          {product.stock}
        </span>
      </div>
      <div className="w-12 sm:w-16 text-sm font-medium text-gray-800">
        {product.price} Bs
      </div>
    </>
  );
};
