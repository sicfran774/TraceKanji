'use client';

import { useState } from "react"
import styles from "./css/footer.module.css"

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

  

  return (
    <div className={styles.main}>
      <button onClick={handleOpenAbout}>About</button>
      <AboutDialog/>
    </div>
  )
}