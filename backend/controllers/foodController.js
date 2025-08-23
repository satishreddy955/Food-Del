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
    const { id, name, category, price } = req.body;

    // build update object dynamically
    const updateData = {};
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price) updateData.price = price;

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const oldFood = await foodModel.findByIdAndUpdate(id, updateData, { new: true });

    if (!oldFood) {
      return res.json({ success: false, message: "Food not found" });
    }

    // delete old image only if a new one was uploaded
    if (req.file && oldFood.image) {
      fs.unlink(`uploads/${oldFood.image}`, () => {});
    }

    res.json({ success: true, message: "Food updated successfully", data: oldFood });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating food", error: error.message });
  }
};

export { listFood, addFood, removeFood, editFood };
