import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../apis/orderApi';
import ExcelJS from 'exceljs';
import Invoice from '../Invoice';

const Report = () => {
  const [order, setOrder] = useState('');
  const [orders, setOrders] = useState([]);
  // const [products, setProducts] = useState([]);
  const [genInvoice,setGenInvoice] = useState(false)

  const handleDownload = async () => {
    if (!order) {
      alert('Please select an order to download the report.');
      return;
    }

    // Find the selected order
    const selectedOrder = orders.find((o) => o._id === order);
    if (!selectedOrder) {
      alert('Selected order not found.');
      return;
    }

    // Create workbook
    const workbook = new ExcelJS.Workbook();


    // Add Student List Sheet
    const studentsSheet = workbook.addWorksheet('Student List');
    studentsSheet.columns = [
      { header: 'Student Name', key: 'name', width: 20 },
      { header: 'Class', key: 'class', width: 10 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'House', key: 'house', width: 15 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'School', key: 'school', width: 15 },
      { header: 'Payment Method', key: 'method', width: 15 },
      { header: 'Total Price', key: 'totalPrice', width: 15 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];

    // Add Product Work Sheet
    const productsSheet = workbook.addWorksheet('Product Work');
    productsSheet.columns = [
      // { header: 'Order ID', key: 'orderId', width: 30 },
      { header: 'House', key: 'house', width: 30 },
      { header: 'Product', key: 'product', width: 30 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Measurement', key: 'measurement', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      // { header: 'Price', key: 'price', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];
    const productMaps = []
    // Populate Students Sheet
    selectedOrder.students?.forEach((student) => {
      studentsSheet.addRow({
        name: student.name,
        class: student.class,
        gender : student.gender,
        house: student.house,
        phone: student.phone,
        school: selectedOrder.industry.name,
        method: student.paymentDetails?.method || 'N/A',
        totalPrice: student.paymentDetails?.totalPrice || 0,
        createdAt: new Date(student.createdAt).toLocaleString(),
      });

      student.products.forEach((product) => {
        const isCustomProduct = product.custom;
        const productName = isCustomProduct ? "Custom Product" : product.product?.name || "Unknown Product";
        const productPrice = product.price || product.product?.price || 0;

        // Find an existing entry with the same product name and house
        const existingProductIndex = productMaps.findIndex(
          (item) =>
          {
            if(item.product === "Custom Product") return ;
            item.house === student.house &&
            item.product === productName
          }
        );

        if (existingProductIndex === -1) {
          // Add a new entry if not found
          productMaps.push({
            house: student.house,
            product: productName,
            quantity: product.quantity, 
            measurement: product.measurement || "-",
            description: product.description || "-",
            price: productPrice,
            createdAt: new Date(student.createdAt).toLocaleString(),
          });
        } else {
            productMaps[existingProductIndex].quantity += product.quantity; // Update quantity for non-custom products
        }
      });

    });
    productMaps.sort((a, b) => a.house.localeCompare(b.house));
    productMaps.forEach((product) => {
      productsSheet.addRow(product);
    });
    // Apply formatting for all sheets
    [ studentsSheet, productsSheet].forEach((sheet) => {
      sheet.getRow(1).font = { bold: true };
      sheet.columns.forEach((column) => {
        column.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });

    // Generate Excel file and trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Order_${selectedOrder._id}_${Date.now()}.xlsx`;
    link.click();
  };
  
  useEffect(() => {
    getAllOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Error fetching orders:', err));
  }, []);

  return (
    <div className="section mx-auto mt-10 max-w-4xl space-y-8">
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Generate Report</h1>

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
            className="w-full border rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Choose an order</option>
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.branch?.name} ({o.industry?.name})
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleDownload}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            Download Report
          </button>
          <button
            onClick={() => setGenInvoice(true)}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>

    {genInvoice && (
      <div className="bg-white p-6 rounded-lg">
        <Invoice
          selectedOrder={orders.find((o) => o._id === order)}
        />
      </div>
    )}
  </div>
  );
};

export default Report;
