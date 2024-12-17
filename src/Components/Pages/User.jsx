import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Table from "../UI/Table";

const Product_Data = [
    {
        id: 1,
        fullName: "John Doe",
        address: "123 Street",
        city: "New York",
        gender: "Male",
        email: "john.doe@example.com",
    },
    {
        id: 2,
        fullName: "Jane Smith",
        address: "456 Avenue",
        city: "Los Angeles",
        gender: "Female",
        email: "jane.smith@example.com",
    },
    {
        id: 3,
        fullName: "Alice Brown",
        address: "789 Boulevard",
        city: "Chicago",
        gender: "Female",
        email: "alice.brown@example.com",
    },
];

const User = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        fullName: "",
        address: "",
        city: "",
        gender: "",
        email: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter((product) =>
            product.fullName.toLowerCase().includes(term) ||
            product.address.toLowerCase().includes(term) ||
            product.city.toLowerCase().includes(term)
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
            address: "",
            city: "",
            gender: "",
            email: "",
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
        "Address",
        "City",
        "Gender",
        "Email",
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
        className="mt-12 bg-white rounded-md shadow-md mx-auto  section  p-5  relative z-10"

            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <div className="flex justify-between text-black items-center mb-6">
                <h2 className="text-xl font-semibold text-black">Tailor List</h2>
                <div className="relative flex items-center">
                    <Search
                        className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5"
                        size={20}
                    />
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
                    Add User
                </button>
            </div>

            <Table
                headers={headers}
                data={getCurrentPageProducts()}
                customStyles={{
                    table: "",
                    header: "text-sm",
                    cell: "text-sm",
                }}
                actions={actions}
            />

<div className='flex flex-col md:flex-row justify-between mt-4 space-x-2 items-center'>
                <div className='flex items-center'>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === 1 ? 'border-gray-600' : 'border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className='mx-2 text-sm font-medium'>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === totalPages ? 'border-gray-600' : 'border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className='text-sm font-medium tracking-wider mt-5 md:mt-0'>Total Tailors: {filteredProducts.length}</div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <motion.div
                             className='bg-white rounded-lg shadow-lg p-6 max-w-3xl  relative w-full'
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             transition={{ duration: 0.3 }}
                         >
            <h2 className="text-lg font-semibold mb-4">Add User</h2>
            
            {/* Close Button */}
            <button
                onClick={() => setAddModalOpen(false)}
                className="absolute top-2 right-2 text-red-500"
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

                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            value={newProduct.fullName}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, fullName: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            value={newProduct.address}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, address: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                            type="text"
                            value={newProduct.city}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, city: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <select
                            value={newProduct.gender}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, gender: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={newProduct.email}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, email: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            value={newProduct.mobile}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, mobile: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                </div>

                {/* Add Button */}
                <div className="mt-1 flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white font-medium px-4 py-2 rounded"
                    >
                        Add
                    </button>
                </div>
            </form>
        </motion.div>
    </div>
)}


            {/* Edit Modal */}
            {isEditModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
     <motion.div
                             className='bg-white rounded-lg shadow-lg p-6 max-w-3xl  relative w-full'
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             transition={{ duration: 0.3 }}
                         >
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            
            {/* Close Button */}
            <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-2 right-2 text-red-500"
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

                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            value={editProduct.fullName}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, fullName: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            value={editProduct.address}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, address: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                            type="text"
                            value={editProduct.city}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, city: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        <select
                            value={editProduct.gender}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, gender: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={editProduct.email}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, email: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Mobile Number</label>
                        <input
                            type="tel"
                            value={editProduct.mobile}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, mobile: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-1 flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white font-medium px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </motion.div>
    </div>
)}

        </motion.div>
    );
};

export default User;
