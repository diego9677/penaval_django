import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getApiSale, updateApiUrlSale } from "../services";
import { Sale } from "../interfaces";
import { Spinner } from "../components/Spinner";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";

const COLUMNS = [
    'producto',
    'cantidad',
    'precio (bs)',
    'subtotal (bs)'
];

export const SaleConfirmation = () => {
    const [sale, setSale] = useState<Sale>();
    const [loading, setLoading] = useState<boolean>(true);

    const pdfRef = useRef<HTMLDivElement>(null);

    const [searchParams] = useSearchParams();
    const saleId = searchParams.get('sale_id');

    const setTotal = (sale: Sale) => {
        const total = sale.sale_detail.reduce((acc, el) => acc + (el.amount * el.unit_price), 0);
        return total.toFixed(2);
    };

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const datos = Object.fromEntries(formData.entries()) as { url: string };
        if (sale) {
            updateApiUrlSale(sale?.id, datos.url)
                .then((resp) => {
                    console.log(resp);
                    alert('Url Guardada correctamente');
                });
        }
    };

    useEffect(() => {
        const controler = new AbortController();

        if (saleId) {
            getApiSale(Number(saleId), controler.signal)
                .then(data => {
                    setSale(data);
                    setLoading(false);
                });
        }

        return () => {
            controler.abort();
        };
    }, [saleId]);

    if (loading) {
        return (
            <main className="h-full flex justify-center items-center">
                <Spinner color="primary" size="lg" />
            </main>
        );
    }

    return (
        <main className="px-4 py-2 md:mx-auto md:w-[800px] flex flex-col h-full gap-4">
            {sale && (
                <section ref={pdfRef} className="flex-1 bg-white shadow-md rounded-lg border flex flex-col p-5 gap-2">
                    <header className='flex items-start'>
                        <div className="flex-1 flex flex-col">
                            <img className="object-cover h-20 w-32" src="/static/logo.jpg" />
                            <p className="text-xs font-normal text-neutral-600 text-left">Av. Escuadron Velasco, Calle Remigimiento 31<br />Esquina Miguel Castro Pintó #412</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-sm font-normal text-neutral-700">Nro:&nbsp;{sale.id}</p>
                        </div>
                    </header>

                    <section className="flex justify-center items-center">
                        <h6 className="text-xl font-bold text-neutral-800">NOTA DE VENTA</h6>
                    </section>

                    {/* summary */}
                    <main className='flex items-end mb-5'>
                        <section className="flex-1 flex flex-col gap-2">
                            <h5 className='text-base font-bold text-neutral-800'>Cliente</h5>
                            <div className="flex items-center">
                                <span className="text-sm font-normal text-neutral-700 w-56">{sale.client.first_name}&nbsp;{sale.client.last_name}</span>
                                <CopyToClipBoardButton value={`${sale.client.first_name} ${sale.client.last_name}`} />
                            </div>
                            <section className="flex items-center">
                                <div className="flex items-center w-56">
                                    <span className="text-sm font-normal text-neutral-700">Nit:&nbsp;</span>
                                    <span className="text-sm font-normal text-neutral-600">{sale.client.nit}</span>
                                </div>
                                <CopyToClipBoardButton value={sale.client.nit} />
                            </section>
                            <section className="flex items-center">
                                <div className="flex items-center w-56">
                                    <span className="text-sm font-normal text-neutral-700">Teléfono:&nbsp;</span>
                                    <span className="text-sm font-normal text-neutral-600">{sale.client.phone}</span>
                                </div>
                                <CopyToClipBoardButton value={sale.client.phone} />
                            </section>
                        </section>
                        <div className="flex items-center">
                            <span className="text-sm font-normal text-neutral-700">Fecha:&nbsp;</span>
                            <p className='text-sm font-light text-neutral-600 flex gap-1 items-center'>
                                {new Date(sale.date).toLocaleString()}
                            </p>
                        </div>
                    </main>
                    {/* table */}
                    <table className='border overflow-hidden rounded-lg border-neutral-200'>
                        <thead className='text-left text-xs font-medium uppercase text-gray-800 bg-gray-100'>
                            <tr className=''>
                                {COLUMNS.map((c, i) => <th key={i} className='p-2'>{c}</th>)}
                            </tr>
                        </thead>

                        <tbody className='divide-y divide-gray-100'>
                            {sale.sale_detail.map((d) => (
                                <tr key={d.id}>
                                    <td className='p-2'>
                                        <div className="flex items-center gap-2 w-52">
                                            <span className="text-sm text-gray-800 font-normal whitespace-nowrap flex-1">{d.product.type_product.name} {d.product.code}</span>
                                            <CopyToClipBoardButton value={`${d.product.type_product.name} ${d.product.code}`} />
                                        </div>
                                    </td>
                                    <td className='p-2'>
                                        <div className="flex items-center gap-2 w-16">
                                            <span className="text-sm text-gray-800 font-normal flex-1">{d.amount}</span>
                                            <CopyToClipBoardButton value={d.amount.toString()} />
                                        </div>
                                    </td>
                                    <td className='p-2'>
                                        <div className="flex items-center gap-2 w-24">
                                            <span className="text-sm text-gray-800 font-normal flex-1">{d.unit_price}</span>
                                            <CopyToClipBoardButton value={d.unit_price.toString()} />
                                        </div>
                                    </td>
                                    <td className='p-2'>{d.subtotal}</td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr className="sticky bottom-0 text-left bg-gray-100">
                                <td className="p-2 uppercase text-neutral-800 text-xs font-semibold" colSpan={3}>
                                    Total:
                                </td>
                                <td className="p-2 text-neutral-800 text-sm font-normal" colSpan={1}>
                                    {setTotal(sale)}&nbsp;Bs
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </section>
            )}

            <form className="flex items-end gap-2 px-1" onSubmit={onSubmit}>
                <div className="h-14 flex-1">
                    <Input name="url" label="URL de la Factura" type="text" />
                </div>
                <div className="w-20 h-8">
                    <Button type={"submit"} >Guardar</Button>
                </div>
            </form>
        </main>
    );
};


const CopyToClipBoardButton = ({ value }: { value: string; }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (error) {
            console.error("Error copiando al portapapeles:", error);
        }
    };

    return (
        <div className="relative">
            <button
                title="Copiar al portapapeles"
                className="flex text-sm items-center justify-center text-gray-400 hover:text-black"
                onClick={handleCopy}
            >
                <i className="las la-copy la-lg"></i>
            </button>
            {copySuccess && (
                <span className="absolute bottom-full font-bold right-0 mb-1 bg-gray-200 text-black text-xs p-2 rounded shadow-sm whitespace-nowrap">
                    ¡Copiado!
                </span>
            )}
        </div>
    );

};