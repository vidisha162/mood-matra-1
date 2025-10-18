// import axios from "axios";
// import { createContext, useState, useContext } from "react"; // Added useContext here
// import { toast } from "react-toastify";

// export const AdminContext = createContext();

// // Custom hook
// export const useAuth = () => {
//   const context = useContext(AdminContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AdminProvider");
//   }
//   return context;
// };

// const AdminContextProvider = (props) => {
//   const [aToken, setAtoken] = useState(
//     localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
//   );

//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [doctors, setDoctors] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [dashData, setDashData] = useState(false);
//   const [pendingPosts, setPendingPosts] = useState([]);
//   const [pendingPostsCount, setPendingPostsCount] = useState(0);

//   const getAllDoctors = async () => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/admin/all-doctors",
//         {},
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         setDoctors(data.doctors);
//         console.log(data.doctors);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const changeAvailability = async (docId) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/admin/change-availability",
//         { docId },
//         { headers: { aToken } }
//       );

//       if (data.success) {
//         toast.success(data.message);
//         getAllDoctors();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const getAllAppointments = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
//         headers: { aToken },
//       });

//       if (data.success) {
//         setAppointments(data.appointments);
//         console.log(data.appointments);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const cancelAppointment = async (appointmentId) => {
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/admin/cancel-appointment",
//         { appointmentId },
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         getAllAppointments();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const getDashData = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
//         headers: { aToken },
//       });
//       if (data.success) {
//         setDashData(data.dashData);
//         console.log(data.dashData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   // Blog post management functions
//   const getPendingBlogPosts = async () => {
//     try {
//       const { data } = await axios.get(
//         backendUrl + "/api/blog-posts/admin/pending",
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         setPendingPosts(data.data.posts);
//         setPendingPostsCount(data.data.pagination.totalPosts);
//         console.log(data.data.posts);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const reviewBlogPost = async (
//     postId,
//     status,
//     adminNotes,
//     isFeatured = false
//   ) => {
//     try {
//       const { data } = await axios.put(
//         backendUrl + `/api/blog-posts/admin/${postId}/review`,
//         { status, adminNotes, isFeatured },
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         getPendingBlogPosts(); // Refresh the list
//         getDashData(); // Update dashboard data
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const value = {
//     aToken,
//     setAtoken,
//     backendUrl,
//     doctors,
//     getAllDoctors,
//     changeAvailability,
//     appointments,
//     setAppointments,
//     getAllAppointments,
//     cancelAppointment,
//     dashData,
//     getDashData,
//     pendingPosts,
//     pendingPostsCount,
//     getPendingBlogPosts,
//     reviewBlogPost,
//   };

//   return (
//     <AdminContext.Provider value={value}>
//       {props.children}
//     </AdminContext.Provider>
//   );
// };

// export default AdminContextProvider;





// import { createContext, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AdminContext = createContext();

// const AdminContextProvider = ({ children }) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
//   const [aToken, setAToken] = useState(
//     localStorage.getItem("aToken") || ""
//   );
//   const [doctors, setDoctors] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [dashData, setDashData] = useState(null);

// const getAllDoctors = async () => {
//     // 🚨 QUICK FIX: Check for the token first!
//     if (!aToken) return; 

//     try {
//         const { data } = await axios.post(
//             `${backendUrl}/api/admin/all-doctors`,
//             {},
//             { headers: { aToken } }
//         );
//         // ... (rest of the logic)
//     } catch (error) {
//         toast.error(error.message);
//     }
// };

// // Get all blogs
// const getAllBlogs = async () => {
//     // This function seems to use a public endpoint and doesn't need a token check,
//     // but if you want to make it an admin-only function, add the check:
//     // if (!aToken) return; 
    
//     try {
//         const { data } = await axios.get(`${backendUrl}/api/blog/all-posts`);
//         // ... (rest of the logic)
//     } catch (error) {
//         toast.error(error.message);
//     }
// };

// // Get dashboard data
// const getDashData = async () => {
//     // 🚨 QUICK FIX: Check for the token first!
//     if (!aToken) return;

//     try {
//         const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
//             headers: { aToken },
//         });
//         // ... (rest of the logic)
//     } catch (error) {
//         toast.error(error.message);
//     }
// };

// // Get all appointments
// const getAllAppointments = async () => {
//     // 🚨 QUICK FIX: Check for the token first!
//     if (!aToken) return;

//     try {
//         const { data } = await axios.get(
//             `${backendUrl}/api/admin/appointments`,
//             { headers: { aToken } }
//         );
//         // ... (rest of the logic)
//     } catch (error) {
//         toast.error(error.message);
//     }
// };


//   // // Get all doctors
//   // const getAllDoctors = async () => {
//   //   try {
//   //     const { data } = await axios.post(
//   //       `${backendUrl}/api/admin/all-doctors`,
//   //       {},
//   //       { headers: { aToken } }
//   //     );
//   //     if (data.success) {
//   //       setDoctors(data.doctors);
//   //     } else {
//   //       toast.error(data.message);
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.message);
//   //   }
//   // };

