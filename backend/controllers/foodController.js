import foodModel from "../models/foodModel.js";
import fs from "fs";

// ✅ Get all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    return res.json({ success: true, data: foods });
  } catch (error) {
    console.error("List error:", error);
    return res.status(500).json({ success: false, message: "Error fetching foods" });
  }
};

// ✅ Add food
const addFood = async (req, res) => {
  try {
    const image_filename = req.file?.filename || null;

    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    await food.save();
    return res.json({ success: true, message: "Food added successfully" });
  } catch (error) {
    console.error("Add error:", error);
    return res.status(500).json({ success: false, message: "Error adding food" });
  }
};

// ✅ Remove food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (food.image) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.error("Failed to delete old image:", err);
      });
    }

    await foodModel.findByIdAndDelete(req.body.id);
    return res.json({ success: true, message: "Food removed successfully" });
  } catch (error) {
    console.error("Remove error:", error);
    return res.status(500).json({ success: false, message: "Error removing food" });
  }
};

// ✅ Edit food
const editFood = async (req, res) => {
  try {
    const { id, name, description, category, price } = req.body;

    // Make sure food exists
    const oldFood = await foodModel.findById(id);
    if (!oldFood) {
      return res.json({ success: false, message: "Food not found" });
    }

    // Build update object dynamically
    const updateData = {};
    if (name && name.trim() !== "") updateData.name = name;
    if (description && description.trim() !== "") updateData.description = description;
    if (category && category.trim() !== "") updateData.category = category;
    if (price !== undefined && price !== "") updateData.price = price;

    // Handle new image upload
    if (req.file) {
      if (oldFood.image) {
        fs.unlink(`uploads/${oldFood.image}`, (err) => {
          if (err) console.error("Failed to delete old image:", err);
        });
      }
      updateData.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.json({ success: true, message: "Food updated successfully", data: updatedFood });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: "Error updating food", error: error.message });
  }
};

export { listFood, addFood, removeFood, editFood };
