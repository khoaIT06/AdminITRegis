import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "~/admin/routes/AdminRoutes";
import Layout from "~/admin/components/Layout/DefaultLayout";

function App() {
  return (
    <Router>
        <div className="App">
          <Routes>
            {AdminRoutes.map((route, index) => {
              const Page = route.component;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout><Page /></Layout>
                  }
                />
              );
            })}
          </Routes>
        </div>
      </Router>
  );
}

export default App;
