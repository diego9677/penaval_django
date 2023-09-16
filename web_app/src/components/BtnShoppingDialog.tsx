import React, { useEffect, useState } from 'react';
import { Product, ShoppingCart } from "../interfaces";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { CustomDialog } from "./CustomDialog";
import { ProductItem } from "./ProductItem";

type Props = {
  product: Product;
  onConfirmDialog: (sale: ShoppingCart) => void;
};

export const BtnShoppingDialog = ({ product, onConfirmDialog }: Props) => {
  const [dialog, setDialog] = useState(false);
  const [shoppingState, setShoppingState] = useState<ShoppingCart>({ product_id: 0, product_code: '', amount: 0, pucharse_price: 0, sale_price: 0 });

  useEffect(() => {
    if (product) {
      setShoppingState((prev) => ({ ...prev, product_id: product.id, product_code: product.code, pucharse_price: Number(product.pucharse_price), sale_price: Number(product.price) }));
    }

  }, [product]);

  const closeDialog = () => {
    setShoppingState({ ...shoppingState, amount: 0, pucharse_price: 0 });
    setDialog(false);
  };


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof shoppingState.amount === 'string' || typeof shoppingState.sale_price === 'string') {
      alert('Formulario no valido');
      return;
    }

    if (shoppingState.amount === 0) {
      alert('Debe ingresar una cantidad');
      return;
    }

    if (shoppingState.amount === 0) {
      alert('Debe ingresar un precio de compra');
      return;
    }

    onConfirmDialog(shoppingState);
    closeDialog();
  };

  return (
    <>
      <Button type="button" color="secondary" size="xs" onClick={() => setDialog(true)}>
        <i className="las la-arrow-right la-lg" />
      </Button>
      <CustomDialog dialog={dialog} closeDialog={closeDialog} size="sm">
        <main className="flex flex-col gap-7">
          <header className='flex justify-between'>
            <div className='flex-1 text-lg font-semibold text-gray-800'>
              Compras
            </div>
            <div className='flex-initial'>
              <Button type='button' color='danger' onClick={closeDialog} size='xs'>
                <i className='las la-lg la-times' />
              </Button>
            </div>
          </header>

          <section className="flex gap-10 items-center">
            <ProductItem product={product} />
          </section>

          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <Input
              type="number"
              label="Cantidad"
              color="primary"
              placeholder="'3'"
              min={0}
              value={shoppingState.amount}
              onChange={(e) => setShoppingState({ ...shoppingState, amount: Number(e.target.value) })}
            />

            <Input
              type="number"
              step={0.1}
              min={0}
              label="Precio de compra (Bs)"
              color="primary"
              placeholder="'40.5'"
              value={shoppingState.pucharse_price}
              onChange={(e) => setShoppingState({ ...shoppingState, pucharse_price: Number(e.target.value) })}
            />

            <Input
              type="number"
              step={0.1}
              min={0}
              label="Precio de venta (Bs)"
              color="primary"
              placeholder="'40.5'"
              value={shoppingState.sale_price}
              onChange={(e) => setShoppingState({ ...shoppingState, sale_price: Number(e.target.value) })}
            />

            <Button type="submit" color="primary">Guardar</Button>
          </form>
        </main>
      </CustomDialog>
    </>
  );
};
