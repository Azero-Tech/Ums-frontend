import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getAllTailors, createTailor, deleteTailor, updateTailor } from "../../apis/tailorApi"; // Assuming API functions are set up

const User = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTailors, setFilteredTailors] = useState([]);
    const [tailors, setTailors] = useState([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editTailor, setEditTailor] = useState(null);
    const [newTailor, setNewTailor] = useState({
        name: "",
        address: "",
        city: "",
        gender: "",
        email: "",
        phone: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        getAllTailors().then((res) => {
            setTailors(res.data);
            setFilteredTailors(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }, []);

    const totalPages = Math.ceil(filteredTailors.length / itemsPerPage);

    const SearchHandler = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = tailors.filter((tailor) =>
            tailor.name.toLowerCase().includes(term) ||
            tailor.address.toLowerCase().includes(term) ||
            tailor.city.toLowerCase().includes(term)
        );
        setFilteredTailors(filtered);
        setCurrentPage(1);
    };

    const handleEdit = (tailor) => {
        setEditTailor(tailor);
        setEditModalOpen(true);
    };

    const handleDelete = (tailorId) => {
        deleteTailor(tailorId).then(() => {
            const updatedTailors = filteredTailors.filter(tailor => tailor._id !== tailorId);
            setFilteredTailors(updatedTailors);
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleAdd = () => {
        createTailor(newTailor).then((res) => {
            // setFilteredTailors([...filteredTailors,newTailor]);
            getAllTailors().then((res) => {
                setTailors(res.data);
                setFilteredTailors(res.data);
            }).catch((err) => {
                console.log(err);
            });
            setAddModalOpen(false);
            setNewTailor({
                name: "",
                address: "",
                city: "",
                gender: "",
                email: "",
                phone: "",
            });
        }).catch((err) => {
            console.log(err);
        });
    };

    const handleSave = () => {
        updateTailor(editTailor._id, editTailor).then((res) => {
            const updatedTailors = filteredTailors.map((tailor) =>
                tailor._id === editTailor._id ? res.data : tailor
            );
            setFilteredTailors(updatedTailors);
            setEditModalOpen(false);
        }).catch((err) => {
            console.log(err);
        });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const getCurrentPageTailors = () => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTailors.slice(start, start + itemsPerPage);
    };

    const headers = [
        "S. No",
        "Name",
        "Address",
        "City",
        "Gender",
        "Email",
        "Phone"
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
                onClick={() => handleDelete(row._id)}
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
                <h2 className="text-xl font-semibold text-black">Tailor List</h2>
                <div className="relative flex items-center">
                    <Search
                        className="absolute left-3 text-gray-400 sm:left-2.5 top-2.5"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Search tailor..."
                        className="border rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={SearchHandler}
                        value={searchTerm}
                    />
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="bg-primary font-medium text-white text-md px-4 py-2 rounded-md"
                >
                    Add Tailor
                </button>
            </div>

            <table className="min-w-full table-auto">
                <thead>
                    <tr className="border-b text-nowrap">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {getCurrentPageTailors().map((item, index) => (
                        <tr key={item._id}>
                            <td className="border-b px-4 py-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                            <td className="border-b px-4 py-2">{item.name}</td>
                            <td className="border-b px-4 py-2">{item.address?.slice(0, 10)}...</td>
                            <td className="border-b px-4 py-2">{item.city}</td>
                            <td className="border-b px-4 py-2">{item.gender}</td>
                            <td className="border-b px-4 py-2">{item.email}</td>
                            <td className="border-b px-4 py-2">{item.phone}</td>
                            <td className="border-b px-4 py-2">{actions(item)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                <div className="text-sm font-medium tracking-wider mt-5 md:mt-0">Total Tailors: {filteredTailors.length}</div>
            </div>

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <motion.div
                        className="bg-white rounded-lg shadow-lg p-6 max-w-3xl relative w-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-lg font-semibold mb-4">Add Tailor</h2>
                        <button
                            onClick={() => setAddModalOpen(false)}
                            className="absolute top-2 right-2 text-red-500"
                        >
                            <X size={20} />
                        </button>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={newTailor.name}
                                    onChange={(e) => setNewTailor({ ...newTailor, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={newTailor.address}
                                    onChange={(e) => setNewTailor({ ...newTailor, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">City</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={newTailor.city}
                                    onChange={(e) => setNewTailor({ ...newTailor, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Gender</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={newTailor.gender}
                                    onChange={(e) => setNewTailor({ ...newTailor, gender: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={newTailor.email}
                                    onChange={(e) => setNewTailor({ ...newTailor, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={newTailor.phone}
                                    onChange={(e) => setNewTailor({ ...newTailor, phone: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                className="w-full bg-primary py-2 text-white rounded-md"
                            >
                                Add Tailor
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && editTailor && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <motion.div
                        className="bg-white rounded-lg shadow-lg p-6 max-w-3xl relative w-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-lg font-semibold mb-4">Edit Tailor</h2>
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="absolute top-2 right-2 text-red-500"
                        >
                            <X size={20} />
                        </button>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={editTailor.name}
                                    onChange={(e) => setEditTailor({ ...editTailor, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Address</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={editTailor.address}
                                    onChange={(e) => setEditTailor({ ...editTailor, address: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">City</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={editTailor.city}
                                    onChange={(e) => setEditTailor({ ...editTailor, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Gender</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={editTailor.gender}
                                    onChange={(e) => setEditTailor({ ...editTailor, gender: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={editTailor.email}
                                    onChange={(e) => setEditTailor({ ...editTailor, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Phone</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-md"
                                    value={editTailor.phone}
                                    onChange={(e) => setEditTailor({ ...editTailor, phone: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleSave}
                                className="w-full bg-primary py-2 text-white rounded-md"
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

export default User;
