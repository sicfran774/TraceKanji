'use client';

import { useState } from "react"
import ChangelogDialog from "../changelog/changelog";
import styles from "./css/footer.module.css"

export default function Footer(){

    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
      };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
      <div className={styles.main}>
        <p>Created by <a href={"https://github.com/sicfran774"} target="_blank">sicfran</a> 🤓</p>
        <p><a href={"https://www.buymeacoffee.com/sicfran"} target="_blank">Buy me a coffee ☕</a></p>
        <p>
            Questions or suggestions?&nbsp;
            <a href = "mailto:study@tracekanji.com?subject=Trace Kanji Feedback">
                Contact me!
            </a>
        </p>
        <p>
            <button onClick={handleOpenDialog}>Changelog</button>
            <ChangelogDialog open={openDialog} onClose={handleCloseDialog} />
        </p>
      </div>
    )
}