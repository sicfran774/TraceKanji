'use client'

import SignIn from "./sign-in"
import styles from "./css/header.module.css"
import SVG from 'react-inlinesvg'
import { useState, useEffect } from "react"

export default function Header(){
    const [logoSVG, setLogoSVG] = useState("")

    useEffect(() => {
        chooseLogo()
    }, [])

    const onClick = () => {
        location.reload()
    }
    
    const chooseLogo = async () => {
        if (window.matchMedia && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
            fetch("/logos/TraceKanjiLogos_LightMode.svg")
                .then(response => response.text())
                .then(text => setLogoSVG(text))
        } else {
            fetch("/logos/TraceKanjiLogos_DarkMode_NoBG.svg")
                .then(response => response.text())
                .then(text => setLogoSVG(text))
        }
    }

    return(
        <div className={styles.header}>
            <div className={styles.title} onClick={() => {}}>
                <SVG className={styles.websiteLogo} src={logoSVG} />
            </div>
            <SignIn />
        </div>
    )
}