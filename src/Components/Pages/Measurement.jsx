import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import Table from "../UI/Table";

const Product_Data = [
    {
        id: 1,
        chest: "100",
        waist: "80",
        wrist: "20",
        hips: "90",
        thigh: "50",
        shoulder: "40",
        neck: "30",
        unit: "cm",
    },
    {
        id: 2,
        chest: "95",
        waist: "75",
        wrist: "18",
        hips: "85",
        thigh: "48",
        shoulder: "38",
        neck: "28",
        unit: "cm",
    },
    {
        id: 3,
        chest: "105",
        waist: "85",
        wrist: "22",
        hips: "95",
        thigh: "52",
        shoulder: "42",
        neck: "32",
        unit: "cm",
    },
];

const Measurement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        chest: "",
        waist: "",
        wrist: "",
        hips: "",
        thigh: "",
        shoulder: "",
        neck: "",
        unit: "", // e.g., "cm", "inches"
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter((product) =>
            product.chest.toLowerCase().includes(term) ||
            product.waist.toLowerCase().includes(term) ||
            product.wrist.toLowerCase().includes(term) ||
            product.hips.toLowerCase().includes(term) ||
            product.thigh.toLowerCase().includes(term) ||
            product.shoulder.toLowerCase().includes(term) ||
            product.neck.toLowerCase().includes(term) ||
            product.unit.toLowerCase().includes(term)
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
            chest: "",
            waist: "",
            wrist: "",
            hips: "",
            thigh: "",
            shoulder: "",
            neck: "",
            unit: "",
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
        "Chest",
        "Waist",
        "Wrist",
        "Hips",
        "Thigh",
        "Shoulder",
        "Neck",
        "Unit",
       
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
                <h2 className="text-xl font-semibold text-black">Measurement List</h2>
                <div className="relative flex items-center">
                    <Search
                        className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search Measurement..."
                        className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md"
                >
                    Add Measurement
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
                <div className='text-sm font-medium tracking-wider mt-5 md:mt-0'>Total Measurements: {filteredProducts.length}</div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg w-3/5  relative">
      <h2 className="text-lg font-semibold mb-4">Add Measurement</h2>
      <button
        onClick={() => setAddModalOpen(false)}
        className="absolute top-2 right-2 text-red-500"
      >
        <X size={20} />
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Chest</label>
            <input
              type="text"
              value={newProduct.chest}
              onChange={(e) =>
                setNewProduct({ ...newProduct, chest: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Waist</label>
            <input
              type="text"
              value={newProduct.waist}
              onChange={(e) =>
                setNewProduct({ ...newProduct, waist: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Wrist</label>
            <input
              type="text"
              value={newProduct.wrist}
              onChange={(e) =>
                setNewProduct({ ...newProduct, wrist: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hips</label>
            <input
              type="text"
              value={newProduct.hips}
              onChange={(e) =>
                setNewProduct({ ...newProduct, hips: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Thigh</label>
            <input
              type="text"
              value={newProduct.thigh}
              onChange={(e) =>
                setNewProduct({ ...newProduct, thigh: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shoulder</label>
            <input
              type="text"
              value={newProduct.shoulder}
              onChange={(e) =>
                setNewProduct({ ...newProduct, shoulder: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Neck</label>
            <input
              type="text"
              value={newProduct.neck}
              onChange={(e) =>
                setNewProduct({ ...newProduct, neck: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <select
              value={newProduct.unit}
              onChange={(e) =>
                setNewProduct({ ...newProduct, unit: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">Select Unit</option>
              <option value="cm">cm</option>
              <option value="inches">inches</option>
            </select>
          </div>
        </div>

        <div className="mt-1 flex justify-end">
          <button
            type="submit"
            className="bg-primary text-white font-medium px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
)}


            {/* Edit Modal */}
            {isAddModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-3/5  relative">
            <h2 className="text-lg font-semibold mb-4">Add Measurement</h2>
            <button
                onClick={() => setAddModalOpen(false)}
                className="absolute top-2 right-2 text-red-500"
            >
                <X size={20} />
            </button>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleAdd();
                }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Chest</label>
                        <input
                            type="text"
                            value={newProduct.chest}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, chest: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Waist</label>
                        <input
                            type="text"
                            value={newProduct.waist}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, waist: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Wrist</label>
                        <input
                            type="text"
                            value={newProduct.wrist}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, wrist: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hips</label>
                        <input
                            type="text"
                            value={newProduct.hips}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, hips: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Thigh</label>
                        <input
                            type="text"
                            value={newProduct.thigh}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, thigh: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Shoulder</label>
                        <input
                            type="text"
                            value={newProduct.shoulder}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, shoulder: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Neck</label>
                        <input
                            type="text"
                            value={newProduct.neck}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, neck: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <select
                            value={newProduct.unit}
                            onChange={(e) =>
                                setNewProduct({ ...newProduct, unit: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Unit</option>
                            <option value="cm">cm</option>
                            <option value="inches">inches</option>
                        </select>
                    </div>
                </div>

                <div className="mt-1 flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white font-medium px-4 py-2 rounded"
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
        <div className="bg-white p-6 rounded-lg w-3/5  relative">
            <h2 className="text-lg font-semibold mb-4">Edit Measurement</h2>
            <button
                onClick={() => setEditModalOpen(false)}
                className="absolute top-2 right-2 text-red-500"
            >
                <X size={20} />
            </button>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Chest</label>
                        <input
                            type="text"
                            value={editProduct.chest}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, chest: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Waist</label>
                        <input
                            type="text"
                            value={editProduct.waist}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, waist: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Wrist</label>
                        <input
                            type="text"
                            value={editProduct.wrist}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, wrist: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Hips</label>
                        <input
                            type="text"
                            value={editProduct.hips}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, hips: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Thigh</label>
                        <input
                            type="text"
                            value={editProduct.thigh}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, thigh: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Shoulder</label>
                        <input
                            type="text"
                            value={editProduct.shoulder}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, shoulder: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Neck</label>
                        <input
                            type="text"
                            value={editProduct.neck}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, neck: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <select
                            value={editProduct.unit}
                            onChange={(e) =>
                                setEditProduct({ ...editProduct, unit: e.target.value })
                            }
                            className="w-full border rounded px-3 py-2"
                            required
                        >
                            <option value="">Select Unit</option>
                            <option value="cm">cm</option>
                            <option value="inches">inches</option>
                        </select>
                    </div>
                </div>

                <div className="mt-1 flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white font-medium px-4 py-2 rounded hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

        </motion.div>
    );
};

export default Measurement;