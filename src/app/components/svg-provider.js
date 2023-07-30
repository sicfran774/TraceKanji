'use client'

import {createContext, useState} from 'react'

export const SharedKanjiProvider = createContext(null)

export default function Provider({children}){
    const [sharedKanji, setSharedKanji] = useState({kanji: "", svg: ""})

    return (
        <SharedKanjiProvider.Provider value={{ sharedKanji, setSharedKanji }}>
            {children}
        </SharedKanjiProvider.Provider>
    )
}