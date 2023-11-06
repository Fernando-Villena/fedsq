import { useEffect, useState } from 'react';
import banner from '/assets/img/salad-2756467_1920.jpg';

interface MesasPageProps {
  token: string;
}

interface Mesa {
  id: number;
  url: string;
  link: string;
  qrImage: string;
  rol: string;
}

function MesasPage({ token }: MesasPageProps) {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [nuevaMesa, setNuevaMesa] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(4);
  const [containerHeight, setContainerHeight] = useState('97vh');

 
  const fetchMesas = async () => {
    try {
      const response = await fetch('https://emiliosk11.pythonanywhere.com/api/usuarios/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        const mesasFiltradas = data.filter((mesa: Mesa) => mesa.rol === 'mesa');
        setMesas(mesasFiltradas);
      } else {
        console.log('No se pudo obtener la lista de mesas.');
      }
    } catch (error) {
      console.log('Ocurrió un error al obtener las mesas. Por favor, intenta de nuevo más tarde.');
    }
  };
  useEffect(() => {
    const updateContainerHeight = () => {
      if (window.innerWidth >= 1700) {
        setContainerHeight('');
      } else {
        setContainerHeight(''); // Otra altura deseada cuando la pantalla es pequeña
      }
    };
  
    // Agrega un event listener para el evento resize
    window.addEventListener('resize', updateContainerHeight);
  
    // Llama a la función para aplicar el estilo inicialmente
    updateContainerHeight();
  
    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', updateContainerHeight);
    };
  }, []);


  useEffect(() => {
    fetchMesas();

    const intervalId = setInterval(fetchMesas, 100000);

    return () => clearInterval(intervalId);
  }, [token]);

  const extraerNumeroDelEnlace = (enlace: string) => {
    const match = enlace.match(/\/(\d+)$/);
    return match ? match[1] : null;
  };

  const handleAgregarMesa = async () => {
    try {
      const mesaUrl = `https://legendary-kelpie-b17f6a.netlify.app/#/mesa/${nuevaMesa}`;

      if (mesas.some((mesa) => mesa.link === mesaUrl)) {
        console.log('El link de la mesa ya existe.');
      } else {
        const response = await fetch('https://emiliosk11.pythonanywhere.com/api/usuarios/crear_superusuarios/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: nuevaMesa,
            password: '123',
            email: 'a@a.com',
            rol: 'mesa',
            link: mesaUrl,
          }),
        });

        if (response.status === 201) {
          setNuevaMesa('');
          fetchMesas(); // Actualiza la lista de mesas
        } else {
          console.log('No se pudo agregar la mesa. Verifica los datos ingresados.');
        }
      }
    } catch (error) {
      console.log('Ocurrió un error al agregar la mesa. Por favor, intenta de nuevo más tarde.');
    }
  };

  const handleEliminarMesa = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        const updatedMesas = mesas.filter((mesa) => mesa.url !== url);
        setMesas(updatedMesas);
      } else {
        console.log('No se pudo eliminar la mesa.');
      }
    } catch (error) {
      console.log('Ocurrió un error al eliminar la mesa. Por favor, intenta de nuevo más tarde.');
    }
  };

  const getCurrentPageMesas = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mesas.slice(startIndex, endIndex);
  };

  return (
    <div className='container-fluid bg-white rounded' style={{ height: containerHeight }} >
      <div className='p-5'>
        <div className='card' >
          <div style={{ background: `url(${banner}) center / cover no-repeat`, height: '200px', textAlign: 'center', position: 'relative', borderTopRightRadius: '5px',borderTopLeftRadius: '5px' }}>
            <h1 style={{ color: 'white', paddingTop: '100px', fontSize: '34px', textShadow: '2px 2px 4px rgba(0, 0, 1, 1)', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
              Estás en el administrador de mesas
            </h1>
          </div>

          <div className='m-3'>
            <div className='row'>
              <div className="col">
                <h3 className='text-dark mb-4' style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>Agregar nueva mesa</h3>
              </div>
              <div className="col">
                <nav aria-label="Paginación" >
                  <ul className="pagination float-end   justify-content-center" >
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Página anterior"
                      >
                        <span aria-hidden="true" >Anterior</span>
                      </button>
                    </li>
                    {mesas.length > itemsPerPage && (
                      Array.from({ length: Math.ceil(mesas.length / itemsPerPage) }).map((_, index) => (
                        <li
                          key={index}
                          className={`page-item ${currentPage === index + 1 ? 'active ' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))
                    )}
                    <li className={`page-item ${currentPage === Math.ceil(mesas.length / itemsPerPage) ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Página siguiente"
                      >
                        <span aria-hidden="true">Siguiente</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <input
              className='form-control'
              type="text"
              placeholder="Nombre de la nueva mesa"
              value={nuevaMesa}
              onChange={(e) => setNuevaMesa(e.target.value)}
            />
            <div className="d-grid gap-2">
              <button type="button" className="btn  btn-dark mt-2" onClick={handleAgregarMesa}>Agregar</button>
            </div>
          </div>
        </div>
        <table className='mt-5 shadow rounded bg-body-tertiary   table table-bordered text-center border-round' >
          <thead>
            <tr>
              <th scope="col">Numero de mesa</th>
              <th scope="col">Qr</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageMesas().map((mesa) => (
              <tr key={mesa.id}>
                <td className='align-middle'>{extraerNumeroDelEnlace(mesa.link)}</td>
                <td className='align-middle'> <img src={mesa.qrImage} style={{ width: '80px' }} alt={mesa.link} /></td>
                <td className='align-middle'>
                  <button type="button" className="btn btn-dark" onClick={() => handleEliminarMesa(mesa.url)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MesasPage;
