import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllEmployees = createAsyncThunk(
  "employee/fetchAllEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employees/getAllEmployees"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLineChartData = createAsyncThunk(
  "employee/fetchLineChartData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employees/getLineChartData"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPieChartData = createAsyncThunk(
  "employee/fetchPieChartData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employees/getPieChartData"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addEmployee = createAsyncThunk(
  "employee/addEmployee",
  async (employeeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/employees",
        employeeData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const moveMultipleToRecycleBin = createAsyncThunk(
  "employee/moveMultipleToRecycleBin",
  async (employeeIds, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/employees/moveMultipleToRecycleBin",
        { ids: employeeIds },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return employeeIds;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const restoreEmployees = createAsyncThunk(
  "employee/restoreEmployees",
  async (employeeIds, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:8080/api/employees/restoreFromRecycleBin",
        { ids: employeeIds }
      );
      return response.data.restoredEmployees;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchIntercomData = createAsyncThunk(
  "employee/fetchIntercomData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employees/intercomData"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewIntercomData = createAsyncThunk(
  "employee/addNewIntercomData",
  async (employeeData, { rejectWithValue, getState }) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/employees/addNewIntercomData",
        employeeData
      );

      const transformedData = {
        id: response.data.id,
        empNo: response.data.empNo,
        name: response.data.name || employeeData.name || null,
        email: response.data.email || employeeData.email || null,
        designation: response.data.designation || null,
        division: response.data.parentDivision || null,
        function: response.data.function || null,
        workerType:
          response.data.collarWorker || employeeData.workerType || null,
        phone: response.data.phone || employeeData.phone || null,
        grade: response.data.grade || employeeData.grade || null,
        floor: response.data.floor || employeeData.floor || null,
        location: response.data.location || employeeData.location || null,
        intercom: response.data.intercom || employeeData.intercom || null,
        status: response.data.status || employeeData.status || "active",
      };

      return transformedData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateIntercomData = createAsyncThunk(
  "employee/updateIntercomData",
  async ({ id, employeeData }, { rejectWithValue, getState }) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/employees/updateIntercomData?id=${id}`,
        employeeData
      );

      const transformedData = {
        id: response.data.id,
        empNo: response.data.empNo,
        name: response.data.name,
        email: response.data.email,
        designation: response.data.designation,
        division: response.data.parentDivision,
        function: response.data.function,
        workerType: response.data.collarWorker,
        phone: response.data.phone,
        grade: response.data.grade,
        floor: response.data.floor,
        location: response.data.location,
        intercom: response.data.intercom,
        status: response.data.status,
      };

      return transformedData;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteIntercomBulk = createAsyncThunk(
  "employee/deleteIntercomBulk",
  async (employeeIds, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        "http://localhost:8080/api/employees/deleteIntercomBulk",
        {
          data: { ids: employeeIds },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return employeeIds;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecycleCount = createAsyncThunk(
  "employee/fetchRecycleCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employees/recycleCount"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRequestCount = createAsyncThunk(
  "employee/fetchRequestCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/employees/requestCount"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employee",
  initialState: {
    allEmployees: [],
    lineChartData: [],
    pieChartData: [],
    intercomData: [],
    recycleCount: 0,
    requestCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    updateEmployee: (state, action) => {
      const { id, updatedEmployee } = action.payload;
      const employeeIndex = state.allEmployees.findIndex(
        (emp) => emp.id === id
      );
      if (employeeIndex !== -1) {
        state.allEmployees[employeeIndex] = {
          ...state.allEmployees[employeeIndex],
          ...updatedEmployee,
        };
      }
    },
    decrementRequestCount: (state) => {
      state.requestCount = Math.max(0, state.requestCount - 1);
    },
    decrementRecycleCount: (state, action) => {
      state.recycleCount = Math.max(0, state.recycleCount - action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.allEmployees = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLineChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLineChartData.fulfilled, (state, action) => {
        state.lineChartData = action.payload;
        state.loading = false;
      })
      .addCase(fetchLineChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPieChartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPieChartData.fulfilled, (state, action) => {
        state.pieChartData = action.payload;
        state.loading = false;
      })
      .addCase(fetchPieChartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.allEmployees = [...state.allEmployees, action.payload];
        state.loading = false;
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(moveMultipleToRecycleBin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveMultipleToRecycleBin.fulfilled, (state, action) => {
        state.loading = false;
        state.allEmployees = state.allEmployees.filter(
          (employee) => !action.payload.includes(employee.id)
        );
        state.recycleCount += action.payload.length;
      })
      .addCase(moveMultipleToRecycleBin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(restoreEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.allEmployees = [...state.allEmployees, ...action.payload];
        state.recycleCount = Math.max(
          0,
          state.recycleCount - action.payload.length
        );
      })
      .addCase(restoreEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchIntercomData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIntercomData.fulfilled, (state, action) => {
        state.intercomData = action.payload;
        state.loading = false;
      })
      .addCase(fetchIntercomData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNewIntercomData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewIntercomData.fulfilled, (state, action) => {
        state.loading = false;
        state.intercomData = [...state.intercomData, action.payload];
      })
      .addCase(addNewIntercomData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIntercomData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIntercomData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.intercomData.findIndex(
          (emp) => emp.id === action.payload.id
        );
        if (index !== -1) {
          state.intercomData[index] = action.payload;
        }
      })
      .addCase(updateIntercomData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteIntercomBulk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIntercomBulk.fulfilled, (state, action) => {
        state.loading = false;
        state.intercomData = state.intercomData.filter(
          (employee) => !action.payload.includes(employee.id)
        );
      })
      .addCase(deleteIntercomBulk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecycleCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecycleCount.fulfilled, (state, action) => {
        state.recycleCount = action.payload.recycleCount;
        state.loading = false;
      })
      .addCase(fetchRecycleCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRequestCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestCount.fulfilled, (state, action) => {
        state.requestCount = action.payload.requestsCount;
        state.loading = false;
      })
      .addCase(fetchRequestCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default employeeSlice.reducer;
export const { updateEmployee, decrementRequestCount, decrementRecycleCount } =
  employeeSlice.actions;
