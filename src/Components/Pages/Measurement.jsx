import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import Modal from "../UI/Model";
import { createParameter, getAllParameters, updateParameter, deleteParameter } from '../../apis/parameterApi';
import { Switch } from '@mui/material'; 

const Measurement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);  // For displaying filtered data
  const [allProducts, setAllProducts] = useState([]);  // For storing the original unfiltered data
  const [newProduct, setNewProduct] = useState({ name: "" });
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");  

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await getAllParameters();
        setAllProducts(response.data);
        setFilteredProducts(response.data);  // Set both filtered and all products
      } catch (error) {
        console.error("Error fetching parameters:", error);
      }
    };
    fetchParameters();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  // Handle Add Product
  const handleAdd = async () => {
    try {
      await createParameter(newProduct);  
      setAllProducts([{...newProduct, status: "active"}, ...allProducts]);  // Add to allProducts
      setFilteredProducts([{...newProduct, status: "active"}, ...filteredProducts]);  // Update the filtered list as well
      setAddModalOpen(false);
      setNewProduct({ name: "" });
    } catch (error) {
      setErrorMessage(error.message);
      alert(error.message);
    }
  };

  // Handle Edit
  const handleEdit = (index) => {
    setEditIndex(index);
    setNewProduct({ name: filteredProducts[index].name });  // Populate newProduct with current data for editing
    setEditModalOpen(true);
  };

  // Handle Save After Editing
  const handleSave = async () => {
    if (editIndex === null) return;

    const updatedProducts = [...filteredProducts];
    updatedProducts[editIndex] = { ...updatedProducts[editIndex], ...newProduct };

    try {
      await updateParameter(filteredProducts[editIndex]._id, updatedProducts[editIndex]); 
      setAllProducts(updatedProducts);  // Update allProducts
      setFilteredProducts(updatedProducts);  // Update filtered list
      setEditModalOpen(false);
      setEditIndex(null);
    } catch (error) {
      setErrorMessage(error.message);
      alert(error.message);
    }
  };

  // Handle Delete
  const handleDelete = async (index) => {
    try {
      await deleteParameter(filteredProducts[index]._id); 
      const updatedProducts = filteredProducts.filter((_, i) => i !== index);
      setAllProducts(updatedProducts);  // Update allProducts
      setFilteredProducts(updatedProducts);  // Update filtered list
    } catch (error) {
      setErrorMessage(error.message);
      alert(error.message);
    }
  };

  // Toggle the status of a parameter
  const handleStatusToggle = async (index) => {
    try {
      const product = allProducts[index];
      product.status = product.status === "active" ? "deactive" : "active"; 
      await updateParameter(product._id, product);  
      const updatedProducts = filteredProducts.map((pro) =>
        pro._id === product._id ? product : pro
      );
      setAllProducts(updatedProducts);  // Update allProducts
      setFilteredProducts(updatedProducts);  // Update filtered list
    } catch (error) {
      setErrorMessage(error.message);
      alert(error.message);
    }
  };

  return (
    <motion.div className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Measurement List</h2>
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 top-2.5" size={20} />
          <input
            type="text"
            placeholder="Search Measurement..."
            className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md">
          Add Measurement
        </button>
      </div>

      {/* Custom Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">S.No</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Parameter Name</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((row, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                  <td className="px-4 py-2 text-gray-700 border-b">{index + 1}</td>
                  <td className="px-4 py-2 text-gray-700 border-b">{row.name}</td>
                  <td className="px-4 py-2 text-gray-700 border-b">
                    <Switch
                      checked={row.status === "active"}
                      onChange={() => handleStatusToggle(index)}
                      color="primary"
                    />
                  </td>
                  <td className="px-4 py-2 text-gray-700 border-b">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500 text-xs sm:text-sm">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal
          title="Add Measurement"
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAdd}
          inputs={[{
            label: "Parameter Name",
            value: newProduct.name,
            onChange: (e) => setNewProduct({ ...newProduct, name: e.target.value }),
          }]}/>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editIndex !== null && (
        <Modal
          title="Edit Measurement"
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleSave}
          inputs={[{
            label: "Parameter Name",
            value: newProduct.name,
            onChange: (e) => setNewProduct({ ...newProduct, name: e.target.value }),
          }]}/>
      )}
    </motion.div>
  );
};

export default Measurement;
