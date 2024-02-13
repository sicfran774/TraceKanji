import styles from './css/study.module.css'
import { useEffect } from 'react'

export default function Study({ deck, setStudying }){

    useEffect(() => {
        console.log(deck)
    }, [ ,deck])

    const endStudy = () => {
        setStudying(false)
    }

    return (
        <div className={styles.main}>
            {deck}
            <button onClick={() => endStudy()}>End Study</button>
        </div>
    )
}