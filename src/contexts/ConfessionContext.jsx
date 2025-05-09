import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is being used for API calls
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ConfessionContext = createContext();

export const useConfessions = () => useContext(ConfessionContext);

export const ConfessionProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Ensure user is authenticated
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // For example: all, approved, pending

  // Axios instance for API calls
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Make sure this is correct
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Fetch all confessions, applying the filter for status (approved/pending)
  useEffect(() => {
    const fetchConfessions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/all_confessions"); // Adjust based on the backend response
        let filteredConfessions = response.data;

        if (filter !== "all") {
          filteredConfessions = filteredConfessions.filter(
            (confession) => confession.status === filter
          );
        }

        setConfessions(filteredConfessions);
      } catch (error) {
        console.error("Error fetching confessions:", error);
        toast.error("Failed to load confessions");
      } finally {
        setLoading(false);
      }
    };

    fetchConfessions();
  }, [filter]); // Re-fetch when filter changes

  // Create a confession
  const createConfession = async (confessionText) => {
    if (!currentUser) {
      toast.error("You need to be logged in to submit a confession.");
      return;
    }

    try {
      const response = await axiosInstance.post("/create_confession", {
        confession: confessionText,
      });
      setConfessions((prevConfessions) => [
        ...prevConfessions,
        response.data.confession,
      ]);
      toast.success("Confession submitted successfully!");
    } catch (error) {
      console.error("Error creating confession:", error);
      toast.error("Failed to submit confession");
    }
  };

  const value = {
    confessions,
    loading,
    createConfession,
    filter,
    setFilter,
  };

  return (
    <ConfessionContext.Provider value={value}>
      {children}
    </ConfessionContext.Provider>
  );
};
