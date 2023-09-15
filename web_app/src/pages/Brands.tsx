import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brand } from "../interfaces";
import { deleteApiBrand, getApiBrands } from "../services";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { TableBuilder } from "../components/TableBuilder";
import { Spinner } from "../components/Spinner";
import { BtnDeletaConfirmDialog } from "../components/common/BtnDeleteConfirmDialog";

const COLUMNS = [
  '#',
  'Nombre',
  'Descripción',
  // 'Creado',
  // 'Actualizado',
  ''
];


export const Brands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getProviders(controller.signal);

  }, []);


  const getProviders = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await getApiBrands(search, signal);
      setBrands(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getProviders();
  };

  const onDelete = async (id: number) => {
    setLoading(true);
    await deleteApiBrand(id);
    await getProviders();
    setLoading(false);
  };

  return (
    <main className="flex flex-col gap-8">
      <header className="flex justify-between">

        <div className="w-20">
          <Link to="/brands/form">
            <Button type="button">Nuevo</Button>
          </Link>
        </div>

        <form className="flex gap-2 items-center" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="'Marca X'"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="w-12">
            <Button type="submit" color="success">
              <i className="las la-search la-lg" />
            </Button>
          </div>
        </form>
      </header>

      <section className="overflow-auto h-[calc(100vh_-_10rem)]">
        {!loading &&
          <TableBuilder
            columns={COLUMNS}
            children={brands.map((b) => {
              return (
                <tr key={b.id} className="text-left text-sm font-normal text-gray-900">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.name}</td>
                  <td className="p-2">{b.description}</td>
                  {/* <td className="p-2">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(b.updatedAt).toLocaleDateString()}</td> */}
                  <td className="flex gap-2 items-center h-12">
                    <div className="w-8">
                      <Link to={`/brands/form?id=${b.id}`}>
                        <Button type="button" color="success" size="xs">
                          <i className="las la-pen la-lg" />
                        </Button>
                      </Link>
                    </div>
                    <div className="w-8">
                      <BtnDeletaConfirmDialog
                        title="Eliminar"
                        subtitle={`¿Esta seguro que desea eliminar la marca ${b.name}?`}
                        onConfirm={() => onDelete(b.id)}
                      />
                    </div>
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