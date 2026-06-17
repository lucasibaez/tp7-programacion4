import { useState } from "react";

import { Link } from "react-router-dom";

import { useParticipantes } from "../context/ParticipantesContext";

import { useAuth } from "../context/AuthContext";

import ParticipanteCard from "../components/ParticipanteCard";

import Filtros from "../components/Filtros";

export default function HomePage() {

  const { participantes } = useParticipantes();

  const { user } = useAuth();

  const [filtroNombre, setFiltroNombre] = useState("");

  const [filtroModalidad, setFiltroModalidad] = useState("");

  const [filtroNivel, setFiltroNivel] = useState("");

  const limpiarFiltros = () => {

    setFiltroNombre("");

    setFiltroModalidad("");

    setFiltroNivel("");

  };

  const participantesFiltrados =
    participantes.filter((p) => {

      return (

        p.nombre
          .toLowerCase()
          .includes(
            filtroNombre.toLowerCase()
          )

        &&

        (
          filtroModalidad === ""
          ||
          p.modalidad === filtroModalidad
        )

        &&

        (
          filtroNivel === ""
          ||
          p.nivel === filtroNivel
        )

      );

    });

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold">

            Participantes

          </h1>

          {
            user && (

              <p className="text-gray-600 mt-1">

                Usuario:
                {" "}

                <strong>
                  {user.username}
                </strong>

                {" "}

                | Rol:
                {" "}

                <strong>
                  {user.rol}
                </strong>

              </p>

            )
          }

        </div>

        {
          user?.rol === "ADMIN" && (

            <Link
              to="/nuevo"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >

              Nuevo participante

            </Link>

          )
        }

      </div>

      <Filtros
        filtroNombre={filtroNombre}
        setFiltroNombre={setFiltroNombre}
        filtroModalidad={filtroModalidad}
        setFiltroModalidad={setFiltroModalidad}
        filtroNivel={filtroNivel}
        setFiltroNivel={setFiltroNivel}
        limpiarFiltros={limpiarFiltros}
      />

      <div className="grid md:grid-cols-3 gap-4 mt-4">

        {
          participantesFiltrados.map((p) => (

            <ParticipanteCard
              key={p.id}
              participante={p}
            />

          ))
        }

      </div>

    </div>

  );

}