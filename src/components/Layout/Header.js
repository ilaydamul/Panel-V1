import React, { useContext, useState } from 'react'
import $ from 'jquery'
import { AuthContext } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';

function Header() {
  const [openDropdown, setOpenDropdown] = useState();
  const authCtx = useContext(AuthContext);

  function logout() {
    authCtx.logout();
    window.location.href = '/login';
  }

  function toggleMenu() {
    $(".header-burger").toggleClass("active");
    $(".panel-menu").toggleClass("active");
    $(".panel-shadow").toggleClass("active");
  }

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };


  return (
    <header className="panel-header">
      <div className="logo-wrapper">
        <div className="logo">
          <img src="/images/guse-garage-logo-siyah.png" alt="Guse Garage Logo" />
        </div>
        <div className="header-burger" onClick={toggleMenu}>
          <span className="burger-icon"></span>
        </div>
      </div>
      <div className="panel-shadow"></div>
      <div className="panel-menu">
        <div className="header-burger" onClick={toggleMenu}>
          <span className="burger-icon"></span>
        </div>
        <div className="pages">
          <NavLink to="/" className="panel-button"><i className="fa-solid fa-house-chimney"></i>
            <span>Anasayfa</span></NavLink>

          {/* Hizmetler Dropdown */}
          <div className={`panel-button dp-wrap ${openDropdown === "services" ? "active" : ""}`}>
            <div onClick={() => toggleDropdown("services")} className='dp-btn'>
              <span> <i className="fa-regular fa-chart-bar"></i> İçerikler</span>
              <i className={`fa-solid fa-chevron-right ${openDropdown === "services" ? "rotate" : ""}`}></i>
            </div>

            <div className={`dp-menu ${openDropdown === "services" ? "show" : ""}`}>
              <NavLink to="/services" className="dp-item"><i className="fa-solid fa-circle"></i> Hizmetler</NavLink>
              <NavLink to="/applications" className="dp-item"><i className="fa-solid fa-circle"></i> Uygulamalar</NavLink>
            </div>
          </div>

          {/* <NavLink to="/services" className="panel-button"><i className="fa-regular fa-chart-bar"></i>
            <span>Hizmetler</span></NavLink> */}
        </div>

        <div className="header-footer">
          {/* <a href="profile.html" className="panel-button text-center"><i className="fa-solid fa-user"></i> <span>Guse Garage</span> </a> */}
          <button className="panel-button text-center panel-btn-red m-0" onClick={logout}><i
            className="fa-solid fa-arrow-right-from-bracket"></i> <span>Çıkış Yap</span></button>
        </div>
      </div>
    </header>
  )
}

export default Header