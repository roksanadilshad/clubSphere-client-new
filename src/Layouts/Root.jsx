import React from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router';
import ScrollToTopButton from '../Pages/ScrollToTop';

const Root = () => {
    return (
        <div>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
            <ScrollToTopButton/>
        </div>
    );
};

export default Root;