import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ROUTES from "./routes";
import Layout from "./components/common/Layout";
import "./App.css";

/**
 * Modular App: routes and layouts defined in routes.js
 * To add a page: just update routes.js, no edit needed here!
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {ROUTES.map(({ path, component: Component, layout }, idx) => (
          <Route
            key={path || idx}
            path={path}
            element={
              layout ? (
                <Layout>
                  <Component />
                </Layout>
              ) : (
                <Component />
              )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
