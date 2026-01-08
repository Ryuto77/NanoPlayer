import { usePlayer } from "../context/PlayerContext";
import SongCard from "../components/SongCard";

const Liked = () => {
  const { songs, liked } = usePlayer();

  const likedSongs = songs.filter((song) =>
    liked.includes(song.id)
  );

  if (likedSongs.length === 0) {
    return (
      <p className="muted" style={{ padding: "20px" }}>
        No liked songs yet
      </p>
    );
  }

  return (
    <div className="grid">
      {likedSongs.map((song, index) => (
        <SongCard
          key={song.id}
          song={song}
          index={index}
        />
      ))}
    </div>
  );
};

export default Liked;
