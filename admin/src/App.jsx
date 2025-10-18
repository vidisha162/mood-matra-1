// import React, { useContext } from "react";
// import LoginLanding from "./pages/LoginLanding";
// import AdminLogin from "./pages/AdminLogin";
// import DoctorLogin from "./pages/DoctorLogin";
// import { ToastContainer } from "react-toastify";
// import { AdminContext } from "../../frontend/src/context/AdminContext";
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
// import { Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/Admin/Dashboard";
// import AllApointments from "./pages/Admin/AllApointments";
// import AddDoctor from "./pages/Admin/AddDoctor";
// import DoctorsList from "./pages/Admin/DoctorsList";
// import Patients from "./pages/Admin/Patients";
// import PatientReports from "./pages/Admin/PatientReports";
// import Testimonials from "./pages/Admin/Testimonials";
// import BlogPosts from "./pages/Admin/BlogPosts";
// import { DoctorContext } from "./context/DoctorContext";
// import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
// import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
// import DoctorProfile from "./pages/Doctor/DoctorProfile";
// import MyPatients from "./pages/Doctor/MyPatients";
// import PatientsReports from "./pages/Doctor/MyPatientsReports";
// import MyPatientsReports from "./pages/Doctor/MyPatientsReports";
// import PatientMoodData from "./pages/Doctor/PatientMoodData";

// const App = () => {
//   const { aToken } = useContext(AdminContext);
//   const { dToken } = useContext(DoctorContext);

//   return (
//     <>
//       <ToastContainer
//         theme="colored"
//         className="scale-95 mt-2 sm:scale-100 sm:mt-14"
//       />

//       {aToken || dToken ? (
//         <div>
//           <Navbar />
//           <div className="flex items-start">
//             <Sidebar />
//             <Routes>
//               {/* Root route */}
//               <Route
//                 path="/"
//                 element={aToken ? <Dashboard /> : <DoctorDashboard />}
//               />

//               {/* Admin routes */}
//               <Route path="/admin-dashboard" element={<Dashboard />} />
//               <Route path="/all-appointments" element={<AllApointments />} />
//               <Route path="/add-doctor" element={<AddDoctor />} />
//               <Route path="/doctor-list" element={<DoctorsList />} />
//               <Route path="/patients" element={<Patients />} />
//               <Route path="/patient-reports" element={<PatientReports />} />
//               <Route path="/testimonials" element={<Testimonials />} />
//               <Route path="/review-posts" element={<BlogPosts />} />

//               {/* Doctor routes */}
//               <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
//               <Route
//                 path="/doctor-appointments"
//                 element={<DoctorAppointments />}
//               />
//               <Route path="/doctor-profile" element={<DoctorProfile />} />
//               <Route path="/my-patients" element={<MyPatients />} />
//               <Route
//                 path="/my-patient-reports"
//                 element={<MyPatientsReports />}
//               />
//               <Route path="/patient-mood-data" element={<PatientMoodData />} />
//             </Routes>
//           </div>
//         </div>
//       ) : (
//         <Routes>
//           {/* Login routes */}
//           <Route path="/" element={<LoginLanding />} />
//           <Route path="/admin-login" element={<AdminLogin />} />
//           <Route path="/doctor-login" element={<DoctorLogin />} />
//         </Routes>
//       )}
//     </>
//   );
// };

// export default App;





// frontend/src/App.jsx

// import React, { useContext } from "react";
// import { Route, Routes } from "react-router-dom";
// import { ToastContainer } from "react-toastify";

// // Admin Context (You previously fixed the functions in here to prevent crashing)
// import { AdminContext } from "../../frontend/src/context/AdminContext"; 
// import { DoctorContext } from "./context/DoctorContext";

// // Login Pages
// import LoginLanding from "./pages/LoginLanding";
// import AdminLogin from "./pages/AdminLogin";
// import DoctorLogin from "./pages/DoctorLogin";

// // Layout & Components
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";

// // Admin Components (NOTE: Using your existing file names)
// import Dashboard from "./pages/Admin/Dashboard"; // Used for /admin (index)
// import AllApointments from "./pages/Admin/AllApointments";
// import AddDoctor from "./pages/Admin/AddDoctor";
// import DoctorsList from "./pages/Admin/DoctorsList"; // Used for /admin/doctors
// import Patients from "./pages/Admin/Patients";
// import PatientReports from "./pages/Admin/PatientReports";
// import Testimonials from "./pages/Admin/Testimonials";
// import BlogPosts from "./pages/Admin/BlogPosts"; // Used for /admin/blogs (review-posts)

// // Doctor Components
// import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
// import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
// import DoctorProfile from "./pages/Doctor/DoctorProfile";
// import MyPatients from "./pages/Doctor/MyPatients";
// import MyPatientsReports from "./pages/Doctor/MyPatientsReports";
// import PatientMoodData from "./pages/Doctor/PatientMoodData";


// const App = () => {
//   const { aToken } = useContext(AdminContext);
//   const { dToken } = useContext(DoctorContext);

//   return (
//     <>
//       <ToastContainer
//         theme="colored"
//         className="scale-95 mt-2 sm:scale-100 sm:mt-14"
//       />

