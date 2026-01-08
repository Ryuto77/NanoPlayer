import { usePlayer } from "../context/PlayerContext";
import { useState } from "react";
import SongCard from "../components/SongCard";

const PlayLists = () => {
  const {
    playlists = [],
    songs = [],
    renamePlaylist,
    deletePlaylist,
  } = usePlayer();

  const [active, setActive] = useState(null);

  if (active) {
    const pl = playlists.find((p) => p.id === active);
    const list = Array.isArray(pl?.songs) ? pl.songs : [];

    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setActive(null)}>← Back</button>
        <h2>{pl.name}</h2>

        <div className="grid">
          {list.map((id) => {
            const song = songs.find((s) => s.id === id);
            if (!song) return null;
            const index = songs.findIndex((s) => s.id === id);
            return (
              <SongCard key={id} song={song} index={index} />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Playlists</h2>

      <div className="grid">
        {playlists.map((pl) => (
          <div key={pl.id} className="card">
            <div
              className="cover"
              onClick={() => setActive(pl.id)}
            >
              <div className="playlist-cover">🎵</div>
            </div>

            <h4>{pl.name}</h4>
            <p>{pl.songs?.length || 0} songs</p>

            <div className="playlist-actions">
              <button
                onClick={() => {
                  const name = prompt("Rename playlist", pl.name);
                  if (name) renamePlaylist(pl.id, name);
                }}
              >
                ✏
              </button>

              <button onClick={() => deletePlaylist(pl.id)}>
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayLists;
