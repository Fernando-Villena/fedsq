import React from 'react';
import { NavLink } from 'react-router-dom';
import './A.css'


interface NavBarProps {
  onLogout: () => void;
  rightComponent?: React.ReactNode;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, rightComponent }) => {
  return (
    <div>
      <div>
        <div className="container-fluid">
          <div className="row flex-nowrap ">
            <div style={{ backgroundColor: '#1d1d1d' }} className="col-auto col-md-2 col-xl-2 px-sm-2 ">
              <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">

                  <span className="mt-2    fs-5 d-none d-sm-inline"><strong>Feds'Q</strong> </span>
              
                <hr style={{ borderTop: '1px solid white', width: '100%' }} />
                <ul className="mt-0 nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                  <li className="nav-item">
                    <NavLink to="/inicio" activeClassName="pl-3 active-link" className="text-white nav-link align-middle ">
                      <i style={{ marginRight: '10px' }} className="fa-solid fa-xl fa-house"></i>Inicio 
                    </NavLink>
                  </li>
                  <li className="nav-item ">
                    <NavLink to="/mesas" activeClassName="active-link" className="text-white nav-link align-middle ">
                      <i style={{ marginRight: '10px' }} className="fa-solid fa-xl fa-qrcode"></i> Mesas
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/ingredientes" activeClassName="active-link" className="text-white nav-link align-middle ">
                      <i style={{ marginRight: '10px' }} className="fa-solid fa-xl fa-carrot"></i>Ingredientes
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/platos" activeClassName="active-link" className="text-white nav-link align-middle ">
                      <i style={{ marginRight: '10px' }} className="fa-solid fa-xl fa-utensils"></i>Platos
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/ordenes" activeClassName="active-link" className="text-white nav-link align-middle ">
                      <i style={{ marginRight: '10px' }} className="fa-solid fa-xl fa-pen"></i>Ordenes
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/Despachos" activeClassName="active-link" className="text-white nav-link align-middle ">
                      <i style={{ marginRight: '10px' }} className="fa-solid fa-xl fa-box"></i>Despachos
                    </NavLink>
                  </li>
                </ul>
                <hr />
                <div className="dropdown pb-4">
                  <button type="button" className="btn btn-outline-light" onClick={onLogout}>
                    <i className="fa fa-sign-out" aria-hidden="true"></i> Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
            <div className="col py-3">
              {rightComponent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NavBar;