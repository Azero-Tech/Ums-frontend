import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { BiLeftArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const Product_Data = [
    {
        id: 1,
        fullName: "John Doe",
        Class: "b",
        house: "katpadi",
        mobile: "1234567890",
        sizeType: "Pant",
    },
    {
        id: 2,
        fullName: "Jane Smith",
        Class: "b",
        house: "vellore",
        mobile: "9876543210",
        sizeType: "T-shirt",
    },
    {
        id: 3,
        fullName: "Alice Brown",
        Class: "b",
        house: "vellore",
        mobile: "1122334455",
        sizeType: "shirt",
    },
];

const Student = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const navigate = useNavigate();

    const [newProduct, setNewProduct] = useState({
        fullName: "",
        Class: "",
        house: "",
        mobile: "",
        sizeType: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter((product) =>
            product.fullName.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setEditModalOpen(true);
    };

    const handleDelete = (productId) => {
        const updatedProducts = filteredProducts.filter(
            (product) => product.id !== productId
        );
        setFilteredProducts(updatedProducts);
    };

    const handleAdd = () => {
        const newId =
            filteredProducts.length > 0
                ? Math.max(...filteredProducts.map((product) => product.id)) + 1
                : 1;
        const productToAdd = { ...newProduct, id: newId };
        setFilteredProducts([productToAdd, ...filteredProducts]);
        setAddModalOpen(false);
        setNewProduct({
            fullName: "",
            Class: "",
            house: "",
            mobile: "",
            sizeType: "",
        });
    };

    const handleSave = () => {
        const updatedProducts = filteredProducts.map((product) =>
            product.id === editProduct.id ? editProduct : product
        );
        setFilteredProducts(updatedProducts);
        setEditModalOpen(false);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };

    const headers = [
        "S.No",
        "Full Name",
        "Class",
        "House",
        "Mobile Number",
        "Size Type",
    ];

    const actions = (row) => (
        <div className="flex gap-2">
            <button
                onClick={() => handleEdit(row)}
                className="text-blue-500 hover:text-blue-700"
            >
                <Edit size={18} />
            </button>
            <button
                onClick={() => handleDelete(row.id)}
                className="text-red-500 hover:text-red-700"
            >
                <Trash2 size={18} />
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
            <div className="flex justify-between text-black items-center mb-6">
                <h2 className="text-xl p-2 font-semibold text-black flex">
                    <FaArrowLeft 
                        className="mt-1" onClick={() => navigate("/order-project")} 
                    /> 
                    Student List
                </h2>
                <div className="relative flex items-center"> 
                    <Search className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5" size={20} />
                    <input
                        type="text"
                        placeholder="Search User..."
                        className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md"
                >
                    Add Student
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto divide-y divide-gray-600">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentPageProducts().length > 0 ? (
                            getCurrentPageProducts().map((row, rowIndex) => (
                                <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{rowIndex + 1}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.fullName}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.Class}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.house}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.mobile}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.sizeType}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b">{actions(row)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length + 1} className="text-center py-4 text-gray-500 text-xs sm:text-sm">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col md:flex-row justify-between mt-4 space-x-2 items-center">
                <div className="flex items-center">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === 1 ? 'border-gray-600' : 'border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="mx-2 text-sm font-medium">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === totalPages ? 'border-gray-600' : 'border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
                    >
                        <ChevronRight size={18} />
                    </button>
 </div>
                    <div className="text-sm font-medium tracking-wider mt-5 md:mt-0">Total Products: {filteredProducts.length}</div>
                </div>

                {/* Add Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg w-full max-w-3xl relative">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Student</h2>

                            {/* Close Button */}
                            <button
                                onClick={() => setAddModalOpen(false)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                            >
                                <X size={20} />
                            </button>

                            {/* Form Fields */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleAdd();
                                }}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={newProduct.fullName}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, fullName: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Class */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                        <input
                                            type="text"
                                            value={newProduct.Class}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, Class: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Dropdown for Clothing Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                        <select
                                            value={newProduct.sizeType}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, sizeType: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="" disabled>Select Clothing Type</option>
                                            <option value="Shirt">Shirt</option>
                                            <option value="T-shirt">T-shirt</option>
                                            <option value="Pant">Pant</option>
                                        </select>
                                    </div>

                                    {/* House */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">House</label>
                                        <input
                                            type="text"
                                            value={newProduct.house}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, house: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                        <input
                                            type="text"
                                            value={newProduct.mobile}
                                            onChange={(e) =>
                                                setNewProduct({ ...newProduct, mobile: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                        >
                                            Add Student
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z -50">
                        <div className="bg-white p-8 rounded-lg w-full max-w-3xl relative">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Student</h2>

                            {/* Close Button */}
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                            >
                                <X size={20} />
                            </button>

                            {/* Form Fields */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSave();
                                }}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={editProduct.fullName}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, fullName: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Class */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                        <input
                                            type="text"
                                            value={editProduct.Class}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, Class: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Dropdown for Clothing Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                                        <select
                                            value={editProduct.sizeType}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, sizeType: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        >
                                            <option value="" disabled>Select Clothing Type</option>
                                            <option value="Shirt">Shirt</option>
                                            <option value="T-shirt">T-shirt</option>
                                            <option value="Pant">Pant</option>
                                        </select>
                                    </div>

                                    {/* House */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">House</label>
                                        <input
                                            type="text"
                                            value={editProduct.house}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, house: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Mobile Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                        <input
                                            type="text"
                                            value={editProduct.mobile}
                                            onChange={(e) =>
                                                setEditProduct({ ...editProduct, mobile: e.target.value })
                                            }
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-primary text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </motion.div>
        );
    };

export default Student;