import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: React.ReactElement;
  rol?: "ADMIN" | "CONSULTA";
};

export default function PrivateRoute({ children, rol }: Props) {

  const { user, token, loading } = useAuth();

  // ======================================================
  // ESPERA A QUE SE CARGUE LA SESIÓN
  // ======================================================
  if (loading) return null; // opcional: spinner

  // ======================================================
  // SIN LOGIN → LOGIN
  // ======================================================
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // ======================================================
  // CONTROL DE ROLES
  // ======================================================
  if (rol && user.rol !== rol) {
    return <Navigate to="/" replace />;
  }

  return children;
}