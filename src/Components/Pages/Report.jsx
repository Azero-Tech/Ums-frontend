import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../apis/orderApi";
import ExcelJS from "exceljs";
import Invoice from "../Invoice";
import StudentInvoices from "../StudentsInvoice";
import { customDate } from "../../utils/dateFormat";

const Report = () => {
  const [order, setOrder] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [genInvoice, setGenInvoice] = useState(false);
  const [getAllInvoices, setGetAllInvoices] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getAllOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Error fetching orders:", err));
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Ensure full-day coverage
      
        // Check if any student has a payment date within the range
        const hasValidPayment = order.students?.some((student) => {
          if (!student.paymentDetails?.date) return false;
          const paymentDate = new Date(student.paymentDetails.date);
          return paymentDate >= start && paymentDate <= end;
        });
      
        return hasValidPayment;
      });
      
      
      setFilteredOrders(filtered);
    }
  }, [startDate, endDate, orders]);

  const handleDownload = async () => {
    if (!order) {
      alert("Please select an order to download the report.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); 
    // Find the selected order
    const selectedOrder = orders.find((o) => o._id === order);
    if (!selectedOrder) {
      alert("Selected order not found.");
      return;
    }
    const filteredStudents = selectedOrder?.students?.filter((student) => {
      if (!student.paymentDetails?.date) return false; // Skip students with no payment date
      const paymentDate = new Date(student.paymentDetails.date);
      return paymentDate >= start && paymentDate <= end;
    }) || []; 
    selectedOrder.students = filteredStudents
    // Create workbook
    const workbook = new ExcelJS.Workbook();

    // Add Student List Sheet
    const studentsSheet = workbook.addWorksheet("Student List");
    studentsSheet.columns = [
      { header: "Roll No", key: "rollNo", width: 20 },
      { header: "Name", key: "name", width: 20 },
      { header: "Class", key: "class", width: 10 },
      { header: "Division", key: "division", width: 20 },
      { header: "Gender", key: "gender", width: 10 },
      { header: "House", key: "house", width: 15 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "School", key: "school", width: 15 },
      { header: "Payment Method", key: "method", width: 15 },
      { header: "Total Price", key: "totalPrice", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    // Add Product Work Sheet
    const productsSheet = workbook.addWorksheet("Product Work");
    productsSheet.columns = [
      // { header: 'House', key: 'house', width: 30 },
      { header: "Product", key: "product", width: 30 },
      { header: "Quantity", key: "quantity", width: 10 },
      { header: "Measurement", key: "measurement", width: 30 },
      { header: "Description", key: "description", width: 50 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    // Add Summary Sheet
    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.columns = [
      { header: "Payment Mode", key: "category", width: 30 },
      { header: "Total Amount", key: "total", width: 20 },
    ];

    const productMaps = [];
    let totalCash = 0;
    let totalOnline = 0;
    let overallTotal = 0;
    let totalCG = 0;

    // Populate Students Sheet
    selectedOrder.students?.forEach((student) => {
      const paymentMethod = student.paymentDetails?.method || "N/A";
      const totalPrice = student.paymentDetails?.totalPrice || 0;

      // Add student data
      studentsSheet.addRow({
        rollNo: student.rollNo,
        name: student.name,
        class: student.class,
        division : student.division,
        gender: student.gender,
        house: student.house,
        phone: student.phone,
        school: selectedOrder.industry.name,
        method: paymentMethod,
        totalPrice,
        createdAt: new Date(student.createdAt).toLocaleString(),
      });

      // Update totals
      if (paymentMethod.toLowerCase() === "cash"||paymentMethod.toLowerCase() === "balance") {
        totalCash += totalPrice;
      }
      if (paymentMethod.toLowerCase() === "gpay" || paymentMethod.toLowerCase() === "online") {
        totalOnline += totalPrice;
      }
      if(paymentMethod.toLowerCase() === "cash & gpay"){
        totalCG += totalPrice;
      }
      // if(paymentMethod.toLowerCase() !== "balance"){
        overallTotal += totalPrice;
      // }

      student.products.forEach((product) => {
        const isCustomProduct = product.custom;
        const productName = isCustomProduct
          ? "Custom Product"
          : product.product?.name || "Unknown Product";
        const productPrice = product.price || product.product?.price || 0;

        // Find an existing entry with the same product name and house
        const existingProductIndex = productMaps.findIndex(
          (it) => it.product === productName && productName !== "Custom Product"
        );
        if (existingProductIndex === -1) {
          productMaps.push({
            // house: student.house,
            product: productName,
            quantity: product.quantity,
            measurement: product.measurement || "-",
            description: product.description || "-",
            price: productPrice,
            createdAt: new Date(student.paymentDetails?.date).toLocaleString(),
          });
        } else {
          productMaps[existingProductIndex].quantity += product.quantity;
        }
      });
    });

    // Sort Products Alphabetically by House & Product
    productMaps.sort((a, b) => a.product.localeCompare(b.product));

    // Populate Product Sheet
    productMaps.forEach((product) => {
      productsSheet.addRow(product);
    });

    // Populate Summary Sheet
    summarySheet.addRow({
      category: "Total (Cash Payments)",
      total: totalCash,
    });
    summarySheet.addRow({
      category: "Total (Online Payments)",
      total: totalOnline,
    });
    summarySheet.addRow({
      category: "Total (Cash & Gpay Payments)",
      total: totalCG,
    });
    // summarySheet.addRow({
    //   category: "Total Balance",
    //   total: totalBalance,
    // });
    summarySheet.addRow({ category: "Overall Total", total: overallTotal });

    // Apply formatting for all sheets
    [studentsSheet, productsSheet, summarySheet].forEach((sheet) => {
      sheet.getRow(1).font = { bold: true };
      sheet.columns.forEach((column) => {
        column.alignment = { vertical: "middle", horizontal: "center" };
      });
    });

    // Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Order_${selectedOrder._id}_${Date.now()}.xlsx`;
    link.click();
  };

  return (
    <div className="section mx-auto mt-10 max-w-xl space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Generate Report
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="order"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Order
            </label>
            <select
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full border rounded-lg py-2 px-4"
            >
              <option value="" disabled>
                Choose an order
              </option>
              {filteredOrders.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.branch?.name} ({o.industry?.name})
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-between space-x-4">
            <div className=" w-full">
              <label
                htmlFor="startdate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border rounded-lg w-full py-2 px-4"
              />
            </div>
            <div className=" w-full">
              <label
                htmlFor="enddate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border rounded-lg w-full py-2 px-4"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleDownload}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
            >
              Download Report
            </button>
            <button
              onClick={() => setGenInvoice(true)}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Download Invoice
            </button>
            <button
              onClick={() => setGetAllInvoices(true)}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
            >
              Download Students Invoices
            </button>
          </div>
        </div>
      </div>

      {genInvoice && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 z-50">
          <div className="w-full mx-auto h-full overflow-y-auto">
            <Invoice
              selectedOrder={orders.find((o) => o._id === order)}
              setGenInvoice={setGenInvoice}
            />
          </div>
        </div>
      )}
      {getAllInvoices && (
        <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 z-50">
          <div className="w-full mx-auto h-full overflow-y-auto">
            <StudentInvoices
              students={orders.find((o) => o._id === order).students}
              setShowInvoice={setGetAllInvoices}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
