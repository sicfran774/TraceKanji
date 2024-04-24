import { useState, useEffect } from "react"
import { updateDecksInDB } from "@/app/util/interval";

import { darkTheme, lightTheme } from '@/app/util/colors';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'
import { CircularProgress } from "@mui/material"
 
import styles from "./css/premade-decks.module.css"

export default function PremadeDeck({openDialog, handleCloseDialog, allDecks, email, addedDeck, setAddedDeck}) {

    const [theme, setTheme] = useState(lightTheme)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme(darkTheme)
        } else {
            setTheme(lightTheme)
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            setTheme(event.matches ? darkTheme : lightTheme)
        })
    }, [])

    const addDeckToAccount = async (deckName) => {
        try {
            console.log(allDecks)
            setLoading(true)
            const premadeDeck = (await fetch(`api/mongodb/premade/${deckName}`).then(result => result.json())).deck
            allDecks.push(premadeDeck)
            updateDecksInDB(email, allDecks)
            setAddedDeck(true)
        } catch (e) {
            console.error("Failed to add premade deck to user account")
        } finally {
            setLoading(false)
        }
    }

    const PremadeDialog = () => {
        return (
        <Dialog className={styles.dialog} open={openDialog} onClose={handleCloseDialog} scroll='paper'>
            <DialogTitle>Pre-made Decks 📚</DialogTitle>
            <DialogContent>
            <div className={styles.main}>
                <ul>
                    <li>
                        <h3>RTK (Remembering the Kanji) Deck </h3>
                        <p>This deck contains all 2200 kanji from Heisig&apos;s Remembering the Kanji 6th edition.</p>
                        <button type="button" className={styles.addDeckButton} onClick={() => addDeckToAccount("RTK")}>Add to Deck List</button>
                        {loading && <CircularProgress size="24px"/>}
                    </li>
                </ul>
                {addedDeck && 
                    <div className={styles.deckAdded}>
                        <p>Deck added. Close this window to continue.</p>
                    </div>
                }
                <div>
                    <h4><a href={"mailto:study@tracekanji.com?subject=Trace Kanji Feedback"}>Contact me</a> if you have any suggestions on more pre-made decks.</h4>
                </div>
            </div>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
                Close
            </Button>
            </DialogActions>
            
        </Dialog>
        )
    }

    return (
        <ThemeProvider theme={theme}>
            <PremadeDialog/>
        </ThemeProvider>
    )
}