import  { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import LoginPage from './LoginPage';
import InicioPage from './Inicio';
import MesasPage from './MesasPage';
import NavBar from './NavBar';
import  Platos  from './Platos';
import Ordenes from './Ordenes';
import Ingredientes from './Ingredientes';
import Despachos from './Despachos';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('https://emiliosk11.pythonanywhere.com/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setIsLoggedIn(true);
        setToken(data.access);
      } else {
        console.log('Inicio de sesión fallido. Verifica tus credenciales.');
      }
    } catch (error) {
      console.log('Ocurrió un error al iniciar sesión. Por favor, intenta de nuevo más tarde.');
    }
  };

  const handleLogout = () => {
  
    setIsLoggedIn(false);
    setToken('');
  };

  const renderRoutes = () => {
    return (
      <Switch>
        <Route exact path="/">
          {isLoggedIn ? <Redirect to="/inicio" /> : <LoginPage onLogin={handleLogin} />}
        </Route>
        <Route  path="/inicio">
          {isLoggedIn ? <InicioPage token={token} /> : <Redirect to="/" />}
        </Route>
        <Route path="/mesas">
          {isLoggedIn ? <MesasPage token={token} /> : <Redirect to="/" />}
        </Route>
        <Route path="/platos">
          {isLoggedIn ? <Platos token={token} /> : <Redirect to="/" />}
        </Route>
        <Route path="/ordenes">
          {isLoggedIn ? <Ordenes token={token} /> : <Redirect to="/" />}
        </Route>
        <Route path="/ingredientes">
          {isLoggedIn ? <Ingredientes token={token} /> : <Redirect to="/" />}
        </Route>
        <Route path="/despachos">
          {isLoggedIn ? <Despachos token={token} /> : <Redirect to="/" />}
        </Route>

        
      </Switch>
    );
  };

  return (
    <Router>
      <div>
      {isLoggedIn  ?<NavBar onLogout={handleLogout} rightComponent={renderRoutes()} />:<LoginPage onLogin={handleLogin} />}
      </div>
    </Router>
  );
}

export default App;
