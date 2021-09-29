import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import Title from '../common/Title';
import MembershipCard from '../common/MembershipCard';
import Header from '../layout/Header';
import config from '../config/config';
import axios from 'axios';
import { getToken } from '../utilities/localStorageUtils';


const Membership: React.FC = () => {
    const toastTiming = config.toastTiming;
    const token = getToken();

    interface LooseObject {
        [key: string]: any
    }

    // State declaration
    const [membershipDetails, setMembershipDetails] = useState<[]>([]);



    useEffect(() => {
        let componentMounted = true;

        axios.get(`${config.baseUrl}/memberships`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((res) => {
                console.log(res);
                const data = res.data;
                if (componentMounted) {
                    if (data.length !== 0) {
                        setMembershipDetails(() => {
                            return data.map((membershipData: LooseObject, index: number) => {
                                return {
                                    ...membershipData,
                                    membershipID: parseInt(membershipData.membership_id)
                                };

                            });
                        });
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });

        return (() => {
            componentMounted = false;
        });
    }, []);

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
            <Title title="Membership" />
            <main className="l-Main">
                <Header />
                <div className="c-Membership">
                    <h1 className="c-Membership__Heading">Choose the Plan that's Right for You</h1>
                    <div className="c-Membership__Cards">
                        {
                            membershipDetails.map((data: LooseObject, index: number) => {
                                if (data.name !== "Normal") {
                                    return <MembershipCard
                                        key={index}
                                        name={data.name}
                                        price={data.price}
                                        description={data.description}
                                        membershipID={data.membershipID}
                                    />
                                } else {
                                    return null;
                                }
                            })
                        }
                    </div>


                </div>
            </main>
        </>
    )
}

export default Membership;