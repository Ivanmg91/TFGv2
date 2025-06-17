import React, { useRef, useState, useEffect } from "react";
import "./CommentsRow.css";

const CommentsRow = ({ comentarios }) => {
  const rowRef = useRef(null);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const updateArrows = () => {
    const el = rowRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [comentarios]);

  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 320, behavior: "smooth" });
  };

  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -320, behavior: "smooth" });
  };

  return (
    <div className="comments-row-container">
      {!isMobile && showLeftArrow && (
        <div className="comments-row-shadow left" onClick={scrollLeft}>
          <span className="arrow">&#8592;</span>
        </div>
      )}
      <div className="comments-row" ref={rowRef}>
        {comentarios.length === 0 ? (
          <div className="comments-empty">No hay comentarios aún.</div>
        ) : (
          comentarios.map((c, idx) => (
            <div className="comment-card" key={idx}>
              <div className="comment-author">{c.nombre}</div>
              <div className="comment-date">
                {new Date(c.fecha).toLocaleString()}
              </div>
              <div className="comment-text">{c.comentario}</div>
            </div>
          ))
        )}
      </div>
      {!isMobile && showRightArrow && (
        <div className="comments-row-shadow right" onClick={scrollRight}>
          <span className="arrow">&#8594;</span>
        </div>
      )}
    </div>
  );
};

export default CommentsRow;