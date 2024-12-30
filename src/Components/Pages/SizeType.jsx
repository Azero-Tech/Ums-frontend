import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Upload } from "lucide-react"; // Import the Upload icon
import { useNavigate } from "react-router-dom";
import Mapping from "./Mapping";

const Product_Data = [
    { id: 1, SizeName: "6", type: "t-Shirt" },
    { id: 2, SizeName: "4", type: "shirt" },
    { id: 3, SizeName: "6", type: "t-Shirt" },
];

const SizeType = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ SizeName: "", type: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isMapping, setIsMapping] = useState(false);
    const [mappingProduct, setMappingProduct] = useState({ SizeName: "", type: "" });
    const [mappedProducts, setMappedProducts] = useState([]); // New state for mapped products
    const [uploadedFileName, setUploadedFileName] = useState("");

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter((product) =>
            product.SizeName.toLowerCase().includes(term) ||
            product.type.toLowerCase().includes(term)
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
        setNewProduct({ SizeName: "", type: "" });
    };

    const handleSave = () => {
        const updatedProducts = filteredProducts.map((product) =>
            product.id === editProduct.id ? editProduct : product
        );
        setFilteredProducts(updatedProducts);
        setEditModalOpen(false);
    };

    const handleMappingAdd = () => {
        if (mappingProduct?.additionalParam) {
          setMappedProducts((prev) => [
            ...prev,
            { parameter: mappingProduct.additionalParam },
          ]);
        }
      };
      const handleParaEdit = (index) => {
        const itemToEdit = mappedProducts[index];
        // Logic to edit the parameter (e.g., open an edit form/modal)
      };
      
      const handleParaDelete = (index) => {
        const updatedProducts = mappedProducts.filter((_, i) => i !== index);
        setMappedProducts(updatedProducts);
      };
      
    const navigate = useNavigate();

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };

    const headers = ["S.No", "Size Name", "Type"];

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

    const mapping = (row) => (
        <div className="flex items-center">
            <button
                onClick={() => {
                    
                    setMappingProduct(row); // Set the mapping product
                    setIsMapping(true); // Open the mapping modal
                }}
                className="ml-2 flex items-center justify-center"
            >
                <ChevronRight size={20} className="text-primary" />
            </button>
        </div>
    );

    const handleBulkUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedFileName(file.name); // Display the file name
            // Process the file here (e.g., parse CSV, send to the server)
        }
    };

    return (
        <motion.div
            className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-black">Size Type List</h2>
                <div className="relative flex items-center">
                    <Search className="absolute left-3 text-gray-400 top-2.5" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="file"
                            id="bulkUpload"
                            accept=".csv, .xls, .xlsx"
                            onChange={(e) => handleBulkUpload(e)}
                            className="hidden"
                        />
                        <label
                            htmlFor="bulkUpload"
                            className="text-black border border-gray-300 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-200"
                        >
                            <Upload size={18} />
                            Bulk Upload
                        </label>
                    </div>
                    {uploadedFileName && (
                        <span className="text-sm text-gray-600">{uploadedFileName}</span>
                    )}
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="bg-primary text-white font-medium px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Add Size Type
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto divide-y divide-gray-600">
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium">Actions</th>
                            <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium">Mapping</th>

                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentPageProducts().length > 0 ? (
                            getCurrentPageProducts().map((row, rowIndex) => (
                                <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{rowIndex + 1 + (currentPage - 1) * itemsPerPage}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.SizeName}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.type}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b">{actions(row)}</td>
                                    <td className="px-4 py-2 text-gray-700 border-b">{mapping(row)}</td>

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

            <div className="flex justify-between mt-4">
                <div className="flex items-center">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 border rounded-md ${currentPage === 1 ? "border-gray-400 text-gray-400" : "border-gray-300 hover:bg-gray-200"}`}
                    >
                        <ChevronLeft size={18 } />
                    </button>
                    <span className="mx-2 text-sm">Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 border rounded-md ${currentPage === totalPages ? "border-gray-400 text-gray-400" : "border-gray-300 hover:bg-gray-200"}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className="text-sm">Total Sizes: {filteredProducts.length}</div>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white relative p-6 rounded-lg w-3/5">
                        <h2 className="text-lg font-semibold mb-4">Add Size Type</h2>
                        <button
                            onClick={() => setAddModalOpen(false)}
                            className="absolute top-3 right-3 text-black"
                        >
                            <X size={26} />
                        </button>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAdd();
                            }}
                        >
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Size Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.SizeName}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                SizeName: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Size Type</label>
                                    <select
                                        value={newProduct.type}
                                        onChange={(e) =>
                                            setNewProduct({
                                                ...newProduct,
                                                type: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="t-Shirt">T-Shirt</option>
                                        <option value="shirt">Shirt</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-3/5 relative">
                        <h2 className="text-lg font-semibold mb-4">Edit Size Type</h2>
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-3 right-3 text-black"
                        >
                            <X size={20} />
                        </button>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Size Name</label>
                                    <input
                                        type="text"
                                        value={editProduct?.SizeName || ""}
                                        onChange={(e) =>
                                            setEditProduct({
                                                ...editProduct,
                                                SizeName: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Size Type</label>
                                    <select
                                        value={editProduct?.type || ""}
                                        onChange={(e) =>
                                            setEditProduct({
                                                ...editProduct,
                                                type: e.target.value,
                                            })
                                        }
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="t-Shirt">T-Shirt</option>
                                        <option value="shirt">Shirt</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className=" bg-primary text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isMapping && (
    <Mapping 
        mappingProduct={mappingProduct} 
        setIsMapping={setIsMapping}
        mappedProducts={mappedProducts} 
        setMappingProduct={setMappingProduct} 
        handleMappingAdd={handleMappingAdd}
        handleParaEdit={handleParaEdit}
        handleParaDelete={handleParaDelete}
    />
)}
            

        </motion.div>
    );
};  

export default SizeType;