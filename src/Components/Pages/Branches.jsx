import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";

const Product_Data = [
    {
        id: 1,
        fullName: "John Doe",
        address: "123 Street",
        city: "New York",
        gender: "Male",
        email: "john.doe@example.com",
        mobile:"455556546",
        industryType:"school"
    },
    {
        id: 2,
        fullName: "Jane Smith",
        address: "456 Avenue",
        city: "Los Angeles",
        gender: "Female",
        email: "jane.smith@example.com",
        mobile:"455556546",
        industryType:"school"


    },
    {
        id: 3,
        fullName: "Alice Brown",
        address: "789 Boulevard",
        city: "Chicago",
        gender: "Female",
        email: "alice.brown@example.com",
        mobile:"455556546"

    },
];
const industryTypes = [
    { id: 1, name: "School" },
    { id: 2, name: "College" },
    { id: 3, name: "Hospital" },
  ];
const Branches = () => {
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
        mobile: "",
        industryType: "",
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
            mobile: "",
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
    const handleEdit = () => {
        const updatedProducts = filteredProducts.map((product) =>
            product.id === editProduct.id ? editProduct : product
        );
        setFilteredProducts(updatedProducts);
        setEditModalOpen(false);
        setEditProduct(null);
    };
    const headers = [
        "S.No",
        "Full Name",
        "Address",
        "City",
        "Gender",
        "Email",
        "Mobile",

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
    
    const handleClientTypeChange = (value) => {
        console.log("Selected Client Type:", value);
        // Implement your filtering logic here
    };

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
                        <option value="">Select Client Type</option>
                        <option value="corporate">School</option>
                        <option value="individual">College</option>
                    </select>
                </div>
                <div className="relative flex items-center w-full sm:w-auto mt-4 sm:mt-0">
                    <Search
                        className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search User..."
                        className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={SearchHandler}
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
                        {getCurrentPageProducts().map((item, index) => (
                            <tr key={item.id}>
                                <td className="border-b px-4 py-2">
                                    {index + 1 + (currentPage - 1) * itemsPerPage}
                                </td>
                                <td className="border-b px-4 py-2">{item.fullName}</td>
                                <td className="border-b px-4 py-2">{item.address}</td>
                                <td className="border-b px-4 py-2">{item.city}</td>
                                <td className="border-b px-4 py-2">{item.gender}</td>
                                <td className="border-b px-4 py-2">{item.email}</td>
                                <td className="border-b px-4 py-2">{item.mobile}</td>
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
                                        onClick={() => handleDelete(item.id)}
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
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-4/4 sm:w-1/3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Add Branch</h3>
                            <button onClick={() => setAddModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                value={newProduct.industryType}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewProduct({ ...newProduct, industryType: value });
                }}
                className="w-full px-4 py-2 border rounded-md mt-2"
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
                                      className="w-full px-4 py-2 border rounded-md mt-2"

                                      required />
                                      
                                      </>
              )}
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newProduct.fullName}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, fullName: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={newProduct.address}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, address: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={newProduct.city}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, city: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="Gender"
                                value={newProduct.gender}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, gender: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newProduct.email}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, email: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="Mobile"
                                value={newProduct.mobile}
                                onChange={(e) =>
                                    setNewProduct({ ...newProduct, mobile: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <button
                                type="button"
                                onClick={handleAdd}
                                className="bg-primary text-white px-4 py-2 rounded-md w-full mt-4"
                            >
                                Add Branch
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-3/4 sm:w-1/3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Edit Branch</h3>
                            <button onClick={() => setEditModalOpen(false)}><X size={20} /></button>
                        </div>
                        <form className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                value={editProduct.industryType}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
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
                value={editProduct.fullName}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    fullName: e.target.value,
                  })
                }
                className="border rounded-md p-2 w-full mb-4"
                required
              />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={editProduct.fullName}
                                onChange={(e) =>
                                    setEditProduct({ ...editProduct, fullName: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={editProduct.address}
                                onChange={(e) =>
                                    setEditProduct({ ...editProduct, address: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={editProduct.city}
                                onChange={(e) =>
                                    setEditProduct({ ...editProduct, city: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="Gender"
                                value={editProduct.gender}
                                onChange={(e) =>
                                    setEditProduct({ ...editProduct, gender: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={editProduct.email}
                                onChange={(e) =>
                                    setEditProduct({ ...editProduct, email: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <input
                                type="text"
                                placeholder="Mobile"
                                value={editProduct.mobile}
                                onChange={(e) =>
                                    setEditProduct({ ...editProduct, mobile: e.target.value })
                                }
                                className="w-full px-4 py-2 border rounded-md mt-2"
                            />
                            <button
                                type="button"
                                onClick={handleSave}
                                className="bg-primary text-white px-4 py-2 rounded-md w-full mt-4"
                            >
                                Save Changes
                            </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default Branches;
