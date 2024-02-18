import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/firebase.config";
import axios from "axios";

export const AuthContext = createContext(null);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const googleSignIn = () => {
        return signInWithPopup(auth, provider)
    }
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            if (!currentUser) {
                setUser(currentUser);
                setLoading(false);
            } else {
                const userData = {
                    email: currentUser.email,
                    name: currentUser.displayName,
                    photoURL: currentUser.photoURL
                }
                axios.post('https://site-features.onrender.com/saveUser', userData)
                    .then(res => {
                        if (res.data.acknowledged) {
                            setUser(currentUser);
                        } else if (res.data?.email) {
                            res.data.role && (currentUser['role'] = res.data.role)
                            setUser(currentUser);
                        }
                        setLoading(false);
                    })
            }
        });
        return () => {
            unSubscribe();
        }
    }, [])

    const authInfo = {
        user,
        loading,
        googleSignIn,
        logOut
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;