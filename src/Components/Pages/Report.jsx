import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../apis/orderApi';
import ExcelJS from 'exceljs';
import { getAllSizes } from '../../apis/sizeApi';

const Report = () => {
  const [order, setOrder] = useState('');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

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

      // Populate Products Sheet
      student.products?.forEach((product) => {
        const matchedProduct = products.find((pro) => pro._id === product.product);
        const productName = matchedProduct ? matchedProduct.name : "Custom Product";
    
        // Unique key combining house and product name
        const houseProductKey = `${student.house}-${productName}`;
    
        // Check if the product already exists for the same house
        const existingProductIndex = productMaps.findIndex(
          (item) => item.house === student.house && item.product === productName
        );
    
        if (existingProductIndex === -1) {
          // If product doesn't exist, add a new entry
          productMaps.push({
            // orderId: selectedOrder._id,
            house: student.house,
            product: productName,
            quantity: product.quantity,
            measurement: product.measurement || "-",
            description: product.description || "-",
            createdAt: new Date(student.createdAt).toLocaleString(),
          });
        } else {
          // If product exists, increase the quantity
          productMaps[existingProductIndex].quantity += product.quantity;
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
    getAllSizes().then((res)=>{
      setProducts(res.data)
    })
  }, []);

  return (
    <div className="section mx-auto max-w-md mt-10 space-y-4">
      <div>
        <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
          Order
        </label>
        <select
          id="order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border rounded-lg py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select an order</option>
          {orders.map((o) => (
            <option key={o._id} value={o._id}>
              {o.branch?.name} ({o.industry?.name})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleDownload}
        className="w-full px-4 py-2 text-white bg-primary rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Download Report
      </button>
    </div>
  );
};

export default Report;
