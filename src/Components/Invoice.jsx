import React, { useMemo, useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../Assets/logo01.png";

const Invoice = ({ selectedOrder,setGenInvoice }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  const [currentProducts, setCurrentProducts] = useState([]);

  // Memoized productMaps and grandTotal calculation
  const { productMaps, grandTotal } = useMemo(() => {
    let products = [];
    let total = 0;

    if (selectedOrder?.students?.length) {
      selectedOrder.students.forEach((student) => {
        student.products?.forEach((product) => {
          const productName = product.product
            ? product.product.name
            : "Custom Product";
          const productPrice = product.price || product.product?.price || 0;
          const totalPrice = product.quantity * productPrice;

          const existingProductIndex = products.findIndex(
            (item) =>
              item.house === student.house &&
              item.product === productName &&
              item.price === productPrice
          );

          if (existingProductIndex === -1) {
            products.push({
              house: student.house,
              product: productName,
              quantity: product.quantity,
              price: productPrice,
              totalPrice,
            });
          } else {
            products[existingProductIndex].quantity += product.quantity;
            products[existingProductIndex].totalPrice += totalPrice;
          }

          total += totalPrice;
        });
      });
    }
    return { productMaps: products, grandTotal: total };
  }, [selectedOrder]);

  // Calculate products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Use useEffect to update the current products when productMaps or currentPage changes
  useEffect(() => {
    setCurrentProducts(productMaps.slice(indexOfFirstProduct, indexOfLastProduct));
  }, [productMaps, currentPage]);

  const totalPages = Math.ceil(productMaps.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const downloadPDF = async () => {
    setCurrentPage(1)
    const pdf = new jsPDF("p", "mm", "a5");
    let isFirstPage = true;
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const startIdx = pageIndex * productsPerPage;
      const endIdx = Math.min(
        (pageIndex + 1) * productsPerPage,
        productMaps.length
      );
      setCurrentPage(pageIndex + 2)
      const currentPageProducts = productMaps.slice(startIdx, endIdx);
      const invoiceElement = document.getElementById("invoice");
      if (!invoiceElement) return;

      const canvas = await html2canvas(invoiceElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 148; // A5 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (!isFirstPage) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      isFirstPage = false;
    }
    setCurrentPage(1)
    pdf.save("invoices.pdf");
    setGenInvoice(false)
  };

  return (
    <>
      <div className=" text-right m-5 gap-3 ">
        <button
            className="bg-primary text-white px-4 py-2 rounded-md mr-3"
            onClick={() => setGenInvoice(false)}
          >
            Close
        </button>
        <button
          onClick={downloadPDF}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-500"
        >
          Download as PDF
        </button>
      </div>

      <div
        className="section mx-auto p-8 bg-white max-w-[148mm] text-sm"
        id="invoice"
      >
        <div className="border-b pb-4 mb-4 flex justify-between items-center">
          <div>
            <img src={Logo} alt="logo" className="w-36 h-auto" />
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
            <p className="text-gray-600">
              {selectedOrder?.branch?.name} - {selectedOrder?.industry?.name}
            </p>
            <p className="text-gray-600">
              {selectedOrder?.branch?.address}, {selectedOrder?.branch?.city}
            </p>
            <p className="text-gray-600">
              {selectedOrder?.branch?.phone} | {selectedOrder?.branch?.email}
            </p>
          </div>
        </div>

        <div>
          {productMaps.length > 0 ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Product Summary
              </h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-2 py-2 text-left text-gray-700">
                      S.No
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-gray-700">
                      House
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-gray-700">
                      Product
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-gray-700">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-gray-700">
                      Price
                    </th>
                    <th className="border border-gray-300 px-2 py-2 text-left text-gray-700">
                      Total Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-2 py-2">
                        {idx + 1 + (currentPage - 1) * productsPerPage}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.house}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.product}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-xs">
                        &#8377; {item.price}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-xs">
                        &#8377; {item.totalPrice}
                      </td>
                    </tr>
                  ))}
                  {currentPage === totalPages && (
                    <tr className="bg-gray-100 font-bold">
                      <td
                        className="border border-gray-300 px-2 py-2 text-right"
                        colSpan="5"
                      >
                        Grand Total
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-xs">
                        &#8377; {grandTotal}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {currentPage === totalPages &&<p className="text-gray-600 text-center mt-4">Thank you</p>}
            </div>
          ) : (
            <p className="text-gray-600">No products to display.</p>
          )}
        </div>
      </div>
      {/* Pagination Controls */}
      {/* <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="flex items-center px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div> */}
    </>
  );
};

export default Invoice;
