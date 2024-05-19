import { createContext, useContext, useState } from "react";

export const AuthContext = createContext<{
    authUser: string | null,
    setAuthUser: React.Dispatch<undefined>
} | null >(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
    return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [authUser, setAuthUser] = useState(() => {
        try {
            const userInfo = localStorage.getItem("user-info");
            if (userInfo) {
                return JSON.parse(userInfo);
            }
            return null;
        } catch (error) {
            console.error("Error parsing user info:", error);
            return null;
        }
    });

    return <AuthContext.Provider value={{ authUser, setAuthUser }}>{children}</AuthContext.Provider>;
};