import { forwardRef } from "react";
import { Proform } from "../interfaces";

interface Props {
    proform: Proform;
}

const COLUMNS = [
    'cod',
    'cantidad',
    'p. venta',
    'subtotal'
];
// landscape
// portrait

export const Print = forwardRef<HTMLDivElement, Props>(({ proform }, ref) => {

    const setTotal = () => {
        const total = proform.proform_detail.reduce((acc, el) => acc + (el.amount * el.unit_price), 0);
        return total;
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
            <div className='bg-white rounded-sm p-5 flex flex-col gap-8' ref={ref}>
                {/* header */}
                <div className='flex justify-between items-start'>
                    <div className='flex gap-3'>
                        <div className='w-4 bg-blue-600' />
                        <h3 className='flex-1 text-xl text-neutral-800 font-medium'>PeñaVal</h3>
                    </div>
                </div>
                {/* summary */}
                <div className='flex flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <h5 className='text-base font-bold text-neutral-800'>Proforma: {proform.id}</h5>
                        <p className='text-sm font-light text-neutral-600 flex gap-1 items-center'>
                            <i className='las la-clock la-lg' />
                            {new Date(proform.date).toLocaleString()}
                        </p>
                    </div>
                </div>
                {/* table */}
                <table className='report'>
                    <thead className='text-xs font-semibold uppercase text-gray-2 bg-neutral-200'>
                        <tr className='font-semibold text-left'>
                            {COLUMNS.map((c, i) => <th key={i} className='p-2'>{c}</th>)}
                        </tr>
                    </thead>

                    <tbody className='text-sm text-neutral-800 divide-y divide-gray-100'>
                        {proform.proform_detail.map((d) => (
                            <tr key={d.id} className='text-gray-700 text-sm font-normal'>
                                <td className='p-2'>
                                    <p className="text-sm font-medium text-black">{d.product.code}</p>
                                </td>
                                <td className='p-2'>
                                    <p className="text-sm font-medium text-black">{d.amount}</p>
                                </td>
                                <td className='p-2'>
                                    <p className="text-sm font-medium text-black">{d.unit_price} Bs</p>
                                </td>
                                <td className='p-2'>
                                    <p className="text-sm font-medium text-black">{d.subtotal} Bs</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    <tfoot>
                        <tr className="sticky bottom-0 text-left bg-neutral-200 text-gray-800 text-sm font-semibold">
                            <td className="p-2 uppercase" colSpan={3}>
                                Total:
                            </td>
                            <td className="p-2" colSpan={1}>
                                {setTotal()} Bs
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
});