import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Table from "../UI/Table";
import Modal from "../UI/Model";

const Product_Data = [
  { parameterName: "Chest", unit: "cm", id: 1 },
  { parameterName: "Waist", unit: "inches", id: 2 },
];

const Measurement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(Product_Data);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ parameterName: "", unit: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Product_Data.filter(
      (product) =>
        product.parameterName.toLowerCase().includes(term) ||
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
    setNewProduct({ parameterName: "", unit: "" });
  };

  const handleSave = () => {
    if (!editProduct) return;
    const updatedProducts = filteredProducts.map((product) =>
      product.id === editProduct.id ? editProduct : product
    );
    setFilteredProducts(updatedProducts);
    setEditModalOpen(false);
  };

  const paginate = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const getCurrentPageProducts = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  };

  const headers = ["Parameter Name", "Unit"];

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Measurement List</h2>
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-gray-400 top-2.5" size={20} />
          <input
            type="text"
            placeholder="Search Measurement..."
            className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
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
        showSerialNumber={true}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <button
            onClick={() => paginate("prev")}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate("next")}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <span>Total Measurements: {filteredProducts.length}</span>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <Modal
          title="Add Measurement"
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAdd}
          inputs={[
            {
              label: "Parameter Name",
              value: newProduct.parameterName,
              onChange: (e) =>
                setNewProduct({ ...newProduct, parameterName: e.target.value }),
            },
            {
              label: "Unit",
              value: newProduct.unit,
              onChange: (e) =>
                setNewProduct({ ...newProduct, unit: e.target.value }),
            },
          ]}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editProduct && (
        <Modal
          title="Edit Measurement"
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleSave}
          inputs={[
            {
              label: "Parameter Name",
              value: editProduct.parameterName,
              onChange: (e) =>
                setEditProduct({
                  ...editProduct,
                  parameterName: e.target.value,
                }),
            },
            {
              label: "Unit",
              value: editProduct.unit,
              onChange: (e) =>
                setEditProduct({ ...editProduct, unit: e.target.value }),
            },
          ]}
        />
      )}
    </motion.div>
  );
};

export default Measurement;
