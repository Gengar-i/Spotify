import { useState } from "preact/hooks";
import { getAlbums, getToken } from "../services/api";

const Main = () => {
  const [offset, setOffset] = useState(0);

  return (
    <div>
      <button onClick={getToken}>Get Access Token</button>
      <button onClick={getAlbums}>Get artist</button>
    </div>
  );
};

export default Main;
