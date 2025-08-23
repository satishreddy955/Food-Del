import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood, editFood } from "../controllers/foodController.js";

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");   // ✅ ensure proper path with trailing slash
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // ✅ safer unique naming
  }
});

const upload = multer({ storage });

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/edit", upload.single("image"), editFood); // ✅ multer added for edit

export default foodRouter;
