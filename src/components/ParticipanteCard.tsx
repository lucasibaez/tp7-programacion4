import { useNavigate } from "react-router-dom";

import { Participante } from "../models/Participante";

import { useParticipantes } from "../context/ParticipantesContext";

import { useAuth } from "../context/AuthContext";

type Props = {
  participante: Participante;};

export default function ParticipanteCard({participante,}: Props) {

  const { eliminar } = useParticipantes();

  const { user } = useAuth();

  const navigate = useNavigate(); //Sirve para cambiar de página sin recargar.

  return (

    <div className="border p-4 rounded shadow bg-white">

      <h3 className="font-bold text-lg">

        {participante.nombre}

      </h3>

      <p>
        {participante.email}
      </p>

      <p>
        Edad: {participante.edad}
      </p>

      <p>
        País: {participante.pais}
      </p>

      <p>
        Modalidad: {participante.modalidad}
      </p>

      <p>
        Nivel: {participante.nivel}
      </p>

      <div className="mt-2">

        <strong>
          Tecnologías:
        </strong>

        <div className="flex gap-2 flex-wrap mt-1">

          {
            participante.tecnologias.map((t) => (

              <span
                key={t}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
              >

                {t}

              </span>

            ))
          }

        </div>

      </div>
 {/* const { user } = useAuth();*/}
      { 
        user?.rol === "ADMIN" && (

          <div className="flex gap-2 mt-4">

            <button
              onClick={() =>
                navigate(`/editar/${participante.id}`)
              }
              className="bg-yellow-500 text-white px-3 py-1 rounded"
            >

              Editar

            </button>
            {/* const { eliminar } = useParticipantes();*/}
            <button
              onClick={() =>
                eliminar(participante.id)
              }
              className="bg-red-500 text-white px-3 py-1 rounded"
            >

              Eliminar

            </button>

          </div>

        )
      }

    </div>

  );

}