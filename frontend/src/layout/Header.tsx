import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import { IconContext } from 'react-icons';
// import jwt_decode from "jwt-decode";
import { clearLocalStorage } from '../utilities/localStorageUtils';
// import axios from 'axios';
// import convert from 'htmr';
import Badge from '@material-ui/core/Badge';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header: React.FC = () => {

    // https://stackoverflow.com/questions/12710905/how-do-i-dynamically-assign-properties-to-an-object-in-typescript
    // This will allow us to dynamically assign properties to object in typescript
    // interface LooseObject {
    //     [key: string]: any
    // };

    // const token: string | null = getToken();
    // const decodedToken: LooseObject = jwt_decode(token as string); // as string / ! = non null assertion, to tell typescript that getToken will not return null
    // const username: string = decodedToken.username;

    const history = useHistory();

    // State declaration
    const [isProfilePopUpOpen, setIsProfilePopUpOpen] = useState<boolean>(false);

    // Handler
    const handleProfilePicClick = (): void => {
        setIsProfilePopUpOpen((prevState) => !prevState);
    };

    const handleLogOutClick = (): void => {
        clearLocalStorage();
        history.push("/login");
        toast.success('Successfully logged out!');
    };


    return (
        <header>
            <div className="c-Header">
                {/* Left section */}
                <div className="c-Header__Left">
                    <div className="c-Logo">
                        <a href="/products">Stripe Donut</a>
                    </div>
                </div>
                {/* Right section */}
                <div className="c-Header__Right">
                    <div className="c-Header__Links">
                        <a href="/products">Products</a>
                        <a href="/membership">Membership</a>
                    </div>
                    <div className="c-Header__Icons">
                        <div className="c-Header__Cart">
                            <Badge color="secondary" variant="dot">
                                <IconContext.Provider value={{ color: "black", size: "21px" }}>
                                    <FaIcons.FaShoppingCart />
                                </IconContext.Provider>
                            </Badge>
                        </div>
                        <div className="c-Header__Account">
                            <div className="c-Header__Avatar" onClick={handleProfilePicClick}></div>
                            {
                                isProfilePopUpOpen ?
                                    <div className="l-Header__Profile-pop-up">
                                        <div className="c-Header__Profile-pop-up">
                                            <button onClick={() => history.push("/account")}>My Account</button>
                                            <hr/>
                                            <button onClick={handleLogOutClick}>Log out</button>
                                        </div>
                                    </div>
                                    :
                                    null
                            }
                        </div>
                    </div>

                </div>
            </div>

        </header>
    )
}

export default Header;