import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  createIndustry,
  getAllIndustries,
  updateIndustry,
  deleteIndustry
} from "../../apis/industryApi"; // Import your API functions
import { getAllTypes } from '../../apis/industryTypeApi';
import {useAuth}  from '../context/AuthProvider'
import toast from "react-hot-toast";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [industries, setIndustries] = useState([]);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [filteredIndustries, setFilteredIndustries] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [newIndustry, setNewIndustry] = useState({
    name: "",
    industryType: "",
  });
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const {setIsLoading} = useAuth()
  const itemsPerPage = 5;

  useEffect(() => {
    setIsLoading(true)
    const fetchIndustries = async () => {
      try {
        const data = await getAllIndustries();
        const types = await getAllTypes();
        setIndustryTypes(types.data);
        // Ensure industries and filteredIndustries are arrays
        setIndustries(data.data);
        setFilteredIndustries(data.data);
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching industries:", error);
      }
    };

    fetchIndustries();
  }, [isAddModalOpen, isEditModalOpen]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = industries.filter(
      (industry) =>
        industry.name.toLowerCase().includes(term) ||
        industry.industryType.type.toLowerCase().includes(term)
    );
    setFilteredIndustries(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    setIsLoading(true)
    try {
      const res = await deleteIndustry(id);
      setFilteredIndustries(filteredIndustries.filter((industry) => industry._id !== id));
      toast.success(res.message)
      setIsLoading(false)
    } catch (error) {
      console.error("Error deleting industry:", error);
      toast.error(error?.response?.data?.message)
    }
  };

  const handleAdd = async () => {
    try {
      setIsLoading(true)
      const newIndustryData = await createIndustry(newIndustry);
      setAddModalOpen(false);
      setNewIndustry({ name: "", industryType: "" });
      toast.success(newIndustryData.message)
      setIsLoading(false)
    } catch (error) {
      console.error("Error adding industry:", error);
      toast.error(error.response?.data?.message)
    }
  };

  const handleEdit = async () => {
    setIsLoading(true)
    try {
      const res = await updateIndustry(editingIndustry._id, editingIndustry);
      setEditModalOpen(false);
      setEditingIndustry(null);
      toast.success(res.message)
      setIsLoading(false)
    } catch (error) {
      console.error("Error editing industry:", error);
      toast.error(error.response?.data?.message)
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getCurrentPageIndustries = () => {
    // Check if filteredIndustries is an array before using .slice
    if (Array.isArray(filteredIndustries)) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return filteredIndustries.slice(startIndex, startIndex + itemsPerPage);
    }
    return []; // Return an empty array if filteredIndustries is not an array
  };

  return (
    <motion.div
      className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Institutions</h2>
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
          Add Institution
        </button>
      </div>

      {/* Table Section */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">S.No</th>
            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Industry</th>
            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentPageIndustries().map((item, index) => (
            <tr key={item._id}>
              <td className="border-b px-4 py-2">
                {index + 1 + (currentPage - 1) * itemsPerPage}
              </td>
              <td className="border-b px-4 py-2">{item.name}</td>
              <td className="border-b px-4 py-2">{item.industryType?.type}</td>
              <td className="border-b px-4 py-2">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-red-500 hover:text-red-700 mr-2"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setEditingIndustry(item);
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
          <span className="mx-3">Page {currentPage} of {Math.ceil(filteredIndustries.length / itemsPerPage)}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredIndustries.length / itemsPerPage)}
            className={`px-3 py-1 border rounded-md ${
              currentPage === Math.ceil(filteredIndustries.length / itemsPerPage)
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div>Total Institutions: {filteredIndustries.length}</div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96 relative">
            <h2 className="text-lg font-semibold mb-4">Add Institution</h2>
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
                value={newIndustry.industryType}
                onChange={(e) => setNewIndustry({ ...newIndustry, industryType: e.target.value })}
                className="border rounded-md p-2 w-full mb-4"
                required
              >
                <option value="" disabled>Select Industry Type</option>
                {industryTypes.map((industry) => (
                  <option key={industry._id} value={industry._id}>
                    {industry.type}
                  </option>
                ))}
              </select>

              {newIndustry.industryType && (
                <>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {industryTypes.find(type => type._id === newIndustry.industryType).type} Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter specific name"
                    value={newIndustry.name}
                    onChange={(e) => setNewIndustry({ ...newIndustry, name: e.target.value })}
                    className="border rounded-md p-2 w-full mb-4"
                    required
                  />
                </>
              )}
              <button
                type="submit"
                className="bg-primary text-white font-medium px-4 py-2 rounded-md"
              >
                Add Institution
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingIndustry && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-70 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Institution</h2>
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
                value={editingIndustry.industryType?._id || ""}
                onChange={(e) =>
                  setEditingIndustry({
                    ...editingIndustry,
                    industryType: industryTypes.find(
                      (type) => type._id === e.target.value
                    ),
                  })
                }
                className="border rounded-md p-2 w-full mb-4"
                required
              >
                <option value="" disabled>Select Industry Type</option>
                {industryTypes.map((industry) => (
                  <option key={industry._id} value={industry._id}>
                    {industry.type}
                  </option>
                ))}
              </select>

              {editingIndustry.industryType && (
                <>
                  <label className="block text-sm font-medium mb-1">
                    {editingIndustry.industryType.type} Name
                  </label>
                  <input
                    type="text"
                    value={editingIndustry.name || ""}
                    onChange={(e) =>
                      setEditingIndustry({
                        ...editingIndustry,
                        name: e.target.value,
                      })
                    }
                    className="border rounded-md p-2 w-full mb-4"
                    required
                  />
                </>
              )}
              <button
                type="submit"
                className="bg-primary text-white font-medium px-4 py-2 rounded-md"
              >
                Update Industry
              </button>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Clients;
