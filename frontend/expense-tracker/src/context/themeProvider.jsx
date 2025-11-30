import React, { useLayoutEffect } from 'react';
import { ThemeContext } from './themeContext';

const ThemeProvider = ({ children }) => {
    const theme = 'light';

    // Use useLayoutEffect to ensure light mode is always applied
    useLayoutEffect(() => {
        try {
            // Always remove dark class to ensure light mode
            document.documentElement.classList.remove('dark');
            console.debug('ThemeProvider.apply -> light mode enforced');
        } catch (error) {
            console.error('Error setting theme:', error);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ theme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;
