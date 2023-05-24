import { UserInfo } from '@firebase/auth';
import { useState, useEffect } from 'react'
import { auth } from './config';


export interface AuthUserState {
  uid: string | null,
  displayName: string | null,
  email: string | null
}

const formatAuthUser = (user: UserInfo): AuthUserState => ({
  displayName: user.displayName,
  uid: user.uid,
  email: user.email
});


export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<AuthUserState | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: UserInfo | null) => {
    if (!authState) {
      setAuthUser(null)
      setLoading(false)
      return;
    }

    setLoading(true)
    const formattedUser: AuthUserState = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };
  const signOut = () =>
    auth.signOut().then(clear);

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => authStateChanged(user));
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signOut
  };
}