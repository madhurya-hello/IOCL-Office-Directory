
/**
 * A dropdown component for selecting months in a calendar view.
 * Displays all 12 months in a 3-column grid layout.
 * 
 * @param {number} currentMonth - The currently selected month (0-11)
 * @param {function} onMonthSelect - Callback when a month is selected
 */

const DateDropdown = ({ currentMonth, onMonthSelect }) => {
   // Container styling for the dropdown
  const containerStyle = {
    width: '300px',
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
    marginTop: '1.5rem',
  };

  // Styling for the content area inside the dropdown
  const tabContentStyle = {
    padding: '1rem',
    backgroundColor: 'white',
  };

  // Dynamic styling for list items based on selection state
  const listItemStyle = (isSelected) => ({
    padding: '0.5rem',
    cursor: 'pointer',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
    backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6',
    color: isSelected ? 'white' : 'inherit',
    textAlign: 'center',
    transition: 'all 0.2s',
  });

  // Array of all month names
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December',
  ];

  return (
    <div style={containerStyle}>
      <div style={tabContentStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {months.map((month, index) => (
            <div 
              key={month} 
              style={listItemStyle(index === currentMonth)}
              onClick={() => onMonthSelect(index)}
            >
              {month.substring(0, 3)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateDropdown;