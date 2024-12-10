import { Link, useSearchParams } from "react-router-dom";
import { ProductItem } from "../components/ProductItem";
import { useEffect, useState } from "react";
import { getApiProduct } from "../services";
import { Product, SaleCart, ShoppingCart } from "../interfaces";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { CustomDialog } from "../components/CustomDialog";
import { SaleFormDetail } from "../components/SaleFormDetail";
import { ShoppingFormDetail } from "../components/ShoppingFormDetail";
import { useStore } from "../store";

export const ProductDetail = () => {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'sale' | 'shopping'>('sale');
  const [dialog, setDialog] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  const saleCart = useStore(state => state.saleCart);
  const shoppingCart = useStore(state => state.shoppingCart);
  const setSaleCart = useStore(state => state.setSaleCart);
  const setShoppingCart = useStore(state => state.setShoppingCart);

  useEffect(() => {
    if (id) {
      getApiProduct(Number(id))
        .then((data) => {
          setProduct(data);
          setLoading(false);
        });
    }
  }, [id]);

  const openDialog = (type: 'sale' | 'shopping') => {
    setType(type);
    setDialog(true);
  };

  const closeDialog = () => {
    setDialog(false);
  };

  const onAddSaleCart = (sale: SaleCart) => {
    if (shoppingCart.length > 0) {
      alert('Tiene compras pendientes que debe cerrar');
      return;
    }

    const index = saleCart.findIndex(p => p.product_code === sale.product_code);
    if (saleCart[index]) {
      const data = saleCart.map(s => s.product_id === sale.product_id ? sale : s);
      setSaleCart(data);
    } else {
      setSaleCart([...saleCart, sale]);
    }
  };

  const onAddShoppingCart = (shopping: ShoppingCart) => {
    if (saleCart.length > 0) {
      alert('Tiene ventas pendientes que debe cerrar');
      return;
    }

    const index = shoppingCart.findIndex(p => p.product_code === shopping.product_code);
    if (shoppingCart[index]) {
      const data = shoppingCart.map(s => s.product_id === shopping.product_id ? shopping : s)
      setShoppingCart(data);
    } else {
      setShoppingCart([...shoppingCart, shopping]);
    }

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }
  return (
    <>
      <section className="flex flex-col gap-4 py-2 px-4 md:mx-auto md:w-[500px]">
        <header className="border-b flex py-2">
          <div className="w-8">
            <Link to="/products" className="link">
              <i className="las la-arrow-left la-lg" />
            </Link>
          </div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-bold text-gray-700">
              Producto
            </h3>
          </div>
        </header>

        <main className="flex gap-7 items-center py-6">
          <ProductItem product={product!} />
        </main>

        <footer className="flex flex-col gap-5">
          <div className="h-8">
            <Button type="button" color="primary" onClick={() => openDialog('sale')}>
              Venta
            </Button>
          </div>
          <div className="h-8">
            <Button type="button" color="success" onClick={() => openDialog('shopping')}>
              Compra
            </Button>
          </div>
          <div className="h-8">
            <Link to={`/products/form?id=${id}`} className="btn btn-secondary text-center">
              Editar
            </Link>
          </div>
        </footer>
      </section>

      <CustomDialog dialog={dialog} closeDialog={closeDialog}>
        {type === 'sale' && <SaleFormDetail product={product!} onConfirmDialog={onAddSaleCart} closeDialog={closeDialog} />}
        {type === 'shopping' && <ShoppingFormDetail product={product!} onConfirmDialog={onAddShoppingCart} closeDialog={closeDialog} />}
      </CustomDialog>
    </>
  );
};
