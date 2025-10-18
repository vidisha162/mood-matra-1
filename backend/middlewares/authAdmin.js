




import jwt from "jsonwebtoken";

// Admin authorization middleware
const authAdmin = async (req, res, next) => {
  try {
    // Get token from headers (lowercase atoken)
    const { atoken } = req.headers;

    if (!atoken) {
      return res.status(401).json({ 
        success: false, 
        message: "Not Authorized. Login Again" 
      });
    }

    // Verify the token
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    console.log("✅ Decoded Admin Token:", token_decode);

    // Check that decoded token email matches admin email
    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: "Not Authorized. Admins only" 
      });
    }

    // Admin is verified, proceed
    next();
  } catch (error) {
    console.log("❌ AuthAdmin error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

export default authAdmin;