import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X, Upload } from "lucide-react";
import { Switch } from "@mui/material";
import { createSize, getAllSizes, updateSize, deleteSize } from "../../apis/sizeApi";
import Mapping from '../Pages/Mapping';

const SizeType = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sizes, setSizes] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ name: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isMapping, setIsMapping] = useState(false);
    const [mappingProduct, setMappingProduct] = useState();
    const [mappedProducts, setMappedProducts] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState("");

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const fetchData = async () => {
        try {
            const response = await getAllSizes();  // Fetch all sizes
            setSizes(response.data);
            setFilteredProducts(response.data);  // Initially set filtered products to all sizes
        } catch (error) {
            console.error("Error fetching sizes", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            // If search term is empty, show all sizes
            setFilteredProducts(sizes);
        } else {
            // Apply filter based on search term
            const filtered = sizes.filter((product) =>
                product.name.toLowerCase().includes(term)
            );
            setFilteredProducts(filtered);
        }
        setCurrentPage(1); // Reset to first page after search
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setEditModalOpen(true);
    };

    const handleDelete = async (productId) => {
        try {
            await deleteSize(productId);  // Delete a size
            setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
        } catch (error) {
            console.error("Error deleting size", error);
        }
    };

    const handleAdd = async () => {
        try {
            const data = await createSize(newProduct);  // Add a new size
            fetchData();  // Refresh data after adding new size
            setAddModalOpen(false);
            setNewProduct({ name: "" });
        } catch (error) {
            console.error("Error adding size", error);
        }
    };

    const handleSave = async () => {
        try {
            const data = await updateSize(editProduct.id, editProduct);  // Update a size
            setFilteredProducts(
                filteredProducts.map((product) =>
                    product.id === editProduct.id ? data : product
                )
            );
            setEditModalOpen(false);
        } catch (error) {
            console.error("Error saving size", error);
        }
    };

    const toggleStatus = async (productId) => {
        try {
            const data = filteredProducts.find(data => data._id === productId);
            await updateSize(productId, { ...data, status: data.status === 'active' ? 'inactive' : 'active' });
            const updatedProducts = filteredProducts.map(product =>
                product._id === productId ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' } : product
            );
            setFilteredProducts(updatedProducts);
        } catch (error) {
            console.error(error);
            alert('Error saving changes.');
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };

    const headers = ["S.No", "Product Name", "status"];

    const actions = (row) => (
        <div className="flex gap-2">
            <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700">
                <Edit size={18} />
            </button>
            <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:text-red-700">
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
            setUploadedFileName(file.name);
            // Add logic to parse and upload the file if needed
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
                <h2 className="text-xl font-semibold text-black">Products</h2>
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
                            onChange={handleBulkUpload}
                            className="hidden"
                        />
                        <label htmlFor="bulkUpload" className="text-black border border-gray-300 px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-200">
                            <Upload size={18} />
                            Bulk Upload
                        </label>
                    </div>
                    {uploadedFileName && (
                        <span className="text-sm text-gray-600">{uploadedFileName}</span>
                    )}
                    <button onClick={() => setAddModalOpen(true)} className="bg-primary text-white font-medium px-4 py-2 rounded hover:bg-blue-700">
                        Add Product
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
                        {getCurrentPageProducts().map((row, index) => (
                            <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                                <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">{row.name}</td>
                                <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                                    <Switch
                                        checked={row.status === 'active'}
                                        onChange={() => toggleStatus(row._id)}
                                        color="primary"
                                    />
                                </td>
                                <td className="px-4 py-2 text-gray-700 border-b">{actions(row)}</td>
                                <td className="px-4 py-2 text-gray-700 border-b">{mapping(row)}</td>
                            </tr>
                        ))}
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
                        <ChevronLeft size={18} />
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
                <div className="text-sm">Total Products : {filteredProducts.length}</div>
            </div>

            {/* Add Size Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white relative p-6 rounded-lg w-3/5">
                        <h2 className="text-lg font-semibold mb-4">Add Product</h2>
                        <button onClick={() => setAddModalOpen(false)} className="absolute top-3 right-3 text-black">
                            <X size={26} />
                        </button>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAdd();
                        }}>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Size Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-3/5 relative">
                        <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
                        <button onClick={() => setEditModalOpen(false)} className="absolute top-3 right-3 text-black">
                            <X size={20} />
                        </button>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={editProduct?.name || ""}
                                        onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                        className="w-full border rounded px-3 py-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Mapping Modal */}
            {isMapping && (
                <Mapping
                    product={mappingProduct}
                    setIsMapping={setIsMapping}
                    mappedProducts={mappedProducts}
                    setProduct={setMappingProduct}
                    setMappedProducts={setMappedProducts}
                />
            )}
        </motion.div>
    );
};

export default SizeType;
