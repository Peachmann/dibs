import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './components/Login';

const AppRoutes = () => {
	return (
		<Routes>
			<Route path='/' exact element={<Home />} />
			<Route path='/login' exact element={<Login />} />
		</Routes>
	);
};

export default AppRoutes;