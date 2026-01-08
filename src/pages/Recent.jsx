import { usePlayer } from "../context/PlayerContext";

const Recent = () => {
  const { recent } = usePlayer();

  return (
    <div className="queue">
      {recent.map((song) => (
        <div key={song.id}>
          {song.title} — {song.artist}
        </div>
      ))}
    </div>
  );
};

export default Recent;
