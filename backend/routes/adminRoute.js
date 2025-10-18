// import express from "express";
// import {
//   addDoctor,
//   allDoctors,
//   loginAdmin,
//   appointmentsAdmin,
//   appointmentCancel,
//   adminDashboard,
//   allPatients,
//   downloadPatientsPDF,
//   downloadPatientsExcel,
// } from "../controllers/adminController.js";
// import upload from "../middlewares/multer.js";
// import authAdmin from "../middlewares/authAdmin.js";
// import { changeAvailability } from "../controllers/doctorController.js";

// const adminRouter = express.Router();

// // In your route
// adminRouter.post(
//   "/add-doctor",
//   authAdmin,
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "video", maxCount: 1 },
//   ]),
//   addDoctor
// );
// adminRouter.post("/login", loginAdmin);
// adminRouter.post("/all-doctors", authAdmin, allDoctors);
// adminRouter.get("/patients", authAdmin, allPatients);
// adminRouter.get("/download-patients-pdf", authAdmin, downloadPatientsPDF);
// adminRouter.get("/download-patients-excel", authAdmin, downloadPatientsExcel);
// adminRouter.post("/change-availability", authAdmin, changeAvailability);
// adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
// adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
// adminRouter.get("/dashboard", authAdmin, adminDashboard);

// export default adminRouter;




// routes/adminRoute.js
// import express from "express";
// import bcrypt from "bcryptjs";
// import User from "../models/userModel.js";
// import {
//   addDoctor,
//   allDoctors,
//   loginAdmin,
//   appointmentsAdmin,
//   appointmentCancel,
//   adminDashboard,
//   deleteDoctorByAdmin,
//   editDoctorByAdmin,
//   deleteBlogByAdmin,
//   editBlogByAdmin,
//   allPatients,
//   downloadPatientsPDF,
//   downloadPatientsExcel,
// } from "../controllers/adminController.js";

// import upload from "../middlewares/multer.js";
// import authAdmin from "../middlewares/authAdmin.js";
// import { changeAvailability } from "../controllers/doctorController.js";

// const adminRouter = express.Router();

// // ONE-TIME CREATE ADMIN
// adminRouter.post("/create-admin", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingAdmin = await User.findOne({ email });
//     if (existingAdmin)
//       return res.status(400).json({ message: "Admin already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const admin = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//     });

//     res.status(201).json({ message: "Admin created", admin });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // OTHER ADMIN ROUTES
// adminRouter.post( 
//   "/add-doctor",
//   authUser, 
//   authAdmin,
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "video", maxCount: 1 },
//   ]),
//   addDoctor
// );
// adminRouter.post("/login", loginAdmin);
// adminRouter.post("/all-doctors",  authUser, authAdmin, allDoctors);
// adminRouter.get("/patients",  authUser, authAdmin, allPatients);
// adminRouter.get("/download-patients-pdf", authUser,  authAdmin, downloadPatientsPDF);
// adminRouter.get("/download-patients-excel", authUser,  authAdmin, downloadPatientsExcel);
// adminRouter.post("/change-availability", authUser,  authAdmin, changeAvailability);
// adminRouter.get("/appointments",  authUser, authAdmin, appointmentsAdmin);
// adminRouter.post("/cancel-appointment", authUser,  authAdmin, appointmentCancel);
// adminRouter.get("/dashboard", authUser,  authAdmin, adminDashboard);

// adminRouter.post("/delete-doctor", authUser,  authAdmin, deleteDoctorByAdmin);
// adminRouter.post("/edit-doctor", authUser,  authAdmin, editDoctorByAdmin);

// // Blog edit/delete routes
// adminRouter.post("/delete-blog", authUser,  authAdmin, deleteBlogByAdmin);
// adminRouter.post("/edit-blog", authUser,  authAdmin, editBlogByAdmin);

// export default adminRouter;




// import express from "express";
// import bcrypt from "bcryptjs";
// import User from "../models/userModel.js";
// import {
//   addDoctor,
//   allDoctors,
//   loginAdmin,
//   appointmentsAdmin,
//   appointmentCancel,
//   adminDashboard,
//   deleteDoctorByAdmin,
//   editDoctorByAdmin,
//   deleteBlogByAdmin,
//   editBlogByAdmin,
//   allPatients,
//   downloadPatientsPDF,
//   downloadPatientsExcel,
// } from "../controllers/adminController.js";

// import upload from "../middlewares/multer.js";
// import authUser from "../middlewares/authUser.js"; // <-- add this
// import authAdmin from "../middlewares/authAdmin.js";
// import { changeAvailability } from "../controllers/doctorController.js";

// const adminRouter = express.Router();

// // ONE-TIME CREATE ADMIN
// adminRouter.post("/create-admin", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingAdmin = await User.findOne({ email });
//     if (existingAdmin)
//       return res.status(400).json({ message: "Admin already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const admin = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "admin",
//     });

//     res.status(201).json({ message: "Admin created", admin });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // OTHER ADMIN ROUTES
// adminRouter.post( 
//   "/add-doctor",
//   authUser, 
//   authAdmin,
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "video", maxCount: 1 },
//   ]),
//   addDoctor
// );

// adminRouter.post("/login", loginAdmin);
// adminRouter.post("/all-doctors", authUser, authAdmin, allDoctors);
// adminRouter.get("/patients", authUser, authAdmin, allPatients);
// adminRouter.get("/download-patients-pdf", authUser, authAdmin, downloadPatientsPDF);
// adminRouter.get("/download-patients-excel", authUser, authAdmin, downloadPatientsExcel);
// adminRouter.post("/change-availability", authUser, authAdmin, changeAvailability);
// adminRouter.get("/appointments", authUser, authAdmin, appointmentsAdmin);
// adminRouter.post("/cancel-appointment", authUser, authAdmin, appointmentCancel);
// adminRouter.get("/dashboard", authUser, authAdmin, adminDashboard);

// adminRouter.post("/delete-doctor", authUser, authAdmin, deleteDoctorByAdmin);
// adminRouter.post("/edit-doctor", authUser, authAdmin, editDoctorByAdmin);

// // Blog edit/delete routes
// adminRouter.post("/delete-blog", authUser, authAdmin, deleteBlogByAdmin);
// adminRouter.post("/edit-blog", authUser, authAdmin, editBlogByAdmin);

// export default adminRouter;



import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import {
  addDoctor,
  allDoctors,
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
  deleteDoctorByAdmin,
  editDoctorByAdmin,
  createBlogByAdmin,
  deleteBlogByAdmin,
  editBlogByAdmin,
  allPatients,
  downloadPatientsPDF,
  downloadPatientsExcel,
} from "../controllers/adminController.js";

import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

// ONE-TIME CREATE ADMIN
adminRouter.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({ message: "Admin created", admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ALL ADMIN ROUTES - Only authAdmin middleware (NO authUser)
adminRouter.post(
  "/add-doctor",
  authAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  addDoctor
);

adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/patients", authAdmin, allPatients);
adminRouter.get("/download-patients-pdf", authAdmin, downloadPatientsPDF);
adminRouter.get("/download-patients-excel", authAdmin, downloadPatientsExcel);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// Doctor management routes
adminRouter.post("/delete-doctor", authAdmin, deleteDoctorByAdmin);
adminRouter.post("/edit-doctor", authAdmin, editDoctorByAdmin);

// Blog management routes
adminRouter.post("/delete-blog", authAdmin, deleteBlogByAdmin);
adminRouter.post("/edit-blog", authAdmin, editBlogByAdmin);

adminRouter.post("/create-blog", authAdmin, createBlogByAdmin);

export default adminRouter;