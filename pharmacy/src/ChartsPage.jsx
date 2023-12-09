import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import './vendor/fontawesome-free/css/all.min.css';
import './css/sb-admin-2.min.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format, isSameMonth } from 'date-fns';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);
import { addMonths, subMonths, differenceInMonths } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ChartsSection = () => {
  const [salesReport, setSalesReport] = useState([]);
  const [filteredSalesReport, setFilteredSalesReport] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDate, setSelectedDate] = useState(null); // Initially set to null
  const [totalSales, setTotalSales] = useState(0);
  const [displayedStartDate, setDisplayedStartDate] = useState(subMonths(new Date(), 23));
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(false);
  const token = localStorage.getItem('adminToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    axios
      .get('http://localhost:3002/adminsales-report', { headers })
      .then((response) => {
        const transformedData = response.data.flatMap((order) => {
          const orderDate = new Date(order.orderDate);

          return order.items.map((item) => ({
            orderDate,
            itemName: item.name,
            quantity: item.quantity,
            price: item.price,
          }));
        });
        console.log(transformedData);
        setSalesReport(transformedData);
        setFilteredSalesReport(transformedData);
      })
      .catch((error) => {
        console.error('Error fetching sales report:', error);
      });
  }, []);

  useEffect(() => {
    const calculatedTotalSales = filteredSalesReport.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    setTotalSales(calculatedTotalSales);
  }, [filteredSalesReport]);

  useEffect(() => {
    const filteredData = salesReport.filter((entry) => {
      const monthMatch = !selectedMonth || isSameMonth(entry.orderDate, new Date(selectedMonth));

      return monthMatch;
    });

    console.log(filteredData);

    setFilteredSalesReport(filteredData);

    const lastMonthInData = new Date(filteredData[0]?.orderDate);
    const lastMonthToShow = subMonths(displayedStartDate, 1);

    const shouldDisableNextButton = isSameMonth(lastMonthToShow, new Date());
    setIsNextButtonDisabled(shouldDisableNextButton);
  }, [selectedMonth, displayedStartDate, salesReport]);

  useEffect(() => {
    // Filter data based on the selected date if a date is selected
    if (selectedDate) {
      const filteredData = salesReport.filter((entry) => {
        return isSameMonth(entry.orderDate, selectedDate);
      });

      setFilteredSalesReport(filteredData);
    }
  }, [selectedDate, salesReport]);

  const allMonths = Array.from(
    { length: 24 },
    (_, index) => format(addMonths(displayedStartDate, index), 'yyyy-MM')
  );

  const chartData = {
    labels: allMonths,
    datasets: [
      {
        label: 'Total Quantity of Orders',
        data: allMonths.map((month) =>
          filteredSalesReport
            .filter((entry) => isSameMonth(entry.orderDate, new Date(month)))
            .reduce((total, entry) => total + entry.quantity, 0)
        ),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Perform any additional actions based on the selected date
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        labels: allMonths,
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Orders',
        },
      },
    },
    indexAxis: 'x',
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleViewReport = () => {
    console.log('View Report clicked');
  };

  const handlePreviousMonths = () => {
    setDisplayedStartDate((prevStartDate) => subMonths(prevStartDate, 24));
    setIsPreviousClicked(true);
  };

  const handleNextMonths = () => {
    setDisplayedStartDate((prevStartDate) => addMonths(prevStartDate, 24));
    setIsPreviousClicked(false); // Reset the flag when next is clicked
  };
  const [isPreviousClicked, setIsPreviousClicked] = useState(false);

  useEffect(() => {
    // Disable the next button initially
    setIsNextButtonDisabled(true);
  }, []);
  useEffect(() => {
    const lastMonthInData = new Date(filteredSalesReport[0]?.orderDate);
    const lastMonthToShow = subMonths(displayedStartDate, 1);

    // Disable the next button only if the last month to show is the current month
    const shouldDisableNextButton = isSameMonth(lastMonthToShow, new Date()) || !isPreviousClicked;
    setIsNextButtonDisabled(shouldDisableNextButton);
  }, [selectedMonth, displayedStartDate, salesReport, isPreviousClicked]);

  const filterMonthRange = Array.from(
    { length: 48 },
    (_, index) => format(addMonths(new Date(), index - 36), 'yyyy-MM')
  );

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Charts</h1>
      <p className="mb-4">Dummy data is used in this section for illustration purposes.</p>

      <div className="row">
        <div className="col-xl-12 col-lg-12">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="d-flex justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">Bar Chart</h6>
                <div>
                  <label htmlFor="monthFilter" className="mr-2">
                    Select Date:
                  </label>
                  <DatePicker
                    id="monthFilter"
                    className="form-control"
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    filterDate={(date) => date <= new Date()} // Only allow dates up to the current date
                  />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-bar">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <button
                  className="btn btn-primary"
                  onClick={handlePreviousMonths}
                  title="Previous 24 Months"
                >
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Previous
                </button>
                <div>
                  <button
                    className="btn btn-primary ml-2"
                    onClick={handleNextMonths}
                    disabled={isNextButtonDisabled}
                    title="Next 24 Months"
                  >
                    Next <FontAwesomeIcon icon={faArrowAltCircleRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsSection;