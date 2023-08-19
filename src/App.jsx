import Auth from "./components/Auth";
import { db, auth, storage } from "./config/firebase";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

const App = () => {
  const [movieList, setMovieList] = useState([]);
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState("");
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollectionRef = collection(db, "movies");

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);

      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMovieList(filteredData);
    } catch (error) {
      alert(error);
    }
  };

  async function onSubmitMovie(e) {
    e.preventDefault();
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        userId: auth?.currentUser?.uid,
      });
      setNewMovieTitle("");
      setNewReleaseDate("");
      getMovieList();
    } catch (error) {
      alert(error);
    }
  }

  async function deleteMovie(id) {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    getMovieList();
  }

  async function updateMovieTitle(id, e) {
    e.preventDefault();
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
    setUpdatedTitle("");
  }

  async function uploadFile(e) {
    e.preventDefault();
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <Auth />
      {movieList.map((movie) => (
        <div key={movie.id}>
          <h1>{movie.title}</h1>
          <p> Date: {movie.releaseDate} </p>
          <button onClick={() => deleteMovie(movie.id)}> Delete Movie</button>

          <form onSubmit={(e) => updateMovieTitle(movie.id, e)}>
            <input
              value={updatedTitle}
              placeholder="new title..."
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
            <input type="submit" value="Update Title" />
          </form>
        </div>
      ))}
      <br />
      <form onSubmit={onSubmitMovie}>
        <input
          placeholder="Movie title..."
          value={newMovieTitle}
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release Date..."
          type="number"
          value={newReleaseDate}
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input type="submit" value="Submit Movie" />
      </form>
      <br />
      <br />
      <form onSubmit={uploadFile}>
        <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
        <input type="submit" value="Upload File" />
      </form>
    </div>
  );
};

export default App;
