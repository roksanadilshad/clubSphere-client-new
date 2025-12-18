import axios from "axios";

export const getUser = async (email) => {
  if (!email) return null; // safety

  try {
    const { data } = await axios.get(`https://club-sphere-server-new.vercel.app/users/${email}`);
    return data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};
