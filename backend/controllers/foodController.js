import foodModel from "../models/foodModel.js";
import fs from "fs";

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching foods" });
  }
};

// add food
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
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// delete food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }

    if (food.image) {
      fs.unlink(`uploads/${food.image}`, () => {});
    }
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// edit food
const editFood = async (req, res) => {
  try {
    const { id } = req.body;

    // Build update object dynamically
    const updateData = {};
    if (req.body.name && req.body.name.trim() !== "") updateData.name = req.body.name;
    if (req.body.category && req.body.category.trim() !== "") updateData.category = req.body.category;
    if (req.body.price && req.body.price.trim() !== "") updateData.price = req.body.price;

    // Handle new image
    if (req.file) {
      const oldFood = await foodModel.findById(id);
      if (oldFood?.image) {
        fs.unlink(`uploads/${oldFood.image}`, () => {});
      }
      updateData.image = req.file.filename;
    }

    const updatedFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedFood) {
      return res.json({ success: false, message: "Food not found" });
    }

    return res.json({ success: true, message: "Food updated successfully", data: updatedFood });
  } catch (error) {
    console.error("Update error:", error);
    res.json({ success: false, message: "Error updating food", error: error.message });
  }
};

export { listFood, addFood, removeFood, editFood };
