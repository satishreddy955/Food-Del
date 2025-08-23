import foodModel from "../models/foodModel.js";
import fs from 'fs';

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// add food
const addFood = async (req, res) => {
  try {
    let image_filename = `${req.file.filename}`;
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
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// delete food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// edit food
const editFood = async (req, res) => {
  try {
    const { id, name, category, price } = req.body;
    const updateData = { name, category, price };

    if (req.file) {
      // delete old image
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

    res.json({ success: true, message: "Food updated successfully", data: updatedFood });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating food" });
  }
};

export { listFood, addFood, removeFood, editFood };
