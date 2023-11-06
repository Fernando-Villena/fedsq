import { useEffect, useState } from 'react';
import axios from 'axios';
import banner from '/assets/img/35732.jpg';

// Definir las interfaces para Platos y Ingredientes
interface PlatosPageProps {
    token: string;
}

interface Ingrediente {
    url: string;
    id: number;
    nombre_ingrediente: string;
}

interface Plato {
    id: number;
    nombre_plato: string;
    descripcion_plato: string;
    precio_plato: number;
    imagen_plato: string;
    ingredientes: string[];
    otros_detalles_plato: string; // Nuevo campo
}

function Platos({ token }: PlatosPageProps) {
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [ingredientes, setIngredientes] = useState<Ingrediente[]>([]);
    const [platoEdit, setPlatoEdit] = useState<Plato | null>(null);
    const [imagenPlato, setImagenPlato] = useState<File | null>(null);
    const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const [containerHeight, setContainerHeight] = useState('97vh');


    useEffect(() => {
        const fetchPlatos = async () => {
            try {
                const response = await axios.get('https://emiliosk11.pythonanywhere.com/api/platos/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data = response.data;
                    setPlatos(data);
                } else {
                    console.log('No se pudo obtener la lista de platos.');
                }
            } catch (error) {
                console.log('Ocurrió un error al obtener los platos. Por favor, intenta de nuevo más tarde.');
            }
        };

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

        fetchPlatos();
        fetchIngredientes();
    }, [token]);

    useEffect(() => {
        const updateContainerHeight = () => {
          if (window.innerWidth >= 1900) {
            setContainerHeight('97vh');
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
      

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlatos = platos.slice(indexOfFirstItem, indexOfLastItem);

    // Calcula el número total de páginas
    const totalPages = Math.ceil(platos.length / itemsPerPage);

    // Crea un array de números de página
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleEditarPlato = (plato: Plato) => {
        setPlatoEdit({
            ...plato,
            ingredientes: [], // Inicializar como un array vacío
        });

        // Seleccionar los ingredientes ya asociados al plato
        const ingredientesAsociados = plato.ingredientes.map((url) => {
            const id = parseInt(url.split('/').slice(-2, -1)[0], 10);
            return id;
        });
        setIngredientesSeleccionados(new Set(ingredientesAsociados));
    };

    const handleCancelarEdicion = () => {
        setPlatoEdit(null);
        setImagenPlato(null);
        setIngredientesSeleccionados(new Set());
    };

    const handleGuardarPlato = async () => {
        if (platoEdit) {
            const formData = new FormData();

            if (imagenPlato) {
                formData.append('imagen_plato', imagenPlato);
            }

            formData.append('nombre_plato', platoEdit.nombre_plato);
            formData.append('descripcion_plato', platoEdit.descripcion_plato);
            formData.append('precio_plato', platoEdit.precio_plato.toString());
            formData.append('otros_detalles_plato', platoEdit.otros_detalles_plato);

            // Construir una lista de URLs a partir de los IDs de los ingredientes seleccionados
            const ingredientesUrls = Array.from(ingredientesSeleccionados)
                .map((id) => `https://emiliosk11.pythonanywhere.com/api/ingredientes/${id}/`);

            ingredientesUrls.forEach((ingredienteUrl) => {
                formData.append('ingredientes', ingredienteUrl);
            });

            try {
                if (platoEdit.id) {
                    // Editar un plato existente
                    const response = await axios.put(
                        `https://emiliosk11.pythonanywhere.com/api/platos/${platoEdit.id}/`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (response.status === 200) {
                        const platoActualizado = response.data;
                        const platosActualizados = platos.map((plato) =>
                            plato.id === platoActualizado.id ? platoActualizado : plato
                        );
                        setPlatos(platosActualizados);
                        handleCancelarEdicion();
                    } else {
                        console.log('No se pudo actualizar el plato.');
                    }
                } else {
                    // Crear un nuevo plato
                    const response = await axios.post(
                        'https://emiliosk11.pythonanywhere.com/api/platos/',
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );

                    if (response.status === 201) {
                        const nuevoPlato = response.data;
                        setPlatos([...platos, nuevoPlato]);
                        handleCancelarEdicion();
                    } else {
                        console.log('No se pudo crear el nuevo plato.');
                    }
                }
            } catch (error) {
                console.log('Ocurrió un error al guardar el plato.');
            }
        }
    };



    const handleEliminarPlato = async (platoId: number) => {
        try {
            const response = await axios.delete(
                `https://emiliosk11.pythonanywhere.com/api/platos/${platoId}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 204) {
                const platosActualizados = platos.filter((plato) => plato.id !== platoId);
                setPlatos(platosActualizados);
            } else {
                console.log('No se pudo eliminar el plato.');
            }
        } catch (error) {
            console.log('Ocurrió un error al eliminar el plato.');
        }
    };

    return (
        <div className='container-fluid bg-white rounded' style={{ height: containerHeight }} >
            <div className='p-5'>

                <div className='card'>
                    <div style={{ background: `url(${banner}) center / cover no-repeat`, height: '200px', textAlign: 'center', position: 'relative', borderTopRightRadius: '5px', borderTopLeftRadius: '5px' }}>
                        <h1 style={{ color: 'white', paddingTop: '100px', fontSize: '34px', textShadow: '2px 2px 4px rgba(0, 0, 1, 1)', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                            Estás en el administrador de platos
                        </h1>
                    </div>

                    <div className='m-3'>
                        <div className='row'>
                            <div className="col">
                                <button
                                    className='btn btn-dark mb-3'
                                    data-bs-toggle='modal'
                                    data-bs-target='#platoModal'
                                    onClick={() => handleCancelarEdicion()}
                                >
                                    Agregar un nuevo plato +
                                </button>
                            </div>
                            <div className="col">
                                <nav aria-label="Paginación">
                                    <ul className="pagination float-end justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage - 1)}
                                                aria-label="Página anterior"
                                            >
                                                Anterior
                                            </button>
                                        </li>
                                        {pageNumbers.map((number) => (
                                            <li
                                                key={number}
                                                className={`page-item ${number === currentPage ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(number)}
                                                >
                                                    {number}
                                                </button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => setCurrentPage(currentPage + 1)}
                                                aria-label="Página siguiente"
                                            >
                                                Siguiente
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                    </div>
                </div>
                <table className='mt-5  shadow table align-middle table-bordered text-center border-round '>
                    <thead>
                        <tr>

                            <th scope='col'>Nombre del Plato</th>
                            <th scope='col'>Descripción</th>
                            <th scope='col'>Precio</th>
                            <th scope='col'>Imagen</th>
                            <th scope='col'>Ingredientes</th>
                            <th scope='col'>Otros Detalles</th>
                            <th scope='col'>Acción</th>
                            <th scope='col'>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPlatos.map((plato) => (
                            <tr key={plato.id}>

                                <td>{plato.nombre_plato}</td>
                                <td>{plato.descripcion_plato}</td>
                                <td>${plato.precio_plato}</td>
                                <td>
                                    <img
                                        src={plato.imagen_plato}
                                        alt={plato.nombre_plato}
                                        style={{ width: '100px' }}
                                    />
                                </td>
                                <td>
                                    <ul className="list-unstyled">
                                        {plato.ingredientes.map((ingredienteUrl) => {
                                            const id = parseInt(ingredienteUrl.split('/').slice(-2, -1)[0], 10);
                                            const ingrediente = ingredientes.find((ing) => ing.id === id);
                                            return (
                                                <li key={ingredienteUrl}>
                                                    {ingrediente ? ingrediente.nombre_ingrediente : 'Desconocido'}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </td>
                                <td>{plato.otros_detalles_plato}</td>
                                <td>
                                    <button
                                        className='btn btn-warning m-2'
                                        data-bs-toggle='modal'
                                        data-bs-target='#platoModal'
                                        onClick={() => handleEditarPlato(plato)}
                                    >
                                        Editar
                                    </button>

                                </td>
                                <td>
                                    <button
                                        className=' btn btn-danger '
                                        onClick={() => handleEliminarPlato(plato.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <div
                className='modal fade'
                id='platoModal'
                tabIndex={-1}
                aria-labelledby='platoModalLabel'
                aria-hidden='true'
            >
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title text-dark' id='platoModalLabel'>
                                {platoEdit ? 'Editar Plato' : 'Agregar Plato'}
                            </h5>
                            <button
                                type='button'
                                className='btn-close '
                                data-bs-dismiss='modal'
                                aria-label='Close'
                                onClick={() => handleCancelarEdicion()}
                            ></button>
                        </div>
                        <div className='modal-body'>
                            <form encType='multipart/form-data'>
                                <div className='mb-3'>
                                    <label htmlFor='nombre_plato' className='form-label text-dark'>
                                        Nombre del Plato
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        id='nombre_plato'
                                        name='nombre_plato'
                                        value={platoEdit ? platoEdit.nombre_plato : ''}
                                        onChange={(e) =>
                                            setPlatoEdit({
                                                ...platoEdit!,
                                                nombre_plato: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='descripcion_plato' className='form-label text-dark'>
                                        Descripción del Plato
                                    </label>
                                    <input
                                        type='text'
                                        className='form-control'
                                        id='descripcion_plato'
                                        name='descripcion_plato'
                                        value={platoEdit ? platoEdit.descripcion_plato : ''}
                                        onChange={(e) =>
                                            setPlatoEdit({
                                                ...platoEdit!,
                                                descripcion_plato: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='precio_plato' className='form-label text-dark'>
                                        Precio del Plato
                                    </label>
                                    <input
                                        type='number'
                                        className='form-control'
                                        id='precio_plato'
                                        name='precio_plato'
                                        value={platoEdit ? platoEdit.precio_plato : 0}
                                        onChange={(e) =>
                                            setPlatoEdit({
                                                ...platoEdit!,
                                                precio_plato: parseFloat(e.target.value),
                                            })
                                        }
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='otros_detalles_plato ' className='form-label text-dark'>
                                        Otros Detalles
                                    </label>
                                    <input
                                        type='tex'
                                        className='form-control '
                                        id='otros_detalles_plato'
                                        name='otros_detalles_plato'
                                        value={platoEdit ? platoEdit.otros_detalles_plato : ''}
                                        onChange={(e) =>
                                            setPlatoEdit({
                                                ...platoEdit!,
                                                otros_detalles_plato: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='imagen_plato' className='form-label text-dark'>
                                        Imagen del Plato
                                    </label>
                                    <input
                                        type='file'
                                        className='form-control'
                                        id='imagen_plato'
                                        name='imagen_plato'
                                        accept='image/*'
                                        onChange={(e) => setImagenPlato(e.target.files ? e.target.files[0] : null)}
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor='ingredientes' className='text-dark form-label'>
                                        Ingredientes
                                    </label>
                                    {ingredientes.map((ingrediente) => (
                                        <div className='form-check text-dark' key={ingrediente.id}>
                                            <input
                                                className='form-check-input '
                                                type='checkbox'
                                                value={ingrediente.id}
                                                id={`ingrediente-${ingrediente.id}`}
                                                checked={ingredientesSeleccionados.has(ingrediente.id)}
                                                onChange={(e) => {
                                                    const id = ingrediente.id;
                                                    if (e.target.checked) {
                                                        setIngredientesSeleccionados((prevSet) => new Set(prevSet).add(id));
                                                    } else {
                                                        setIngredientesSeleccionados((prevSet) => {
                                                            const newSet = new Set(prevSet);
                                                            newSet.delete(id);
                                                            return newSet;
                                                        });
                                                    }
                                                }}
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor={`ingrediente-${ingrediente.id}`}
                                            >
                                                {ingrediente.nombre_ingrediente}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button
                                type='button'
                                className='btn btn-secondary'
                                data-bs-dismiss='modal'
                                onClick={() => handleCancelarEdicion()}
                            >
                                Cerrar
                            </button>
                            <button
                                type='button'
                                className='btn btn-primary'
                                onClick={() => handleGuardarPlato()}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Platos;