import { useContext, createContext, useState, useEffect } from "react";
import { Text, SafeAreaView } from "react-native";
import { account } from "../lib/appwriteConfig.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        checkAuth();
    };

    const checkAuth = async () => {
        try {
            const response = await account.get();
            setUser(response);
            setSession(response);
        } catch (error) {
            console.log(error);
            setUser(null);
            setSession(null);
        }
        setLoading(false);
    };

    const signin = async ({ email, password }) => {
        setLoading(true);
        try {
            const responseSession = await account.createEmailPasswordSession(
                email,
                password
            );
            setSession(responseSession);
            const responseUser = await account.get();
            setUser(responseUser);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const signup = async ({ email, password, name }) => {
        setLoading(true);
        try {
            // 1. Create account
            await account.create('unique()', email, password, name);
            // 2. Login (create session)
            const responseSession = await account.createEmailPasswordSession(email, password);
            setSession(responseSession);
            // 3. Get user
            const responseUser = await account.get();
            setUser(responseUser);
        } catch (error) {
            console.log(error);
            // Optionally: set error state and show message to user
        }
        setLoading(false);
    };

    const signout = async () => {
        setLoading(true);
        await account.deleteSession("current");
        setSession(null);
        setLoading(false);
        setUser(null);
    };

    const contextData = { session, user, signin, signout, signup };
    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (
                <SafeAreaView>
                    <Text>Loading..</Text>
                </SafeAreaView>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthContext, AuthProvider };