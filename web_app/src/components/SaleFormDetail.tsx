import React, { useState } from 'react';
import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { Product, SaleCart } from "../interfaces";

type Props = {
    product: Product;
    closeDialog: () => void;
    onConfirmDialog: (sale: SaleCart) => void;
};

export const SaleFormDetail = ({ product, onConfirmDialog, closeDialog }: Props) => {
    const [saleState, setSaleState] = useState<SaleCart>({
        product_id: product.id,
        product_code: product.code,
        amount: 0,
        unit_price: Number(product.price)
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (typeof saleState.amount === 'string' || typeof saleState.unit_price === 'string') {
            alert('Formulario no valido');
            return;
        }

        if (saleState.amount === 0) {
            alert('Debe ingresar una cantidad');
            return;
        }

        if (saleState.amount > product.stock) {
            alert('No hay stock suficiente');
            return;
        }

        onConfirmDialog(saleState);
        closeDialog();
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <h3 className="text-lg text-center font-bold text-neutral-800">Compra</h3>

            <Input
                type="number"
                label="Cantidad"
                color="primary"
                min={0}
                placeholder="'3'"
                value={saleState.amount}
                onChange={(e) => setSaleState({ ...saleState, amount: Number(e.target.value) })}
            />
            <Input
                type="number"
                step={0.1}
                min={0}
                label="Precio de venta (Bs)"
                color="primary"
                placeholder="'40.5'"
                value={saleState.unit_price}
                onChange={(e) => setSaleState({ ...saleState, unit_price: Number(e.target.value) })}
            />

            <Button type="submit" color="primary">Agregar</Button>
        </form>
    );
};
