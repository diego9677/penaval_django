import { Link, useSearchParams } from "react-router-dom";
import { ProductItem } from "../components/ProductItem";
import { useEffect, useState } from "react";
import { getApiProduct, getSale, getShopping, setSale, setShopping } from "../services";
import { Product, SaleCart, ShoppingCart } from "../interfaces";
import { Spinner } from "../components/Spinner";
import { Button } from "../components/common/Button";
import { CustomDialog } from "../components/CustomDialog";
import { SaleFormDetail } from "../components/SaleFormDetail";
import { ShoppingFormDetail } from "../components/ShoppingFormDetail";

export const ProductDetail = () => {
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<'sale' | 'shopping'>('sale');
  const [dialog, setDialog] = useState(false);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

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
    if (getShopping().length > 0) {
      alert('Tiene compras pendientes que debe cerrar');
      return;
    }

    const saleCart = getSale();
    const index = saleCart.findIndex(p => p.product_code === sale.product_code);
    if (saleCart[index]) {
      saleCart[index] = sale;
    } else {
      saleCart.push(sale);
    }

    setSale(saleCart);
  };

  const onAddShoppingCart = (shopping: ShoppingCart) => {
    if (getSale().length > 0) {
      alert('Tiene ventas pendientes que debe cerrar');
      return;
    }

    const shoppingCart = getShopping();
    const index = shoppingCart.findIndex(p => p.product_code === shopping.product_code);
    if (shoppingCart[index]) {
      shoppingCart[index] = shopping;
    } else {
      shoppingCart.push(shopping);
    }

    setShopping(shoppingCart);
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
          <Button type="button" color="primary" onClick={() => openDialog('sale')}>
            Venta
          </Button>
          <Button type="button" color="success" onClick={() => openDialog('shopping')}>
            Compra
          </Button>
          <Link to={`/products/form?id=${id}`} className="btn btn-secondary p-2 text-center">
            Editar
          </Link>
        </footer>
      </section>

      <CustomDialog dialog={dialog} closeDialog={closeDialog}>
        {type === 'sale' && <SaleFormDetail product={product!} onConfirmDialog={onAddSaleCart} closeDialog={closeDialog} />}
        {type === 'shopping' && <ShoppingFormDetail product={product!} onConfirmDialog={onAddShoppingCart} closeDialog={closeDialog} />}
      </CustomDialog>
    </>
  );
};
