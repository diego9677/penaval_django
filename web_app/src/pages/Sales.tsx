import { useState } from "react";
import { Link } from "react-router-dom";

import { getApiSales } from "../services";
import { ParamsReport, Sale } from "../interfaces";
import { Button } from "../components/common/Button";
import { TableBuilder } from "../components/TableBuilder";
import { Spinner } from "../components/Spinner";

import "flatpickr/dist/themes/material_green.css";
import RangeDatepicker from "../components/RangeDatePicker";
import { CustomDialog } from "../components/CustomDialog";


const COLUMNS = [
  'nit',
  'cliente',
  'fecha',
  'productos',
  'total',
  'detalle',
];

const COLUMNS_DETAIL = [
  'Producto',
  'Cantidad',
  'P. de Venta',
  'Subtotal',
];


const SaleDetail = ({ row }: { row: Sale; }) => {
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
              <p className="text-lg font-medium text-gray-800">Detalle: {row.client.person.firstName} {row.client.person.lastName}</p>
            </div>
            <div className='flex-initial'>
              <Button type='button' color='danger' onClick={closeDialog} size='xs'>
                <i className='las la-lg la-times' />
              </Button>
            </div>
          </div>

          <TableBuilder
            columns={COLUMNS_DETAIL}
            children={row.saleDetail.map((s) => {
              return (
                <tr key={s.id} className="text-left text-sm font-normal text-gray-900">
                  <td className="p-2">{s.product.code}</td>
                  <td className="p-2">{s.quantity}</td>
                  <td className="p-2">{s.salePrice} Bs</td>
                  <td className="p-2">{Number(s.salePrice) * s.quantity} Bs</td>
                </tr>
              );
            })}
          />
        </section>
      </CustomDialog>
    </>
  );
};

export const Sales = () => {
  const [loading, setLoading] = useState(false);
  const [sales, setSales] = useState<Sale[]>([]);

  const getSales = async (params: { begin: string; end: string; }) => {
    setLoading(true);
    try {
      const data = await getApiSales(params);
      setSales(data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (params: ParamsReport) => {
    const { begin, end } = params;
    if (begin && end) {
      await getSales({ begin, end });
    } else {
      alert('Rango de fechas no valido');
    }
  };

  return (
    <main className="flex flex-col gap-8">
      <header className="flex justify-between">

        <div className="w-20">
          <Link to="/sales/form">
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
            children={sales.map((s) => {
              return (
                <tr key={s.id} className="text-left text-sm font-normal text-gray-900">
                  <td className="p-2">{s.client.nit}</td>
                  <td className="p-2">{s.client.person.firstName} {s.client.person.lastName}</td>
                  <td className="p-2">{new Date(s.date).toLocaleString()}</td>
                  <td className="p-2">{s.saleDetail.length}</td>
                  <td className="p-2">{s.saleDetail.reduce((acc, el) => acc + (Number(el.salePrice) * el.quantity), 0)} Bs</td>
                  <td className="p-2">
                    <SaleDetail row={s} />
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
