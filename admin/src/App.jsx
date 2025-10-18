


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