//       {aToken || dToken ? (
//         <div>
//           <Navbar />
//           <div className="flex items-start">
//             <Sidebar />
//             <Routes>
//               {/* Root route after login (redirects based on token) */}
//               <Route
//                 path="/"
//                 element={aToken ? <Dashboard /> : <DoctorDashboard />}
//               />

//               {/* 🔑 ADMIN ROUTES FIX: Grouped under /admin 🔑 */}
//              {/* The element used here, Dashboard, can be seen as the main Admin Layout */}
//               <Route path="/admin" element={<Dashboard />}>
//                 {/* Matches: /admin (index path when hitting /admin directly) */}
//                 <Route index element={<Dashboard />} />
//                 
//                 {/* Matches: /admin/doctors (Fixes the console error) */}
//                 <Route path="doctors" element={<DoctorsList />} /> 
                
//                 {/* Nested Admin paths (using the new naming convention) */}
//                 <Route path="appointments" element={<AllApointments />} />
//                 <Route path="add-doctor" element={<AddDoctor />} />
//                 <Route path="patients" element={<Patients />} />
//                 <Route path="patient-reports" element={<PatientReports />} />
//                 <Route path="testimonials" element={<Testimonials />} />
//                 <Route path="blogs" element={<BlogPosts />} /> 
//               </Route>

//               {/* Doctor routes (can remain top-level or be nested under /doctor) */}
//               <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
//               <Route
//                 path="/doctor-appointments"
//                 element={<DoctorAppointments />}
//               />
//               <Route path="/doctor-profile" element={<DoctorProfile />} />
//               <Route path="/my-patients" element={<MyPatients />} />
//               <Route
//                 path="/my-patient-reports"
//                 element={<MyPatientsReports />}
//               />
//               <Route path="/patient-mood-data" element={<PatientMoodData />} />
//             </Routes>
//           </div>
//         </div>
//       ) : (
//         <Routes>
//           {/* Login routes */}
//           <Route path="/" element={<LoginLanding />} />
//           <Route path="/admin-login" element={<AdminLogin />} />
//           <Route path="/doctor-login" element={<DoctorLogin />} />
//         </Routes>
//       )}
//     </>
//   );
// };

// export default App;














// frontend/src/App.jsx

import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Contexts
import { AdminContext } from "../../frontend/src/context/AdminContext";
import { DoctorContext } from "./context/DoctorContext";

// Layout & Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Login Pages
import LoginLanding from "./pages/LoginLanding";
import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";

// Admin Components (Used in the authenticated section)
import Dashboard from "../../frontend/src/pages/Admin/Dashboard"; 
import AllApointments from "../../frontend/src/pages/Admin/AllApointments";
import AddDoctor from "../../frontend/src/pages/Admin/AddDoctor";
import DoctorsList from "../../frontend/src/pages/Admin/DoctorsList"; 
import Patients from "../../frontend/src/pages/Admin/Patients";
import PatientReports from "../../frontend/src/pages/Admin/PatientReports";
import Testimonials from "../../frontend/src/pages/Admin/Testimonials";
import BlogPosts from "../../frontend/src/pages/Admin/BlogPosts"; 

// Doctor Components (Used in the authenticated section)
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointments from "./pages/Doctor/DoctorAppointments";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import MyPatients from "./pages/Doctor/MyPatients";
import MyPatientsReports from "./pages/Doctor/MyPatientsReports";
import PatientMoodData from "./pages/Doctor/PatientMoodData";


const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <>
      <ToastContainer
        theme="colored"
        className="scale-95 mt-2 sm:scale-100 sm:mt-14"
      />

      {aToken || dToken ? (
        <div>
          <Navbar />
          <div className="flex items-start">
            <Sidebar />
            <Routes>
              {/* Root route after login */}
              <Route
                path="/"
                element={aToken ? <Dashboard /> : <DoctorDashboard />}
              />

              {/* 🔑 ADMIN ROUTES: Updated to match browser request 🔑 */}
             {/* This structure defines the paths the browser is requesting but which were previously missing */}
              
             {/* FIX FOR: /admin/doctors (This must be here to clear the console error) */}
              <Route path="/admin/doctors" element={<DoctorsList />} /> 
             
             {/* FIX FOR: /admin/blogs (The path for editing/deleting blogs) */}
              <Route path="/admin/blogs" element={<BlogPosts />} /> 
             
             {/* You can keep your existing admin routes for backwards compatibility */}
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointments" element={<AllApointments />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route path="/doctor-list" element={<DoctorsList />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patient-reports" element={<PatientReports />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/review-posts" element={<BlogPosts />} />

              {/* Doctor routes */}
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor-appointments"
                element={<DoctorAppointments />}
              />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              <Route path="/my-patients" element={<MyPatients />} />
              <Route
                path="/my-patient-reports"
                element={<MyPatientsReports />}
              />
              <Route path="/patient-mood-data" element={<PatientMoodData />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          {/* Login routes */}
          <Route path="/" element={<LoginLanding />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
        </Routes>
      )}
    </>
  );
};

export default App;