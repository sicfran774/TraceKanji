'use client'

import styles from './css/kanji.module.css';
import { useEffect, useState} from "react";

export default function Kanji() {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }

    return (
        <div className={styles.card}>
            <img src="./kanji/test.svg" alt="test" className={styles.overlay}></img>
        </div>
    )
}
  