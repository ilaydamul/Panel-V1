import React from 'react'
import $ from 'jquery'

function Header() {

  function logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  function toggleMenu() {
    $(".header-burger").toggleClass("active");
    $(".panel-menu").toggleClass("active");
    $(".panel-shadow").toggleClass("active");
  }

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
          <a href="/" className="panel-button"><i className="fa-solid fa-house-chimney"></i>
            <span>Anasayfa</span></a>
          <a href="/services" className="panel-button"><i class="fa-regular fa-chart-bar"></i>
            <span>Hizmetler</span></a>
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