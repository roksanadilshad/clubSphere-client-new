import axios from "axios";



export const saveUser = async ( user ) => {
    try{
        if(!user?.email) return;

        await axios.post("https://club-sphere-server-new.vercel.app/users", {
             firebaseUid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    role: "member",
    createdAt: new Date(),
        });
    }catch(err){
        console.error("Error saving user:", err);
        
    }
}