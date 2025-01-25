import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Logo from "../Assets/logo01.png";

const Invoice = ({ selectedOrder }) => {
  const productMaps = [];
  let grandTotal = 0;

  // Populate productMaps with the student and product details
  selectedOrder.students?.forEach((student) => {
    student.products?.forEach((product) => {
      const productName = product.product ? product.product.name : "Custom Product";
      const productPrice = product.price || product.product.price || 0; // Default price if none specified
      const totalPrice = product.quantity * productPrice;

      // Find an existing entry with the same product name and price
      const existingProductIndex = productMaps.findIndex(
        (item) =>
          item.house === student.house &&
          item.product === productName &&
          item.price === productPrice
      );

      if (existingProductIndex === -1) {
        // Add a new entry if not found
        productMaps.push({
          house: student.house,
          product: productName,
          quantity: product.quantity,
          price: productPrice,
          totalPrice,
        });
      } else {
        // Update the existing entry
        productMaps[existingProductIndex].quantity += product.quantity;
        productMaps[existingProductIndex].totalPrice += totalPrice;
      }

      grandTotal += totalPrice;
    });
  });

  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a5"); // A5 paper size
      const imgWidth = 148; // A5 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice${selectedOrder._id}.pdf`);
    });
  };

  return (
    <>
      <div className="mt-8 text-right mb-5">
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
              {selectedOrder.branch.name} - {selectedOrder.industry.name}
            </p>
            <p className="text-gray-600">
              {selectedOrder.branch.address}, {selectedOrder.branch.city}
            </p>
            <p className="text-gray-600">
              {selectedOrder.branch.phone} | {selectedOrder.branch.email}
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
                  {productMaps.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-2 py-2">{idx + 1}</td>
                      <td className="border border-gray-300 px-2 py-2">{item.house}</td>
                      <td className="border border-gray-300 px-2 py-2">{item.product}</td>
                      <td className="border border-gray-300 px-2 py-2">{item.quantity}</td>
                      <td className="border border-gray-300 px-2 py-2">
                        &#8377; {item.price}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &#8377; {item.totalPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td
                      className="border border-gray-300 px-2 py-2 text-right"
                      colSpan="5"
                    >
                      Grand Total
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      &#8377; {grandTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="text-gray-600 text-center">Thank you</p>
            </div>
          ) : (
            <p className="text-gray-600">No products to display.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Invoice;
