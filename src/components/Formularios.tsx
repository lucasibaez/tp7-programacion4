import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";

import { useNavigate } from "react-router-dom";

import { Participante } from "../models/Participante";

import { useParticipantes } from "../context/ParticipantesContext";

export default function Formularios() {

  const navigate = useNavigate();

  const { //CUSTOM HOOK VIENE DEL CONTEXT
    participantes,
    agregar,
    editar,
    editando,
    dispatch
  } = useParticipantes();

//aca arranca el codigo  LO PRIMERO Q HACES hasta nombre
  const [form, setForm] = useState({
    id: undefined as number | undefined,
    nombre: "",// con esto primero y de ahi vas al primer input
    email: "",
    edad: "",
    pais: "Argentina",//CUARTA COSA Q HACES 
    modalidad: "",
    tecnologias: [] as string[],
    nivel: "Principiante",
    aceptaTerminos: false,
  });

  // 
  useEffect(() => {

    if (editando) {

      setForm({
        id: editando.id,
        nombre: editando.nombre,
        email: editando.email,
        edad: String(editando.edad),
        pais: editando.pais,
        modalidad: editando.modalidad,
        tecnologias: editando.tecnologias,
        nivel: editando.nivel,
        aceptaTerminos: editando.aceptaTerminos,
      });

    }

  }, [editando]);

//LO SEGUNDO Q HACES 
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const { name, value, type } = e.target;

    // CHECKBOX TECNOLOGÍAS
    if (type === "checkbox" && name === "tecnologias") {

      const checked = (e.target as HTMLInputElement).checked;

      let nuevas = [...form.tecnologias];

      if (checked) {
        nuevas.push(value);
      } else {
        nuevas = nuevas.filter((t) => t !== value);
      }

      setForm({
        ...form,
        tecnologias: nuevas,
      });

    }

    // OTROS CHECKBOX
    else if (type === "checkbox") {

      const checked = (e.target as HTMLInputElement).checked;

      setForm({
        ...form,
        [name]: checked,
      });

    }

    // INPUTS NORMALES
    else {
//LO Q HACES TERCERO ACA:
      setForm({
        ...form,
        [name]: value,
      });

    }
  };
//ACA ES PARA ENVIAR O ACUTALIZAR
  const handleSubmit = (e: FormEvent) => {

    e.preventDefault();// PARA EVITAR RECARGAR PAGINA

    // VALIDACIONES

    //VALIDACION PARA NOMBRE
    if (!form.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    // VALIACCION PARA EMAIL
    if (!form.email.trim()) {

  alert("El email es obligatorio");

  return;

}

// VALIDAR FORMATO EMAIL OSEA Q VENGA CON ARROBA
if (!form.email.includes("@")) {

  alert("Email inválido");

  return;

}

// VALIDAR EMAIL REPETIDO OSEA NO EXISTA ANTES
const existe = participantes.some(  (p) =>    p.email === form.email    &&   p.id !== form.id);

if (existe) {

  alert("El email ya existe");

  return;

}
    //VALIDACIONES PARA LA EDADES SEAN CORRECTA
    if (!form.edad  ||  Number(form.edad) <= 17  ) {

      alert("Edad inválida debe ser mayor de 18 años");
      return;
      } 

    if(!form.edad || Number(form.edad)  >= 100 ){
       alert("Edad inválida");
      return;

    }
    
//VALIDACIONES PARA CHECK BOXES
    if (!form.modalidad) {
      alert("Seleccioná modalidad");
      return;
    }

    if (form.tecnologias.length === 0) {
      alert("Seleccioná al menos una tecnología");
      return;
    }

    if (!form.aceptaTerminos) {
      alert("Debés aceptar los términos");
      return;
    }

    // CREAR OBJETO
    const nuevo = new Participante(
      editando ? editando.id : Date.now(),
      form.nombre,
      form.email,
      Number(form.edad),
      form.pais,
      form.modalidad,
      form.tecnologias,
      form.nivel,
      form.aceptaTerminos
    );

    // EDITAR ENVIAS AL REDUCER
    if (editando) {

      editar(nuevo);

      dispatch({
        type: "SET_EDITANDO",
        payload: null,
      });

    }

    // AGREGAR SI NO ESTAS EDITANDO 
    else {

      agregar(nuevo);

    }

    // RESET ACA LIMPIAS TODO PARA IR AL HOME LIMPIO
    setForm({
      id: undefined,
      nombre: "",
      email: "",
      edad: "",
      pais: "Argentina",
      modalidad: "",
      tecnologias: [],
      nivel: "Principiante",
      aceptaTerminos: false,
    });

    // VOLVER AL HOME
    navigate("/");
  };
 
  return (

    <form
      onSubmit={handleSubmit}
      className="grid gap-4"
    >

      <input
        name="nombre" //aca esta el primer input, pero poder modificarlo debo usar un metodo
        value={form.nombre}
        onChange={handleChange}//que seria este q esta aca handlechange pero antes declararlo
        placeholder="Nombre" //Muestra un texto de ayuda dentro del input cuando está vacío.
        className="border p-2"//dibuja un borde y agrega un espacio no se donde 
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2"
      />

      <input
        name="edad"
        type="number"
        value={form.edad}
        onChange={handleChange}
        placeholder="Edad"
        className="border p-2"
      />

      <select //LUEGO VENIS ACA  DESPUES DE LOS INPUTS
        name="pais"
        value={form.pais}
        onChange={handleChange}
        className="border p-2"
      >
        <option>Argentina</option>
        <option>Chile</option>
        <option>Uruguay</option>
      </select>

      <div>

        {["Presencial", "Virtual", "Híbrido"].map((m) => (

          <label key={m} className="mr-4">

            <input
              type="radio"
              name="modalidad"
              value={m}
              checked={form.modalidad === m}
              onChange={handleChange}
            />

            {m}

          </label>

        ))}

      </div>

      <div>

        {["React", "Angular", "Vue"].map((t) => (

          <label key={t} className="mr-4">

            <input
              type="checkbox"
              name="tecnologias"
              value={t}
              checked={form.tecnologias.includes(t)}
              onChange={handleChange}
            />

            {t}

          </label>

        ))}

      </div>

      <select
        name="nivel"
        value={form.nivel}
        onChange={handleChange}
        className="border p-2"
      >
        <option>Principiante</option>
        <option>Intermedio</option>
        <option>Avanzado</option>
      </select>

      <label>

        <input
          type="checkbox"
          name="aceptaTerminos"
          checked={form.aceptaTerminos}
          onChange={handleChange}
        />

        Acepto términos

      </label>

      <button className="bg-blue-500 text-white p-2">

        {
          editando
            ? "Actualizar"
            : "Registrar"
        }

      </button>

    </form>
  );
}