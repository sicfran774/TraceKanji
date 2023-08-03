'use client'

import styles from './css/kanji-deck.module.css'
import { useSession } from 'next-auth/react';

export default function SignIn() {
    const {data, status} = useSession()
  
    if(status === 'authenticated'){
        return (
            <div className={styles.addToDeck}>
                <select name="decks" id="decks">
                    <option value="default">Default Deck (WIP)</option>
                </select>
                <button type="button" className='button'>Add to Deck</button>
            </div>
        )
    }
    return (
        <div></div>
    )
}