import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const initialData = [
    { id: 1, name: "Saint Xavier", branch: "Delhi" },
    { id: 2, name: "Jane Smith", branch: "Vadodara" },
];

const OrderProject = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(initialData);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ id: null, name: "", branch: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const industries = [
        { label: "S", value: "it" },
        { label: "Manufacturing", value: "manufacturing" },
        { label: "Retail", value: "retail" }
    ];

    const industryTypes = {
        it: ["School", "Collage", "Hospital"],
    
    };

    const branches = {
        corporate: ["Delhi", "Mumbai"],
        individual: ["Vadodara", "Surat"]
    };

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = initialData.filter(
            (user) =>
                user.name.toLowerCase().includes(term) ||
                user.branch.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleDelete = (userId) => {
        const updatedUsers = filteredUsers.filter((user) => user.id !== userId);
        setFilteredUsers(updatedUsers);
    };

    const handleAdd = () => {
        const newId =
            filteredUsers.length > 0
                ? Math.max(...filteredUsers.map((user) => user.id)) + 1
                : 1;
        const userToAdd = { ...newUser, id: newId };
        setFilteredUsers([userToAdd, ...filteredUsers]);
        setAddModalOpen(false);
        setNewUser({ industry: "", industryType: "", branch: "" });
    };

    const handleEdit = () => {
        const updatedUsers = filteredUsers.map((user) =>
            user.id === newUser.id ? { ...user, name: newUser.name, branch: newUser.branch } : user
        );
        setFilteredUsers(updatedUsers);
        setEditModalOpen(false);
        setNewUser({ id: null, name: "", branch: "" });
    };

    const handleIndustryChange = (e) => {
        const selectedIndustry = e.target.value;
        setNewUser({
            ...newUser,
            industry: selectedIndustry,
            industryType: "", // Reset industry type
            branch: "" // Reset branch
        });
    };

    const handleIndustryTypeChange = (e) => {
        setNewUser({ ...newUser, industryType: e.target.value, branch: "" }); // Reset branch
    };

    const handleBranchChange = (e) => {
        setNewUser({ ...newUser, branch: e.target.value });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const headers = ["S.No",  "Branch", "Industry"];
    const actions = (row) => (
        <div className="flex gap-2">
            <button
                onClick={() => {
                    setEditModalOpen(true);
                    setNewUser({ id: row.id, name: row.name, branch: row.branch });
                }}
                className="text-blue-500 hover:text-blue-700"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={() => {
                    if (window.confirm("Are you sure you want to delete this order?")) {
                        handleDelete(row.id);
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
                onClick={() => navigate('/student')}
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
                    placeholder="Search User..."
                    className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleSearch}
                    value={searchTerm}
                />
                <button
                    onClick={() => setAddModalOpen(true)}
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
                            <th className="px-4 py-2 text-left border-b font-semibold">Actions</th>
                            <th className="px-4 py-2 text-left border-b font-semibold">Student</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers
                            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                            .map((user, index) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-2 border-b">{index + 1}</td>
                                    <td className="px-4 py-2 border-b">{user.name}</td>
                                    <td className="px-4 py-2 border-b">{user.branch}</td>
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
                        className={`px-3 py-1 border rounded-md ${currentPage === 1 ? "border-gray-400 text-gray-400" : "border-gray-300 hover:bg-gray-200"}`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="mx-2 text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? "border-gray-400 text-gray-400" : "border-gray-300 hover:bg-gray-200"}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className="text-sm">Total Orders: {filteredUsers.length}</div>
            </div>

            {/* Add User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-3/5 relative">
                        <h2 className="text-lg font-semibold mb-4">Add Order</h2>
                        <button
                            onClick={() => setAddModalOpen(false)}
                            className="absolute top-2 right-2 text-red-500"
                        >
                            <X size={20} />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Industry</label>
                                <select
                                    value={newUser.industry}
                                    onChange={handleIndustryChange}
                                    className="w-full border rounded px-3 py-2"
                                    required
                                >
                                    <option value="">Select Industry</option>
                                    {industries.map((industry) => (
                                        <option key={industry.value} value={industry.value}>
                                            {industry.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {newUser.industry && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Industry Type</label>
                                    <select
                                        value={newUser.industryType}
                                        onChange={handleIndustryTypeChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Industry Type</option>
                                        {industryTypes[newUser.industry]?.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {newUser.industryType && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Branch</label>
                                    <select
                                        value={newUser.branch}
                                        onChange={handleBranchChange}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Branch</option>
                                        {branches[newUser.industryType]?.map((branch) => (
                                            <option key={branch} value={branch}>
                                                {branch}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <button
                                onClick={handleAdd}
                                className="bg-primary font-medium text-white px-4 py-2 rounded-md mt-4"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-3/5 relative">
                        <h2 className="text-lg font-semibold mb-4">Edit Order</h2>
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-2 right-2 text-red-500"
                        >
                            <X size={20} />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Branch</label>
                                <input
                                    type="text"
                                    className="w-full border rounded px-3 py-2"
                                    value={newUser.branch}
                                    onChange={(e) => setNewUser({ ...newUser, branch: e.target.value })}
                                    required
                                />
                            </div>
                            <button
                                onClick={handleEdit}
                                className="bg-primary font-medium text-white px-4 py-2 rounded-md mt-4"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default OrderProject;
