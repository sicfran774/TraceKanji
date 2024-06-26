'use client'

import {createContext, useState} from 'react'

export const SharedKanjiProvider = createContext(null)

export default function Provider({children}){
    const [sharedKanji, setSharedKanji] = useState({kanji: "", svg: ""})
    const [editingDeck, setEditingDeck] = useState(false)
    const [selectedKanji, setSelectedKanji] = useState([])
    const [userSettings, setUserSettings] = useState({penWidth: 5, autoShowTracing: true})
    const [userStats, setUserStats] = useState({dayStreak: 0, studied: []})

    return (
        <SharedKanjiProvider.Provider 
            value={{ sharedKanji, setSharedKanji, 
                editingDeck, setEditingDeck, 
                selectedKanji, setSelectedKanji,
                userSettings, setUserSettings,
                userStats, setUserStats
            }}
        >
            {children}
        </SharedKanjiProvider.Provider>
    )
}