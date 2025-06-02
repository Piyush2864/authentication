import { Request, Response } from "express";
import User from "../models/userModel";

export const getUser = async (req: Request, res: Response): Promise<any> => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const user = await User.findById(userId).select("-refreshToken");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select("-refreshToken");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user",
    });
  }
};
