'use client'

import styles from './css/kanji-overlay.module.css';
import { useEffect, useState} from "react";

export default function KanjiOverlay() {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }

    return (
        <div className={styles.overlay}>
            <img src="./kanji/test.svg" alt="test" className={styles.kanji}></img>
        </div>
    )
}
  