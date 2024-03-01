'use client'

import SignIn from "./sign-in"
import styles from "./css/header.module.css"

export default function Header(){
    function onClick(){
        location.reload()
    }

    return(
        <div className={styles.header}>
            <div className={styles.title} onClick={() => onClick()}>
                <h1>Trace Kanji</h1>
                <span>Kanji tracer and handwriting recognition</span>
            </div>
            <SignIn />
        </div>
    )
}