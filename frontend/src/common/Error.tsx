import React from 'react';
import { NavLink } from 'react-router-dom';

const Error: React.FC = () => {
    return (
        <div className="c-Error">
            <h1>Something went Wrong!</h1>
            <p>Try again later</p>
            <NavLink to = "/products">Go to Home</NavLink>
        </div>
    )
}

export default Error;