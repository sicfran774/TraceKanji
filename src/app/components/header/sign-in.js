'use client'

import styles from './css/sign-in.module.css'
import {useSession, signIn, signOut} from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ChangelogDialog from '../changelog/changelog';

export default function SignIn() {
    const {data, status} = useSession()
    const [profilePicWindow, setProfilePicWindow] = useState(false)
    const pfpAndMenuRef = useRef(null);

    const [openDialog, setOpenDialog] = useState(false)
    const [openAbout, setOpenAbout] = useState(false)

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenAbout = () => {
        console.log("?/")
        setOpenAbout(true);
    };

    const handleCloseAbout = () => {
        setOpenAbout(false);
    };

    const toggleMenu = () => {
        //console.log("toggle")
        setProfilePicWindow(!profilePicWindow)
    }

    const handleBlur = (event) => {
        if (!pfpAndMenuRef.current.contains(event.relatedTarget)) {
            //console.log("blur")
            setProfilePicWindow(false);
        }
    };

    const AboutDialog = () => {
        return (
          <Dialog open={openAbout} onClose={handleCloseAbout} scroll='paper'>
            <DialogTitle>About Trace Kanji</DialogTitle>
            <DialogContent>
              <div className={styles.main}>
                <h3>How to use this website</h3>
                <p>Use the search bar to lookup kanji meanings, on/kun readings, or the kanji itself. <span style={{color: '#1e88e5'}}>You can use kana as well!</span></p>
                <p>Click on a kanji to show info, and also overlay it on the draw area</p>
                <p>You can toggle the overlay, undo, and reset the drawing by using the buttons below the pad.</p>
                <p><span style={{color: '#1e88e5'}}>Click and drag (desktop)</span> or <span style={{color: '#1e88e5'}}>drag your finger</span> to draw on the pad.</p>
                <p>Click the<span style={{color: '#f57f17'}}> Enable Recognition</span> button and start drawing. The website will give you the best matching kanji in the list.</p>
                <br/>

                <h3>Deck creation and spaced-repetition studying</h3>
                <p>Log in using your Google Account in order to access features such as deck creation, and an SRS study tool.</p>
                <p><span style={{color: '#00c853'}}>It&apos;s completely free! Start studying today!</span></p>
    
                <br/>
                <h3>Credits</h3>
                <p>Kanji SVGs and stroke orders provided by <a href={"https://kanjivg.tagaini.net/"} target="_blank">KanjiVG</a></p>
                <p>Kanji info provided by <a href={"https://kanjiapi.dev/"} target="_blank">kanjiapi.dev</a></p>
                <p>Kanji recognition courtesy of <a href={"https://github.com/CaptainDario/DaKanji-Single-Kanji-Recognition"} target="_blank">CaptainDario&apos;s Kanji recognition machine learning model</a></p>
                <br/>
                <p>Created by <a href={"https://github.com/sicfran774"} target="_blank">sicfran</a> 🤓</p>
                <p><a href={"https://www.buymeacoffee.com/sicfran"} target="_blank">Buy me a coffee ☕</a></p>
                <p>
                    Questions or suggestions?&nbsp;
                    <a href = "mailto:study@tracekanji.com?subject=Trace Kanji Feedback">
                        Contact me!
                    </a>
                </p>
                <br/>
                <p>
                    <button onClick={handleOpenDialog}>Changelog</button>
                    <ChangelogDialog open={openDialog} onClose={handleCloseDialog} />
                </p>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAbout} color="primary">
                Close
              </Button>
            </DialogActions>
            
          </Dialog>
        )
      }
  
    if(status === 'authenticated'){
        return (
            <div className={styles.signIn}>
                <div
                    ref={pfpAndMenuRef}
                    className={styles.pfpAndMenu}
                    onClick={() => setProfilePicWindow(true)}
                    onBlur={handleBlur}
                    tabIndex={0}
                >
                    <img
                        id="profilePic" 
                        className={styles.welcome} 
                        src={data.user.image}
                    />
                    {profilePicWindow &&
                    <div className={styles.menu} tabIndex={0}>
                        <ul>
                            <li>
                                <p>📈</p>
                                <p>Coming Soon</p>
                            </li>
                            <li>
                                <p>⚙️</p>
                                <p>Coming Soon</p>
                            </li>
                            <li onClick={() => handleOpenAbout()}>
                                <p style={{marginLeft: "5px", marginRight: "10px"}}>🛈</p>
                                <p>Help/About</p>
                            </li>
                            <li onClick={() => signOut()}>
                                <p>🚪🏃</p>
                                <p>Log Out</p>
                            </li>
                        </ul>
                    </div>
                }
                </div>
                <AboutDialog/>
            </div>
        )
    }
    return (
        <div className={styles.signIn}>
            <div
                ref={pfpAndMenuRef}
                className={styles.pfpAndMenu}
                onClick={() => setProfilePicWindow(true)}
                onBlur={handleBlur}
                tabIndex={0}
            >
                <div
                    id="profilePic" 
                    className={styles.welcome}
                    style={{padding: "10px", width: "80px"}}
                >
                    Sign In
                </div>
                {profilePicWindow &&
                <div className={styles.menu} style={{height: "160px"}} tabIndex={0}>
                    <ul>
                        <li onClick={() => handleOpenAbout()}>
                            <p style={{marginLeft: "5px", marginRight: "10px"}}>🛈</p>
                            <p>About</p>
                        </li>
                        <li onClick={() => signIn('google')}>
                            <img className={styles.google} src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"/>
                            <p>Sign In with Google</p>
                        </li>
                    </ul>
                </div>
            }
            </div>
            <AboutDialog/>
        </div>
    )
}

