import React from 'react';
import CustomNavbar from './Navbar';
import { SellButton } from './SellButton';

const Layout = ({ children }) => {
  return (
    <>
      <CustomNavbar />
      {children}
      <SellButton />
    </>
  );
};

export default Layout;
