import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const User_Data = [
    {
        id: 1,
        institution: "Sunbeam School",
        industries: "School",
    },
    {
        id: 1,
        institution: "vit ",
        industries: "college",
    },
    // Add more user data as needed
];

const Project = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const totalPages = Math.ceil(User_Data.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageUsers = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return User_Data.slice(start, start + itemsPerPage);
    };

    const headers = ["Institution", "Industries", "Actions"];

    return (
        <motion.div
            className="mt-12 bg-white rounded-lg shadow-lg mx-auto section p-6 relative z-10 max-w-5xl"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project List</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-700">
                    <thead className="bg-gray-100">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentPageUsers().map((user, index) => (
                            <tr
                                key={user.id}
                                className={`hover:bg-gray-100 ${
                                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }`}
                            >
                                <td className="px-6 py-4 border-b">{user.institution}</td>
                                <td className="px-6 py-4 border-b">{user.industries}</td>
                                <td className="px-6 py-4 border-b">
                                    <button
                                        onClick={() => navigate(`/products/${user.id}`)}
                                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition"
                                    >
                                        {/* <span>View</span> */}
                                        <ArrowRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg border text-gray-600 ${
                            currentPage === 1
                                ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                                : "bg-white border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg border text-gray-600 ${
                            currentPage === totalPages
                                ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                                : "bg-white border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className="text-sm font-medium text-gray-700">
                    Total Users: {User_Data.length}
                </div>
            </div>
        </motion.div>
    );
};

export default Project;
