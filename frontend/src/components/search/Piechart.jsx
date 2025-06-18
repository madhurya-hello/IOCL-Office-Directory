import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts"; // Library for rendering charts
import { useSelector, useDispatch } from "react-redux"; // Redux hooks for state management
import Loader from "../shared/Loader"; // Component for displaying loading state

// Component to render a donut chart for employee distribution by division
const PieChart = () => {
  // State and ref hooks
  const chartRef = useRef(null); // Reference to the chart DOM element
  const [selectedDivision, setSelectedDivision] = useState(null); // Tracks selected division
  const [chart, setChart] = useState(null); // Stores the ApexCharts instance
  const [highlightedIndex, setHighlightedIndex] = useState(null); // Tracks highlighted chart segment
  const dispatch = useDispatch(); // Redux dispatch for triggering actions
  const { pieChartData, loading, error } = useSelector(
    (state) => state.employee
  ); // Redux state for chart data

  // Calculate total number of employees
  const totalEmployees = pieChartData.reduce(
    (sum, division) => sum + division.noOfEmployees,
    0
  );

  // Effect to initialize and update the chart
  useEffect(() => {
    if (pieChartData.length === 0 || loading) return; // Skip if no data or loading

    // Chart configuration for ApexCharts
    const getChartOptions = () => {
      return {
        series: pieChartData.map((div) => div.noOfEmployees), // Data for chart segments
        colors: [
          "rgb(255, 99, 132)", // Red
          "rgb(54, 162, 235)", // Blue
          "rgb(75, 192, 192)", // Teal
          "rgb(255, 159, 64)", // Orange
          "rgb(153, 102, 255)", // Purple
          "rgb(255, 205, 86)", // Yellow
        ], // Color palette for chart segments
        chart: {
          height: "100%",
          width: "100%",
          type: "donut", // Chart type
          events: {
            // Handle segment click to highlight and update data
            dataPointSelection: (event, chartContext, config) => {
              const selectedIndex = config.dataPointIndex;
              setSelectedDivision(pieChartData[selectedIndex]); // Set selected division
              setHighlightedIndex(selectedIndex); // Track highlighted segment

              if (chart) {
                // Slightly increase size of selected segment for emphasis
                chart.updateSeries(
                  pieChartData.map((div, index) =>
                    index === selectedIndex
                      ? div.noOfEmployees * 1.1
                      : div.noOfEmployees
                  )
                );
              }
            },
          },
        },
        stroke: {
          colors: ["transparent"], // Remove segment borders
          lineCap: "",
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true, // Show labels in center
                name: {
                  show: true,
                  fontFamily: "Inter, sans-serif",
                  offsetY: 20, // Position label
                },
                total: {
                  showAlways: true,
                  show: true,
                  label: selectedDivision
                    ? selectedDivision.division
                    : "Total Employees", // Dynamic label
                  fontFamily: "Inter, sans-serif",
                  formatter: function (w) {
                    return selectedDivision
                      ? selectedDivision.noOfEmployees.toString()
                      : totalEmployees.toString(); // Display selected or total employees
                  },
                },
                value: {
                  show: true,
                  fontFamily: "Inter, sans-serif",
                  offsetY: -20, // Position value
                  formatter: function (value) {
                    return value; // Display raw value
                  },
                },
              },
              size: "80%", // Donut hole size
            },
          },
        },
        grid: {
          padding: {
            top: -2, // Adjust chart padding
          },
        },
        labels: pieChartData.map((div) => div.division), // Segment labels
        dataLabels: {
          enabled: false, // Disable data labels on segments
        },
        legend: {
          position: "bottom", // Legend position
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: 500,
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: function (value) {
              return value + " employees"; // Tooltip format
            },
          },
        },
        states: {
          active: {
            filter: {
              type: "none", // Disable default hover effects
            },
          },
        },
      };
    };

    // Render chart if container exists
    if (chartRef.current && typeof ApexCharts !== "undefined") {
      const newChart = new ApexCharts(chartRef.current, getChartOptions());
      newChart.render(); // Render the chart
      setChart(newChart); // Store chart instance

      // Cleanup on component unmount
      return () => {
        newChart.destroy();
      };
    }
  }, [pieChartData, loading, selectedDivision]); // Re-run on data, loading, or selection change

  // Reset chart to original state
  const handleRefresh = () => {
    setSelectedDivision(null); // Clear selected division
    setHighlightedIndex(null); // Clear highlighted segment
    if (chart) {
      chart.updateSeries(pieChartData.map((div) => div.noOfEmployees)); // Reset segment sizes
    }
  };

  // Display loader during initial data fetch
  if (loading && pieChartData.length === 0) {
    return <Loader />;
  }

  // Display error if data fetch fails
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Main component render
  return (
    // Container for the chart card
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", // Subtle shadow
        color: "#1f2937",
        padding: "1rem",
        overflow: "hidden",
      }}
    >
      {/* Total Employees Display */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              color: "#6b7280",
            }}
          >
            Total Employees
          </span>
          <span
            style={{
              marginLeft: "0.5rem",
              fontSize: "1.3rem",
              fontWeight: "bold",
              color: "#111827",
            }}
          >
            {totalEmployees.toLocaleString()}
          </span>{" "}
          {/* Formatted total */}
        </div>
      </div>

      {/* Separator */}
      <div
        style={{
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "0.75rem",
        }}
      ></div>

      {/* Chart Header and Refresh Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h5
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#111827",
              paddingRight: "0.25rem",
            }}
          >
            Blood Groups
          </h5>{" "}
          {/* Chart title (mislabeled, should be Divisions) */}
        </div>
        <div>
          <button
            type="button"
            onClick={handleRefresh}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              width: "2rem",
              height: "2rem",
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#111827")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#6b7280")}
            aria-label="Refresh chart"
          >
            {/* Refresh icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 30 30"
            >
              <path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div
        style={{ padding: "1.5rem 0" }}
        id="donut-chart"
        ref={chartRef}
      ></div>

      {/* Footer Separator */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          alignItems: "center",
          borderTop: "1px solid #e5e7eb",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "1.25rem",
          }}
        >
          <div></div>
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(PieChart);
