import React from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const Product_Data = [
    { product: "Shirt", unit: "4" },
    { product: "T-shirt", unit: "8" },
];

const ProductPage = () => {
    const { id } = useParams();

    const headers = ["Product", "Unit"];

    return (
        <motion.div
            className="mt-12 bg-white rounded-lg shadow-lg mx-auto section p-6 max-w-4xl"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Product Details for User ID: {id}
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-700">
                    <thead className="bg-gray-100">
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
                        {Product_Data.map((product, index) => (
                            <tr
                                key={index}
                                className={`hover:bg-gray-100 ${
                                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }`}
                            >
                                <td className="px-6 py-4 border-b">{product.product}</td>
                                <td className="px-6 py-4 border-b">{product.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6">
                <p className="text-sm text-gray-600">
                    Showing details for User ID: <span className="font-semibold">{id}</span>
                </p>
            </div>
        </motion.div>
    );
};

export default ProductPage;
