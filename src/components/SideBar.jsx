

const SideBar = ({ setPage, setRightPanel, setAuthPage, setLoggedIn }) => {
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    setLoggedIn(false);
    if (setAuthPage) setAuthPage("login");
  };
  return (
    <div className="sidebar">
      <h2 className="sidebar-title"> Nano Player</h2>
      <div className="sidebar-nav">
        <p onClick={() => setPage("home")}>🏠 Home</p>
        <p onClick={() => setPage("search")}>🔍 Search</p>
        <p onClick={() => setPage("liked")}>❤️ Liked</p>
        <p onClick={() => setPage("playlists")}>📂 Playlists</p>
        <hr className="sidebar-divider" />
        <div className="sidebar-secondary">
          <p onClick={() => setRightPanel("queue")}>📜 Queue</p>
          <p onClick={() => setRightPanel("recent")}>🕒 Recent</p>
        </div>
        <hr className="sidebar-divider" />
        <button className="logout-btn" onClick={handleLogout} style={{ marginTop: 12 }}>🚪 Logout</button>
      </div>
    </div>
  );
};

export default SideBar;
