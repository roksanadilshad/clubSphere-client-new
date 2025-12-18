import axios from "axios";

export const saveUser = async (user) => {
    try {
        if (!user?.email) return;

        // 1. Save User to Database
        await axios.post("https://club-sphere-server-new.vercel.app/users", {
            firebaseUid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: "member",
            createdAt: new Date(),
        });

        // 2. GENERATE TOKEN (The missing part)
        const { data } = await axios.post("https://club-sphere-server-new.vercel.app/jwt", {
            email: user.email
        });

        // 3. STORE TOKEN
        if (data.token) {
            localStorage.setItem('accessToken', data.token);
            console.log("Token secured and stored!");
        }

    } catch (err) {
        console.error("Error in saveUser or JWT generation:", err);
    }
}