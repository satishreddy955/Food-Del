import { useEffect, useState } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    price: "",
    image: null
  });

  // Fetch food list
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      toast.error("Error fetching list");
    }
  };

  // Delete food
  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      await fetchList();
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("Error deleting item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  // Open edit form
  const editFood = (food) => {
    setSelectedFood(food._id);
    setEditForm({
      name: food.name || "",
      category: food.category || "",
      price: food.price || "",
      image: null // reset image field
    });
  };

  // Update food
  const updateFood = async () => {
    try {
      const formData = new FormData();
      formData.append("id", selectedFood);

      // Append only non-empty values
      if (editForm.name.trim() !== "") formData.append("name", editForm.name);
      if (editForm.category.trim() !== "") formData.append("category", editForm.category);
      if (editForm.price !== "" && !isNaN(editForm.price)) {
        formData.append("price", editForm.price);
      }
      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const response = await axios.post(`${url}/api/food/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setSelectedFood(null);
        await fetchList();
      } else {
        toast.error(response.data.message || "Error updating food");
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className='cursor edit-btn' onClick={() => editFood(item)}>Edit</button>
              <button className='cursor delete-btn' onClick={() => removeFood(item._id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form */}
      {selectedFood && (
        <div className="edit-form">
          <h3>Edit Food</h3>
          <input
            type="text"
            placeholder="Name"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Category"
            value={editForm.category}
            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={editForm.price}
            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={updateFood} style={{ marginRight:"10px" }}>Save</button>
            <button onClick={() => setSelectedFood(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
