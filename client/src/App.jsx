import "./App.css";
import TextEditor from "./TextEditor";
import { Route, Navigate, Routes } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/documents/${uuidV4()}`} replace />}
        />
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </>
  );
}

export default App;
