// Create a Super Admin user if not exists
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Role } from "../modules/User/user.interface";
import { User } from "../modules/User/user.model";

export const createSuperAdmin = async () => {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

    if (!superAdminEmail || !superAdminPassword) {
      throw new Error("Super Admin credentials are not defined");
    }

    const existingAdmin = await User.findOne({ email: superAdminEmail });
    if (existingAdmin) {
      console.log("Super Admin already exists");
      return;
    }

    const saltRounds: number = Number(process.env.SALT_ROUND);
    const hashedPassword = await bcrypt.hash(superAdminPassword, saltRounds);
    const newAdmin = new User({
      firstName: "Super",
      lastName: "Admin",
      email: superAdminEmail,
      password: hashedPassword,
      role: Role.SuperAdmin,
      address: "Head Office",
      phone: "01234567890",
      isActive: "Active",
    });

    await newAdmin.save();
    console.log("Super Admin created successfully");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
  }
};
