import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Songs } from "../data/Songs";

const PlayerContext = createContext();
const allSongs = Object.values(Songs).flat();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const fadeRef = useRef(null);
  const transitioningRef = useRef(false);
  const seekingRef = useRef(false);


  /* ================= CORE ================= */
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [queue, setQueue] = useState([]);
  const [recent, setRecent] = useState([]);
  const [mini, setMini] = useState(false);

  /* ================= PROGRESS / VOLUME ================= */
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  /* ================= SHUFFLE / REPEAT ================= */
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off"); // off | all | one

  /* ================= LIKES ================= */
  const [liked, setLiked] = useState(() => {
    const saved = localStorage.getItem("likedSongs");
    return saved ? JSON.parse(saved) : [];
  });

  /* ================= PLAY COUNT ================= */
  const [playCount, setPlayCount] = useState(() => {
    const saved = localStorage.getItem("playCount");
    return saved ? JSON.parse(saved) : {};
  });

  /* ================= PLAYLISTS ================= */
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem("playlists");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  /* ================= AUDIO EVENTS ================= */
  useEffect(() => {
    const audio = audioRef.current;

    audio.ontimeupdate = () => {
  if (seekingRef.current) return;
  setProgress(audio.currentTime);
};



    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.onended = () => {
      if (repeat === "one") {
        audio.currentTime = 0;
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
        return;
      }

      playNext();
    };
  }, [repeat, shuffle, currentIndex]);

  useEffect(() => {
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  /* ================= CROSSFADE ================= */
  const crossfadeTo = (src) => {
    const audio = audioRef.current;
    if (transitioningRef.current) return;

    transitioningRef.current = true;

    if (fadeRef.current) {
      clearInterval(fadeRef.current);
      fadeRef.current = null;
    }

    if (!audio.src) {
      audio.src = src;
      audio.currentTime = 0;
      audio.volume = muted ? 0 : volume;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
        .finally(() => {
          transitioningRef.current = false;
        });
      return;
    }

    let v = audio.volume;

    fadeRef.current = setInterval(() => {
      v -= 0.1;
      audio.volume = Math.max(v, 0);

      if (v <= 0) {
        clearInterval(fadeRef.current);
        fadeRef.current = null;

        audio.src = src;
        audio.currentTime = 0;

        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            fadeIn();
          })
          .catch(() => setIsPlaying(false))
          .finally(() => {
            transitioningRef.current = false;
          });
      }
    }, 100);
  };

  const fadeIn = () => {
    const audio = audioRef.current;
    let v = 0;
    audio.volume = 0;

    const id = setInterval(() => {
      v += 0.1;
      audio.volume = Math.min(v, muted ? 0 : volume);
      if (v >= volume) clearInterval(id);
    }, 100);
  };

  /* ================= CONTROLS ================= */
  const playSong = (index) => {
    const song = allSongs[index];
    if (!song) return;

    crossfadeTo(song.audio);
    setCurrentIndex(index);
    setIsPlaying(true);

    setQueue(allSongs.slice(index + 1));

    setRecent((r) =>
      [song, ...r.filter((s) => s.id !== song.id)].slice(0, 20)
    );

    setPlayCount((p) => {
      const u = { ...p, [song.id]: (p[song.id] || 0) + 1 };
      localStorage.setItem("playCount", JSON.stringify(u));
      return u;
    });
  };

  const togglePlay = () => {
    if (currentIndex === null) return;
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const playNext = () => {
    if (currentIndex === null) return;

    let nextIndex;

    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * allSongs.length);
      } while (nextIndex === currentIndex);
    } else {
      nextIndex = currentIndex + 1;
    }

    if (nextIndex >= allSongs.length) {
      if (repeat === "all") {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    playSong(nextIndex);
  };

  const playPrev = () => {
    if (currentIndex === null) return;

    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = repeat === "all" ? allSongs.length - 1 : 0;
    }

    playSong(prevIndex);
  };

 const seek = (t) => {
  const audio = audioRef.current;
  const d = audio.duration;
  const finite = Number.isFinite(d) && d > 0;
  const next = finite ? Math.min(Math.max(t, 0), d) : Math.max(t, 0);

  try {
    audio.currentTime = next;
  } catch {
    // ignore (some browsers throw if media isn't seekable yet)
  }

  setProgress(next); // manual update while seeking
};

const startSeek = () => {
  seekingRef.current = true;
};

const endSeek = () => {
  seekingRef.current = false;
};


  /* ================= PLAYLIST HELPERS ================= */
  const createPlaylist = (name) => {
    if (!name.trim()) return;
    setPlaylists((p) => [...p, { id: Date.now(), name, songs: [] }]);
  };

  const addToPlaylist = (playlistId, songId) => {
    setPlaylists((p) =>
      p.map((pl) =>
        pl.id === playlistId && !pl.songs.includes(songId)
          ? { ...pl, songs: [...pl.songs, songId] }
          : pl
      )
    );
  };

  const toggleLike = (songId) => {
  setLiked((prev) => {
    const updated = prev.includes(songId)
      ? prev.filter((id) => id !== songId)
      : [...prev, songId];

    localStorage.setItem("likedSongs", JSON.stringify(updated));
    return updated;
  });
};


  const renamePlaylist = (id, name) => {
    setPlaylists((p) =>
      p.map((pl) => (pl.id === id ? { ...pl, name } : pl))
    );
  };

  const deletePlaylist = (id) => {
    setPlaylists((p) => p.filter((pl) => pl.id !== id));
  };

  const addToQueueNext = (songId) => {
    const song = allSongs.find((s) => s.id === songId);
    if (!song) return;
    setQueue((q) => [song, ...q]);
  };

  /* ================= KEYBOARD ================= */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }

      if (e.code === "ArrowRight" && !transitioningRef.current) {
        playNext();
      }

      if (e.code === "ArrowLeft" && !transitioningRef.current) {
        playPrev();
      }

      if (e.key === "m") {
        setMini((m) => !m);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <PlayerContext.Provider
      value={{
        songs: allSongs,
        currentSong: currentIndex !== null ? allSongs[currentIndex] : null,
        isPlaying,
        queue,
        recent,
        liked,
        playCount,
        playlists,
        mini,

        progress,
        duration,
        volume,
        muted,
        shuffle,
        repeat,

        playSong,
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

        createPlaylist,
        addToPlaylist,
        renamePlaylist,
        deletePlaylist,
        addToQueueNext,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
