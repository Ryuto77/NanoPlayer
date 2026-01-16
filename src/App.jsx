import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Sidebar from "./components/SideBar";
import RightSidebar from "./components/RightSideBar";
import PlayerBar from "./components/PlayerBar";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Liked from "./pages/Liked";
import Playlists from "./pages/PlayLists";

import "./index.css";

const App = () => {
  const [page, setPage] = useState("home");
  const [authPage, setAuthPage] = useState("login");
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem("loggedIn") === "true");

  useEffect(() => {
    const handler = () => {
      setLoggedIn(localStorage.getItem("loggedIn") === "true");
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  const [rightPanel, setRightPanel] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);


  // Close right sidebar if Home is pressed again
  const handleSetPage = (p) => {
    // Only close right sidebar if Home is pressed and a right panel is open
    if (p === "home" && rightSidebarOpen) {
      setRightSidebarOpen(false);
      setRightPanel(null);
    }
    setPage(p);
    setSidebarOpen(false); // close sidebar on nav
  };

  // Open right sidebar on mobile/tablet when panel is set
  const handleSetRightPanel = (panel) => {
    setRightPanel(panel);
    if (window.innerWidth <= 1099) {
      setRightSidebarOpen(true);
    }
  };


  const renderPage = () => {
    if (!loggedIn) {
      if (authPage === "login") {
        return (
          <Login
            goRegister={() => setAuthPage("register")}
            onLoginSuccess={() => setLoggedIn(true)}
          />
        );
      }

      return (
        <Register
          goLogin={() => setAuthPage("login")}
          onRegisterSuccess={() => setLoggedIn(true)}
        />
      );
    }
    if (page === "search") return <Search />;
    if (page === "liked") return <Liked />;
    if (page === "playlists") return <Playlists />;
    return <Home />;
  };

  return (
    <>
      {/* If not logged in, show only auth page */}
      {!loggedIn ? (
        <div className="main">{renderPage()}</div>
      ) : (
        <>
          {/* Hamburger for mobile/tablet */}
          <button
            className="hamburger"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>

          {/* Sidebar overlay for mobile/tablet */}
          <div className={`sidebar-drawer${sidebarOpen ? " open" : ""}`}>
            <Sidebar setPage={handleSetPage} setRightPanel={handleSetRightPanel} setAuthPage={setAuthPage} setLoggedIn={setLoggedIn} />
            <button className="close-drawer" onClick={() => setSidebarOpen(false)}>&times;</button>
          </div>

          {/* Overlay background */}
          {sidebarOpen && <div className="drawer-backdrop" onClick={() => setSidebarOpen(false)} />}

          <div className="app">
            {/* Desktop sidebar */}
            <div className="sidebar desktop-only">
              <Sidebar setPage={handleSetPage} setRightPanel={handleSetRightPanel} setAuthPage={setAuthPage} setLoggedIn={setLoggedIn} />
            </div>

            <div className="main">
              {renderPage()}
            </div>

            {/* Desktop right sidebar */}
            <div className="right-sidebar desktop-only">
              <RightSidebar panel={rightPanel} />
            </div>
          </div>

          {/* Right sidebar bottom sheet for mobile/tablet */}
          <div className={`right-bottom-sheet${rightSidebarOpen ? " open" : ""}`}>
            <RightSidebar panel={rightPanel} />
            <button className="close-bottom-sheet" onClick={() => { setRightSidebarOpen(false); setRightPanel(null); }}>&times;</button>
          </div>
          {rightSidebarOpen && <div className="drawer-backdrop" onClick={() => { setRightSidebarOpen(false); setRightPanel(null); }} />}

          <PlayerBar />
        </>
      )}
    </>
  );
};

export default App;
