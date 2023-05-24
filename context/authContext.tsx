import { createContext, useContext } from 'react'
import useFirebaseAuth, { AuthUserState } from "../firebase/authUser";

interface AuthState{
  authUser: AuthUserState | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const initial: AuthState = {
  authUser: {
    uid: null,
    displayName: null,
    email: null
  },
  loading: true,
  signOut: async () => { }
}
const authUserContext = createContext(initial);

export function AuthUserProvider({ children }: any) {
  const auth:AuthState = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(authUserContext);