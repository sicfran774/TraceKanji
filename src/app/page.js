//https://www.geeksforgeeks.org/paint-app-using-reactjs/#

'use client';

import styles from './page.module.css';
import Kanji from './components/kanji'
import { useEffect, useRef, useState} from "react";

export default function Draw() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 10;
    contextRef.current = context;
  }, []);

  const startDrawing = (e) => {
    contextRef.current.beginPath();
    contextRef.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
      if (!isDrawing) {
          return;
      }
      contextRef.current.lineTo(
          e.nativeEvent.offsetX,
          e.nativeEvent.offsetY
      );

      contextRef.current.stroke();
  };

  return (
    <div className={styles.main}>
      <Kanji />
      <div className={styles.paint}>
        <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        width={'500px'}
        height={'500px'}
        ref={canvasRef}
        />
      </div>
    </div>
    
  )
}
