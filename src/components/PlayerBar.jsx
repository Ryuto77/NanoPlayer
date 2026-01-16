import { usePlayer } from "../context/PlayerContext";

const formatTime = (sec = 0) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const PlayerBar = () => {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    muted,
    shuffle,
    liked,
    repeat,
    mini,

    togglePlay,
    toggleLike,
    playNext,
    playPrev,
    seek,
    startSeek,
    endSeek,
    setVolume,
    setMuted,
    setShuffle,
    setRepeat,
    setMini,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className={`player ${mini ? "mini" : ""}`}>
      {/* LEFT */}
      <div className="player-left">
        {!mini && (
          <img
            src={currentSong.image}
            alt={currentSong.title}
            className="player-thumb"
          />
        )}
        <div className="player-meta">
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <strong>{currentSong.title}</strong>
  </div>

  {!mini && <div className="muted">{currentSong.artist}</div>}
</div>

      </div>

      {/* CENTER */}
      <div className="player-center">
        {/* CONTROLS */}
        <div className="controls">
          {/* SHUFFLE */}
          <button
            className={shuffle ? "active" : ""}
            title="Shuffle"
            onClick={() => setShuffle((s) => !s)}
          >
            {shuffle ? "🔀" : "➡️"}
          </button>

          <button onClick={playPrev}>⏮</button>

          <button onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>

          <button onClick={playNext}>⏭</button>

          {/* REPEAT */}
          <button
            className={repeat !== "off" ? "active" : ""}
            title="Repeat"
            onClick={() =>
              setRepeat(
                repeat === "off"
                  ? "all"
                  : repeat === "all"
                  ? "one"
                  : "off"
              )
            }
          >
            {repeat === "one"
              ? "🔂"
              : repeat === "all"
              ? "🔁"
              : "↩️"}
          </button>
        </div>

        {/* PROGRESS (centered under controls) */}
        {!mini && (
          <div className="progress-row">
            <span className="time">{formatTime(progress)}</span>
            <input
              type="range"
              min="0"
              max={duration || 1}
              value={progress}
              onPointerDown={startSeek}
              onPointerUp={endSeek}
              onPointerCancel={endSeek}
              onMouseLeave={endSeek}
              onChange={(e) => seek(Number(e.target.value))}
            />
            <span className="time">{formatTime(duration)}</span>

            {/* Like button (mobile placement: on seek row) */}
            <button
              className="like-btn like-inline"
              onClick={() => toggleLike(currentSong.id)}
              title="Like"
            >
              {liked.includes(currentSong.id) ? "❤️" : "🤍"}
            </button>
          </div>
        )}

      </div>

      {/* RIGHT */}
      <div className="player-right">
        {!mini && (
          <div className="volume-row">
            <button onClick={() => setMuted(!muted)}>
              {muted ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>
        )}

        <button onClick={() => setMini(!mini)}>
          {mini ? "⬆" : "⬇"}
        </button>
      </div>
    </div>
  );
};

export default PlayerBar;
