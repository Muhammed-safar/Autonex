import { Outlet } from "react-router-dom";
import Navbar from "../layout/Navbar.jsx";
import Footer from "../layout/Footer.jsx";

const MainLayout = () => {
  return (
    <div className=" min-h-screen flex flex-col ">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;