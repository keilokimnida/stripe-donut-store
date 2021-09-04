// Set user data when logging in
export const saveUserToken = (token: string, ): void => {
    localStorage.setItem('token', token);
};