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
    'p.c.',
    'p.v.',
    'sub',
    ''
];

export const ShoppingCartComponent = () => {
    const [providers, setProviders] = useState<Provider[]>([]);
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
        <form className="px-4 py-2 md:mx-auto md:w-[500px] flex flex-col h-full" onSubmit={onSaveShopping}>
            <h4 className="text-lg font-medium text-gray-800 h-8">Registrar Compra (Bs)</h4>

            <section className="h-20">
                <Select
                    id="id-provider"
                    label="Proveedor"
                    options={providers.map(p => ({ label: p.name, value: p.id }))}
                    value={selectedProvider}
                    onChange={(value) => setSelectedProvider(value)}
                />
            </section>

            <section className="overflow-auto flex-1">
                {shoppingCart.length > 0 ?
                    <TableBuilder
                        columns={COLUMNS}
                        children={shoppingCart.map((s) => {
                            return (
                                <tr key={s.product_code} className="text-left text-xs font-normal text-gray-900 h-8">
                                    <td className="flex items-center h-8 w-20 line-clamp-1">{s.product_code}</td>
                                    <td className="p-1">{s.amount}</td>
                                    <td className="p-1">{s.pucharse_price}</td>
                                    <td className="p-1">{s.sale_price}</td>
                                    <td className="p-1">{Math.round((s.amount * s.pucharse_price) * 10) / 10}</td>
                                    <td className="">
                                        <div className="w-6 h-6">
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
                                <td className="p-1 uppercase" colSpan={4}>
                                    Total:
                                </td>
                                <td className="p-1" colSpan={2}>
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

            <section className="flex gap-4 h-14 items-center">
                <div className="flex-1 h-8">
                    <Button type="button" color="danger" onClick={onClean}>Limpiar</Button>
                </div>
                <div className="flex-1 h-8">
                    <Button type="submit" color="primary">
                        {saveLoading ? <Spinner color="white" size="md" /> : 'Guardar'}
                    </Button>
                </div>
            </section>
        </form>
    );
};
