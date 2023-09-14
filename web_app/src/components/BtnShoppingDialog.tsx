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
  const [shoppingState, setShoppingState] = useState<ShoppingCart>({ productId: 0, productCode: '', quantity: 0, pucharsePrice: 0, salePrice: 0 });

  useEffect(() => {
    if (product) {
      setShoppingState((prev) => ({ ...prev, productId: product.id, productCode: product.code, pucharsePrice: Number(product.pucharsePrice), salePrice: Number(product.price) }));
    }

  }, [product]);

  const closeDialog = () => {
    setShoppingState({ ...shoppingState, quantity: 0, pucharsePrice: 0 });
    setDialog(false);
  };


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof shoppingState.quantity === 'string' || typeof shoppingState.salePrice === 'string') {
      alert('Formulario no valido');
      return;
    }

    if (shoppingState.quantity === 0) {
      alert('Debe ingresar una cantidad');
      return;
    }

    if (shoppingState.pucharsePrice === 0) {
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
              value={shoppingState.quantity}
              onChange={(e) => setShoppingState({ ...shoppingState, quantity: Number(e.target.value) })}
            />

            <Input
              type="number"
              step={0.1}
              min={0}
              label="Precio de compra (Bs)"
              color="primary"
              placeholder="'40.5'"
              value={shoppingState.pucharsePrice}
              onChange={(e) => setShoppingState({ ...shoppingState, pucharsePrice: Number(e.target.value) })}
            />

            <Input
              type="number"
              step={0.1}
              min={0}
              label="Precio de venta (Bs)"
              color="primary"
              placeholder="'40.5'"
              value={shoppingState.salePrice}
              onChange={(e) => setShoppingState({ ...shoppingState, salePrice: Number(e.target.value) })}
            />

            <Button type="submit" color="primary">Guardar</Button>
          </form>
        </main>
      </CustomDialog>
    </>
  );
};
