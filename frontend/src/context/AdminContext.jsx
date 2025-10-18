

import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") || ""
  );
  const [doctors, setDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [pendingPostsCount, setPendingPostsCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(null);

  // Sync token with localStorage
  useEffect(() => {
    if (aToken) {
      localStorage.setItem("aToken", aToken);
    } else {
      localStorage.removeItem("aToken");
    }
  }, [aToken]);

  // Get all doctors - ✅ FIXED: Use lowercase 'atoken' in headers
  const getAllDoctors = async () => {
    if (!aToken) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { atoken: aToken } }  // ← lowercase 'atoken'
      );
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        setAToken("");
      } else {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Get all blogs
  const getAllBlogs = async () => {
    try {
      // const { data } = await axios.get(`${backendUrl}/api/blog/all-posts`);
      // ✅ Correct
       const { data } = await axios.get(`${backendUrl}/api/blog-posts/approved`);

      if (data.success) {
        setBlogs(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get dashboard data
  const getDashData = async () => {
    if (!aToken) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { atoken: aToken },  // ← lowercase 'atoken'
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get all appointments
  const getAllAppointments = async () => {
    if (!aToken) return;

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/appointments`,
        { headers: { atoken: aToken } }  // ← lowercase 'atoken'
      );
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Review blog post
  const reviewBlogPost = async (blogId, status, adminNotes, isFeatured) => {
    if (!aToken) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/review-blog`,
        { blogId, status, adminNotes, isFeatured },
        { headers: { atoken: aToken } }  // ← lowercase 'atoken'
      );
      if (data.success) {
        toast.success(data.message);
        getAllBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get pending blog posts
  const getPendingBlogPosts = async () => {
    if (!aToken) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/blog/pending-posts`,
        { headers: { atoken: aToken } }  // ← lowercase 'atoken'
      );
      if (data.success) {
        setPendingPosts(data.posts);
        setPendingPostsCount(data.posts?.length || 0);
        return data.posts;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    blogs,
    getAllBlogs,
    pendingPosts,
    pendingPostsCount,
    appointments,
    getAllAppointments,
    dashData,
    getDashData,
    reviewBlogPost,
    getPendingBlogPosts,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;