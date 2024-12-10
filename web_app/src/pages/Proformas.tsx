import React, { useState } from 'react';
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";
import { Proform } from "../interfaces";
import { getApiProform } from "../services";
import { useStore } from "../store";

export const Proformas = () => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>();
    const [proformas, setProformas] = useState<Proform[]>([]);

    const setSaleCart = useStore(state => state.setSaleCart)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (search !== '') {
            setLoading(true);
            const resp = await getApiProform(search);
            setProformas(resp);
            setLoading(false);
        } else {
            setMessage('Debe buscar por un numero de proforma')
        }
    };

    const loadSales = (proform: Proform) => {
        const saleCart = proform.proform_detail.map(p => ({ product_id: p.product.id, product_code: p.product.code, amount: p.amount, unit_price: p.unit_price }));
        setSaleCart(saleCart);
        alert('Productos agregados a la venta');
    }

    return (
        <main className="flex flex-col md:gap-8 md:mx-auto md:w-[500px] h-full">
            <header className="flex items-center px-4 md:p-0 h-14">
                <form className="flex-1 flex gap-2 items-center" onSubmit={onSubmit}>
                    <div className="flex-1 h-8">
                        <Input
                            type="number"
                            placeholder="Ej: Proforma"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex-initial h-8 w-8">
                        <Button type="submit" color="success">
                            <i className="las la-search la-lg" />
                        </Button>
                    </div>
                </form>
            </header>

            <section className="overflow-auto flex-1 px-4 md:p-0">
                {message && !loading && (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-sm font-medium text-neutral-800">{message}</p>
                    </div>
                )}
                {!loading && !message && proformas.map(p => (
                    <button className="w-full flex flex-col gap-1 border-b py-2" key={p.id} onClick={() => loadSales(p)}>
                        <span className="text-sm font-semibold text-gray-800">Proforma: {p.id}</span>
                        <span className="text-sm font-semibold text-gray-800">Cliente: {p.client.first_name} {p.client.last_name}</span>
                        <span className="text-sm font-light text-gray-700">{new Date(p.date).toLocaleString()}</span>
                    </button>
                ))}
                {loading && !message &&
                    <div className="flex justify-center items-center h-full">
                        <Spinner color="primary" size="lg" />
                    </div>
                }
            </section>
        </main>
    );
};
