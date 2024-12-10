import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Place } from "../interfaces";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Spinner } from "../components/Spinner";
import { getApiPlaces } from "../services";


// const COLUMNS = [
//   '#',
//   'Nombre',
//   'Descripción',
//   // 'Creado',
//   // 'Actualizado',
//   ''
// ];

export const Places = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    getPlaces(controller.signal);

    return () => {
      controller.abort();
    };
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


  return (
    <main className="flex flex-col md:mx-auto md:w-[500px] h-full">
      <header className="flex items-center px-4 md:p-0 h-14 gap-6">
        <div className="flex-initial h-8 w-14">
          <Link to="/places/form">
            <Button type="button">Nuevo</Button>
          </Link>
        </div>

        <form className="flex-1 flex gap-2 items-center" onSubmit={onSubmit}>
          <div className="flex-1 h-8">
            <Input
              type="text"
              placeholder="Ej: Lugar 'X'"
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
        {!loading && places.map(p => (
          <Link to={`/places/form?id=${p.id}`} className="flex flex-col gap-1 py-2 border-b" key={p.id}>
            <span className="text-sm font-semibold text-gray-800">{p.name}</span>
            <span className="text-sm font-light text-gray-700">{p.description}</span>
          </Link>
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


// {!loading &&
//   <TableBuilder
//     columns={COLUMNS}
//     children={places.map((b) => {
//       return (
//         <tr key={b.id} className="text-left text-sm font-normal text-gray-900">
//           <td className="p-2">{b.id}</td>
//           <td className="p-2">{b.name}</td>
//           <td className="p-2">{b.description}</td>
//           {/* <td className="p-2">{new Date(b.createdAt).toLocaleDateString()}</td>
//           <td className="p-2">{new Date(b.updatedAt).toLocaleDateString()}</td> */}
//           <td className="flex gap-2 items-center h-12">
//             <div className="w-8">
//               <Link to={`/places/form?id=${b.id}`}>
//                 <Button type="button" color="success" size="xs">
//                   <i className="las la-pen la-lg" />
//                 </Button>
//               </Link>
//             </div>
//             <div className="w-8">
//               <BtnDeletaConfirmDialog
//                 title="Eliminar"
//                 subtitle={`¿Esta seguro que desea eliminar el lugar ${b.name}?`}
//                 onConfirm={() => onDelete(b.id)}
//               />
//             </div>
//           </td>
//         </tr>
//       );
//     })}
//   />
// }