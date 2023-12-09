// SalesReport.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

function SalesReport() {
  const [salesReport, setSalesReport] = useState([]);
  const [filteredSalesReport, setFilteredSalesReport] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [totalSales, setTotalSales] = useState(0);
  const token = localStorage.getItem('pharmacistToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get('http://localhost:3002/sales-report', { headers })
      .then((response) => {
        const transformedData = response.data.orders
        .filter(order => order.status !== 'Processing').flatMap(order => {
          const orderDate = format(new Date(order.orderDate), 'yyyy-MM-dd');

          // Create a new entry for each item in the order with the same date
          return order.items.map(item => ({
            orderDate,
            itemName: item.name,
            quantity: item.quantity,
            price: item.price,
          }));
        }); 
        const trimmedTransformedData = transformedData.map(item => ({
          ...item,
          itemName: item.itemName.trim(),
        }));
        const filteredTransformedData = trimmedTransformedData.filter(item => response.data.username.includes(item.itemName));
        setSalesReport(filteredTransformedData);
        setFilteredSalesReport(response.data.orders);
      })
      .catch((error) => {
        console.error('Error fetching sales report:', error);
      });
  }, []);

  useEffect(() => {
    // Calculate total sales for all medicines
    const calculatedTotalSales = filteredSalesReport.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    setTotalSales(calculatedTotalSales);
  }, [filteredSalesReport]);

  useEffect(() => {
    // Apply filtering based on selectedMedicine and selectedDate
    const filteredData = salesReport.filter(entry => {
      const medicineMatch = !selectedMedicine || entry.itemName.includes(selectedMedicine);
      const dateMatch = !selectedDate || entry.orderDate === selectedDate;
      const monthMatch = !selectedMonth || entry.orderDate.startsWith(selectedMonth);

      console.log(`Medicine: ${medicineMatch}, Date: ${dateMatch}, Month: ${monthMatch}`);

      return medicineMatch && dateMatch && monthMatch;
    });

    console.log(filteredData); // Log the filtered data

    setFilteredSalesReport(filteredData);
  }, [selectedMedicine, selectedDate, selectedMonth, salesReport]);




  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  };

  const thStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '15px',
    textAlign: 'center', // Updated to center-align
  };

  const tdStyle = {
    padding: '15px',
    borderBottom: '1px solid #ddd',
    textAlign: 'center', // Updated to center-align
  };

  const containerStyle = {
    textAlign: 'center',
    marginTop: '20px',
  };

  const titleStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '20px',
    fontSize: '24px',
    marginBottom: '10px',
  };

  const filterContainerStyle = {
    textAlign: 'left',
    marginBottom: '20px',
    marginLeft: '30px',
    marginRight: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const filterLabelStyle = {
    marginRight: '20px',
    fontSize: '16px',
  };

  const filterInputStyle = {
    padding: '10px',
    fontSize: '14px',
    width: '200px',
  };

  // ...

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Medicines Sales Report</h1>

      <div style={filterContainerStyle}>
        <div>
          <label style={filterLabelStyle}>Filter by Medicine:</label>
          <input
            type="text"
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
            style={filterInputStyle}
          />
        </div>

        <div>
          <label style={filterLabelStyle}>Filter by Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={filterInputStyle}
          />
        </div>

        <div>
          <label style={filterLabelStyle}>Filter by Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={filterInputStyle}
          />
        </div>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr >
            <th style={thStyle}>Order Date</th>
            <th style={thStyle}>Medicine Name</th>
            <th style={thStyle}>Quantity Sold</th>
            <th style={thStyle}>Unit Price</th>
            <th style={thStyle}>Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {
            filteredSalesReport.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{new Date(item.orderDate).toLocaleDateString()}</td>
                  <td style={tdStyle}>{item.itemName}</td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={tdStyle}>${item.price}</td>
                  <td style={tdStyle}>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))
            }
          <tr>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}></td>
            <td style={tdStyle}><strong>Total Sales</strong></td>
            <td style={tdStyle}>
              <strong>${totalSales.toFixed(2)}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SalesReport;

