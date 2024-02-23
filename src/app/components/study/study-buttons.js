import styles from './css/study-buttons.module.css'
import { useEffect } from 'react'

export default function StudyButtons({ deck }){

    return (
        <div className={styles.main}>
            <div className={styles.buttonDiv}>
                <button onClick={() => {}}>Again</button>
                <p>Time</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => {}}>Hard</button>
                <p>Time</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => {}}>Good</button>
                <p>Time</p>
            </div>
            <div className={styles.buttonDiv}>
                <button onClick={() => {}}>Easy</button>
                <p>Time</p>
            </div>
        </div>
    )
}