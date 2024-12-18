import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Search, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Table from '../UI/Table';

const Product_Data = [
    { id: 1, client: "School", remark: "Electronics", CreationDate: "12-12-24" },
    { id: 2, client: "College", remark: "Electronics", CreationDate: "12-12-24" },
    { id: 3, client: "College", remark: "Electronics", CreationDate: "12-12-24" },
];

const ProductTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({ client: "", remark: "", CreationDate: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter(product =>
            product.client.toLowerCase().includes(term) ||
            product.remark.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setEditModalOpen(true);
    };

    const handleDelete = (productId) => {
        const updatedProducts = filteredProducts.filter(product => product.id !== productId);
        setFilteredProducts(updatedProducts);
    };

    const handleAdd = () => {
        const newId = filteredProducts.length > 0 ? Math.max(...filteredProducts.map(product => product.id)) + 1 : 1;
        const productToAdd = { ...newProduct, id: newId };
        setFilteredProducts([productToAdd, ...filteredProducts]);
        setAddModalOpen(false);
        setNewProduct({ client: "", remark: "", CreationDate: "" });
    };

    const handleSave = () => {
        const updatedProducts = filteredProducts.map(product =>
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
    const headers = ["S.No", "Client", "Remark", "Creation Date"];

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

    return (
        <motion.div
        className="mt-12 bg-white rounded-md shadow-md mx-auto  section  p-5  relative z-10"

            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            {/* Header and Search */}
            <div className='flex justify-between text-black items-center mb-6'>
                <h2 className='text-xl font-semibold text-black'>Client List</h2>
                <div className='relative flex items-center'>
                    <Search className='absolute left-3 text-gray-400 sm:left-2.5 top-2.5' size={20} />
                    <input
                        type="text"
                        placeholder='Search Product...'
                        className='text-white border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
                <button onClick={() => setAddModalOpen(true)} className='bg-primary font-medium text-white text-md px-4 py-2 rounded-md'>
                    Add Client
                </button>
            </div>

            <Table
                headers={headers}
                data={getCurrentPageProducts()}
                customStyles={{ table: "", header: "text-sm", cell: "text-sm" }}
                actions={actions}
            />

            {/* Enhanced Pagination Controls */}
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
                <div className='text-sm font-medium tracking-wider mt-5 md:mt-0'>Total Clients: {filteredProducts.length}</div>
            </div>
          {/* Add Product Modal */}
{isAddModalOpen && (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
        <motion.div
            className='bg-white rounded-lg shadow-lg p-6 max-w-xl w-full'
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h1 className='text-2xl font-semibold mb-4 underline tracking-wider'>Add New Product</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='flex flex-col space-y-1'>
    <label className='text-sm'>Client Type</label>
    <input
        type="text"
        value={newProduct.client}
        onChange={(e) => setNewProduct({ ...newProduct, client: e.target.value })}
        placeholder="Enter Client Type"
        className='w-full px-4 py-2 border rounded-md'
    />
</div>


                <div className='flex flex-col space-y-1'>
                    <label className='text-sm'>Remark</label>
                    <input
                        type="text"
                        value={newProduct.remark}
                        onChange={(e) => setNewProduct({ ...newProduct, remark: e.target.value })}
                        placeholder='Remark'
                        className='w-full px-4 py-2 border rounded-md'
                    />
                </div>
            </div>

            <div className='flex justify-end mt-5 space-x-2'>
                <button onClick={() => setAddModalOpen(false)} className='border px-4 py-2 rounded-md'>
                    Cancel
                </button>
                <button onClick={handleAdd} className='bg-primary font-medium text-white text-md px-4 py-2 rounded-md'>
                    Add Product
                </button>
            </div>
        </motion.div>
    </div>
)}

            {/* Edit modal pop up */}
            {isEditModalOpen && (
                <div className='fixed inset-0 text-black flex items-center justify-center bg-black bg-opacity-50 z-50'>
                    <motion.div
                        className='bg-white rounded-lg shadow-lg p-6 max-w-xl w-full'
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className='text-2xl font-semibold mb-3 underline tracking-wider'>Edit Product</h1>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex flex-col space-y-1'>
    <label className='text-sm'>Client Type</label>
    <select
        value={editProduct.client}
        onChange={(e) => setEditProduct({ ...editProduct, client: e.target.value })}
        className='w-full px-4 py-2 border     rounded-md'
    >
        <option value=''>Select Client Type</option>
        <option value='School'>School</option>
        <option value='College'>College</option>
    </select>
</div>

                            <div className='flex flex-col space-y-1'>
                                <label className='text-sm'>Remark</label>
                                <input
                                    type='text'
                                    value={editProduct.remark}
                                    onChange={(e) => setEditProduct({ ...editProduct, remark: e.target.value })}
                                    className='w-full px-4 py-2 border text-white rounded-md'
                                />
                            </div>
                            
                        </div>

                        <div className='flex justify-end mt-5 space-x-2'>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className='border font-medium px-4 py-2 rounded-md'
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className='bg-primary font-medium text-white text-md px-4 py-2 rounded-md w-24'
                            >
                                Save
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Add Product Modal */}
          
        </motion.div>
    );
};

export default ProductTable;