import React, { useState } from 'react';
import { UserContext } from './userContext';

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Function to update user
    const updateUser = (newUser) => {
        setUser(newUser);
    };
    // Function clear user data (e.g. Logout)
    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;

//
