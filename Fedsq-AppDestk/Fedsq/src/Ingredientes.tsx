import { useEffect, useState } from 'react';
import axios from 'axios';
import banner from '/assets/img/pexels-ella-olsson-1640772.jpg';

interface IngredientesPageProps {
    token: string;
}

interface Ingrediente {
    url: string;
    id: number;
    nombre_ingrediente: string;
    descripcion_ingrediente: string;
    stock: number;
    otros_detalles_ingrediente: string;
}

function Ingredientes({ token }: IngredientesPageProps) {
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [nuevoIngrediente, setNuevoIngrediente] = useState<Partial<Ingrediente>>({
        nombre_ingrediente: '',
        descripcion_ingrediente: '',
        stock: 0,
        otros_detalles_ingrediente: '',
    });
    const [editIngrediente, setEditIngrediente] = useState<Ingrediente | null>(null);
    const [containerHeight, setContainerHeight] = useState('97vh');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    useEffect(() => {
        // Obtener la lista de ingredientes desde la API
        const fetchIngredientes = async () => {
            try {
                const response = await axios.get('https://emiliosk11.pythonanywhere.com/api/ingredientes/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data = response.data;
                    setIngredientes(data);
                } else {
                    console.log('No se pudo obtener la lista de ingredientes.');
                }
            } catch (error) {
                console.log('Ocurrió un error al obtener los ingredientes. Por favor, intenta de nuevo más tarde.');
            }
        };

        fetchIngredientes();
    }, [token]);

    const indexOfLastIngrediente = currentPage * itemsPerPage;
    const indexOfFirstIngrediente = indexOfLastIngrediente - itemsPerPage;
    const currentIngredientes = ingredientes.slice(indexOfFirstIngrediente, indexOfLastIngrediente);

    // Cambiar a la página siguiente
    const prevPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (currentPage < Math.ceil(ingredientes.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };
    useEffect(() => {
        const updateContainerHeight = () => {
          if (window.innerWidth >= 1900) {
            setContainerHeight('');
          } else {
            setContainerHeight('auto'); // Otra altura deseada cuando la pantalla es pequeña
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
      

    const handleAgregarIngrediente = async () => {
        try {
            const response = await axios.post(
                'https://emiliosk11.pythonanywhere.com/api/ingredientes/',
                nuevoIngrediente,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                const nuevoIngredienteCreado = response.data;
                setIngredientes([...ingredientes, nuevoIngredienteCreado]);
                setNuevoIngrediente({
                    nombre_ingrediente: '',
                    descripcion_ingrediente: '',
                    stock: 0,
                    otros_detalles_ingrediente: '',
                });
            } else {
                console.log('No se pudo agregar el ingrediente.');
            }
        } catch (error) {
            console.log('Ocurrió un error al agregar el ingrediente.');
        }
    };

    const handleEliminarIngrediente = async (ingredienteId: number) => {
        try {
            const response = await axios.delete(
                `https://emiliosk11.pythonanywhere.com/api/ingredientes/${ingredienteId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 204) {
                const nuevosIngredientes = ingredientes.filter(ingrediente => ingrediente.id !== ingredienteId);
                setIngredientes(nuevosIngredientes);
            } else {
                console.log('No se pudo eliminar el ingrediente.');
            }
        } catch (error) {
            console.log('Ocurrió un error al eliminar el ingrediente.');
        }
    };

    const handleEditarIngrediente = (ingrediente: Ingrediente) => {
        setEditIngrediente(ingrediente);
    };

    const handleActualizarIngrediente = async () => {
        if (!editIngrediente) return;

        try {
            const response = await axios.put(
                `https://emiliosk11.pythonanywhere.com/api/ingredientes/${editIngrediente.id}/`,
                editIngrediente,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                const ingredientesActualizados = ingredientes.map(ingred =>
                    ingred.id === editIngrediente.id ? editIngrediente : ingred
                );
                setIngredientes(ingredientesActualizados);
                setEditIngrediente(null);
            } else {
                console.log('No se pudo actualizar el ingrediente.');
            }
        } catch (error) {
            console.log('Ocurrió un error al actualizar el ingrediente.');
        }
    };

    const handleCancelarEdicion = () => {
        setEditIngrediente(null);
    };

    return (
        <div className='container-fluid bg-white rounded' style={{ height: containerHeight }}>
            <div className='p-5'>




                <div className='card'>
                    <div style={{ background: `url(${banner}) center / cover no-repeat`, height: '200px', textAlign: 'center', position: 'relative', borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}>
                        <h1 style={{ color: 'white', paddingTop: '100px', fontSize: '34px', textShadow: '2px 2px 4px rgba(0, 0, 1, 1)', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                            Estás en el administrador de ingredientes
                        </h1>
                    </div>

                    <div className='m-3'>
                        <div className='row'>
                            <div className="col">
                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    data-bs-toggle="modal"
                                    data-bs-target="#ingredienteModal" // Este debe coincidir con el 'id' del modal
                                >
                                    Agregar Ingrediente +
                                </button>
                            </div>
                            <div className="col">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination float-end justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <a
                                                className="page-link"
                                                href="#"
                                                onClick={prevPage}
                                            >
                                                Anterior
                                            </a>
                                        </li>
                                        {Array(Math.ceil(ingredientes.length / itemsPerPage))
                                            .fill(null)
                                            .map((_, index) => (
                                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                    <a
                                                        href="#"
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </a>
                                                </li>
                                            ))}
                                        <li className={`page-item ${currentPage === Math.ceil(ingredientes.length / itemsPerPage) ? 'disabled' : ''}`}>
                                            <a
                                                className="page-link"
                                                href="#"
                                                onClick={nextPage}
                                            >
                                                Siguiente
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                    </div>
                </div>









                <table className="mt-5  shadow table align-middle table-bordered text-center border-round" style={{marginBottom:'50px'}}>
                    <thead>
                        <tr>

                            <th scope="col">Nombre del Ingrediente</th>
                            <th scope="col">Descripción</th>
                            <th scope="col">Stock</th>

                            <th scope="col">Acción</th>
                            <th scope="col">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIngredientes.map(ingrediente => (
                            <tr key={ingrediente.id}>

                                <td>{ingrediente.nombre_ingrediente}</td>
                                <td>{ingrediente.descripcion_ingrediente}</td>
                                <td>{ingrediente.stock}</td>
                                <td>
                                <button
                    type="button"
                    className="btn btn-warning"
                    data-bs-toggle="modal"
                    data-bs-target="#ingredienteModal" // ID del modal de edición
                    onClick={() => handleEditarIngrediente(ingrediente)}
                >
                    Editar
                </button>
                                </td>

                                <td>
                                    <button
                                        onClick={() => handleEliminarIngrediente(ingrediente.id)}
                                        className="btn btn-danger"
                                    >
                                        Eliminar
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Agregar Ingrediente Modal */}
              {/* Modal para Agregar o Editar Ingrediente */}
<div className="modal fade" id="ingredienteModal" tabIndex={-1} aria-labelledby="ingredienteModalLabel" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title text-dark" id="ingredienteModalLabel">
                    {editIngrediente ? 'Editar Ingrediente' : 'Agregar Ingrediente'}
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCancelarEdicion}></button>
            </div>
            <div className="modal-body">
                <form>
                    <div className="mb-3">
                        <label htmlFor="nombre_ingrediente" className="form-label text-dark">Nombre del Ingrediente</label>
                        <input
                            type="text"
                            className="form-control"
                            id="nombre_ingrediente"
                            value={editIngrediente ? editIngrediente.nombre_ingrediente : nuevoIngrediente.nombre_ingrediente}
                            onChange={(e) => {
                                if (editIngrediente) {
                                    setEditIngrediente({ ...editIngrediente, nombre_ingrediente: e.target.value });
                                } else {
                                    setNuevoIngrediente({ ...nuevoIngrediente, nombre_ingrediente: e.target.value });
                                }
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion_ingrediente" className="form-label text-dark">Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            id="descripcion_ingrediente"
                            value={editIngrediente ? editIngrediente.descripcion_ingrediente : nuevoIngrediente.descripcion_ingrediente}
                            onChange={(e) => {
                                if (editIngrediente) {
                                    setEditIngrediente({ ...editIngrediente, descripcion_ingrediente: e.target.value });
                                } else {
                                    setNuevoIngrediente({ ...nuevoIngrediente, descripcion_ingrediente: e.target.value });
                                }
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="stock" className="form-label text-dark">Stock</label>
                        <input
                            type="number"
                            className="form-control"
                            id="stock"
                            value={editIngrediente ? editIngrediente.stock : nuevoIngrediente.stock}
                            onChange={(e) => {
                                if (editIngrediente) {
                                    setEditIngrediente({ ...editIngrediente, stock: parseInt(e.target.value, 10) });
                                } else {
                                    setNuevoIngrediente({ ...nuevoIngrediente, stock: parseInt(e.target.value, 10) });
                                }
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="otros_detalles_ingrediente" className="form-label text-dark">Otros Detalles</label>
                        <input
                            type="text"
                            className="form-control"
                            id="otros_detalles_ingrediente"
                            value={editIngrediente ? editIngrediente.otros_detalles_ingrediente : nuevoIngrediente.otros_detalles_ingrediente}
                            onChange={(e) => {
                                if (editIngrediente) {
                                    setEditIngrediente({ ...editIngrediente, otros_detalles_ingrediente: e.target.value });
                                } else {
                                    setNuevoIngrediente({ ...nuevoIngrediente, otros_detalles_ingrediente: e.target.value });
                                }
                            }}
                        />
                    </div>
                </form>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCancelarEdicion}>
                    Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={editIngrediente ? handleActualizarIngrediente : handleAgregarIngrediente}>
                    {editIngrediente ? 'Actualizar Ingrediente' : 'Agregar Ingrediente'}
                </button>
            </div>
        </div>
    </div>
</div>
            </div>
        </div>
    );
}

export default Ingredientes;