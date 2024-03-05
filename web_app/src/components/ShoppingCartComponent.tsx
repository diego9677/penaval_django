import React, { useEffect, useState } from 'react';
import { Select } from "./common/Select";
import { TableBuilder } from "./TableBuilder";
import { Button } from "./common/Button";
import { Provider } from "../interfaces";
import { Spinner } from "./Spinner";
import { createApiShopping, getApiProviders } from "../services";
import { useStore } from "../store";

const COLUMNS = [
    'cod',
    'cant',
    'P.Compra',
    'P.Venta',
    'Subtotal',
    ''
];

export const ShoppingCartComponent = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
    // const [shoppingCartState, setShoppingCartState] = useState<ShoppingCart[]>(getShopping());
    const [selectedProvider, setSelectedProvider] = useState<number | string>('');
    const [saveLoading, setSaveLoading] = useState(false);

    const shoppingCart = useStore(state => state.shoppingCart);
    const setShoppingCart = useStore(state => state.setShoppingCart);

    const getProviders = async (signal?: AbortSignal) => {
        const data = await getApiProviders('', signal);
        setProviders(data);
    };

    const removeItem = (productCode: string) => {
        const data = shoppingCart.filter(p => p.product_code !== productCode);
        setShoppingCart(data);
    };

    const setTotal = () => {
        const total = shoppingCart.reduce((acc, el) => acc + (el.amount * el.pucharse_price), 0);
        return total;
    };

    const onClean = () => {
        setSelectedProvider('');
        setShoppingCart([]);
    };

    const onSaveShopping = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (shoppingCart.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }

        if (typeof selectedProvider === 'string') {
            alert('Debe seleccionar un proveedor');
            return;
        }

        setSaveLoading(true);
        const data = { provider_id: selectedProvider, products: shoppingCart };
        await createApiShopping(data);
        onClean();
        setSaveLoading(false);
    };

    useEffect(() => {
        const controller = new AbortController();

        getProviders(controller.signal);

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <section className="p-2 md:mx-auto md:w-[500px]">
            <h4 className="text-lg font-medium text-gray-800">Registrar Compra</h4>

            <form className="flex flex-col gap-5" onSubmit={onSaveShopping}>

                <section className="">
                    <Select
                        id="id-provider"
                        label="Proveedor"
                        options={providers.map(p => ({ label: p.name, value: p.id }))}
                        value={selectedProvider}
                        onChange={(value) => setSelectedProvider(value)}
                    />
                </section>

                <section className="overflow-auto h-[calc(100vh_-_15rem)]">
                    {shoppingCart.length > 0 ?
                        <TableBuilder
                            columns={COLUMNS}
                            children={shoppingCart.map((s) => {
                                return (
                                    <tr key={s.product_code} className="text-left text-sm font-normal text-gray-900">
                                        <td className="p-1 w-20 line-clamp-1">{s.product_code}</td>
                                        <td className="p-1">{s.amount}</td>
                                        <td className="p-1">{s.pucharse_price} Bs</td>
                                        <td className="p-1">{s.sale_price} Bs</td>
                                        <td className="p-1">{Math.round((s.amount * s.pucharse_price) * 10) / 10} Bs</td>
                                        <td className="">
                                            <div className="w-8">
                                                <Button
                                                    type="button"
                                                    color="danger"
                                                    size="xs"
                                                    onClick={() => removeItem(s.product_code)}
                                                >
                                                    <i className="las la-trash-alt la-lg" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            footer={
                                <>
                                    <td className="p-2 uppercase" colSpan={4}>
                                        Total:
                                    </td>
                                    <td className="p-2" colSpan={2}>
                                        {setTotal()} Bs
                                    </td>
                                </>
                            }
                        />
                        :
                        <div className="flex h-28 bg-gray-200 justify-center items-center rounded-md">
                            <p className="text-gray-800 font-medium text-lg">
                                No hay información util
                            </p>
                        </div>
                    }
                </section>

                <section className="flex gap-2">
                    <div className="flex-1">
                        <Button type="button" color="danger" onClick={onClean}>Limpiar</Button>
                    </div>
                    <div className="flex-1">
                        <Button type="submit" color="primary">
                            {saveLoading ? <Spinner color="white" size="md" /> : 'Guardar'}
                        </Button>
                    </div>
                </section>
            </form>
        </section>
    );
};
