import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, ChevronLeft, ChevronRight, Search, File } from "lucide-react";
import Table from "../UI/Table";

const Product_Data = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        contactNo: "123-456-7890",
        message: "Need more info on product",
        queryDate: "2024-12-01",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        contactNo: "234-567-8901",
        message: "Interested in bulk purchase",
        queryDate: "2024-12-02",
    },
    {
        id: 3,
        name: "Alice Brown",
        email: "alice.brown@example.com",
        contactNo: "345-678-9012",
        message: "Requesting a demo",
        queryDate: "2024-12-03",
    },
];

const Query = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState(Product_Data);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = Product_Data.filter((product) =>
            product.name.toLowerCase().includes(term) ||
            product.email.toLowerCase().includes(term) ||
            product.contactNo.toLowerCase().includes(term)
        );
        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    const handleEdit = (product) => {
        console.log("Editing", product);
    };

    const handleDelete = (productId) => {
        const updatedProducts = filteredProducts.filter(
            (product) => product.id !== productId
        );
        setFilteredProducts(updatedProducts);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageProducts = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(start, start + itemsPerPage);
    };

    const headers = [ "S.No", "Name", "Email", "Contact No.", "Message", "Query Date", ];

    const actions = (row) => (
        <div className="flex gap-2">
        <File/>
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
                <h2 className="text-xl font-semibold text-black">User Queries</h2>
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
                <div className="text-sm font-medium tracking-wider mt-5 md:mt-0">Total Queries: {filteredProducts.length}</div>
            </div>
        </motion.div>
    );
};

export default Query;
