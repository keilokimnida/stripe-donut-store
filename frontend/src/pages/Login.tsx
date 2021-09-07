import axios from 'axios';
import React, { useState } from 'react';
import  { toast, ToastContainer } from 'react-toastify';
import { saveUserToken } from '../utilities/localStorageUtils';
import { useHistory } from "react-router-dom";

import config from '../config/config';
import Title from '../common/Title';

const Login: React.FC = () => {
    const toastTiming = config.toastTiming;
    const history = useHistory();

    // State declaration
    const [inputValues, setInputValues] = useState<{ username: string; password: string }>({
        username: "",
        password: ""
    });

    // Handlers
    const handleFormSubmit = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        console.log("this was ran");
        axios.post(`${config.baseUrl}/login`, {
            "username": inputValues.username,
            "password": inputValues.password
        })
            .then((res) => {
                console.log(res);
                const data = res.data;
                saveUserToken(data.token);
                history.push("/products");
            })
            .catch((err) => {
                console.log(err);
                let errCode = "Error!";
                let errMsg = "Error!"
                if (err.response !== undefined) {
                    errCode = err.response.status;
                    errMsg = err.response.data.message;
                }
                toast.error(<>Error Code: <b>{errCode}</b><br/>Message: <b>{errMsg}</b></>);
            });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValues((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value
        }));
    }

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={toastTiming}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Title title = "Login"/>
            <div className="c-Login">
                {/* Card Component */}
                <form className="l-Login__Card" onSubmit={(event: any) => handleFormSubmit(event)}>
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
                        <button type="submit" className="c-Btn">Login</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Login;