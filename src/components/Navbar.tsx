import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {

  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const cerrarSesion = () => {

    logout();

    navigate("/login");

  };

  return (

    <nav className="bg-blue-600 text-white p-4">

      <div className="flex justify-between items-center">

        <h1 className="font-bold">
          Registro Eventos
        </h1>

        {/* BURGER */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>

        {/* DESKTOP */}
        <div className="hidden md:flex gap-4 items-center">

          <Link to="/">
            Home
          </Link>

          {
            user?.rol === "ADMIN" && (

              <Link to="/nuevo">
                Nuevo
              </Link>

            )
          }

          <Link to="/publica">
            Pública
          </Link>

          {
            user && (

              <button
                onClick={cerrarSesion}
                className="bg-red-500 px-3 py-1 rounded"
              >

                Cerrar sesión

              </button>

            )
          }

        </div>

      </div>

      {/* MOBILE */}
      {
        open && (

          <div className="flex flex-col gap-2 mt-2 md:hidden">

            <Link
              to="/"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>

            {
              user?.rol === "ADMIN" && (

                <Link
                  to="/nuevo"
                  onClick={() => setOpen(false)}
                >
                  Nuevo
                </Link>

              )
            }

            <Link
              to="/publica"
              onClick={() => setOpen(false)}
            >
              Pública
            </Link>

            {
              user && (

                <button
                  onClick={cerrarSesion}
                  className="bg-red-500 px-3 py-1 rounded"
                >

                  Cerrar sesión

                </button>

              )
            }

          </div>

        )
      }

    </nav>

  );

}