'use client'

import SVG from 'react-inlinesvg'
import styles from './css/kanji-overlay.module.css';
import { useContext, useEffect, useState} from "react";
import { SharedKanjiProvider } from '../shared-kanji-provider';

export default function KanjiOverlay() {
    const [hydrated, setHydrated] = useState(false);
    let { sharedKanji } = useContext(SharedKanjiProvider)

    useEffect(() => {
        setHydrated(true);
    }, []);

    if (!hydrated) {
        // Returns null on first render, so the client and server match
        return null;
    }

    return (
        <div className={styles.overlay}>
            <SVG src={sharedKanji.svg} alt="Kanji" className={styles.kanji} />
        </div>
    )
}
  