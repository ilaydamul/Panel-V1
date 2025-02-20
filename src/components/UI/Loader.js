import { ProgressSpinner } from 'primereact/progressspinner'
import React from 'react'

function Loader() {
    return (
        <div className='loader'>
            <ProgressSpinner />
        </div>
    )
}

export default Loader