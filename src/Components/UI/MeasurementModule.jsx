import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Modal from "./Model";
 

// Dummy data
const productData = [
  { id: 1, size: "Small", name: "T-Shirt", type: "Clothing" },
  { id: 2, size: "Medium", name: "Jeans", type: "Clothing" },
  { id: 3, size: "Large", name: "Jacket", type: "Clothing" },
];

const MeasurementModule = () => {
  const [data, setData] = useState(productData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({ size: "", name: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(productData);

  // Handle adding a new item
  const handleAddItem = () => {
    const newId = data.length + 1;
    const newProduct = { ...newItem, id: newId };
    setData([newProduct, ...data]);
    setFilteredData([newProduct, ...filteredData]);
    setNewItem({ size: "", name: "", type: "" });
  };

  // Handle editing an item
  const handleEditItem = (item) => {
    setEditItem(item);
    setIsEditModalOpen(true);
  };

  // Handle saving changes after editing
  const handleSaveEdit = () => {
    if (editItem) {
      const updatedData = data.map((item) =>
        item.id === editItem.id ? editItem : item
      );
      setData(updatedData);
      setFilteredData(updatedData);
      setIsEditModalOpen(false);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    setFilteredData(updatedData);
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(
      (item) =>
        item.size.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.type.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  // Table headers
  const headers = ["Size", "Name", "Type", "Actions"];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Measurement Module</h2>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
            className="border rounded-lg p-2"
          />
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="border-b px-4 py-2 text-left font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={item.id}>
              <td className="border-b px-4 py-2">{item.size}</td>
              <td className="border-b px-4 py-2">{item.name}</td>
              <td className="border-b px-4 py-2">{item.type}</td>
              <td className="border-b px-4 py-2">
                <button
                  onClick={() => handleEditItem(item)}
                  className="text-blue-500 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Adding */}
      <Modal
        isOpen={!editItem}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleAddItem}
        title="Add New Item"
      >
        <div className="space-y-4">
          <div>
            <label>Size</label>
            <input
              type="text"
              value={newItem.size}
              onChange={(e) =>
                setNewItem({ ...newItem, size: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label>Type</label>
            <input
              type="text"
              value={newItem.type}
              onChange={(e) =>
                setNewItem({ ...newItem, type: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
      </Modal>

      {/* Modal for Editing */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        title="Edit Item"
      >
        <div className="space-y-4">
          <div>
            <label>Size</label>
            <input
              type="text"
              value={editItem?.size || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, size: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={editItem?.name || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
          <div>
            <label>Type</label>
            <input
              type="text"
              value={editItem?.type || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, type: e.target.value })
              }
              className="border rounded p-2 w-full"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MeasurementModule;
