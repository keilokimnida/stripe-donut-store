import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
    type?: string;
}

const LoggedOut: React.FC<Props> = ({type}) => {
    return (
        <div className="c-Logged-out">
            <h1>Please Login to Use {type || "this feature"}!</h1>
            <NavLink to="/login">Login to Stripe Donut!</NavLink>
        </div>
    )
}

export default LoggedOut;