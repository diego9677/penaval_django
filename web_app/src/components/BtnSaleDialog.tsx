import React, { useEffect, useState } from 'react';
import { Product, SaleCart } from "../interfaces";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { CustomDialog } from "./CustomDialog";
import { ProductItem } from "./ProductItem";

type Props = {
  product: Product;
  onConfirmDialog: (sale: SaleCart) => void;
};

export const BtnSaleDialog = ({ product, onConfirmDialog }: Props) => {
  const [dialog, setDialog] = useState(false);
  const [saleState, setSaleState] = useState<SaleCart>({ productId: 0, productCode: '', quantity: 0, salePrice: 0 });

  useEffect(() => {
    if (product) {
      setSaleState((prev) => ({ ...prev, productId: product.id, productCode: product.code, salePrice: Number(product.price) }));
    }

  }, [product]);

  const closeDialog = () => {
    setSaleState({ ...saleState, quantity: 0 });
    setDialog(false);
  };


  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof saleState.quantity === 'string' || typeof saleState.salePrice === 'string') {
      alert('Formulario no valido');
      return;
    }

    if (saleState.quantity === 0) {
      alert('Debe ingresar una cantidad');
      return;
    }

    if (saleState.quantity > product.stock) {
      alert('No hay stock suficiente');
      return;
    }

    onConfirmDialog(saleState);
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
              Ventas
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
              min={0}
              placeholder="'3'"
              value={saleState.quantity}
              onChange={(e) => setSaleState({ ...saleState, quantity: Number(e.target.value) })}
            />
            <Input
              type="number"
              step={0.1}
              min={0}
              label="Precio de venta (Bs)"
              color="primary"
              placeholder="'40.5'"
              value={saleState.salePrice}
              onChange={(e) => setSaleState({ ...saleState, salePrice: Number(e.target.value) })}
            />

            <Button type="submit" color="primary">Guardar</Button>
          </form>
        </main>
      </CustomDialog>
    </>
  );
};
