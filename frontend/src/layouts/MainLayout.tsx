import { Routes, Route } from "react-router-dom";
import { Home } from "../content/home";

export const MainLayout = () => {
  return (
    <main className="grow">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/project" element={<Projects />} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/skills" element={<TechnicalSkills/>} /> */}
      </Routes>
    </main>
  );
};
