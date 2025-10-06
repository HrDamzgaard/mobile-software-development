import { createContext, useContext, useEffect, useState } from "react";
import { User } from '../types/User';
import  AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (u: User) => void;
    logOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () =>{
        const raw = await AsyncStorage.getItem('userData');
        if(raw) setUser(JSON.parse(raw));
        setLoading(false);
    })();
  },[]);

  const login = async (u: User) => {
    setUser(u);
    await AsyncStorage.setItem('userData', JSON.stringify(u));
  };

  const logOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('userData');
  };



  return (
    <AuthContext.Provider value={{ user, loading, login, logOut }} >
      {children}
    </AuthContext.Provider>
  );
};

export const userAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
