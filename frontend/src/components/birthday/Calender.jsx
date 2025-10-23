import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import EmpDet from "./EmpDet";
import DateDropdown from "./DateDropdown";
import { generateProfileImage } from "../helpers/profileUtils.js";
import { motion, AnimatePresence } from "framer-motion";
import { CircularProgress } from "@mui/material";

/**
 * Main Calendar component that displays a monthly view with birthdays.
 * Includes month navigation, date selection, and employee details panel.
 */
const Calendar = ({ onEmployeeClick }) => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date()); // Currently viewed month/year
  const [selectedDate, setSelectedDate] = useState(null); // Selected day
  const [showDatePicker, setShowDatePicker] = useState(false); // Month dropdown visibility
  const [birthdayData, setBirthdayData] = useState([]); // Birthday data from API
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const dropdownRef = useRef(null); // Ref for dropdown container
  const [hasAnimated, setHasAnimated] = useState(false); // Animation state
  const headerRef = useRef(null); // Ref for header element

  // IntersectionObserver for header animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, [hasAnimated]);

  // Click outside handler for date picker dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        const monthDisplayButton = document.querySelector(
          ".month-display-button"
        );
        if (monthDisplayButton && !monthDisplayButton.contains(event.target)) {
          setShowDatePicker(false);
        }
      }
    };

    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  // Fetch birthdays for the current month on mount
  useEffect(() => {
    const today = new Date().getDate();
    setSelectedDate(today);
    fetchBirthdays(currentDate.getMonth() + 1);
  }, []);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Fetches birthday data from API for given month
  const fetchBirthdays = async (month) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/employees/getEmpByMonth`,
        {
          params: { month },
        }
      );
      setBirthdayData(response.data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching birthdays:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filters birthday data for specific date
  const getBirthdaysForDate = (date) => {
    if (!birthdayData || !Array.isArray(birthdayData)) return [];

    const day = date;
    const month = currentMonth + 1;

    return birthdayData.filter((person) => {
      if (!person?.birthDate) return false;
      try {
        const [birthYear, birthMonth, birthDay] = person.birthDate
          .split("-")
          .map(Number);
        return birthDay === day && birthMonth === month;
      } catch (e) {
        console.error("Error parsing birth date:", e);
        return false;
      }
    });
  };

  // Renders the calendar grid with days and birthdays
  const renderCalendar = () => {
    if (loading) {
      return (
        <div className="loading-overlay">
          <CircularProgress size={40} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>Error Loading Birthdays: {error}</p>
        </div>
      );
    }

    const calendar = [];
    let day = 1;

    // Generate 6 weeks of calendar (6 rows)
    for (let i = 0; i < 6; i++) {
      const week = [];
      // 7 days per week (columns)
      for (let j = 0; j < 7; j++) {
        // Empty cells before first day of month or after last day
        if ((i === 0 && j < firstDayOfMonth) || day > daysInMonth) {
          week.push(
            <div key={`empty-${j}-${i}`} className="calendar-day empty"></div>
          );
        } else {
          const date = day;
          const isSelected = selectedDate === date;
          const isToday =
            new Date().getDate() === date &&
            new Date().getMonth() === currentMonth &&
            new Date().getFullYear() === currentYear;
          const birthdays = getBirthdaysForDate(date);
          week.push(
            <div
              key={`day-${day}`}
              className={`calendar-day ${isSelected ? "selected" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => handleDateClick(date)}
            >
              <div className="date-number">{date}</div>
              {isToday && !isSelected && (
                <div className="today-indicator"></div>
              )}

              {/* Display birthday avatars (max 3) */}
              {birthdays.length > 0 && (
                <div className="birthday-images">
                  {birthdays.slice(0, 3).map((person, idx) => (
                    <img
                      key={idx}
                      src={generateProfileImage(person.name, 40)}
                      alt={person.name}
                      className="birthday-avatar"
                      style={{ left: `${idx * 25}px` }}
                    />
                  ))}
                  {/* Show +count if more than 3 birthdays */}
                  {birthdays.length > 3 && (
                    <div className="birthday-extra">
                      +{birthdays.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
          day++;
        }
      }
      calendar.push(
        <div key={`week-${i}`} className="calendar-week">
          {week}
        </div>
      );
    }
    return calendar;
  };

  // Date selection handler
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Navigation handlers
  const handlePrevMonth = () => {
    const newDate = new Date(currentYear, currentMonth - 1, 1);
    setCurrentDate(newDate);
    setShowDatePicker(false);
    fetchBirthdays(newDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentYear, currentMonth + 1, 1);
    setCurrentDate(newDate);
    setShowDatePicker(false);
    fetchBirthdays(newDate.getMonth() + 1);
  };

  // Month/year picker toggle
  const handleMonthYearClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  // Month selection from dropdown
  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    setCurrentDate(newDate);
    setShowDatePicker(false);
    fetchBirthdays(monthIndex + 1);
  };

  return (
    <div className="calendar-page-container">
      <h1
        className="calendar-heading"
        ref={headerRef}
        style={{
          transform: hasAnimated ? "translateY(-50px)" : "translateY(0)",
          opacity: hasAnimated ? 1 : 0,
          transition: "transform 0.5s ease-out , opacity 0.5s ease-out ",
        }}
      >
        Birthday Buzz - Pick a Date to See!
      </h1>
      <div className="calendar-outer-wrapper">
        <div className="calendar-wrapper">
          <div className="calendar-content-container">
            {/* Calendar container */}
            <div className="calendar-container">
              {/* Month navigation header */}
              <div className="calendar-header">
                <button className="month-nav" onClick={handlePrevMonth}>
                  &lt;
                </button>
                <button
                  className="month-display-button"
                  onClick={handleMonthYearClick}
                >
                  {monthNames[currentMonth]}
                </button>
                <button className="month-nav" onClick={handleNextMonth}>
                  &gt;
                </button>
              </div>

              {/* Month dropdown picker */}
              {showDatePicker && (
                <div className="date-picker-dropdown" ref={dropdownRef}>
                  <DateDropdown
                    currentMonth={currentMonth}
                    onMonthSelect={handleMonthSelect}
                  />
                </div>
              )}

              {/* Calendar grid */}
              <div className="calendar-grid">
                <div className="calendar-week days-header">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="calendar-day-header">
                      {day}
                    </div>
                  ))}
                </div>
                {/* Calendar days */}
                {renderCalendar()}
              </div>
            </div>

            <EmpDet
              birthdays={
                selectedDate ? getBirthdaysForDate(selectedDate) : null
              }
              onEmployeeClick={onEmployeeClick}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .calendar-page-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .calendar-heading {
          text-align: center;
          margin: 1rem 0 2rem 0;
          color: #333;
          font-size: 5rem;
          font-family: "Underdog", system-ui;
          font-weight: 400;
          width: 100%;
        }

        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-message {
          color: #e74c3c;
          padding: 1rem;
          text-align: center;
        }

        .calendar-outer-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          position: relative;
          top: -3.5rem;
        }

        .calendar-wrapper {
          position: relative;
          width: 100%;
          max-width: 120rem;
          padding: 1rem;
        }

        .calendar-content-container {
          display: flex;
          gap: 2rem;
          width: 100%;
          align-items: stretch;
        }

        .calendar-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 1.5rem;
          position: relative;
          animation: moveDown 0.5s ease-out;
          flex: 2;
          height: 100%;
        }

        @keyframes moveDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .date-picker-dropdown {
          position: absolute;
          top: 70px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .calendar-header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
          gap: 1.5rem;
        }

        .month-display-button {
          background: rgb(21, 110, 226);
          padding: 0.5rem 1.5rem;
          border-radius: 14px;
          font-weight: bold;
          font-size: 1.4rem;
          color: white;
          text-align: center;
          width: 14%;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .month-display-button:hover {
          background: rgb(16, 90, 185);
          transform: scale(1.05);
        }

        .month-nav {
          background: none;
          border: none;
          font-size: 1.9rem;
          cursor: pointer;
          color: #555;
          padding: 0.5rem;
          transition: all 0.2s ease;
        }

        .month-nav:hover {
          color: #2196f3;
          transform: scale(1.2);
        }

        .calendar-grid {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
        }

        .calendar-week {
          display: flex;
          min-height: 150px;
        }

        .calendar-day-header {
          flex: 1;
          padding: 1rem;
          text-align: center;
          font-weight: bold;
          font-size: 1rem;
          color: #666;
          background: #f9f9f9;
        }

        .calendar-day {
          flex: 1;
          min-height: 150px;
          padding: 0.8rem;
          border: 1px solid #f0f0f0;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }

        .calendar-day:hover {
          background: #f5f5f5;
        }

        .calendar-day.selected {
          background: #e3f2fd;
        }

        .calendar-day.empty {
          background: #fafafa;
          cursor: default;
        }

        .date-number {
          font-weight: bold;
          margin-bottom: 0.9rem;
          font-size: 1rem;
        }

        .birthday-images {
          display: flex;
          margin-top: 0.5rem;
          position: relative;
          height: 30px;
        }

        .birthday-avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: 2px solid white;
          object-fit: cover;
          position: absolute;
        }

        .birthday-extra {
          position: absolute;
          left: 85px;
          top: 8px;
          background: rgb(63, 62, 62);
          color: white;
          font-size: 1.1rem;
          padding: 3px 7px;
          border-radius: 15px;
          white-space: nowrap;
        }

        .calendar-day.today {
          position: relative;
        }

        .today-indicator {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 6px;
          height: 6px;
          background-color: #2196f3;
          border-radius: 50%;
        }

        @media (max-width: 1024px) {
          .calendar-content-container {
            flex-direction: column;
          }
          .month-display-button {
            width: auto;
            padding: 0.5rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;
