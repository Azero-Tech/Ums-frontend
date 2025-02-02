import React, { useEffect, useState } from "react";
import { MdClose, MdDelete } from "react-icons/md";
import { getAllSizesByIndustry } from "../../apis/sizeApi";
import { getAllTypes } from "../../apis/industryTypeApi";
import { getIndustriesByType } from "../../apis/industryApi";
import { updateStudentInOrder } from "../../apis/studentApi";
import { toast } from "react-hot-toast";
import { getOrderById } from "../../apis/orderApi";
import { sendTemplateMessage } from "../../apis/apiConfig";
import Select from "react-select";

const ProductView = ({
  setProductAdd,
  addForm,
  viewForm,
  orderId,
  studentId,
  studentName,
  setProductView,
  fetchProduct,
}) => {
  const [selectedIndustryType, setSelectedIndustryType] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({});
  const [industryTypes, setIndustryTypes] = useState([]);
  const [cart, setCart] = useState([]);
  const [custom, setCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [method, setMethod] = useState("");
  const [price, setPrice] = useState("");
  const [measurement, setMeasurement] = useState("");

  // Fetch Industry Types on Mount
  // useEffect(() => {
  //   getAllTypes()
  //     .then((typesRes) => setIndustryTypes(typesRes.data))
  //     .catch(() => setError("Error fetching industry types or sizes"));
  // }, []);

  // Preselect Industry based on Order ID
  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then((res) => {setSelectedIndustry(res.data?.industry?._id)
      setOrder(res.data)})
        .catch(() => setError("Error fetching order details"));
    }
  }, [orderId]);

  // Fetch Industries by Type
  // useEffect(() => {
  //   if (selectedIndustryType) {
  //     setLoading(true);
  //     getIndustriesByType(selectedIndustryType)
  //       .then((res) => setIndustrys(res.data))
  //       .catch(() => setError("Error fetching industries"))
  //       .finally(() => setLoading(false));
  //   } else {
  //     setIndustrys([]);
  //   }
  // }, [selectedIndustryType]);

  // Fetch Products by Industry
  useEffect(() => {
    if (selectedIndustry) {
      setLoading(true);
      getAllSizesByIndustry(selectedIndustry)
        .then((res) => setProducts(res.data))
        .catch(() => setError("Error fetching products"))
        .finally(() => setLoading(false));
    } else {
      setProducts([]);
    }
  }, [selectedIndustry]);

  // Add product to cart
  const addToCart = () => {
    if (!selectedProduct || !quantity) {
      return alert("Please select a product and quantity");
    }
  
    if (selectedProduct === "custom" && (!price || !measurement)) {
      return alert("Please provide all details for the custom product");
    }
  
    const product = selectedProduct === "custom"
      ? { name: "Custom Product", price: parseFloat(price), measurement }
      : products.find((p) => p._id === selectedProduct);
  
    const newCartItem = {
      product: product.name,
      productId: selectedProduct,
      description,
      measurement: selectedProduct === "custom" ? measurement : null,
      price: product.price,
      quantity: parseInt(quantity, 10),
      totalPrice: product.price * parseInt(quantity, 10),
      custom: selectedProduct === "custom",
    };
  
    setCart((prev) => [...prev, newCartItem]);
    setSelectedProduct("");
    setQuantity("");
    setDescription("");
    setMeasurement("");
    setError("");
    setPrice("");
  };
  

  // Remove product from cart
  const removeFromCart = (index) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Handle Submit
  const handleSubmit = () => {
    if (cart.length === 0) {
      setError("Please add products to the cart");
      return;
    }
    const student = order.students.find(student=>student._id===studentId)
    const productsToSubmit = cart.map((item) => ({
      product: item.productId === "custom" ? null :item.productId ,
      quantity: item.quantity,
      price : item.productId === "custom" ? item.price : null,
      measurement : item.productId === "custom" ? item.measurement : null,
      custom : item.productId === "custom",
      description: item.description,
    }));
    const totalPrice = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    // console.log({
    //   products: [...student.products, ...productsToSubmit],
    //   paymentDetails: {
    //     method,
    //     totalPrice: student.paymentDetails
    //       ? student.paymentDetails.totalPrice + totalPrice
    //       : totalPrice,
    //     date: Date.now(),
    //   },
    // });
   
    updateStudentInOrder(orderId, studentId, {
      products: productsToSubmit,
      paymentDetails: {
        method,
        totalPrice: student.paymentDetails
          ? student.paymentDetails.totalPrice + totalPrice
          : totalPrice,
        date: Date.now(),
      },
    })
      .then((res) => {
        // const payload = {
        //   to:  `+91${student.phone}`, // Replace with the recipient's phone number
        //   recipient_type: "individual",
        //   type: "template",
        //   template: {
        //     language: {
        //       policy: "deterministic",
        //       code: "en",
        //     },
        //     name: "school_order_completion",
        //     components: [],
        //   },
        // };
        // sendTemplateMessage(payload).then((res)=>toast.success(res.message)).catch(err=>console.log(err))
        toast.success('product add successfully')
        setProductAdd(false)
      })
      .catch((err) => {
        console.log(err)
        toast.error('soming went worng')
      });
  };

  const productOptions = products.map((product) => ({
    value: product._id,
    label: `${product.name} (₹${product.price})`,
  }));

  const options = [{ value: "custom", label: "Custom Product" }, ...productOptions];

  const paymentOptions = [
    { value: "", label: "--Select--" },
    { value: "balance", label: "Balance" },
    { value: "cash", label: "Cash" },
    { value: "gpay", label: "Gpay" },
    
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-4xl relative shadow-lg min-h-[90vh] max-h-[90vh] mx-2 overflow-y-auto">
        {/* Close Button */}
        <MdClose
          className="absolute right-4 top-4 cursor-pointer text-gray-600 hover:text-gray-800"
          onClick={() =>
            addForm ? setProductAdd(false) : setProductView(false)
          }
        />

        {addForm && (
          <>
            <div className=" flex justify-between">
              <h2 className="text-xl font-bold mb-4">Add Product</h2>
              <p>Name : {studentName}</p>
            </div>
            {/* Product Dropdown */}
            <div
              className={`${
                selectedProduct === "custom" && " grid grid-cols-2 gap-2"
              }`}
            >
              {selectedIndustry && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Product
                  </label>
                  <Select
                    className="w-full border rounded-lg"
                    options={options}
                    value={options.find((opt) => opt.value === selectedProduct)}
                    onChange={(selectedOption) =>
                      setSelectedProduct(selectedOption.value)
                    }
                    placeholder="--Choose a Product--"
                    isSearchable
                  />
                </div>
              )}
              {/* {selectedProduct && (
              <button
                className=" p-1 absolute right-10 top-16 text-sm bg-primary rounded-md text-white"
                onClick={() => setCustom(!custom)}
              >
                Custom
              </button>
            )} */}
              {selectedProduct === "custom" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Measurement
                  </label>
                  <input
                    type="text"
                    className="border rounded-lg py-2 px-4 w-full"
                    value={measurement}
                    onChange={(e) => setMeasurement(e.target.value)}
                  />
                </div>
              )}
              {selectedProduct === "custom" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    className="border rounded-lg py-2 mb-4 px-4 w-full"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              )}
              {/* Quantity Input */}
              {selectedProduct && (
                <div className="mb-4">
                  <div className=" flex justify-between items-center">
                    <label className="block text-sm font-medium mb-1">
                      Quantity
                    </label>
                    {selectedProduct !== "custom" ? (
                      <span>
                        {quantity *
                          products.find((pro) => pro._id === selectedProduct)
                            .price}
                      </span>
                    ) : (
                      <span>{quantity * price}</span>
                    )}
                  </div>
                  <input
                    type="number"
                    className="border rounded-lg py-2 px-4 w-full"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              )}
            </div>
            {selectedProduct && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description ( Optional )
                </label>
                <textarea
                  type="text"
                  className="border rounded-lg py-2 px-4 w-full"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}
            {/* Add to Cart Button */}
            {selectedProduct && quantity && (
              <button
                className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium mb-4"
                onClick={addToCart}
              >
                Add to List
              </button>
            )}

            {/* Cart Display */}
            {cart.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold">Products</h3>
                <ul>
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="mr-auto">
                        {item.product} (x{item.quantity}){" "}
                        {item.description && <em>({item.description})</em>}
                        {item.measurement && (
                          <>
                            <em>({item.measurement})</em>
                            <span className=" bg-primary text-white text-xs ml-2 rounded-md px-2 py-1">
                              custom
                            </span>
                          </>
                        )}
                      </span>
                      <span>&#8377; {item.totalPrice}</span>
                      <button
                        className="text-red-500 ml-3"
                        onClick={() => removeFromCart(index)}
                      >
                        <MdDelete />
                      </button>
                    </li>
                  ))}
                </ul>
                <hr className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    &#8377;{" "}
                    {cart.reduce((acc, item) => acc + item.totalPrice, 0)}
                  </span>
                </div>
              </div>
            )}
            <div className="">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Mode
                </label>
                <Select
                  className="w-full border rounded-md mb-2"
                  options={paymentOptions}
                  value={paymentOptions.find((opt) => opt.value === method)}
                  onChange={(selectedOption) => setMethod(selectedOption.value)}
                  placeholder="--Select--"
                />
              </div>
              {/* Submit Button */}
              <button
                className=" py-2 w-full bg-primary rounded-md text-white  text-sm font-medium"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </>
        )}
        {viewForm && fetchProduct.length > 0 && (
          <div className="mb-6 ">
            <div className=" flex justify-between">
              <h3 className="text-lg font-semibold mb-4">Products({fetchProduct.length})</h3>
              <div className="flex font-bold">
                <span>Total :</span>
                <span>
                  &#8377; {fetchProduct.reduce(
                  (acc, item) =>
                    acc + item.quantity * (item.product?.price || item?.price),
                  0
                )}
                </span>
              </div>
            </div>
            <div className=" ">
              <table className="table-auto w-full border-collapse border border-gray-300 hidden md:table">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Product Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Description
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Measurement
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fetchProduct.map((item, index) => {
                    return (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="border border-gray-300 px-4 py-2 text-nowrap">
                          {item.product ? item.product.name : "Custom Product"}
                          (&#8377; {item.product?.price || item?.price})
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.description || "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {item.custom ? `${item.measurement}` : "-"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          &#8377; {(item.product?.price || item?.price) * item.quantity}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="md:hidden space-y-4">
                {fetchProduct.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-lg shadow-sm p-4 bg-white"
                  >
                    <h3>
                      <strong>S.No:</strong> {index + 1}
                    </h3>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.product ? item.product.name : "Custom Product"}{" "}
                      (&#8377; {item.product?.price || item?.price})
                    </h3>
                    <p className="text-xs text-gray-600">
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Description:</strong> {item.description || "-"}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Measurement:</strong>{" "}
                      {item.custom ? `${item.measurement}` : "-"}
                    </p>
                    <p className="text-xs text-gray-600">
                      <strong>Total Price:</strong>{" "}
                      &#8377; {(item.product?.price || item?.price) * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <hr className="my-4" />
            {/* <div className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span>
                {" "}
                &#8377;
                {fetchProduct.reduce(
                  (acc, item) =>
                    acc + item.quantity * (item.product?.price || item?.price),
                  0
                )}
              </span>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductView;
