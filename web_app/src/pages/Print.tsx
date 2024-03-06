import { forwardRef } from "react";
import { Proform } from "../interfaces";

interface Props {
    proform: Proform;
}

const COLUMNS = [
    'producto',
    'cantidad',
    'precio',
    'subtotal'
];
// landscape
// portrait

export const Print = forwardRef<HTMLDivElement, Props>(({ proform }, ref) => {

    const setTotal = () => {
        const total = proform.proform_detail.reduce((acc, el) => acc + (el.amount * el.unit_price), 0);
        return total.toFixed(2);
    };

    const getPageStyle = () => {
        return `@media print {
              body {
                zoom: 100%;
              }
              @page { 
                size: portrait; 
              }
            }`;
    };

    return (
        <>
            <style>{getPageStyle()}</style>
            <div className='bg-white rounded-sm p-5 flex flex-col gap-2' ref={ref}>
                {/* header */}
                <section className='flex items-start'>
                    <div className="flex-1 flex flex-col">
                        <div className="flex gap-2 items-end">
                            <div className="w-7 h-7 border"></div>
                            <h3 className='text-xl text-neutral-800 font-medium'>PeñaVal</h3>
                        </div>
                        <p className="text-xs font-normal text-neutral-600">Av. Escuadron Velasco, Calle Remigimiento 31 esquina Miguel Castro Pintó #412</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <p className="text-sm font-normal text-neutral-700">Nro:&nbsp;{proform.id}</p>
                        <div className="h-24 w-24 border">

                        </div>
                    </div>
                </section>
                {/* summary */}
                <header className='flex items-end mb-5'>
                    <section className="flex-1 flex flex-col">
                        <h5 className='text-base font-bold text-neutral-800'>Cliente</h5>
                        <span className="text-sm font-normal text-neutral-700">{proform.client.first_name}&nbsp;{proform.client.last_name}</span>
                        <div className="flex items-center">
                            <span className="text-sm font-normal text-neutral-700">Nit:&nbsp;</span>
                            <span className="text-sm font-normal text-neutral-600">{proform.client.nit}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm font-normal text-neutral-700">Teléfono:&nbsp;</span>
                            <span className="text-sm font-normal text-neutral-600">{proform.client.phone}</span>
                        </div>
                    </section>
                    <div className="flex items-center">
                        <span className="text-sm font-normal text-neutral-700">Fecha:&nbsp;</span>
                        <p className='text-sm font-light text-neutral-600 flex gap-1 items-center'>
                            {new Date(proform.date).toLocaleString()}
                        </p>
                    </div>
                </header>
                {/* table */}
                <table className='border overflow-hidden rounded-lg border-neutral-200'>
                    <thead className='text-left text-xs font-medium uppercase text-neutral-800 bg-gray-200'>
                        <tr className=''>
                            {COLUMNS.map((c, i) => <th key={i} className='p-2'>{c}</th>)}
                        </tr>
                    </thead>

                    <tbody className='text-sm text-neutral-800 divide-y divide-neutral-200 font-normal'>
                        {proform.proform_detail.map((d) => (
                            <tr key={d.id}>
                                <td className='p-2'>{d.product.code}</td>
                                <td className='p-2'>{d.amount}</td>
                                <td className='p-2'>{d.unit_price}&nbsp;Bs</td>
                                <td className='p-2'>{d.subtotal}&nbsp;Bs</td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr className="sticky bottom-0 text-left bg-gray-200">
                            <td className="p-2 uppercase text-neutral-800 text-sm font-semibold" colSpan={3}>
                                Total:
                            </td>
                            <td className="p-2 text-neutral-800 text-sm font-normal" colSpan={1}>
                                {setTotal()}&nbsp;Bs
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
});