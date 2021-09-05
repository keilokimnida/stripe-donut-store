// Set user data when logging in
export const saveUserToken = (token: string, ): void => {
    localStorage.setItem('token', token);
};

// Return the user's token
export const getToken = (): string | null => {
    return localStorage.getItem('token') || null;
}

// Clear user's localStorage
export const clearLocalStorage = () => {
    localStorage.clear();
}