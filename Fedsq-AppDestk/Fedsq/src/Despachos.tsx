import { useEffect, useState } from 'react';
import axios from 'axios';
import banner from '/assets/img/904324.jpg';

interface OrdenesPageProps {
    token: string;
}

interface Usuario {
    url: string;
    id: number;
    username: string;
}

interface Plato {
    url: string;
    id: number;
    nombre_plato: string;
    descripcion_plato: string;
    precio_plato: number;
    imagen_plato: string;
    ingredientes: string[]; // Cambia el tipo según la estructura real de los ingredientes
}

interface Orden {
    url: string;
    id: number;
    usuario: string;
    estado: string;
    fecha_creacion: string;
    otros_detalles_orden: string;
}

interface OrdenItem {
    url: string;
    id: number;
    orden: string;
    plato: string;
    cantidad: number;
    precio_unitario: number;
    total_item: number;
}

function Despachos({ token }: OrdenesPageProps) {
    const [ordenes, setOrdenes] = useState<Orden[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [platos, setPlatos] = useState<Plato[]>([]);
    const [ordenItems, setOrdenItems] = useState<OrdenItem[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loadingOrdenes, setLoadingOrdenes] = useState(true);

    const [elapsedTimes, setElapsedTimes] = useState<{ id: number; elapsed: string }[]>([]);
    const [containerHeight, setContainerHeight] = useState('97vh');

    const formatElapsedTime = (orderTime: string): string => {
        const orderTimestamp = new Date(orderTime).getTime();
        const currentTimestamp = new Date().getTime();
        const elapsedMilliseconds = currentTimestamp - orderTimestamp;
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        const hours = Math.floor(elapsedSeconds / 3600);
        const minutes = Math.floor((elapsedSeconds % 3600) / 60);
        const seconds = elapsedSeconds % 60;
        return `${hours}h:${minutes}m ${seconds}s`; // Agrega "h" para horas, "m" para minutos y "s" para segundos
    };

    const despacharOrden = async (ordenId: any) => {
        try {
            const response = await axios.patch(`https://emiliosk11.pythonanywhere.com/api/ordenes/${ordenId}/`, {
                estado: 'Entregado',
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const updatedOrdenes = ordenes.map(orden => {
                    if (orden.id === ordenId) {
                        return { ...orden, estado: 'Entregado' };
                    }
                    return orden;
                });

                setOrdenes(updatedOrdenes);
            } else {
                console.log('No se pudo despachar la orden.');
            }
        } catch (error) {
            console.log('Ocurrió un error al despachar la orden. Por favor, intenta de nuevo más tarde.');
        }
    };
    useEffect(() => {
        const updateContainerHeight = () => {
            if (window.innerWidth >= 1400) {
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


    useEffect(() => {
        const fetchOrdenes = async () => {
            try {
                const response = await axios.get('https://emiliosk11.pythonanywhere.com/api/ordenes/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data = response.data;
                    setOrdenes(data);
                } else {
                    console.log('No se pudo obtener la lista de órdenes.');
                }
                setLoadingOrdenes(false);
            } catch (error) {
                console.log('Ocurrió un error al obtener las órdenes. Por favor, intenta de nuevo más tarde.');
                setLoadingOrdenes(false);
            }
        };

        const fetchUsuarios = async () => {
            try {
                const response = await axios.get('https://emiliosk11.pythonanywhere.com/api/usuarios/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data = response.data;
                    setUsuarios(data);
                } else {
                    console.log('No se pudo obtener la lista de usuarios.');
                }
            } catch (error) {
                console.log('Ocurrió un error al obtener los usuarios. Por favor, intenta de nuevo más tarde.');
            }
        };

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

        const fetchOrdenItems = async () => {
            try {
                const response = await axios.get('https://emiliosk11.pythonanywhere.com/api/ordenesitems/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const data = response.data;
                    setOrdenItems(data);
                } else {
                    console.log('No se pudo obtener la lista de orden items.');
                }
            } catch (error) {
                console.log('Ocurrió un error al obtener los orden items. Por favor, intenta de nuevo más tarde.');
            }
        };

        const fetchAllData = async () => {
            await fetchPlatos();
            await fetchOrdenItems();
            await fetchUsuarios();
            await fetchOrdenes();
        };

        fetchAllData();

        const interval = setInterval(() => {
            const updatedElapsedTimes = ordenes.map((orden) => {
                return {
                    id: orden.id,
                    elapsed: formatElapsedTime(orden.fecha_creacion),
                };
            });
            setElapsedTimes(updatedElapsedTimes);
        }, 1000); // Actualizar cada 1 segundo

        return () => {
            clearInterval(interval);
        };
    }, [/*ordenes*/]);

    const handlePageChange = (pageIndex: number) => {
        setActiveIndex(pageIndex);
    };

    const itemsPerPage = 4;
    const startIndex = activeIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const renderOrdenesRecibidas = () => {
        return ordenes
            .filter((orden) => orden.estado === 'Despachado')
            .slice(startIndex, endIndex)
            .map((orden) => (
                <div className="col-md-3 mb-3" key={orden.id}>
                    <div className="card h-100">
                        <div className="card-header">
                            <div className='row'>
                                <div className='col'>
                                    <p className="card-title"><strong>Orden #{orden.id}</strong> </p>
                                </div>
                                <div className='col'>
                                    <strong>
                                        <p className="card-text float-end">
                                            <strong><i className="fa-regular fa-clock"></i></strong>{' '}
                                            {elapsedTimes.find((time) => time.id === orden.id)?.elapsed || formatElapsedTime(orden.fecha_creacion)}
                                        </p>
                                    </strong>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <p className="card-text">
                                <strong>Mesa:</strong>{' '}
                                {usuarios.find((usuario) => usuario.url === orden.usuario)?.username || 'Desconocido'}
                            </p>
                            <p className="card-text">
                                <strong>Platos:</strong>
                                <ul>
                                    {ordenItems
                                        .filter((item) => item.orden === orden.url)
                                        .map((item) => {
                                            const plato = platos.find((p) => item.plato === p.url);
                                            return (
                                                <li key={item.url}>
                                                    {plato
                                                        ? `${plato.nombre_plato} (Cantidad: ${item.cantidad})`
                                                        : 'Desconocido'}
                                                </li>
                                            );
                                        })}
                                </ul>
                            </p>
                        </div>
                        <div className="card-footer">
                            <small className="text-muted">
                                {orden.estado !== 'Entregado' && (
                                    <div className="d-grid gap-2">
                                        <button
                                            onClick={() => despacharOrden(orden.id)}
                                            className="btn btn-success"
                                        >
                                            Entregar
                                        </button>
                                    </div>
                                )}
                            </small>
                        </div>
                    </div>
                </div>
            ));
    };

    const pageCount = Math.ceil(ordenes.filter((orden) => orden.estado === 'Recibida').length / itemsPerPage);
    const pageIndexes = Array.from({ length: pageCount }, (_, index) => index);

    return (
        <div className='container-fluid bg-white rounded' style={{ height: containerHeight }}>
            <div className='p-5'>
                <div className='card'>
                    <div style={{ background: `url(${banner}) center / cover no-repeat`, height: '200px', textAlign: 'center', position: 'relative', borderTopRightRadius: '5px', borderTopLeftRadius: '5px', }}>
                        <h1 style={{ color: 'white', paddingTop: '100px', fontSize: '34px', textShadow: '2px 2px 4px rgba(0, 0, 1, 1)', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                            Estás en el administrador de despachos
                        </h1>
                    </div>
                    <div className='m-3'>
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${activeIndex === 0 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(activeIndex - 1)}
                                    >
                                        Anterior
                                    </button>
                                </li>
                                {pageIndexes.map((pageIndex) => (
                                    <li key={pageIndex} className={`page-item ${pageIndex === activeIndex ? 'active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(pageIndex)}
                                        >
                                            {pageIndex + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${activeIndex === pageCount - 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(activeIndex + 1)}
                                    >
                                        Siguiente
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="d-flex mt-5 justify-content-center">
                    {loadingOrdenes && (
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    )}
                </div>
                <div className="row">
                    {renderOrdenesRecibidas()}
                </div>
            </div>
        </div>
    );
}

export default Despachos;




