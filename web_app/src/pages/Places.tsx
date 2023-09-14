import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Place } from "../interfaces";
import { deleteApiPlace, getApiPlaces } from "../services";
import { TableBuilder } from "../components/TableBuilder";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";
import { BtnDeletaConfirmDialog } from "../components/common/BtnDeleteConfirmDialog";


const COLUMNS = [
  '#',
  'Nombre',
  'Descripción',
  'Creado',
  'Actualizado',
  ''
];

export const Places = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getPlaces(controller.signal);

  }, []);


  const getPlaces = async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const data = await getApiPlaces(search, signal);
      setPlaces(data);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await getPlaces();
  };

  const onDelete = async (id: number) => {
    setLoading(true);
    await deleteApiPlace(id);
    await getPlaces();
    setLoading(false);
  };

  return (
    <main className="flex flex-col gap-8">
      <header className="flex justify-between">

        <div className="w-20">
          <Link to="/wa/places/form">
            <Button type="button">Nuevo</Button>
          </Link>
        </div>

        <form className="flex gap-2 items-center" onSubmit={onSubmit}>
          <Input
            type="text"
            placeholder="Ej: Lugar 'X'"
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
            children={places.map((b) => {
              return (
                <tr key={b.id} className="text-left text-sm font-normal text-gray-900">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.name}</td>
                  <td className="p-2">{b.description}</td>
                  <td className="p-2">{new Date(b.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(b.updatedAt).toLocaleDateString()}</td>
                  <td className="flex gap-2 items-center h-12">
                    <div className="w-8">
                      <Link to={`/wa/places/form?id=${b.id}`}>
                        <Button type="button" color="success" size="xs">
                          <i className="las la-pen la-lg" />
                        </Button>
                      </Link>
                    </div>
                    <div className="w-8">
                      <BtnDeletaConfirmDialog
                        title="Eliminar"
                        subtitle={`¿Esta seguro que desea eliminar el lugar ${b.name}?`}
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
