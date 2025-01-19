import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from '@mui/material';
import { createType, getAllTypes, getType, updateType, deleteType } from '../../apis/industryTypeApi';
import { filter } from 'framer-motion/client';
import {useAuth} from '../context/AuthProvider'
import toast from 'react-hot-toast';

const ProductTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);  // Raw products data
    const [filteredProducts, setFilteredProducts] = useState([]);  // Filtered products data
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [type, setType] = useState('');  // Changed to 'type'
    const [currentPage, setCurrentPage] = useState(1);
    const {setIsLoading} = useAuth()
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Fetch industries on initial load
    useEffect(() => {
        const fetchIndustries = async () => {
            setIsLoading(true)
            try {
                const response = await getAllTypes();  // Fetch types from the API
                setProducts(response.data);  // Set raw data
                setFilteredProducts(response.data);  // Initially set filtered data
                setIsLoading(false)
            } catch (error) {
                console.error(error);  // Log the error for debugging
                alert('Error fetching types.');
            }
        };

        fetchIndustries();
    }, [isEditModalOpen,isAddModalOpen]);

    // Handle search filter
    const SearchHandler = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter products whenever searchTerm or products change
    useEffect(() => {
        const filtered = products.filter(product =>
            product.type.toLowerCase().includes(searchTerm.toLowerCase()) // Use 'type'
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);  // Reset page to 1 on new search
    }, [searchTerm, products]);

    // Handle Edit action
    const handleEdit = (product) => {
        setEditProduct({ ...product });  // Pre-fill the form with product data
        setEditModalOpen(true);
    };

    // Handle Delete action
    const handleDelete = async (productId) => {
        setIsLoading(true)
        try {
            const res = await deleteType(productId);  // Send delete request to API
            const updatedProducts = filteredProducts.filter(product => product._id !== productId);
            setFilteredProducts(updatedProducts);
            setIsLoading(false)
            toast.success(res.message)
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
        }
    };

    // Handle Add action
    const handleAdd = async () => {
        if (!type.trim()) {
            alert('Type name cannot be empty!');
            return;
        }
        try {
            setIsLoading(true)
            const response = await createType({ type });
            setFilteredProducts([{type,status:"actived"}, ...filteredProducts]);
            setAddModalOpen(false);
            setType('');
            setIsLoading(false)
            toast.success(response.message)
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
        }
    };

    // Handle Save action (Save the edited product)
    const handleSave = async () => {
        setIsLoading(true)
        try {
            const res = await updateType(editProduct._id, editProduct);  // Send updated data to API
            const updatedProducts = filteredProducts.map(product =>
                product._id === editProduct._id ? editProduct : product
            );
            setFilteredProducts(updatedProducts);
            setEditModalOpen(false);
            setIsLoading(false)
            toast.success(res.message)
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
        }
    };

    // Toggle Status (Active/Deactivated)
    const toggleStatus = async(productId) => {
        setIsLoading(true)
        try {
            const data = filteredProducts.find(data => data._id === productId)
            const res = await updateType(productId, {status: data.status === 'actived' ? 'deactived' : 'actived'}); 
            const updatedProducts = filteredProducts.map(product =>
                product._id === productId ? { ...product, status: product.status === 'actived' ? 'deactived' : 'actived' } : product
            );
            setFilteredProducts(updatedProducts);
            setEditModalOpen(false);
            setIsLoading(false)
            toast.success(res.message)
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message);
        }
    };

    // Handle Pagination
    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Get products for the current page
    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };

    const headers = ['S.No', 'Type', 'Status'];

    // Pagination Controls
    useEffect(() => {
        setCurrentPage(1); // Reset page to 1 when filteredProducts changes
    }, [filteredProducts]);

    return (
        <motion.div
            className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            {/* Header and Search */}
            <div className="flex justify-between text-black items-center mb-6">
                <h2 className="text-xl font-semibold text-black">Type List</h2>
                <div className="relative flex items-center">
                    <Search className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5" size={20} />
                    <input
                        type="text"
                        placeholder="Search Type..."
                        className="text-white border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md"
                >
                    Add Type
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
                        {filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={headers.length + 1} className="text-center py-4 text-gray-500 text-xs sm:text-sm">
                                    No types available.
                                </td>
                            </tr>
                        ) : (
                            getCurrentPageProducts().map((row, rowIndex) => (
                                <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                                        {rowIndex + 1 + (currentPage - 1) * itemsPerPage}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                                        {row.type}
                                    </td>
                                    <td className="px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm">
                                        <Switch
                                            checked={row.status === 'actived'}
                                            onChange={() => toggleStatus(row._id)}
                                            color="primary"
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-gray-700 border-b">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(row)} className="text-blue-500 hover:text-blue-700">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(row._id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col md:flex-row justify-between mt-4 space-x-2 items-center">
                <div className="flex items-center">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === 1 ? 'border-gray-600' : 'border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="mx-2 text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`text-sm px-3 py-1 border rounded-md ${currentPage === totalPages ? 'border-gray-600' : 'border-gray-300 hover:bg-gray-300 hover:text-gray-800'}`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className="text-sm font-medium tracking-wider mt-5 md:mt-0">Total Types: {filteredProducts.length}</div>
            </div>

            {/* Add Type Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <motion.div
                        className="bg-white rounded-lg shadow-lg p-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-2xl font-semibold mb-4 underline tracking-wider">Add New Type</h1>
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm">Type</label>
                            <input
                                type="text"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder="Enter Type"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setAddModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-primary text-white rounded-md"
                            >
                                Add Type
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Type Modal */}
            {isEditModalOpen && editProduct && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <motion.div
                        className="bg-white rounded-lg shadow-lg p-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-2xl font-semibold mb-4 underline tracking-wider">Edit Type</h1>
                        <div className="flex flex-col space-y-1">
                            <label className="text-sm">Type</label>
                            <input
                                type="text"
                                value={editProduct.type}
                                onChange={(e) => setEditProduct({ ...editProduct, type: e.target.value })}
                                placeholder="Enter Type"
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary text-white rounded-md"
                            >
                                Save Changes
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ProductTable;
