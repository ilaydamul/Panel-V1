import React from 'react'
import Header from './Header'

function Layout({ children, title }) {
    return (
        <div className="wrapper">
            <Header />
            {/* <!-- PANEL CONTENT --> */}
            <div className="main">
                <div className="main-top">
                    <button className="toggle-panel"><i className="fa-solid fa-chevron-left"></i></button>
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