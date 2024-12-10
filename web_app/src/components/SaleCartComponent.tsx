import { useEffect, useRef, useState } from "react";
import { Proform } from "../interfaces";
import { createApiProform, createApiSale, getClientByNit } from "../services";
import { Spinner } from "./Spinner";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { TableBuilder } from "./TableBuilder";
import { Print } from "../pages/Print";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../store";

const COLUMNS = [
    'cod',
    'cant',
    'p.v.',
    'sub',
    ''
];

interface SaleState {
    nit: string;
    first_name: string;
    last_name: string;
    phone: string;
}

export const SaleCartComponent = () => {
    const [saleState, setSaleState] = useState<SaleState>({ nit: '', first_name: '', last_name: '', phone: '' });
    const [proform, setProform] = useState<Proform>();
    // loadings
    const [searchLoading, setSearchLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [proformLoading, setProformLoading] = useState(false);

    const saleCart = useStore(state => state.saleCart);
    const setSaleCart = useStore(state => state.setSaleCart);

    const pdfRef = useRef<HTMLDivElement>(null);

    const removeItem = (productCode: string) => {
        const data = saleCart.filter(p => p.product_code !== productCode);
        setSaleCart(data);
    };

    const setTotal = () => {
        const total = saleCart.reduce((acc, el) => acc + (el.amount * el.unit_price), 0);
        return total;
    };

    const onClean = () => {
        setSaleState({ nit: '', first_name: '', last_name: '', phone: '' });
        setSaleCart([]);
    };

    const onSaveSale = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (saleCart.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }

        if (saleState.nit === '' || saleState.first_name === '' || saleState.last_name === '' || saleState.phone === '') {
            alert('Debe proporcionar datos del cliente');
            return;
        }

        setSaveLoading(true);
        const data = { ...saleState, products: saleCart };
        await createApiSale(data);
        onClean();
        setSaveLoading(false);
    };

    const onFindClient = async () => {
        if (saleState.nit === '') {
            alert('Debe proporcionar un nit para realizar la busqueda');
            return;
        }
        setSearchLoading(true);
        const result = await getClientByNit(saleState.nit);
        if (result.success) {
            setSaleState({ nit: result.data.nit, first_name: result.data.first_name, last_name: result.data.last_name, phone: result.data.phone });
        } else if (result.error.status === 400) {
            setSaleState({ nit: saleState.nit, first_name: '', last_name: '', phone: '' });
        } else {
            console.error(result.error);
        }
        setSearchLoading(false);
    };

    const printProform = async () => {
        if (saleCart.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }

        if (saleState.nit === '' || saleState.first_name === '' || saleState.last_name === '' || saleState.phone === '') {
            alert('Debe proporcionar datos del cliente');
            return;
        }

        const data = { ...saleState, products: saleCart };

        setProformLoading(true);
        // call api
        const resp = await createApiProform(data);
        setProform(resp);
        setProformLoading(false);
    };

    const handlePrint = useReactToPrint({
        content: () => pdfRef.current,
        // onAfterPrint: () => onClean(),
    });

    useEffect(() => {
        if (proform) {
            handlePrint();
        }
    }, [handlePrint, proform]);

    return (
        <form className="px-4 py-2 md:mx-auto md:w-[500px] flex flex-col h-full" onSubmit={onSaveSale}>
            <h4 className="text-lg font-medium text-gray-800 h-8">Registrar Ventas (Bs)</h4>
            <section className="flex h-12 items-start">
                <div className="flex-1 flex gap-2 items-end">
                    <div className="flex-1 h-12">
                        <Input
                            type="text"
                            label="Nit"
                            placeholder="'2123'"
                            value={saleState.nit}
                            onChange={(e) => setSaleState({ ...saleState, nit: e.target.value })}
                        />
                    </div>
                    <div className="w-6 h-6">
                        <Button
                            type="button"
                            color="success"
                            onClick={onFindClient}
                        >
                            {searchLoading ? <Spinner color="white" size="md" /> : <i className="las la-search la-lg" />}
                        </Button>
                    </div>
                </div>
                <div className="flex-1"></div>
            </section>

            <section className="flex items-center gap-2 h-20">
                <div className="flex-1 h-12">
                    <Input
                        type="text"
                        label="Nombres"
                        placeholder="'Pepe'"
                        value={saleState.first_name}
                        onChange={(e) => setSaleState({ ...saleState, first_name: e.target.value })}
                    />
                </div>
                <div className="flex-1 h-12">
                    <Input
                        type="text"
                        label="Apellidos"
                        placeholder="'Perez'"
                        value={saleState.last_name}
                        onChange={(e) => setSaleState({ ...saleState, last_name: e.target.value })}
                    />
                </div>
                <div className="flex-1 h-12">
                    <Input
                        type="text"
                        label="Telefono"
                        placeholder="'7832362'"
                        value={saleState.phone}
                        onChange={(e) => setSaleState({ ...saleState, phone: e.target.value })}
                    />
                </div>
            </section>

            <section className="flex-1 overflow-auto">
                {saleCart.length > 0 ?
                    <TableBuilder
                        columns={COLUMNS}
                        children={saleCart.map((s) => {
                            return (
                                <tr key={s.product_code} className="text-left text-xs font-normal text-gray-900 h-8">
                                    <td className="flex items-center h-8 w-20 line-clamp-1">{s.product_code}</td>
                                    <td className="p-1">{s.amount}</td>
                                    <td className="p-1">{s.unit_price}</td>
                                    <td className="p-1">{Math.round((s.amount * s.unit_price) * 10) / 10}</td>
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
                                <td className="p-1 uppercase" colSpan={3}>
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
                    <Button type="button" color="success" onClick={proform ? handlePrint : printProform}>
                        {proformLoading ? <Spinner color="white" size="md" /> : 'Proforma'}
                    </Button>
                </div>
                <div className="flex-1 h-8">
                    <Button type="submit" color="primary">
                        {saveLoading ? <Spinner color="white" size="md" /> : 'Venta'}
                    </Button>
                </div>
            </section>
            {proform &&
                <div className="hidden">
                    <Print ref={pdfRef} proform={proform} />
                </div>
            }
        </form>

    );
};
