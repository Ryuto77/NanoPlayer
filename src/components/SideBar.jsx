const SideBar = ({ setPage, setRightPanel }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title"> Nano Player</h2>

      {/* MAIN NAV */}
      <div className="sidebar-nav">
        <p onClick={() => setPage("home")}>🏠 Home</p>
        <p onClick={() => setPage("search")}>🔍 Search</p>
        <p onClick={() => setPage("liked")}>❤️ Liked</p>
        <p onClick={() => setPage("playlists")}>📂 Playlists</p>

        {/* divider */}
        <hr className="sidebar-divider" />

        {/* SECONDARY */}
        <div className="sidebar-secondary">
          <p onClick={() => setRightPanel("queue")}>📜 Queue</p>
          <p onClick={() => setRightPanel("recent")}>🕒 Recent</p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
