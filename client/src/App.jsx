import { Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AuthGuard from "./components/AuthGuard";
import ErrorBoundary from "./components/ErrorBoundary";
import LandingPage from "./pages/LandingPage";
import BusinessPage from "./pages/BusinessPage";
import AddBusinessPage from "./pages/AddBusinessPage";
import EditBusinessPage from "./pages/EditBusinessPage";
import ProductsPage from "./pages/ProductsPage";
import TransactionsPage from "./pages/TransactionsPage";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/business/create" element={<AddBusinessPage />} />
          <Route path="/business/:businessId" element={<BusinessPage />} />
          <Route path="/business/:businessId/edit" element={<EditBusinessPage />} />
          <Route path="/business/:businessId/products" element={<ProductsPage />} />
          <Route path="/business/:businessId/transactions" element={<TransactionsPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
