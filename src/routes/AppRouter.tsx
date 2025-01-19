import { Route } from "react-router";
import { Routes } from "react-router";
import PracticePage from "../pages/PracticePage";
import MainPage from "../pages/MainPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/*" element={<MainPage />} />
    </Routes>
  );
};
