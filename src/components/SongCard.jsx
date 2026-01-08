import { usePlayer } from "../context/PlayerContext";
import { useState } from "react";

const SongCard = ({ song, index }) => {
  const {
    playSong,
    playlists = [],
    addToPlaylist,
    addToQueueNext,
    createPlaylist,
  } = usePlayer();

  const [open, setOpen] = useState(false);
  const [newPl, setNewPl] = useState("");
  const [msg, setMsg] = useState("");

  const notify = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(""), 1500);
    setOpen(false);
  };

  return (
    <div className="card">
      <div className="cover" onClick={() => playSong(index)}>
        <img src={song.image} alt={song.title} />
      </div>

      <h4>{song.title}</h4>
      <p>{song.artist}</p>

      {/* + BUTTON */}
      <button
        className="card-plus"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        +
      </button>

      {/* MENU */}
      {open && (
        <div className="card-menu" onClick={(e) => e.stopPropagation()}>
          <div
            onClick={() => {
              addToQueueNext(song.id);
              notify("Added to queue");
            }}
          >
            ▶ Add to queue
          </div>

          <div className="create-pl">
            <input
              placeholder="New playlist"
              value={newPl}
              onChange={(e) => setNewPl(e.target.value)}
            />
            <button
              onClick={() => {
                if (newPl.trim()) {
                  createPlaylist(newPl);
                  notify("Playlist created");
                  setNewPl("");
                }
              }}
            >
              Create
            </button>
          </div>

          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                addToPlaylist(pl.id, song.id);
                notify(`Added to ${pl.name}`);
              }}
            >
              ➕ {pl.name}
            </div>
          ))}
        </div>
      )}

      {/* TOAST */}
      {msg && <div className="toast">{msg}</div>}
    </div>
  );
};

export default SongCard;
