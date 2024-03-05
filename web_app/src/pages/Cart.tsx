import { SaleCartComponent } from "../components/SaleCartComponent";
import { ShoppingCartComponent } from "../components/ShoppingCartComponent";
import { useStore } from "../store";

export const Cart = () => {
  const saleCart = useStore(state => state.saleCart);
  const shoppingCart = useStore(state => state.shoppingCart);

  if (saleCart.length > 0 && shoppingCart.length === 0) {
    return <SaleCartComponent />;
  }

  if (shoppingCart.length > 0 && saleCart.length === 0) {
    return <ShoppingCartComponent />;
  }

  if (shoppingCart.length === 0 && saleCart.length === 0) {
    return (
      <div className='text-base font-semibold text-neutral-800 text-center py-10'>No hay compras ni ventas pendientes</div>
    );
  }
};
