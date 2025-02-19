import React from 'react'
import Header from './Header'

function Layout( {children} ) {
    return (
        <div className="wrapper">
            <Header />
            {/* <!-- PANEL CONTENT --> */}
            <div className="main">
                <div className="main-top">
                    <button className="toggle-panel"><i className="fa-solid fa-chevron-left"></i></button>
                    Anasayfa {'>'} Bloglar
                </div>

                <div className="main-content">
                    <h1 className="main-title">Bloglar</h1>
                    { children }
                </div>
            </div>
        </div>

    )
}

export default Layout