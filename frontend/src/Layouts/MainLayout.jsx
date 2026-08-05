import { Outlet } from "react-router-dom";
import Navbar from "../components/layout.jsx/Navbar.jsx";
import Footer from "../components/layout.jsx/Footer.jsx";
import AllCategorySidebar from "../pages/home/AllCategorySidebar.jsx";
import { useState, useRef } from "react";

const MainLayout = () => {
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const navbarRef = useRef(null);

  return (
    <div className="w-full min-h-screen flex flex-col "> 
      <div className="sticky top-0 z-50" ref={navbarRef}>
        <Navbar onOpenCategory={() => setCategoryDrawerOpen(true)} />
        {categoryDrawerOpen && (
          <>
            <div
              className="absolute top-full left-0 z-50 overflow-hidden shadow-2xl"
              style={{ height: "calc(100vh - 140px)" }}
            >
              <AllCategorySidebar
                onClose={() => setCategoryDrawerOpen(false)}
              />
            </div>
          </>
        )}
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;