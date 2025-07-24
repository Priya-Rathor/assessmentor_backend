const User = require('../Model/UserModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const initialUser = async (req, res) => {
    try {
        const email = process.env.S_ADMIN_EMAIL;
        const password = process.env.S_ADMIN_PASS;

        if (!email || !password) {
            console.warn("❗ Missing super admin credentials in .env");
            if (res && res.status) {
                return res.status(400).json({ message: "Missing super admin credentials" });
            } else {
                return;
            }
        }

        console.log("📥 Attempting to create super admin:", email);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("⚠️ Super Admin already exists:", email);
            if (res && res.status) {
                return res.status(200).json({ message: "Super Admin already exists" });
            } else {
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            password_org: hashedPassword,
            role: "super_admin",
            course_code: []
        });

        await newUser.save();

        console.log("✅ Super Admin created successfully:", email);
        if (res && res.status) {
            return res.status(201).json({ message: "Super Admin created successfully" });
        }
    } catch (error) {
        console.error("❌ Error creating Super Admin:", error);
        if (res && res.status) {
            return res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }
};

module.exports = initialUser;
