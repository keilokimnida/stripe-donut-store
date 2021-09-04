import axios from 'axios';
import React, { useState } from 'react';

const Login: React.FC = () => {

    // State declaration
    const [inputValues, setInputValues] = useState<{username: string; password: string}>({
        username: "",
        password: ""
    });

    // Handlers
    const handleBtnClick = () => {
        axios.post(``);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    return (
        <div className="c-Login">
            {/* Card Component */}
            <div className="l-Login__Card">
                <div className="c-Login__Card">
                    <div className="c-Card__Header">
                        <h1>Login</h1>
                    </div>
                    {/* Username */}
                    <div className="c-Card__Input">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" value={inputValues.username} placeholder="Enter username" onChange={handleInputChange} />
                    </div>
                    {/* Password */}
                    <div className="c-Card__Input">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" value={inputValues.password} placeholder="Enter password" onChange={handleInputChange} />
                    </div>
                    <button type="button" className = "c-Btn c-Btn--primary" onChange={handleBtnClick}>Login</button>
                </div>
            </div>
        </div>
    )
}

export default Login;