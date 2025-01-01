import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { getAssignedTailor } from "../../apis/orderApi";
import { MdArrowBack } from "react-icons/md";

const ProductPage = () => {
    const { id } = useParams();
    const [productList,setProductList] = useState([])
    const navigate = useNavigate()
    useEffect(()=>{
        getAssignedTailor(id).then(res=>{
            setProductList(res.data.productUnits) 
        }).catch(err=>console.log(err))
    },[id])
    const headers = ["S.No","Product", "Count"];

    return (
        <motion.div
            className="mt-12 bg-white rounded-lg shadow-lg mx-auto section p-6"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
        >
            <h2 className="text-xl flex justify-start gap-2 items-center font-semibold text-gray-800 mb-6">
                <button onClick={()=>navigate(-1)}><MdArrowBack/></button>
                <span>Products</span>
                {/* Order ID: {id} */}
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
                        {productList.map((product, index) => (
                            <tr
                                key={index}
                                className={`hover:bg-gray-100 ${
                                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }`}
                            >
                                <td className="px-6 py-4 border-b">{index+1}</td>
                                <td className="px-6 py-4 border-b">{product.product}</td>
                                <td className="px-6 py-4 border-b">{product.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </motion.div>
    );
};

export default ProductPage;
