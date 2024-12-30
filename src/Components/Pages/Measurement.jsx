import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "../UI/Model";

const Product_Data = [
  { parameterName: "Chest" },
  { parameterName: "Waist" },
];

const Measurement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(Product_Data);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newProduct, setNewProduct] = useState({ parameterName: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = Product_Data.filter((product) =>
      product.parameterName.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedProducts = filteredProducts.filter((_, i) => i !== index);
    setFilteredProducts(updatedProducts);
  };

  const handleAdd = () => {
    setFilteredProducts([newProduct, ...filteredProducts]);
    setAddModalOpen(false);
    setNewProduct({ parameterName: "" });
  };

  const handleSave = () => {
    if (editIndex === null) return;
    const updatedProducts = [...filteredProducts];
    updatedProducts[editIndex] = { ...filteredProducts[editIndex], ...newProduct };
    setFilteredProducts(updatedProducts);
    setEditModalOpen(false);
    setEditIndex(null);
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

  const Table = ({
    headers,
    data,
    customStyles = {},
    actions,
    showSerialNumber = false,
  }) => {
    return (
      <div className="overflow-x-auto">
        <table className={`min-w-full table-auto divide-y divide-gray-600 ${customStyles.table}`}>
          <thead>
            <tr>
              {showSerialNumber && (
                <th className={`px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${customStyles.header}`}>
                  S.No
                </th>
              )}
              {headers.map((header, index) => (
                <th key={index} className={`px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider ${customStyles.header}`}>
                  {header}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => {
                const serialNumber = (currentPage - 1) * itemsPerPage + rowIndex + 1;
                return (
                  <tr key={rowIndex} className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    {showSerialNumber && <td className={`px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm ${customStyles.cell}`}>{serialNumber}</td>}
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex} className={`px-4 py-2 text-gray-700 border-b break-words text-xs sm:text-sm ${customStyles.cell}`}>{cell}</td>
                    ))}
                    {actions && <td className="px-4 py-2 text-gray-700 border-b">{actions(row, rowIndex)}</td>}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={headers.length + (showSerialNumber ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-4 text-gray-500 text-xs sm:text-sm">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const headers = ["Parameter Name"];

  const actions = (row, index) => (
    <div className="flex gap-2">
      <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700">
        <Edit size={18} />
      </button>
      <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
        <Trash2 size={18} />
      </button>
    </div>
  );

  return (
    <motion.div className="mt-12 bg-white rounded-md shadow-md mx-auto section p-5 relative z-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.2 }}>
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
          className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md">
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
        actions={(row, index) => actions(row, index)}
        showSerialNumber={true}
      />
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <button
            onClick={() => paginate("prev")}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md">
            <ChevronLeft size={18} />
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate("next")}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded-md">
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
          inputs={[{
            label: "Parameter Name",
            value: newProduct.parameterName,
            onChange: (e) => setNewProduct({ ...newProduct, parameterName: e.target.value }),
          }]}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editIndex !== null && (
        <Modal
          title="Edit Measurement"
          onClose={() => setEditModalOpen(false)}
          onSubmit={handleSave}
          inputs={[{
            label: "Parameter Name",
            value: filteredProducts[editIndex]?.parameterName,
            onChange: (e) => {
              const updatedProducts = [...filteredProducts];
              updatedProducts[editIndex].parameterName = e.target.value;
              setFilteredProducts(updatedProducts);
            },
          }]}
        />
      )}
    </motion.div>
  );
};

export default Measurement;
