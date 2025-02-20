import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAssignedTailor } from "../../apis/orderApi";
import { useAuth } from "../context/AuthProvider";
import { IoMdEye } from "react-icons/io";


const Project = () => {
    const {user,setIsLoading} =useAuth()
    const [list,setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();

    const totalPages = Math.ceil(list.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageUsers = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return list.slice(start, start + itemsPerPage);
    };

    const headers = ["S.No","Branch", "Institution","Student"];

    useEffect(()=>{
        if(user){
            setIsLoading(true)
            getAssignedTailor(user._id)
            .then(res=>{
                setList(res.data.orders)
                setIsLoading(false)
            }).catch(err=>{console.log(err)
                setList([])
            setIsLoading(false)
        })
        }
    },[])
    return (
        <motion.div
            className="mt-5 bg-white rounded-lg shadow-lg mx-auto section p-6 relative"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Project List</h2>

            <div className="overflow-x-auto">
                <table className="hidden md:table w-full border-collapse bg-white text-left text-sm text-gray-700">
                    <thead className="min-w-full table-auto divide-y divide-gray-600">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {getCurrentPageUsers().length > 0 ? getCurrentPageUsers().map((order, index) => (
                            <tr
                                key={order._id}
                                className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                                <td className="px-6 py-4 border-b">{index+1}</td>
                                <td className="px-6 py-4 border-b">{order.branch.name}</td>
                                <td className="px-6 py-4 border-b">{order.industry.name}</td>
                                <td className="px-6 py-4 border-b">
                                    <button
                                        onClick={() => navigate(`/student/${order._id}`)}
                                        className="flex items-center space-x-2 text-blue-500 hover:text-blue-700 transition"
                                    >
                                        {/* <span>View</span> */}
                                        <ArrowRight size={16} />
                                    </button>
                                </td>
                                
                            </tr>
                        )):
                        "NOT ASSIGNED"}
                    </tbody>
                </table>
                  {/* MOBILE VIEW - CARD FORMAT */}
                <div className="md:hidden">
                    {getCurrentPageUsers().length > 0 ? (
                        getCurrentPageUsers().map((order, index) => (
                            <div key={order._id} className="bg-gray-100 rounded-lg shadow-sm p-4 mb-3">
                                <p className="text-sm font-semibold text-gray-700">
                                    <span className="text-gray-500">S.No:</span> {index + 1}
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                    <span className="text-gray-500">Branch:</span> {order.branch.name}
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                    <span className="text-gray-500">Institution:</span> {order.industry.name}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                    <button onClick={() => navigate(`/student/${order._id}`)} className="text-blue-500 hover:text-blue-700 transition flex items-center">
                                        Studends <ArrowRight size={16} className="ml-1" />
                                    </button>
                                    {/* <button onClick={() => navigate(`/projects/${order._id}`)} className="text-blue-500 hover:text-blue-700 transition flex items-center">
                                        Products <IoMdEye size={16} className="ml-1" />
                                    </button> */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">NOT ASSIGNED</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mt-6">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg border text-gray-600 ${
                            currentPage === 1
                                ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                                : "bg-white border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg border text-gray-600 ${
                            currentPage === totalPages
                                ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                                : "bg-white border-gray-300 hover:bg-gray-200"
                        }`}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
                <div className="text-sm font-medium text-gray-700">
                    Total Order: {list.length}
                </div>
            </div>
        </motion.div>
    );
};

export default Project;
