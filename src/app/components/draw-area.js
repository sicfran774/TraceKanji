//https://www.geeksforgeeks.org/paint-app-using-reactjs/#

'use client';

import styles from './css/draw-area.module.css';
import KanjiOverlay from './kanji-overlay'
import { useEffect, useRef, useState, useContext} from "react";
import { SharedKanjiProvider } from './shared-kanji-provider';

export default function DrawArea() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [showKanji, setShowKanji] = useState("Hide Kanji Tracing")
  const [strokes, setStrokes] = useState(null)
  let { sharedKanji } = useContext(SharedKanjiProvider)

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 14;
    contextRef.current = context;

    setStrokes([canvasRef.current.toDataURL()])
  }, []);

  useEffect(() => {
    redrawCanvas()
  }, [strokes])

  useEffect(() => {
    setShowOverlay(true)
    resetCanvas()
    setShowKanji("Hide Kanji Tracing")
  }, [sharedKanji])

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
    addStroke()
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
    setShowKanji((showOverlay) ? "Show Kanji Tracing" : "Hide Kanji Tracing")
  }

  const addStroke = () => {
    //"DataURL" is the current state of the canvas
    setStrokes([...strokes, canvasRef.current.toDataURL()])
  }

  async function undoStroke(){
    if(strokes.length > 1) 
      setStrokes(strokes.slice(0, strokes.length - 1))
  }

  function redrawCanvas(){
    if(!strokes) return
    const context = canvasRef.current.getContext("2d")

    //Get DataURL of last element in stroke array. The first element is the empty canvas
    const canvasPic = new Image()
    canvasPic.src = (strokes.length > 1) ? strokes[strokes.length - 1] : strokes[0]
    
    canvasPic.onload = function() { 
      clearCanvas()
      context.drawImage(canvasPic, 0, 0, 500, 500) 
    }
  }

  function resetCanvas(){
    if(!strokes) return
    setStrokes(strokes.slice(0, 1))
    clearCanvas()
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
      <div className={styles.buttons}>
        <button type="button" onClick={toggleOverlay} className='button'>{showKanji}</button>
        <button type="button" onClick={resetCanvas} className='button'>Reset Drawing</button>
        <button type="button" onClick={undoStroke} className='button'>Undo</button>
      </div>
    </div>
  )
}
