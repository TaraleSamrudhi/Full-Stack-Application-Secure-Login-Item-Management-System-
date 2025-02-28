import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function InputPage() {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  // Fetch user-specific items
  const fetchUserItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8080/items/get-item", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (error) {
      setError("Failed to fetch items. Please try again.");
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserItems();
  }, [fetchUserItems]);

  // Handle new item submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        const response = await axios.post(
          "http://localhost:8080/items/add-item",
          { name: input.trim() },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201 || response.status === 200) {
          setItems([response.data, ...items]);
          setInput("");
        }
      } catch (error) {
        setError("Error adding item. Please try again.");
        console.error("Error adding item:", error);
      }
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = async (itemId, currentState) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/items/update-item/${itemId}`,
        { isSelected: !currentState },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId ? { ...item, isSelected: !currentState } : item
          )
        );
      }
    } catch (error) {
      setError("Error updating item. Try again.");
      console.error("Error updating item:", error);
    }
  };

  // Handle item edit
  const handleEdit = async (itemId, newName) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/items/update-item/${itemId}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === itemId ? { ...item, name: newName } : item))
        );
      }
    } catch (error) {
      setError("Error updating item.");
      console.error("Error updating item:", error);
    }
  };

  // Handle delete functionality
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8080/items/delete-item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter((item) => item.id !== itemId));
    } catch (error) {
      setError("Error deleting item.");
      console.error("Error deleting item:", error);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  return (
    <div className="app-container">
      <div className="input-container">
        <h2>Submit Items</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter something..."
            className="input-field"
            required
          />
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="list-container">
        {loading ? <p>Loading items...</p> : null}
        <ul>
          {items.length > 0 ? (
            items.map((item) => (
              <li key={item.id} className="list-item">
                <input
                  type="checkbox"
                  checked={item.isSelected}
                  onChange={() => handleCheckboxChange(item.id, item.isSelected)}
                  className="checkbox-item"
                />
                {item.name}
                <button
                  onClick={() => {
                    const newName = prompt("Enter new name:", item.name);
                    if (newName) handleEdit(item.id, newName);
                  }}
                  className="edit-button"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="delete-button">
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>No items added yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default InputPage;
