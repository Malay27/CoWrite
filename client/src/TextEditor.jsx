import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { toolbarOptions } from "./constant";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const TextEditor = () => {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    const s = io(
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : process.env.NEXT_PUBLIC_VERCEL_URL || "https://co-write-api.vercel.app"
    );
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, 2000);

    const loadDocumentHandler = (document) => {
      quill.setContents(document);
      quill.enable();
    };

    socket.once("load-document", loadDocumentHandler);
    socket.emit("get-document", documentId);

    const receiveChangesHandler = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", receiveChangesHandler);

    const textChangeHandler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", textChangeHandler);

    return () => {
      clearInterval(interval);
      socket.off("receive-changes", receiveChangesHandler);
      quill.off("text-change", textChangeHandler);
    };
  }, [socket, quill, documentId]);

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
