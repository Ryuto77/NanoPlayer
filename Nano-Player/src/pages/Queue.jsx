import { usePlayer } from "../context/PlayerContext";

const Queue = () => {
  const { queue } = usePlayer();

  return (
    <div className="queue">
      {queue.map((song) => (
        <div key={song.id}>
          {song.title} — {song.artist}
        </div>
      ))}
    </div>
  );
};

export default Queue;
