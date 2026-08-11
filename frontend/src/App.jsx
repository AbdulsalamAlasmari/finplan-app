import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Guide from "./pages/Guide.jsx";
import Tvm from "./pages/Tvm.jsx";
import Budget from "./pages/Budget.jsx";
import Loans from "./pages/Loans.jsx";
import Investments from "./pages/Investments.jsx";
import RealEstate from "./pages/RealEstate.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/tvm" element={<Tvm />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/realestate" element={<RealEstate />} />
      </Route>
    </Routes>
  );
}
