import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Table from "../UI/Table"; // Assuming you have a Table component

const User_Data = 
    [
        {
            id: 1,
            username: "charudua12@test.com",
            userIP: "192.168.1.10",
            loginTime: "2023-07-15 08:30:00",
            logoutTime: "2023-07-15 12:45:00",
            status: "Success",
        },
        {
            id: 2,
            username: "anujk123@test.com",
            userIP: "192.168.1.12",
            loginTime: "2023-07-16 09:00:00",
            logoutTime: "2023-07-16 14:30:00",
            status: "Failed",
        },
        {
            id: 3,
            username: "jv@gmail.com	",
            userIP: "192.168.1.15",
            loginTime: "2023-07-17 10:15:00",
            logoutTime: "2023-07-17 15:00:00",
            status: "Success",
        },
    
    
    // Add more user data as needed
];

const TableUser  = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(User_Data.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageUsers = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return User_Data.slice(start, start + itemsPerPage);
    };

    const headers = ["ID", "Username", "User  IP", "Login Time", "Logout Time", "Status"];

    return (
        <motion.div
        className="mt-12 bg-white rounded-md shadow-md mx-auto   section  p-5  relative z-10"

            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <h2 className="text-xl font-semibold text-black mb-6">User  Logs</h2>

            <Table
                headers={headers}
                data={getCurrentPageUsers()}
                customStyles={{
                    table: "",
                    header: "text-sm",
                    cell: "text-sm",
                }}
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
                <div className='text-sm font-medium tracking-wider mt-5 md:mt-0'>Total Users: {User_Data.length}</div>
            </div>
        </motion.div>
    );
};

export default TableUser ;