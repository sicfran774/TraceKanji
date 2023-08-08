'use client'

import {createContext, useState} from 'react'

export const SharedKanjiProvider = createContext(null)

export default function Provider({children}){
    const [sharedKanji, setSharedKanji] = useState({kanji: "", svg: ""})
    const [editingDeck, setEditingDeck] = useState(false)

    return (
        <SharedKanjiProvider.Provider value={{ sharedKanji, setSharedKanji, editingDeck, setEditingDeck }}>
            {children}
        </SharedKanjiProvider.Provider>
    )
}