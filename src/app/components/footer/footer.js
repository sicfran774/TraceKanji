'use client';

import { useState } from "react"
import ChangelogDialog from "../changelog/changelog";
import styles from "./css/footer.module.css"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Footer(){

  const [openDialog, setOpenDialog] = useState(false)
  const [openAbout, setOpenAbout] = useState(false)

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenAbout = () => {
    setOpenAbout(true);
  };

  const handleCloseAbout = () => {
    setOpenAbout(false);
  };

  const AboutDialog = () => {
    return (
      <Dialog open={openAbout} onClose={handleCloseAbout}>
        <DialogTitle>About Trace Kanji</DialogTitle>
        <DialogContent>
          <div className={styles.main}>
            <h3>How to use this website</h3>
            <p>Use the search bar to lookup kanji meanings, on/kun readings, or the kanji itself. <span style={{color: '#1e88e5'}}>You can use kana as well!</span></p>
            <p>Click on a kanji to show info, and also overlay it on the draw area</p>
            <p>You can toggle the overlay, undo, and reset the drawing by using the buttons below the pad.</p>
            <p><span style={{color: '#1e88e5'}}>Click and drag (desktop)</span> or <span style={{color: '#1e88e5'}}>drag your finger</span> to draw on the pad.</p>
            <p>Click the<span style={{color: '#f57f17'}}> Enable Recognition</span> button and start drawing. The website will give you the best matching kanji in the list.</p>
            <br/>
            <p>Log in using your Google Account in order to access features such as deck creation, and an SRS study tool.</p>
            <p><span style={{color: '#00c853'}}>It&apos;s completely free! Start studying today!</span></p>

            <br/>
            <h3>Credits</h3>
            <p>Kanji SVGs and stroke orders provided by <a href={"https://kanjivg.tagaini.net/"} target="_blank">KanjiVG</a></p>
            <p>Kanji info provided by <a href={"https://kanjiapi.dev/"} target="_blank">kanjiapi.dev</a></p>
            <p>Kanji recognition courtesy of <a href={"https://github.com/CaptainDario/DaKanji-Single-Kanji-Recognition"} target="_blank">CaptainDario&apos;s Kanji recognition machine learning model</a></p>
            <br/>
            <p>Created by <a href={"https://github.com/sicfran774"} target="_blank">sicfran</a> 🤓</p>
            <p><a href={"https://www.buymeacoffee.com/sicfran"} target="_blank">Buy me a coffee ☕</a></p>
            <p>
                Questions or suggestions?&nbsp;
                <a href = "mailto:study@tracekanji.com?subject=Trace Kanji Feedback">
                    Contact me!
                </a>
            </p>
            <br/>
            <p>
                <button onClick={handleOpenDialog}>Changelog</button>
                <ChangelogDialog open={openDialog} onClose={handleCloseDialog} />
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAbout} color="primary">
            Close
          </Button>
        </DialogActions>
        
      </Dialog>
    )
  }

  return (
    <div className={styles.main}>
      <button onClick={handleOpenAbout}>About</button>
      <AboutDialog/>
    </div>
  )
}