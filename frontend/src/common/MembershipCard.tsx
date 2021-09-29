import React from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
    name: string,
    price: string,
    description: string | null,
    membershipID: number
}

const MembershipCard: React.FC<Props> = ({ name, price, description, membershipID }) => {

    const history = useHistory();

    return (
        <div className={`c-Membership-Card c-Membership-Card--${name}`}>
            <div className="c-Membership-Card__Title">
                <h1>{name || "Error"}</h1>
            </div>
            <div className="c-Membership-Card__Price">
                <h1>S${price || "Error"}</h1>
                <p>per month</p>
            </div>
            <div className="c-Membership-Card__Description">
                <p>{description || "Error"}</p>
            </div>
            <div className="c-Membership-Card__Btn">
                <button type="button" onClick={() => history.push(`/membership/payment/${name?.toLowerCase()}`)}>Get Started</button>
            </div>

        </div>
    )
}

export default MembershipCard;