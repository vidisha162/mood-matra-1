// import jwt from "jsonwebtoken";

// // admin authentication middleware
// const authAdmin = async (req, res, next) => {
//   try {
//     const { atoken } = req.headers;
//     if (!atoken) {
//       return res.status(400).json({
//         success: false,
//         message: "Not Authorized! Try to Login Again.",
//       });
//     }
//     const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
//     if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
//       return res.status(400).json({
//         success: false,
//         message: "Not Authorized! Try to Login Again.",
//       });
//     }
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export default authAdmin;


// 







// import User from "../models/userModel.js";

// // Admin authorization middleware
// const authAdmin = async (req, res, next) => {
//   try {
//     // Ensure authUser has set req.user
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: "Unauthorized" });
//     }

//     // Find user by ID
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     // Check if user is admin
//     if (user.role !== "admin") {
//       return res.status(403).json({ success: false, message: "Access denied. Admins only." });
//     }

//     // User is admin, proceed
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export default authAdmin;







// import jwt from "jsonwebtoken";

// // Admin authorization middleware
// const authAdmin = async (req, res, next) => {
//   try {
//     const { aToken } = req.headers;

//     if (!aToken) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "Not Authorized. Login Again" 
//       });
//     }

//     // Decode admin token
//     const token_decode = jwt.verify(aToken, process.env.JWT_SECRET);
    
//     // Check if this token matches admin credentials
//     // Your loginAdmin creates token like: jwt.sign(email + password, JWT_SECRET)
//     const adminEmail = process.env.ADMIN_EMAIL;
//     const adminPassword = process.env.ADMIN_PASSWORD;
//     const expectedToken = adminEmail + adminPassword;
    
//     if (token_decode !== expectedToken) {
//       return res.status(403).json({ 
//         success: false, 
//         message: "Not Authorized. Admins only" 
//       });
//     }

//     // Admin is verified, proceed
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ 
//       success: false, 
//       message: "Invalid or expired token" 
//     });
//   }
// };

// export default authAdmin;







// import jwt from "jsonwebtoken";

// // Admin authorization middleware
// const authAdmin = async (req, res, next) => {
//   try {
//     // Try to get token from 'aToken' header or 'Authorization' header (Bearer token)
//     let aToken = req.headers['aToken'];

//     if (!aToken && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
//       aToken = req.headers.authorization.split(" ")[1];
//     }

//     if (!aToken) {
//       return res.status(401).json({ 
//         success: false, 
//         message: "Not Authorized. Login Again" 
//       });
//     }

//     // Verify the token and get decoded payload
//     const decoded = jwt.verify(aToken, process.env.JWT_SECRET);
//     console.log("Decoded Admin Token:", token_decode);

//     // Check if decoded token contains admin email and matches expected admin email
//     const adminEmail = process.env.ADMIN_EMAIL;

//     if (!decoded.email || decoded.email !== adminEmail) {
//       return res.status(403).json({ 
//         success: false, 
//         message: "Not Authorized. Admins only" 
//       });
//     }

//     // Admin is verified, proceed to next middleware or route handler
//     next();
//   } catch (error) {
//     console.log("AuthAdmin error:", error);
//     res.status(401).json({ 
//       success: false, 
//       message: "Invalid or expired token" 
//     });
//   }
// };

// export default authAdmin;




import jwt from "jsonwebtoken";

// Admin authorization middleware
const authAdmin = async (req, res, next) => {
  try {
    // Try to get token from Authorization header or aToken header
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (req.headers.atoken) {
      token = req.headers.atoken;
    }

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not Authorized. Login Again" 
      });
    }

    // Verify the token
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Admin Token:", token_decode);

    // Check that decoded token email matches admin email in env
    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Not Authorized. Admins only" 
      });
    }

    // Admin is verified, proceed
    next();
  } catch (error) {
    console.log("AuthAdmin error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

export default authAdmin;
