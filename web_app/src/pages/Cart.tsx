import { SaleCartComponent } from "../components/SaleCartComponent";
import { ShoppingCartComponent } from "../components/ShoppingCartComponent";
import { getSale, getShopping } from "../services";

export const Cart = () => {
  return (
    <>
      {getSale().length > 0 && getShopping().length === 0 && <SaleCartComponent />}
      {getShopping().length > 0 && getSale().length === 0 && <ShoppingCartComponent />}
      {getSale().length === 0 && getShopping().length === 0 && <div className='text-gray-900 text-center py-10'>No hay compras ni ventas pendientes</div>}
    </>
  );
};
