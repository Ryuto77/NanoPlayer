import { useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import SongCard from "../components/SongCard";

const Search = () => {
  const { songs } = usePlayer();
  const [query, setQuery] = useState("");

  const results = songs.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <input
        className="search"
        placeholder="Search songs or artists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid">
        {results.map((song, index) => (
          <SongCard key={song.id} song={song} index={index} />
        ))}
      </div>
    </>
  );
};

export default Search;
