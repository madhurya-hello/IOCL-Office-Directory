import React, { useEffect } from "react";
import ApexCharts from "apexcharts"; // ApexCharts library for rendering charts
import { useSelector, useDispatch } from "react-redux"; // Redux hooks
import { fetchLineChartData } from "../../store/employeeSlice"; // Redux action to fetch chart data
import Loader from "../shared/Loader"; // Loading indicator component

// Component for rendering a line chart of employee gender distribution by function
const LineChart = () => {
  const dispatch = useDispatch(); // Redux dispatch
  const { lineChartData, loading, error } = useSelector(
    (state) => state.employee
  ); // Redux state

  // Render chart when lineChartData is available
  useEffect(() => {
    if (lineChartData.length === 0 || loading) return;

    // Extract function names for x-axis categories
    const categories = lineChartData.map((item) => item.function);

    // Extract male and female counts for series data
    const maleData = lineChartData.map((item) => item.noOfMales);
    const femaleData = lineChartData.map((item) => item.noOfFemales);

    // ApexCharts configuration
    const options = {
      xaxis: {
        show: true,
        categories: categories,
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            fill: "#6B7280",
          },
          rotate: -45,
          rotateAlways: true,
          hideOverlappingLabels: false,
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
        title: {
          text: "Functions",
          offsetY: 0,
          style: {
            fontSize: "1rem",
            fontWeight: 800,
            fontFamily: "Inter, sans-serif",
            color: "#6B7280",
          },
        },
      },
      yaxis: {
        show: true,
        labels: {
          show: true,
          style: {
            fontFamily: "Inter, sans-serif",
            fontSize: "0.8rem",
            fontWeight: 600,
            fill: "#6B7280",
          },
          formatter: function (value) {
            return value;
          },
        },
        title: {
          text: "Number of Employees",
          offsetX: 0,
          style: {
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            color: "#6B7280",
          },
        },
      },
      series: [
        {
          name: "Male Employees",
          data: maleData,
          color: "#1A56DB",
        },
        {
          name: "Female Employees",
          data: femaleData,
          color: "#E74694",
        },
      ],
      chart: {
        sparkline: {
          enabled: false,
        },
        height: "100%",
        width: "100%",
        type: "area",
        fontFamily: "Inter, sans-serif",
        dropShadow: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        stacked: false,
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const functionName = w.globals.categoryLabels[dataPointIndex];
          const maleCount = series[0][dataPointIndex];
          const femaleCount = series[1][dataPointIndex];

          return `
            <div class="apexcharts-tooltip-custom">
              <div class="function-name">${functionName}</div>
              <div class="data-row">
                <span class="legend-male"></span>
                Male: ${maleCount} employees
              </div>
              <div class="data-row">
                <span class="legend-female"></span>
                Female: ${femaleCount} employees
              </div>
            </div>
          `;
        },
        style: {
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.7,
          opacityTo: 0.3,
          shadeIntensity: 0.9,
          gradientToColors: ["#1A56DB", "#E74694"],
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 4,
        curve: "smooth",
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "right",
        fontSize: "16rem", // Likely a typo, should be '16px'
      },
      grid: {
        show: true,
        borderColor: "rgba(107, 104, 104, 0.42)",
        strokeDashArray: 3,
      },
      markers: {
        size: 5,
        hover: {
          size: 7,
        },
      },
    };

    // Render chart if ApexCharts is available
    if (typeof ApexCharts !== "undefined") {
      const chart = new ApexCharts(
        document.getElementById("labels-chart"),
        options
      );
      chart.render();

      // Cleanup chart on component unmount
      return () => {
        chart.destroy();
      };
    }
  }, [lineChartData, loading]);

  // Show loader during initial data fetch
  if (loading && lineChartData.length === 0) {
    return <Loader />;
  }

  // Display error if present
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        padding: "0.5rem",
      }}
    >
      {/* Chart container */}
      <div
        id="labels-chart"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
      {/* Inline styles for tooltip */}
      <style jsx>{`
        .apexcharts-tooltip-custom {
          padding: 8px 12px;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .apexcharts-tooltip-custom .function-name {
          font-weight: bold;
          margin-bottom: 6px;
          color: #333;
        }
        .apexcharts-tooltip-custom .data-row {
          display: flex;
          align-items: center;
          margin: 4px 0;
        }
        .apexcharts-tooltip-custom .legend-male {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: #1a56db;
          margin-right: 8px;
          border-radius: 3px;
        }
        .apexcharts-tooltip-custom .legend-female {
          display: inline-block;
          width: 12px;
          height: 12px;
          background: #e74694;
          margin-right: 8px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default LineChart;
