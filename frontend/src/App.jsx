import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/shared/Sidebar";
import Login from "./pages/Login";
import ProtectRoute from "./components/auth/ProtectRoute";
import ProtectLogin from "./components/auth/ProtectLogin"; //maddy
import Loader from "./components/shared/Loader";

const Home = React.lazy(() => import("./pages/Home"));
const Search = React.lazy(() => import("./pages/Search"));
const Recycle = React.lazy(() => import("./pages/Recycle"));
const Request = React.lazy(() => import("./pages/Request"));
const Intercom = React.lazy(() => import("./pages/Intercom"));
const Birthday = React.lazy(() => import("./pages/Birthday"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader message="Loading Page..." />}>
        <Routes>
          {/* maddy */}
          <Route
            path="/"
            element={
              <ProtectLogin>
                {" "}
                <Login />{" "}
              </ProtectLogin>
            }
          />
          <Route
            path="/app"
            element={
              <ProtectRoute>
                {" "}
                <Sidebar />{" "}
              </ProtectRoute>
            }
          >
            <Route path="home" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="recycle" element={<Recycle />} />
            <Route path="request" element={<Request />} />
            <Route path="intercom" element={<Intercom />} />
            <Route path="birthday" element={<Birthday />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
