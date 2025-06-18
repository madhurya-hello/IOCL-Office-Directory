import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import ReqTable from "../components/request/ReqTable";
import axios from "axios";
import { useDispatch } from "react-redux";
import { decrementRequestCount } from "../store/employeeSlice";
import EditNoteIcon from "@mui/icons-material/EditNote";

// Main container with gradient background
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  // background: linear-gradient(135deg, #f5f7fa 0%, rgb(183, 214, 238) 100%);
  background: linear-gradient(
    135deg,
    rgb(225, 236, 245),
    rgb(212, 233, 248) 100%
  );

  padding: 30px;
  box-sizing: border-box;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", sans-serif;
  overflow-y: hidden;
  /* Ensure modal appears above other content */
  position: relative;
  z-index: 1;
`;
// Header card with search functionality
const HeaderCard = styled(motion.div)`
  width: 95%;
  height: 80px;
  margin: 0 auto 1.7rem auto;
  background-color: rgb(255, 255, 255);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px;
  margin-left: 7rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 4;
  &:hover {
    z-index: 6;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;
// Table container with scroll
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 90%;
`;

// Search input component
const TableCard = styled.div`
  width: 95%;
  height: 83vh;
  margin: 0 auto 25px auto;
  background-color: white;
  border-radius: 12px;

  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-left: 7rem;
  transition: all 0.3s ease;
  overflow-y: auto;
  scrollbar-width: thin;
  position: relative;
  z-index: 5;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  }
`;

// Search input component
const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 0 12px;
  flex-grow: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    border-color: #2a88d4;
    box-shadow: 0 2px 12px rgba(42, 136, 212, 0.1);
  }
`;
// Search filter dropdown
const SearchByDropdown = styled.div`
  position: relative;
  margin-left: 10px;
  z-index: 100;
`;
// Dropdown button
const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.27);
  background-color: white;
  color: #4b5563;
  font-size: 1.2rem;
  cursor: pointer;
`;
// Dropdown menu
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 6;
  width: 150px;
  margin-top: 5px;
`;
// Dropdown items
const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  background-color: ${(props) => (props.active ? "#f3f4f6" : "transparent")};

  &:hover {
    background-color: #f3f4f6;
  }
`;

const RequestPage = () => {
  const dispatch = useDispatch();
  // Request data state
  const [requests, setRequests] = useState([]);

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  // UI states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Request data states
  const [newData, setNewData] = useState(null);
  const [reqMessage, setReqMessage] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Fetches requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/employees/requestsData"
        );
        setRequests(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

  // Approves a request and updates employee data
  const handleApprove = async (requestId, empId) => {
    setIsLoading(true);
    try {
      let dataToUpdate = newData;

      if (!dataToUpdate) {
        try {
          const response = await axios.get(
            `http://localhost:8080/api/employees/requestsDataSpecific?requestId=${requestId}`
          );
          dataToUpdate = response.data;
          setNewData(dataToUpdate);
        } catch (fetchError) {
          console.error("Error fetching request data:", fetchError);
          throw new Error("Failed to fetch request data");
        }
      }

      const updateResponse = await axios.put(
        `http://localhost:8080/api/employees/updateEmployee?id=${empId}`,
        dataToUpdate,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (updateResponse.status === 200) {
        const statusResponse = await axios.post(
          "http://localhost:8080/api/employees/setRequestStatus",
          {
            emp_id: empId,
            r_status: "accepted",
            r_message: "",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (statusResponse.status === 200) {
          const deleteResponse = await axios.delete(
            `http://localhost:8080/api/employees/deleteRequest?requestId=${requestId}`
          );

          if (deleteResponse.status === 200) {
            setRequests(requests.filter((r) => r.requestId !== requestId));
            setIsLoading(false);
            dispatch(decrementRequestCount());
             dispatch({
              type: 'employee/updateEmployee',
              payload: {
                id: empId, 
                updatedEmployee: updateResponse.data
              }
            });
          }
        }
      }
    } catch (err) {
      console.error("Error approving request:", err);
      setIsLoading(false);
    }
  };

  // Rejects a request with optional message
  const handleReject = async (requestId, empId) => {
    setIsLoading(true);
    try {
      const statusResponse = await axios.post(
        "http://localhost:8080/api/employees/setRequestStatus",
        {
          emp_id: empId,
          r_status: "rejected",
          r_message: reqMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (statusResponse.status === 200) {
        const response = await axios.delete(
          `http://localhost:8080/api/employees/deleteRequest?requestId=${requestId}`
        );

        if (response.status === 200) {
          setRequests(requests.filter((r) => r.requestId !== requestId));
          setIsLoading(false);
          dispatch(decrementRequestCount());
        }
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      setIsLoading(false);
    }
  };

  // Filters requests based on search term
  const filteredRequests = requests.filter((item) => {
    const searchField = searchBy === "empNo" ? "empNo" : searchBy;
    return item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (error) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          Error loading requests: {error}
        </div>
      </Container>
    );
  }

  return (
    // Main container
    <Container>
      {/* Header with title and search */}
      <HeaderCard
        initial={{ y: -10, opacity: 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        onMouseLeave={() => setIsFilterOpen(false)}
      >
        {/* Title section */}
        <div
          style={{
            position: "absolute",
            left: "25px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <EditNoteIcon fontSize="large" />
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              color: "rgba(3, 3, 3, 0.76)",
              margin: 0,
              letterSpacing: "1px",
            }}
          >
            Requests
          </h1>
        </div>

        {/* Search input */}
        <SearchContainer>
          <SearchInput>
            <FiSearch
              size={23}
              style={{
                marginTop: "0.2rem",
                marginRight: "0.8rem",
                color: "rgba(0, 0, 0, 0.73)",
              }}
            />
            <input
              type="text"
              placeholder={`Search by ${searchBy}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: "11px 0",
                border: "none",
                fontSize: "1.4rem",

                color: "rgba(0, 0, 0, 0.73)",
                backgroundColor: "transparent",
                width: "100%",
                outline: "none",
              }}
            />
          </SearchInput>

          {/* Search filter dropdown */}
          <SearchByDropdown>
            <div>
              <DropdownButton onClick={() => setIsFilterOpen(!isFilterOpen)}>
                <span>
                  {searchBy === "empId"
                    ? "Employee ID"
                    : searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
                </span>
                <FiChevronDown />
              </DropdownButton>

              {isFilterOpen && (
                <DropdownMenu>
                  {["name", "empNo"].map((option) => (
                    <DropdownItem
                      key={option}
                      active={searchBy === option}
                      onClick={() => {
                        setSearchBy(option);
                        setIsFilterOpen(false);
                      }}
                    >
                      {option === "empNo"
                        ? "Employee No"
                        : option.charAt(0).toUpperCase() + option.slice(1)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </div>
          </SearchByDropdown>
        </SearchContainer>
      </HeaderCard>

      {/* Main table */}
      <TableCard>
        <ReqTable
          requests={filteredRequests}
          onApprove={handleApprove}
          onReject={handleReject}
          newData={newData}
          setNewData={setNewData}
          isLoading={isLoading}
          setReqMessage={setReqMessage}
          showRequestModal={showRequestModal}
          setShowRequestModal={setShowRequestModal}
        />
      </TableCard>
    </Container>
  );
};

export default RequestPage;
