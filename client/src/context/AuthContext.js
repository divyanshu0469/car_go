import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
export const AuthContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
};
export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(() => {
        try {
            const userInfo = localStorage.getItem("user-info");
            if (userInfo) {
                return JSON.parse(userInfo);
            }
            return null;
        }
        catch (error) {
            console.error("Error parsing user info:", error);
            return null;
        }
    });
    return _jsx(AuthContext.Provider, { value: { authUser, setAuthUser }, children: children });
};