//   // // Get all blogs
//   // const getAllBlogs = async () => {
//   //   try {
//   //     const { data } = await axios.get(`${backendUrl}/api/blog/all-posts`);
//   //     if (data.success) {
//   //       setBlogs(data.posts);
//   //     } else {
//   //       toast.error(data.message);
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.message);
//   //   }
//   // };

//   // Get dashboard data
//   // const getDashData = async () => {
//   //   try {
//   //     const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
//   //       headers: { aToken },
//   //     });
//   //     if (data.success) {
//   //       setDashData(data.dashData);
//   //     } else {
//   //       toast.error(data.message);
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.message);
//   //   }
//   // };

//   // // Get all appointments
//   // const getAllAppointments = async () => {
//   //   try {
//   //     const { data } = await axios.get(
//   //       `${backendUrl}/api/admin/appointments`,
//   //       { headers: { aToken } }
//   //     );
//   //     if (data.success) {
//   //       setAppointments(data.appointments);
//   //     } else {
//   //       toast.error(data.message);
//   //     }
//   //   } catch (error) {
//   //     toast.error(error.message);
//   //   }
//   // };

//   // Review blog post (for BlogPosts component)
//   const reviewBlogPost = async (blogId, status, adminNotes, isFeatured) => {
//     if (!aToken) return;
//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/admin/review-blog`,
//         { blogId, status, adminNotes, isFeatured },
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         getAllBlogs(); // Refresh blogs list
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Get pending blog posts
//   const getPendingBlogPosts = async () => {
//     if (!aToken) return;
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/blog/pending-posts`,
//         { headers: { aToken } }
//       );
//       if (data.success) {
//         // You can add a state for pending posts if needed
//         return data.posts;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const value = {
//     aToken,
//     setAToken,
//     backendUrl,
//     doctors,
//     getAllDoctors,
//     blogs,
//     getAllBlogs,
//     appointments,
//     getAllAppointments,
//     dashData,
//     getDashData,
//     reviewBlogPost,
//     getPendingBlogPosts,
//   };

//   return (
//     <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
//   );
// };

// export default AdminContextProvider;







// import { createContext, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AdminContext = createContext();

// const AdminContextProvider = ({ children }) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
//   const [aToken, setAToken] = useState(
//     localStorage.getItem("aToken") || ""
//   );
//   const [doctors, setDoctors] = useState([]);
//   const [blogs, setBlogs] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [dashData, setDashData] = useState(null);

//   // Get all doctors
//   const getAllDoctors = async () => {
//     if (!aToken) return; 

//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/admin/all-doctors`,
//         {},
//         { headers: { Authorization: `Bearer ${aToken}` } }
//       );
//       if (data.success) {
//         setDoctors(data.doctors);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Get all blogs
//   const getAllBlogs = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/blog/all-posts`);
//       if (data.success) {
//         setBlogs(data.posts);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Get dashboard data
//   const getDashData = async () => {
//     if (!aToken) return;

//     try {
//       const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
//         headers: { Authorization: `Bearer ${aToken}` },
//       });
//       if (data.success) {
//         setDashData(data.dashData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Get all appointments
//   const getAllAppointments = async () => {
//     if (!aToken) return;

