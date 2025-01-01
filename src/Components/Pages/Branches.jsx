import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getAllBranches } from "../../apis/branchApi";
import { getAllTypes } from "../../apis/industryTypeApi";
import { getIndustriesByType } from "../../apis/industryApi";
import { createBranch, deleteBranch, updateBranch } from "../../apis/branchApi";

const Branches = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [branches, setBranches] = useState([]);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    phone: "",
    industryType: "",
    industry: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    fetchBranches();
    getAllTypes().then((res) => {
      setIndustryTypes(res.data);
    });
  }, []);

  const fetchBranches = () => {
    getAllBranches()
      .then((res) => {
        setBranches(res.data);
        setFilteredProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchHandler = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = branches.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.address.toLowerCase().includes(term) ||
        product.city.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (productId) => {
    deleteBranch(productId)
      .then(() => {
        setFilteredProducts(filteredProducts.filter((product) => product._id !== productId));
      })
      .catch((err) => console.log(err));
  };

  const handleAdd = () => {
    createBranch(newProduct)
      .then((res) => {
        fetchBranches()
        setAddModalOpen(false);
        setNewProduct({
          name: "",
          address: "",
          city: "",
          email: "",
          phone: "",
          industryType: "",
          industry: "",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleSave = () => {
    updateBranch(editProduct._id, editProduct)
      .then(() => {
        const updatedProducts = filteredProducts.map((product) =>
          product.id === editProduct.id ? editProduct : product
        );
        setFilteredProducts(updatedProducts);
        setEditModalOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCurrentPageProducts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  };

  const handleClientTypeChange = (value) => {
    console.log("Selected Client Type:", value);
    getIndustriesByType(value).then((res) => {
      setIndustries(res.data);
    });
  };

  useEffect(()=>{
    if(editProduct){
        handleClientTypeChange(editProduct?.industry?.industryType)
    }
  },[editProduct])
  return (
    <motion.div
      className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      <div className="flex flex-wrap justify-between text-black items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Branch List</h2>
        <div className="relative mt-4 sm:mt-0 sm:ml-4">
          <select
            className="border rounded-lg py-2 px-4 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleClientTypeChange(e.target.value)}
          >
            <option value="">Select Industry Type</option>
            {industryTypes.map((industry) => (
              <option key={industry._id} value={industry._id}>
                {industry.type}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex items-center w-full sm:w-auto mt-4 sm:mt-0">
          <Search className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5" size={20} />
          <input
            type="text"
            placeholder="Search branches..."
            className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={searchHandler}
            value={searchTerm}
          />
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md mt-4 sm:mt-0"
        >
          Add Branch
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-600">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">S.No</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Contact Name</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Industry</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">City</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentPageProducts().map((item, index) => (
              <tr key={item.id}>
                <td className="border-b px-4 py-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                <td className="border-b px-4 py-2">{item.name}</td>
                <td className="border-b px-4 py-2">{item.industry.name}</td>
                <td className="border-b px-4 py-2">{item.address}</td>
                <td className="border-b px-4 py-2">{item.city}</td>
                <td className="border-b px-4 py-2">{item.email}</td>
                <td className="border-b px-4 py-2">{item.phone}</td>
                <td className="border-b px-4 py-2">
                  <button
                    className="text-blue-500 hover:text-blue-700 ml-2"
                    onClick={() => {
                      setEditProduct(item);
                      setEditModalOpen(true);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 ml-2"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-4 space-x-2 items-center">
        <div className="flex items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`text-sm px-3 py-1 border rounded-md ${
              currentPage === 1
                ? "border-gray-600"
                : "border-gray-300 hover:bg-gray-300 hover:text-gray-800"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="mx-2 text-sm font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`text-sm px-3 py-1 border rounded-md ${
              currentPage === totalPages
                ? "border-gray-600"
                : "border-gray-300 hover:bg-gray-300 hover:text-gray-800"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="text-sm font-medium tracking-wider mt-5 md:mt-0">
          Total Products: {filteredProducts.length}
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-4/4 sm:w-1/3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add Branch</h3>
              <button onClick={() => setAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Industry Type Selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Industry Type</label>
                  <select
                    value={newProduct.industryType}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewProduct({ ...newProduct, industryType: value });
                      handleClientTypeChange(value);
                    }}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="" disabled>Select Industry Type</option>
                    {industryTypes.map((industry) => (
                      <option key={industry._id} value={industry._id}>
                        {industry.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry Name Selection */}
                {newProduct.industryType && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Industry Name</label>
                    <select
                      value={newProduct.industry}
                      onChange={(e) => setNewProduct({ ...newProduct, industry: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    >
                      <option value="" disabled>Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry._id} value={industry._id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Enter Address"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newProduct.address}
                    onChange={(e) => setNewProduct({ ...newProduct, address: e.target.value })}
                    required
                  />
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Enter City"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newProduct.city}
                    onChange={(e) => setNewProduct({ ...newProduct, city: e.target.value })}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="Enter Phone"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newProduct.phone}
                    onChange={(e) => setNewProduct({ ...newProduct, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={newProduct.email}
                    onChange={(e) => setNewProduct({ ...newProduct, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleAdd}
                type="button"
                className="w-full bg-primary text-white py-2 px-4 rounded-md mt-4"
              >
                Add Branch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-4/4 sm:w-1/3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Edit Branch</h3>
              <button onClick={() => setEditModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form className="mt-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Industry Type Selection */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Industry Type</label>
                  <select
                    value={editProduct.industry?.industryType}
                    onChange={(e) => setEditProduct({ ...editProduct, industryType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    <option value="" disabled>Select Industry Type</option>
                    {industryTypes.map((industry) => (
                      <option key={industry._id} value={industry._id}>
                        {industry.type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry Name Selection */}
                {editProduct.industry?.industryType && (
                  <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Industry Name</label>
                    <select
                      value={editProduct.industry._id}
                      onChange={(e) => setEditProduct({ ...editProduct, industry: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    >
                      <option value="" disabled>Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry._id} value={industry._id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Name */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Contact Name</label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editProduct.name}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    required
                  />
                </div>

                {/* Address */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    placeholder="Enter Address"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editProduct.address}
                    onChange={(e) => setEditProduct({ ...editProduct, address: e.target.value })}
                    required
                  />
                </div>

                {/* City */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Enter City"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editProduct.city}
                    onChange={(e) => setEditProduct({ ...editProduct, city: e.target.value })}
                    required
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    placeholder="Enter Phone"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editProduct.phone}
                    onChange={(e) => setEditProduct({ ...editProduct, phone: e.target.value })}
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={editProduct.email}
                    onChange={(e) => setEditProduct({ ...editProduct, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                type="button"
                className="w-full bg-primary text-white py-2 px-4 rounded-md mt-4"
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

export default Branches;
