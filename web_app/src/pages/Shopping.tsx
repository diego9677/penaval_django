import { useState } from "react";
import { Link } from "react-router-dom";

import { getApiShopping } from "../services";
import { ParamsReport, Shopping as ShoppingType } from "../interfaces";
import RangeDatepicker from "../components/RangeDatePicker";
import { Button } from "../components/common/Button";
import { CustomDialog } from "../components/CustomDialog";
import { TableBuilder } from "../components/TableBuilder";
import { Spinner } from "../components/Spinner";

const COLUMNS = [
  '#',
  'Proveedor',
  'fecha',
  'productos',
  'total compra',
  'detalle',
];

const COLUMNS_DETAIL = [
  'Producto',
  'Cantidad',
  'P. de compra',
  'P. de Venta',
  'Sub. Compra',
];

const ShoppingDetail = ({ row }: { row: ShoppingType; }) => {
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="w-8">
        <Button type="button" color="secondary" size="xs" onClick={() => setOpen(true)}>
          <i className="las la-tasks la-lg" />
        </Button>
      </div>
      <CustomDialog dialog={open} closeDialog={closeDialog} size="sm">
        <section className="flex flex-col gap-6">
          <div className='flex justify-between gap-2'>
            <div className='flex-1'>
              <p className="text-lg font-medium text-gray-800">Detalle: {row.provider.name}</p>
            </div>
            <div className='flex-initial'>
              <Button type='button' color='danger' onClick={closeDialog} size='xs'>
                <i className='las la-lg la-times' />
              </Button>
            </div>
          </div>

          <TableBuilder
            columns={COLUMNS_DETAIL}
            children={row.shoppingDetail.map((s) => {
              return (
                <tr key={s.id} className="text-left text-sm font-normal text-gray-900">
                  <td className="p-2">{s.product.code}</td>
                  <td className="p-2">{s.amount}</td>
                  <td className="p-2">{s.unit_price_shopping} Bs</td>
                  <td className="p-2">{s.unit_price_sale} Bs</td>
                  <td className="p-2">{Number(s.unit_price_shopping) * s.amount} Bs</td>
                </tr>
              );
            })}
          />
        </section>
      </CustomDialog>
    </>
  );
};

export const Shopping = () => {
  const [loading, setLoading] = useState(false);
  const [shopping, setShopping] = useState<ShoppingType[]>([]);

  const getShopping = async (params: { begin: string; end: string; }) => {
    console.log(params)
    setLoading(true);
    try {
      const data = await getApiShopping(params);
      setShopping(data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (params: ParamsReport) => {
    const { begin, end } = params;
    if (begin && end) {
      await getShopping({ begin, end });
    } else {
      alert('Rango de fechas no valido');
    }
  };


  return (
    <main className="flex flex-col gap-8">
      <header className="flex justify-between">

        <div className="w-20">
          <Link to="/shopping/form">
            <Button type="button">Nuevo</Button>
          </Link>
        </div>

        <div className="w-1/2">
          <RangeDatepicker
            getParams={onSubmit}
          />
        </div>
      </header>

      <section className="overflow-auto h-[calc(100vh_-_10rem)]">
        {!loading &&
          <TableBuilder
            columns={COLUMNS}
            children={shopping.map((s) => {
              return (
                <tr key={s.id} className="text-left text-sm font-normal text-gray-900">
                  <td className="p-2">{s.id}</td>
                  <td className="p-2">{s.provider.name}</td>
                  <td className="p-2">{new Date(s.date).toLocaleString()}</td>
                  <td className="p-2">{s.shoppingDetail.length}</td>
                  <td className="p-2">{s.shoppingDetail.reduce((acc, el) => acc + (Number(el.unit_price_sale) * el.amount), 0)} Bs</td>
                  <td className="p-2">
                    <ShoppingDetail row={s} />
                  </td>
                </tr>
              );
            })}
          />
        }
        {loading &&
          <div className="flex justify-center items-center h-full">
            <Spinner color="primary" size="lg" />
          </div>
        }
      </section>
    </main>
  );
};
