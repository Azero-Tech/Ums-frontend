import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";

const Product_Data = [
  { id: 1, fullName: "Saint Xavier", industryType: "School" },
  { id: 2, fullName: "SSL English school", industryType: "School" },
 
];

const industryTypes = [
  { id: 1, name: "School" },
  { id: 2, name: "College" },
  { id: 3, name: "Hospital" },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(Product_Data);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    fullName: "",
    industryType: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Product_Data.filter(
      (product) =>
        product.fullName.toLowerCase().includes(term) ||
        product.industryType.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setFilteredProducts(filteredProducts.filter((product) => product.id !== id));
  };

  const handleAdd = () => {
    const newId = filteredProducts.length
      ? Math.max(...filteredProducts.map((p) => p.id)) + 1
      : 1;
    const productToAdd = { ...newProduct, id: newId };
    setFilteredProducts([productToAdd, ...filteredProducts]);
    setAddModalOpen(false);
    setNewProduct({ fullName: "", industryType: "" });
  };

  const handleEdit = () => {
    const updatedProducts = filteredProducts.map((product) =>
      product.id === editingProduct.id ? editingProduct : product
    );
    setFilteredProducts(updatedProducts);
    setEditModalOpen(false);
    setEditingProduct(null);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <motion.div
       className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Industries</h2>
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search industries..."
            className="border rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-primary text-white font-medium px-4 py-2 rounded-md"
        >
          Add Industry
        </button>
      </div>

      {/* Table Section */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-left font-semibold">S.No</th>
            <th className="px-4 py-2 text-left font-semibold">Industry</th>
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentPageProducts().map((item, index) => (
            <tr key={item.id}>
              <td className="border-b px-4 py-2">
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </td>
              <td className="border-b px-4 py-2">{item.industryType}</td>
              <td className="border-b px-4 py-2">{item.fullName}</td>
              <td className="border-b px-4 py-2">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-700 mr-2"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setEditingProduct(item);
                    setEditModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="mx-3">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded-md ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div>Total Industries: {filteredProducts.length}</div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-md w-96 relative">
      <h2 className="text-lg font-semibold mb-4">Add Industry</h2>
      <button
        onClick={() => setAddModalOpen(false)}
        className="absolute top-2 right-2 text-red-500"
      >
        <X size={20} />
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
         <select
                value={newProduct.industryType}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewProduct({ ...newProduct, industryType: value });
                }}
                className="border rounded-md p-2 w-full mb-4"
                required
              >
                <option value="" disabled>Select Industry</option>
                {industryTypes.map((industry) => (
                  <option key={industry.id} value={industry.name}>
                    {industry.name}
                  </option>
                ))}
              </select>

           
              {newProduct.industryType && (
 <>
                                    <label className="block text-sm font-medium mb-1">{newProduct.industryType } Name</label>

                              <input
                                      type="text"
                                      placeholder="Enter specific name"
                                      value={newProduct.fullName}
                                      onChange={(e) => setNewProduct({ ...newProduct, fullName: e.target.value })}
                                      className="border rounded-md p-2 w-full mb-4"
                                      required /></>
              )}
         
        <button
          type="submit"
          className="bg-primary text-white font-medium px-4 py-2 rounded-md"
        >
          Add Industry
        </button>
      </form>
    </div>
  </div>
)}


      {/* Edit Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-70 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Industry</h2>
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-2 right-2 text-black"
            >
              <X size={20} />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
            >
           
              <select
                value={editingProduct.industryType}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    industryType: e.target.value,
                  })
                }
                className="border rounded-md p-2 w-full mb-4"
                required
              >
                <option value="" disabled>Select Industry</option>
                {industryTypes.map((industry) => (
                  <option key={industry.id} value={industry.name}>
                    {industry.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Name"
                value={editingProduct.fullName}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    fullName: e.target.value,
                  })
                }
                className="border rounded-md p-2 w-full mb-4"
                required
              />
              <button
                type="submit"
                className="bg-primary text-white font-medium px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Clients;
