import {  useState } from 'react';
import logo from '/assets/img/fed.png'; 
import backgroundImageOne from '/assets/img/186135325_l_normal_none.png';
import backgroundImageTwo from '/assets/img/platter-2009590_1920.jpg';

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginClick = async () => {
    setLoading(true);
    await onLogin(username, password);
    setLoading(false);
  };

  const style = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    textColor: 'black',
    hrColor: 'black',
    fontFamily: 'Arial, sans-serif',
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 d-flex flex-column align-items-center justify-content-center" 
             style={{ backgroundImage: `url(${backgroundImageOne})`, backgroundRepeat: 'no-repeat', height: '100vh' }}>
          <div className='card' style={{ backgroundColor: style.backgroundColor, fontFamily: style.fontFamily }}>
            <div className='m-5'>
              <img src={logo} alt="Fedsq Logo" style={{ width: '240px' }} />
              <h2 style={{ color: style.textColor, textAlign: 'center', fontFamily: style.fontFamily }}>Inicio de sesión</h2>
              <hr className='mb-5' style={{ borderTop: `1px solid ${style.hrColor}`, width: '100%' }} />
              <div className="form-group">
                <input
                  className="form-control mb-2"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control mb-2"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid gap-2 ">
                {loading ? (
                  <div className='d-flex justify-content-center'>
                  <div className="spinner-border text-dark " role="status">
                  
                  </div>
                  </div>
                ) : (
                  <button className="btn btn-block" 
                          style={{ backgroundColor: 'black', color: 'white', fontFamily: style.fontFamily }} 
                          onClick={handleLoginClick}>Iniciar sesión</button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8 d-flex align-items-center" 
             style={{ backgroundImage: `url(${backgroundImageTwo})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', height: '100vh' }}>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
