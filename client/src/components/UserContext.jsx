
import React, { useState, useEffect, createContext } from 'react';
import { isAuthenticated } from '../services/AuthService';

import Login from '../components/Login';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const [ currentUser, setCurrentUser ] = useState(undefined);

	useEffect(() => {
		const checkLoggedIn = async () => {
			let cuser = isAuthenticated();
			if (cuser === null) {
				localStorage.setItem('user', '');
				cuser = '';
			}

			setCurrentUser(cuser);
		};

		checkLoggedIn();
	}, []);

	console.log('usercontext', currentUser);

	return (
		<UserContext.Provider value={[currentUser, setCurrentUser]}>
			{/* { currentUser?.id ? children : <Login />} */}
			{ children }
		</UserContext.Provider>
	);
};


export default UserContext;