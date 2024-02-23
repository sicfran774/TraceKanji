import styles from './css/study.module.css'
import { useEffect, useState } from 'react'
import StudyButtons from './study-buttons'

export default function Study({ deck, setStudying }){

    const [showAnswer, setShowAnswer] = useState(false);

    useEffect(() => {
        //console.log(deck)
    }, [ ,deck])

    const endStudy = () => {
        setStudying(false)
    }

    const answerFalse = () => {
        setShowAnswer(false)
    }

    const answerTrue = () => {
        setShowAnswer(true)
    }

    return (
        <div className={styles.main}>
            <div className={styles.info}>
                {deck}
                <button onClick={() => endStudy()}>End Study</button>
            </div>
            {showAnswer ? <StudyButtons/> : 
            (<div className={styles.showAnswerDiv}>
                <button onClick={() => answerTrue()}>Show Answer</button>
            </div>)}
        </div>
    )
}