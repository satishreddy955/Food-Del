import express from "express";
import { addFood, listFood, removeFood, editFood } from "../controllers/foodController.js";
import multer from "multer";

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Routes
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/remove/:id", removeFood);   // use DELETE with id in params
foodRouter.put("/edit/:id", upload.single("image"), editFood);  // use PUT with id in params

export default foodRouter;
