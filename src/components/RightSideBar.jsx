import { usePlayer } from "../context/PlayerContext";

const RightSideBar = ({ panel }) => {
  const { queue, recent } = usePlayer();

  return (
    <div className="right-sidebar-content">
      {panel === "queue" && (
        <>
          <h3>Queue</h3>
          {queue.length === 0 && (
            <p className="muted">Queue is empty</p>
          )}
          {queue.map((song) => (
            <div key={song.id} className="right-item">
              {song.title}
            </div>
          ))}
        </>
      )}

      {panel === "recent" && (
        <>
          <h3>Recently Played</h3>
          {recent.length === 0 && (
            <p className="muted">No recent songs</p>
          )}
          {recent.map((song) => (
            <div key={song.id} className="right-item">
              {song.title}
            </div>
          ))}
        </>
      )}

      {!panel && (
        <p className="muted">
          Select Queue or Recent
        </p>
      )}
    </div>
  );
};

export default RightSideBar;
