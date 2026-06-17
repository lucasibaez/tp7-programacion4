import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import FormularioPage from "./pages/FormularioPage";
import EditarPage from "./pages/EditarPage";
import PublicaPage from "./pages/PublicaPage";

import PrivateRoute from "./routes/PrivateRoute";

export default function App() {

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* PÚBLICA */}
        <Route
          path="/publica"
          element={<PublicaPage />}
        />

        {/* HOME */}
        <Route
          path="/"
          element={
            <PrivateRoute>

              <HomePage />

            </PrivateRoute>
          }
        />

        {/* NUEVO */}
        <Route
          path="/nuevo"
          element={
            <PrivateRoute rol="ADMIN">

              <FormularioPage />

            </PrivateRoute>
          }
        />

        {/* EDITAR */}
        <Route
          path="/editar/:id"
          element={
            <PrivateRoute rol="ADMIN">

              <EditarPage />

            </PrivateRoute>
          }
        />

      </Routes>

    </div>

  );

}