import React, { useState } from 'react';
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";
import { Proform } from "../interfaces";
import { getApiProform, setSale } from "../services";

export const Proformas = () => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [proformas, setProformas] = useState<Proform[]>([]);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const resp = await getApiProform(search);
        setProformas(resp);
        setLoading(false);
    };

    const loadSales = (proform: Proform) => {
        const saleCart = proform.proform_detail.map(p => ({ product_id: p.product.id, product_code: p.product.code, amount: p.amount, unit_price: p.unit_price }));
        setSale(saleCart);
        alert('Productos agregados a la venta');
    }

    return (
        <main className="flex flex-col md:gap-8 md:mx-auto md:w-[500px]">
            <header className="flex items-center px-4 py-2 md:p-0">
                <form className="flex-1 flex gap-2 items-center" onSubmit={onSubmit}>
                    <div className="flex-1">
                        <Input
                            type="number"
                            placeholder="Ej: Proforma"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-12">
                        <Button type="submit" color="success">
                            <i className="las la-search la-lg" />
                        </Button>
                    </div>
                </form>
            </header>

            <section className="overflow-auto h-[calc(100vh_-_9rem)] py-2 px-4 md:p-0">
                {!loading && proformas.map(p => (
                    <button className="w-full flex flex-col gap-1 border-b py-2" key={p.id} onClick={() => loadSales(p)}>
                        <span className="text-sm font-semibold text-gray-800">Proforma: {p.id}</span>
                        <span className="text-sm font-light text-gray-700">{new Date(p.date).toLocaleString()}</span>
                    </button>
                ))}
                {loading &&
                    <div className="flex justify-center items-center h-full">
                        <Spinner color="primary" size="lg" />
                    </div>
                }
            </section>
        </main>
    );
};
