import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Dashboard from "./pages/dashboard/dashboard";
import ProtectedRoute from "./components/protectedRoute";
import Books from "./pages/books/books";
import Members from "./pages/members/members";
import Loans from "./pages/loans/loans";
import Register from "./pages/auth/register";
import NotFound from "./pages/notFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/loans" element={<Loans />} />
        </Route>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

