import { useState } from "react";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { Product, ShoppingCart } from "../interfaces";

type Props = {
    product: Product;
    closeDialog: () => void;
    onConfirmDialog: (shopping: ShoppingCart) => void;
};

export const ShoppingFormDetail = ({ product, closeDialog, onConfirmDialog }: Props) => {
    const [shoppingState, setShoppingState] = useState<ShoppingCart>({
        product_id: product.id,
        product_code: product.code,
        amount: 0,
        pucharse_price: Number(product.pucharse_price),
        sale_price: Number(product.price),
    });

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(shoppingState);

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
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <h3 className="text-lg text-center font-bold text-neutral-800">Compra</h3>

            <div className="h-14">
                <Input
                    type="number"
                    label="Cantidad"
                    color="primary"
                    placeholder="'3'"
                    min={0}
                    value={shoppingState.amount === 0 ? '' : shoppingState.amount}
                    onChange={(e) => setShoppingState({ ...shoppingState, amount: Number(e.target.value) })}
                />
            </div>
            <div className="h-14">
                <Input
                    type="number"
                    step={0.1}
                    min={0}
                    label="Precio de compra (Bs)"
                    color="primary"
                    placeholder="'40.5'"
                    value={shoppingState.pucharse_price === 0 ? '' : shoppingState.pucharse_price}
                    onChange={(e) => setShoppingState({ ...shoppingState, pucharse_price: Number(e.target.value) })}
                />

            </div>
            <div className="h-14">
                <Input
                    type="number"
                    step={0.1}
                    min={0}
                    label="Precio de venta (Bs)"
                    color="primary"
                    placeholder="'40.5'"
                    value={shoppingState.sale_price === 0 ? '' : shoppingState.sale_price}
                    onChange={(e) => setShoppingState({ ...shoppingState, sale_price: Number(e.target.value) })}
                />
            </div>
            <div className="h-8">
                <Button type="submit" color="primary">Agregar</Button>
            </div>
        </form>
    );
};
