import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { getAllSizes } from "../../apis/sizeApi";
import { getOrderById } from "../../apis/orderApi";
import { useAuth } from "../context/AuthProvider";

const ProductPage = () => {
    const { id } = useParams();
    const [groupedProducts, setGroupedProducts] = useState({});
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const {setIsLoading} = useAuth()

    useEffect(() => {
        // Fetch all sizes
        getAllSizes()
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            setIsLoading(true)
            getOrderById(id)
                .then((res) => {
                    const students = res.data.students;

                    // Group products by house
                    const grouped = students.reduce((acc, student) => {
                        const house = student.house;
                        if (!acc[house]) acc[house] = {};

                        student.products.forEach((product) => {
                            const matchedProduct = products.find(
                                (pro) => pro._id === product.product
                            );
                            const productName = matchedProduct
                                ? matchedProduct.name
                                : "Custom Product";

                            if (!acc[house][productName]) {
                                acc[house][productName] = {
                                    productName,
                                    quantity: 0,
                                    measurement: product.measurement || "-",
                                    price: product.price || (matchedProduct ? matchedProduct.price : "-"),
                                };
                            }
                            acc[house][productName].quantity += product.quantity;
                        });

                        return acc;
                    }, {});
                    setIsLoading(false)
                    setGroupedProducts(grouped);
                })
                .catch((err) => console.error(err));
        }
    }, [id, products]);

    return (
        <motion.div
            className="mt-5 bg-white rounded-lg shadow-lg mx-auto section p-6"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <h2 className="text-xl flex justify-start gap-2 items-center font-semibold text-gray-800 mb-6">
                <button onClick={() => navigate(-1)}>
                    <MdArrowBack />
                </button>
                <span>Products by House</span>
            </h2>

            <div className="overflow-x-auto">
                {Object.keys(groupedProducts).map((house, houseIndex) => (
                    <div key={houseIndex} className="mb-8">
                        {/* Display House Name */}
                        <h3 className="text-lg font-bold text-gray-700 mb-4">
                            House: {house.charAt(0).toUpperCase() + house.slice(1)}
                        </h3>
                        
                        <table className="w-full hidden md:table border-collapse bg-white text-left text-sm text-gray-700">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        S.No
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Measurement
                                    </th>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider border-b">
                                        Price
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.values(groupedProducts[house]).map((product, index) => (
                                    <tr
                                        key={index}
                                        className={`hover:bg-gray-100 ${
                                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                        }`}
                                    >
                                        <td className="px-6 py-4 border-b">{index + 1}</td>
                                        <td className="px-6 py-4 border-b">{product.productName}</td>
                                        <td className="px-6 py-4 border-b">{product.quantity}</td>
                                        <td className="px-6 py-4 border-b">{product.measurement}</td>
                                        <td className="px-6 py-4 border-b">{product.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="md:hidden space-y-4">
                            {Object.values(groupedProducts[house]).map((product, index) => (
                            <div key={index} className="bg-white shadow-md p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
                                <p className="text-gray-700 text-sm"><strong>Quantity:</strong> {product.quantity}</p>
                                <p className="text-gray-700 text-sm"><strong>Measurement:</strong> {product.measurement}</p>
                                <p className="text-gray-700 text-sm"><strong>Price:</strong> {product.price}</p>
                            </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProductPage;