//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/admin/appointments`,
//         { headers: { Authorization: `Bearer ${aToken}` } }
//       );
//       if (data.success) {
//         setAppointments(data.appointments);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Review blog post
//   const reviewBlogPost = async (blogId, status, adminNotes, isFeatured) => {
//     if (!aToken) return;
//     try {
//       const { data } = await axios.post(
//         `${backendUrl}/api/admin/review-blog`,
//         { blogId, status, adminNotes, isFeatured },
//         { headers: { Authorization: `Bearer ${aToken}` } }
//       );
//       if (data.success) {
//         toast.success(data.message);
//         getAllBlogs();
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Get pending blog posts
//   const getPendingBlogPosts = async () => {
//     if (!aToken) return;
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/blog/pending-posts`,
//         { headers: { Authorization: `Bearer ${aToken}` } }
//       );
//       if (data.success) {
//         return data.posts;
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const value = {
//     aToken,
//     setAToken,
//     backendUrl,
//     doctors,
//     getAllDoctors,
//     blogs,
//     getAllBlogs,
//     appointments,
//     getAllAppointments,
//     dashData,
//     getDashData,
//     reviewBlogPost,
//     getPendingBlogPosts,
//   };

//   return (
//     <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
//   );
// };

// export default AdminContextProvider;









// import { createContext, useState, useEffect } from "react"; // <-- ADDED useEffect HERE
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AdminContext = createContext();

// const AdminContextProvider = ({ children }) => {
//     const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    
//     // Initialize state with token from Local Storage on initial load
//     const [aToken, setAToken] = useState(
//         localStorage.getItem("aToken") || ""
//     );
//     const [doctors, setDoctors] = useState([]);
//     const [blogs, setBlogs] = useState([]);
//     const [appointments, setAppointments] = useState([]);
//     const [dashData, setDashData] = useState(null);

//     // 🌟 FIX: Use useEffect to synchronize token changes with Local Storage 🌟
//     useEffect(() => {
//         if (aToken) {
//             // Save token to local storage if it's set
//             localStorage.setItem("aToken", aToken);
//         } else {
//             // Remove token from local storage if set to empty or null (e.g., during logout)
//             localStorage.removeItem("aToken");
//         }
//     }, [aToken]);
//     // ----------------------------------------------------------------------

//     // Get all doctors
//     const getAllDoctors = async () => {
//         // Now using !aToken check, which works better since aToken is reliably loaded
//         if (!aToken) return; 

//         try {
//             const { data } = await axios.post(
//                 `${backendUrl}/api/admin/all-doctors`,
//                 {},
//                 { headers: { Authorization: `Bearer ${aToken}` } }
//             );
//             if (data.success) {
//                 setDoctors(data.doctors);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             console.error("Error fetching doctors:", error);
//             // Handle 401: You might want to log out the user here
//             if (error.response && error.response.status === 401) {
//                  toast.error("Session expired. Please log in.");
//                  setAToken(""); // Set token state to empty/null to force relogin
//             } else {
//                  toast.error(error.message);
//             }
//         }
//     };

//     // Get all blogs (No token required here based on your code)
//     const getAllBlogs = async () => {
//         try {
//             const { data } = await axios.get(`${backendUrl}/api/blog/all-posts`);
//             if (data.success) {
//                 setBlogs(data.posts);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     // Get dashboard data
//     const getDashData = async () => {
//         if (!aToken) return;

//         try {
//             const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
//                 headers: { Authorization: `Bearer ${aToken}` },
//             });
//             if (data.success) {
//                 setDashData(data.dashData);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     // Get all appointments
//     const getAllAppointments = async () => {
//         if (!aToken) return;

//         try {
//             const { data } = await axios.get(
//                 `${backendUrl}/api/admin/appointments`,
//                 { headers: { Authorization: `Bearer ${aToken}` } }
//             );
//             if (data.success) {
//                 setAppointments(data.appointments);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     // Review blog post
//     const reviewBlogPost = async (blogId, status, adminNotes, isFeatured) => {
//         if (!aToken) return;
//         try {
//             const { data } = await axios.post(
//                 `${backendUrl}/api/admin/review-blog`,
//                 { blogId, status, adminNotes, isFeatured },
//                 { headers: { Authorization: `Bearer ${aToken}` } }
//             );
//             if (data.success) {
//                 toast.success(data.message);
//                 getAllBlogs();
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     // Get pending blog posts
//     const getPendingBlogPosts = async () => {
//         if (!aToken) return;
//         try {
//             const { data } = await axios.get(
//                 `${backendUrl}/api/blog/pending-posts`,
//                 { headers: { Authorization: `Bearer ${aToken}` } }
//             );
//             if (data.success) {
//                 return data.posts;
//             }
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     const value = {
//         aToken,
//         setAToken,
//         backendUrl,
//         doctors,
//         getAllDoctors,
//         blogs,
//         getAllBlogs,
//         appointments,
//         getAllAppointments,
//         dashData,
//         getDashData,
//         reviewBlogPost,
//         getPendingBlogPosts,
//     };

//     return (
//         <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
//     );
// };

// export default AdminContextProvider;





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

  // Get all doctors
  const getAllDoctors = async () => {
    if (!aToken) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/all-doctors`,
        {},
        { headers: { aToken } }
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
      const { data } = await axios.get(`${backendUrl}/api/blog/all-posts`);
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
        headers: { aToken },
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
        { headers: { aToken } }
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
        { headers: { aToken } }
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
        { headers: { aToken } }
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