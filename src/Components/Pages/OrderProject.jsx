import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllTypes } from "../../apis/industryTypeApi";
import { getIndustriesByType } from "../../apis/industryApi";
import { getBranchByIndustries } from "../../apis/branchApi";
import {
  getAllOrders,
  createOrder,
  updateOrderById,
  deleteOrderById,
} from "../../apis/orderApi";
import { getAllTailors } from "../../apis/tailorApi";

const OrderProject = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [industryTypes, setIndustryTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [tailors, setTailors] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    industry: "",
    industryType: "",
    branch: "",
    tailors: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isEditMode, setIsEditMode] = useState(false); // To track if it's Add or Edit mode
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    getAllTypes()
      .then((res) => {
        setIndustryTypes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    getAllTailors()
      .then((res) => {
        setTailors(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchOrders = () => {
    getAllOrders()
      .then((res) => {
        setOrders(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter(
      (user) =>
        user.industry.name.toLowerCase().includes(term) ||
        user.branch.name.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const handleDelete = (userId) => {
    deleteOrderById(userId).then(res=>{
        const updatedUsers = filteredUsers.filter((user) => user._id !== userId);
    setFilteredUsers(updatedUsers);
    }).catch(err=>{
        console.log(err)
    })
    
  };

  const handleSave = () => {
    if (isEditMode) {
      updateOrderById(newOrder.id, newOrder)
        .then(() => {
          fetchOrders();
          setModalOpen(false);
        })
        .catch((err) => console.log(err));
    } else {
      createOrder(newOrder)
        .then(() => {
          fetchOrders();
          setModalOpen(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleIndustryChange = (e) => {
    const selectedIndustry = e.target.value;
    setNewOrder({
      ...newOrder,
      industryType: selectedIndustry, // Reset industry type
    });
    getIndustriesByType(selectedIndustry)
      .then((res) => {
        setIndustries(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleIndustryTypeChange = (e) => {
    const industryId = e.target.value;
    getBranchByIndustries(industryId)
      .then((res) => {
        setBranches(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setNewOrder({ ...newOrder, industry: industryId });
  };

  const handleBranchChange = (e) => {
    setNewOrder({ ...newOrder, branch: e.target.value });
  };

  const handleTailorChange = (e) => {
    const tailorId = e.target.value;
    if (!newOrder.tailors.includes(tailorId)) {
      setNewOrder({ ...newOrder, tailors: [...newOrder.tailors, tailorId] });
    }
  };

  const handleRemoveTailor = (tailorId) => {
    setNewOrder({
      ...newOrder,
      tailors: newOrder.tailors.filter((id) => id !== tailorId),
    });
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const headers = ["S.No", "Branch", "Institution"];
  const actions = (row) => (
    <div className="flex gap-2">
      <button
        onClick={() => {
          setIsEditMode(true); // Switch to Edit Mode
          setNewOrder({
            id: row._id,
            industry: row.industry._id,
            industryType: row.industryType._id,
            branch: row.branch._id,
            tailors: row.tailors.map((tailor) => tailor._id),
          });
          setModalOpen(true);
        }}
        className="text-blue-500 hover:text-blue-700"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this order?")) {
            handleDelete(row._id);
          }
        }}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );

  const studentAction = (row) => (
    <div className="flex items-center">
      <button
        onClick={() => navigate(`/student/${row._id}`)}
        className="ml-2 flex items-center justify-center"
      >
        <ChevronRight size={20} className="text-primary" />
      </button>
    </div>
  );

  return (
    <motion.div
      className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between text-black items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Order List</h2>
        <input
          type="text"
          placeholder="Search order"
          className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleSearch}
          value={searchTerm}
        />
        <button
          onClick={() => {
            setIsEditMode(false); // Switch to Add Mode
            setModalOpen(true);
          }}
          className="bg-primary font-medium text-white px-4 py-2 rounded-md"
        >
          Add Order
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-left border-b font-semibold"
                >
                  {header}
                </th>
              ))}
              <th className="px-4 py-2 text-left border-b font-semibold">
                Actions
              </th>
              <th className="px-4 py-2 text-left border-b font-semibold">
                Student
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((user, index) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 border-b">{index + 1}</td>
                  <td className="px-4 py-2 border-b">{user.branch?.name}</td>
                  <td className="px-4 py-2 border-b">
                    {user.industry.name} ({user.industryType?.type})
                  </td>
                  <td className="px-4 py-2 border-b">{actions(user)}</td>
                  <td className="px-4 py-2 border-b">{studentAction(user)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded-md ${
              currentPage === 1
                ? "border-gray-400 text-gray-400"
                : "border-gray-300 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="mx-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded-md ${
              currentPage === totalPages
                ? "border-gray-400 text-gray-400"
                : "border-gray-300 hover:bg-gray-200"
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="text-sm">Total Orders: {filteredUsers.length}</div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-3/5 relative">
            <h2 className="text-lg font-semibold mb-4">
              {isEditMode ? "Edit Order" : "Add Order"}
            </h2>
            <button
              onClick={() => {
                setModalOpen(false)
                setNewOrder({industry:"",industryType:"",tailors:[],branch:""})
            }}
              className="absolute top-2 right-2 text-red-500"
            >
              <X size={20} />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Industry type
                </label>
                <select
                  value={newOrder.industryType}
                  onChange={handleIndustryChange}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">Select Industry</option>
                  {industryTypes.map((industry) => (
                    <option key={industry._id} value={industry._id}>
                      {industry.type}
                    </option>
                  ))}
                </select>
              </div>
              {newOrder.industryType && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Instration
                  </label>
                  <select
                    value={newOrder.industry}
                    onChange={handleIndustryTypeChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Industry Type</option>
                    {industries.map((industry) => (
                      <option key={industry._id} value={industry._id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {newOrder.industry && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Branch
                  </label>
                  <select
                    value={newOrder.branch}
                    onChange={handleBranchChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch._id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {newOrder.branch && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tailors
                  </label>
                  <select
                    onChange={handleTailorChange}
                    className="w-full border rounded px-3 py-2"
                    value="" // Keep the select value empty to allow multiple selections
                  >
                    <option value="" disabled>
                      Select tailor
                    </option>
                    {tailors.map((tailor) => (
                      <option key={tailor._id} value={tailor._id}>
                        {tailor.name}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {newOrder.tailors.map((tailorId) => {
                      const tailor = tailors.find((t) => t._id === tailorId);
                      return (
                        tailor && (
                          <div
                            key={tailorId}
                            className="flex items-center bg-gray-200 rounded-md px-3 py-1"
                          >
                            <span>{tailor.name}</span>
                            <button
                              onClick={() => handleRemoveTailor(tailorId)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                className="bg-primary text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderProject;
