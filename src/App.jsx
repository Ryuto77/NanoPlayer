import { useState } from "react";

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
  const [rightPanel, setRightPanel] = useState(null);

  const renderPage = () => {
    if (page === "search") return <Search />;
    if (page === "liked") return <Liked />;
    if (page === "playlists") return <Playlists />;
    return <Home />;
  };

  return (
    <>
      <div className="app">
        <div className="sidebar">
          <Sidebar setPage={setPage} setRightPanel={setRightPanel} />
        </div>

        <div className="main">
          {renderPage()}
        </div>

        <div className="right-sidebar">
          <RightSidebar panel={rightPanel} />
        </div>
      </div>

      <PlayerBar />
    </>
  );
};

export default App;
