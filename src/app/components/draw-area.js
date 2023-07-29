//https://www.geeksforgeeks.org/paint-app-using-reactjs/#

'use client';

import styles from './css/draw-area.module.css';
import KanjiOverlay from './kanji-overlay'
import { useEffect, useRef, useState} from "react";

export default function DrawArea() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 14;
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

  function toggleOverlay(){
    setShowOverlay(!showOverlay);
  }

  function clearCanvas(){
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className={styles.main}>
      <div className={styles.drawArea}>
        {showOverlay && <KanjiOverlay />}
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
      
      <button type="button" onClick={toggleOverlay} className='button'>Toggle Kanji</button>
      <button type="button" onClick={clearCanvas} className='button'>Clear Drawing</button>
    </div>
    
  )
}
