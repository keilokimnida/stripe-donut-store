import Helmet from "react-helmet";
import React from 'react';

const Title: React.FC<{title: string}> = ({title}) => {
    const defaultTitle = "Stripe Donut";
    return (
        <Helmet>
            <meta charSet="utf-8"/>
            <title>{title ? title : defaultTitle}</title>
        </Helmet>
    )
}

export default Title;