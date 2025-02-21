import React from 'react'
import Header from './Header'
// import $ from 'jquery'

function Layout({ children, title }) {

    // function togglePanel() {
    //     $(".main").toggleClass("open");
    //     $(".panel-header").toggleClass("close");
    //     $(".toggle-panel").toggleClass("active");
    // }

    return (
        <div className="wrapper">
            <Header />
            {/* <!-- PANEL CONTENT --> */}
            <div className="main">
                <div className="main-top">
                    {/* <button className="toggle-panel" onClick={togglePanel}><i className="fa-solid fa-chevron-left"></i></button> */}
                    Anasayfa {'>'} {title}
                </div>

                <div className="main-content">
                    <h1 className="main-title">{title}</h1>
                    {children}
                </div>



                
            </div>
        </div>

    )
}

export default Layout