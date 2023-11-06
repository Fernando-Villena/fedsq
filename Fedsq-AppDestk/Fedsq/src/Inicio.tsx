// InicioPage.tsx
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import banner from '/assets/img/1323318.png';


interface InicioPageProps {
  token: string;
}

function InicioPage({ token }: InicioPageProps) {
  const history = useHistory();
  const [containerHeight, setContainerHeight] = useState('97vh');

  useEffect(() => {
    localStorage.setItem('token', token);

  }, [token, history]);
  useEffect(() => {
    const updateContainerHeight = () => {
      if (window.innerWidth >= 1300) {
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
  

  return (
    <div className='container-fluid bg-white rounded 'style={{ height: containerHeight }} >
      <div className='p-5 '>
    
        <div className='rounded shadow  ' style={{ background: `url(${banner}) center / cover no-repeat`, height: '450px', textAlign: 'center', position: 'relative'}}>
                        <h1 style={{ color: 'white', paddingTop: '200px', fontSize: '34px', textShadow: '2px 2px 4px rgba(0, 0, 1, 1)', fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                        ¡Bienvenido de nuevo al panel de Administración del Restaurante!
                        </h1>
                    </div>
      </div>

    </div>
    
  );
}

export default InicioPage;