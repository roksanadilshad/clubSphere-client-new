
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase.init";
import { AuthContext } from "./AuthContext";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { saveUser } from "../api/saveUser";


const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const createUser = (email, password) =>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    }
    const signInUser = (email, password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }
    const signInWithGoogle = () =>{
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };
    const signOutUser = () =>{
        return signOut(auth);
    }
    const passwordReset =(email) =>{
        setLoading(true)
         return sendPasswordResetEmail(auth, email);
    };
    const updateUserProfile = async (name, photoURL) =>{
        await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: photoURL,
        })
         // optional: reload user to ensure profile is updated
  await auth.currentUser.reload();
  // update local state
  setUser(auth.currentUser);
    }

    useEffect(()=>{
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);

        
        setLoading(false);
      });
       return () =>{
        unsubscribe();
      } 
    }, [])

    const authInfo = {
        loading,
        user,
        createUser,
        signInUser,
        signInWithGoogle,
        signOutUser,
        setUser,
        passwordReset,
        updateUserProfile,
        setLoading
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;