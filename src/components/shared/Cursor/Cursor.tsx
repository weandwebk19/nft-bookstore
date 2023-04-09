import { useEffect, useState } from "react";

import Portal from "@mui/base/Portal";

const Cursor = () => {
  const [cursorInnerXY, setCursorInnerXY] = useState({ x: -100, y: -100 });
  const [cursorOuterXY, setCursorOuterXY] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const x = e.clientX - 16;
      const y = e.clientY - 16;
      setCursorOuterXY({ x, y });
    };
    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <Portal>
      <div
        className="cursor-inner"
        style={{
          transform: `translate3d(${cursorInnerXY.x}px, ${cursorInnerXY.y}px, 0)`
        }}
      />
      <div
        className="cursor-outer"
        style={{
          transform: `translate3d(${cursorOuterXY.x}px, ${cursorOuterXY.y}px, 0)`
        }}
      />
    </Portal>
  );
};

export default Cursor;
