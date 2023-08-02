'use client'

import styles from './css/sign-in.module.css'
import {useSession, signIn, signOut} from 'next-auth/react';

export default function SignIn() {
    const {data, status} = useSession()
  
    if(status === 'authenticated'){
        return (
            <div className={styles.signIn}>
                <h3 className={styles.welcome}>Welcome, {data.user.name}</h3>
                <button type="button" onClick={() => signOut()} className='button'>Sign Out</button>
            </div>
        )
    }
    return (
        <div className={styles.signIn}>
            <button type="button" onClick={() => signIn('google')}className='button'>Login</button>
        </div>
    )
}

