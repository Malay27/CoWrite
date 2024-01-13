import React, { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { toolbarOptions } from "./constant";

const TextEditor = () => {
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: toolbarOptions } });
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
