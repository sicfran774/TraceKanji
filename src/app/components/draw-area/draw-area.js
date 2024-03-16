//https://www.geeksforgeeks.org/paint-app-using-reactjs/#

'use client';

import styles from './css/draw-area.module.css';
import KanjiOverlay from './kanji-overlay'
import { useEffect, useRef, useState, useContext} from "react";
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { darkModeColor } from '@/app/util/colors';

const backgroundColor = 'black'

export default function DrawArea({enableRecognition, setRecKanjiList, studying, showOverlay, setShowOverlay}) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showKanji, setShowKanji] = useState("Toggle Kanji Tracing")
  const [strokes, setStrokes] = useState(null)
  let { sharedKanji } = useContext(SharedKanjiProvider)

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 5;
    contextRef.current = context;
    
    setStrokes([canvasRef.current.toDataURL()])

    // Prevent scrolling when touching the canvas
    document.body.addEventListener("touchstart", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, { passive: false });
    document.body.addEventListener("touchend", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, { passive: false });
    document.body.addEventListener("touchmove", function (e) {
      if (e.target == canvas) {
        e.preventDefault();
      }
    }, { passive: false });

    //Detect dark/light mode change
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) { 
      resetCanvas()
      if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
        context.strokeStyle = "black";
      } else {
        context.strokeStyle = "white";
      }
    })
  }, []);

  useEffect(() => {
    redrawCanvas()
  }, [strokes])

  useEffect(() => {
    if(!studying){
      setShowOverlay(true)
      resetCanvas()
    } else {
      setShowOverlay(false)
      resetCanvas()
    }
  }, [sharedKanji])

  useEffect(() => {
    resetCanvas()
  }, [enableRecognition])

  const startDrawing = (e) => {
    contextRef.current.beginPath();
    if(!e.targetTouches){
      contextRef.current.moveTo(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      )
    } else {
      let touchPos = getTouchPos(canvasRef.current, e)
      contextRef.current.moveTo(
        touchPos.x,
        touchPos.y
      )
    }

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

    if(!e.targetTouches){
      contextRef.current.lineTo(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      )
    } else {
      let touchPos = getTouchPos(canvasRef.current, e)
      contextRef.current.lineTo(
        touchPos.x,
        touchPos.y
      )
    }

    contextRef.current.stroke();
  };

  function toggleOverlay(){
    setShowOverlay(!showOverlay)
  }

  const addStroke = () => {
    //"DataURL" is the current state of the canvas
    setStrokes([...strokes, canvasRef.current.toDataURL()])
    if(enableRecognition){
      predictKanji()
    }
  }

  async function undoStroke(){
    if(strokes.length > 1) 
      setStrokes(strokes.slice(0, strokes.length - 1))
    if(enableRecognition){
      predictKanji()
    }
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
    redrawBackground()
  }

  function redrawBackground(){
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if(enableRecognition){
      if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.getElementById('drawArea').style.backgroundColor = darkModeColor
      }

      context.strokeStyle = "white";
    } else {
      if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.getElementById('drawArea').style.backgroundColor = 'white'
        context.strokeStyle = "black";
      } else {
        context.strokeStyle = "white";
      }
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  // Get the position of a touch relative to the canvas
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }

  async function predictKanji(){
    setRecKanjiList(await fetch(`api/recognize`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({data: canvasRef.current.toDataURL()})
      })
      .then(response => {
        return response.json()
    }))
  }

  const GridOverlay = () => {
    return (
      <div className={styles.grid}>
        <div className={styles.vertical}></div>
        <div className={styles.horizontal}></div>
      </div>
    )
  }

  return (
    <div className={styles.main}>
      <div className={styles.drawArea} id='drawArea'>
        {showOverlay && <KanjiOverlay />}
        <GridOverlay />
        <div className={styles.paint}>
          <canvas
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          onTouchMove={draw}
          width={'500px'}
          height={'500px'}
          ref={canvasRef}
          className={styles.canvas}
          />
        </div>
      </div>
      <div className={styles.buttons}>
        <button type="button" id="showOverlayButton" onClick={toggleOverlay} className={styles.overlayButton}>{showKanji}</button>
        <button type="button" id="resetDrawingButton" onClick={resetCanvas} className={styles.resetButton}>Reset Drawing</button>
        <button type="button" id="undoButton" onClick={undoStroke} className={styles.undoButton}>Undo</button>
      </div>
    </div>
  )
}
