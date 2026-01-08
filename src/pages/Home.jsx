import { Songs } from "../data/Songs";
import SongCard from "../components/SongCard";

const Home = () => {
  let offset = 0;

  return (
    <>
      {Object.entries(Songs).map(([name, list]) => {
        const start = offset;
        offset += list.length;

        return (
          <div key={name}>
            <h2 className="section-title">{name.toUpperCase()}</h2>
            <div className="grid">
              {list.map((song, i) => (
                <SongCard
                  key={song.id}
                  song={song}
                  index={start + i}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Home;
