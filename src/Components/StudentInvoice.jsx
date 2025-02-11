import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../Assets/logo01.png";

const StudentInvoice = ({ student, setShowInvice }) => {
  const downloadPDF = () => {
    const invoiceElement = document.getElementById("invoice");
    if (!invoiceElement) return;

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a5"); // A5 paper size
      const imgWidth = 148; // A5 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice.pdf`);
    });
  };

  return (
    <>
      <div className="mt-8 flex justify-end gap-5 m-5">
        <button
          className=" bg-primary text-white px-4 py-2 rounded-md"
          onClick={() => setShowInvice(false)}
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
        className="section mx-auto p-8 bg-white min-w-[148mm] max-w-[148mm] text-sm"
        id="invoice"
      >
        <div className="border-b pb-4 mb-4 flex justify-between items-center">
          <div>
            <img src={Logo} alt="logo" className="w-36 h-auto" />
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-800">Invoice</h1>
            <p className="text-gray-600">{student.name}</p>
            <p className="text-gray-600">Class : {student.class}</p>
            <p className="text-gray-600">House : {student.house}</p>
            <p className="text-gray-600">{student.phone}</p>
          </div>
        </div>

        <div>
          {student.products.length > 0 ? (
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
                  {student.products.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-2 py-2">
                        {idx + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 capitalize">
                        {item.product?.name || "custom product"}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {item.quantity}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &#8377; {item.product?.price || item.price}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        &#8377;{" "}
                        {item.quantity * (item.product?.price || item.price)}
                      </td>
                    </tr>
                  ))}
                 { student.paymentDetails?.payments?.some(payment => payment.method === "cash") &&
                   <tr className="bg-gray-100 font-bold">
                   <td colSpan={3} className="border border-gray-300 px-4 py-3 text-right">
                     Payment
                   </td>
                   <td className="border border-gray-300 px-4 py-3 text-center">
                     <span className="">Cash</span>
                   </td>
                   <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                     &#8377;{" "}{student.paymentDetails?.payments
                       .filter(payment => payment.method === "cash")
                       .reduce((total, payment) => total + payment.amount, 0)}
                   </td>
                   
                 </tr>
                 }
                  {
                     student.paymentDetails?.payments?.some(payment => payment.method === "gpay") &&
                     <tr className="bg-gray-100 font-bold">
                       {!student.paymentDetails?.payments?.every(payment => payment.method === "gpay") ?
                        <td colSpan={3}></td>
                       :<td colSpan={3} className="border border-gray-300 px-4 py-3 text-right">
                        Payment
                      </td>}
                       <td className="border border-gray-300 px-4 py-3 text-center">
                         <span className="">GPay</span>
                       </td>
                       <td className="border border-gray-300 px-2 py-2 text-right font-semibold">
                         &#8377;{" "}{student.paymentDetails?.payments
                           .filter(payment => payment.method === "gpay")
                           .reduce((total, payment) => total + payment.amount, 0)}
                       </td>
                       
                     </tr>
                  }
                  <tr className="bg-gray-100 font-bold">
                    <td
                      className="border border-gray-300 px-2 py-2 text-right"
                      colSpan="4"
                    >
                      Balance Amount
                    </td>
                    <td className="border border-gray-300 text-right px-2 py-2">
                      &#8377;{" "}{student.paymentDetails?.balance}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td
                      className="border border-gray-300 px-2 py-2 text-right"
                      colSpan="4"
                    >
                      Grand Total
                    </td>
                    <td className="border border-gray-300 text-right px-2 py-2">
                      &#8377;{" "}
                      {student.products.reduce((acc, item) => {
                        const price = item.product?.price || item.price || 0;
                        return acc + item.quantity * Number(price);
                      }, 0)}
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

export default StudentInvoice;
