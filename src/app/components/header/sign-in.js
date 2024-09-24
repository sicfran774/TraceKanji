'use client'

import styles from './css/sign-in.module.css'
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect, useRef, useContext, Fragment } from 'react';
import { SharedKanjiProvider } from '../shared-kanji-provider';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, IconButton, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChangelogDialog from '../changelog/changelog';
import { ThemeProvider } from '@mui/material/styles'
import SettingsPage from './settings';
import { darkTheme, lightTheme } from '@/app/util/colors';

export default function SignIn() {

    const {data, status} = useSession()
    const [profilePicWindow, setProfilePicWindow] = useState(false)
    const pfpAndMenuRef = useRef(null);

    const [openDialog, setOpenDialog] = useState(false)
    const [openAbout, setOpenAbout] = useState(false)
    const [openSettings, setOpenSettings] = useState(false)
    const [openSnack, setOpenSnack] = useState(true)
    const [openAlertSnack, setOpenAlertSnack] = useState(true)

    let { userSettings, setUserSettings, userStats, setUserStats, theme, setTheme } = useContext(SharedKanjiProvider)

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

    useEffect(() => {
        if(status === "authenticated"){
            fetchUserSettings()
            fetchUserStats()
            //updateLogInDB(data.user.email, moment())
        }
    }, [status])

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenAbout = () => {
        setOpenAbout(true);
    };

    const handleCloseAbout = () => {
        setOpenAbout(false);
    };

    const handleOpenSettings = () => {
        setOpenSettings(true);
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    const handleCloseSnack = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setOpenSnack(false)
    }

    const handleCloseAlertSnack = (event, reason) => {
        if (reason === "clickaway") {
            return
        }
        setOpenAlertSnack(false)
    }

    const toggleMenu = () => {
        //console.log("toggle")
        setProfilePicWindow(!profilePicWindow)
    }

    const fetchUserSettings = async () => {
        try{
            let settings = (await fetch(`api/mongodb/settings/${data.user.email}`).then(result => result.json())).settings

            if(settings){
                //Check if user has all needed settings
                if(!settings.timeReset){
                    settings = Object.assign({timeReset: 0}, settings)
                }
                setUserSettings(settings)

            } else {
                throw new Error("Failed to fetch settings for user.")
            }
        } catch (e){
            console.error(e)
            await fetchUserSettings()
        }
    }

    const fetchUserStats = async () => {
        try {
            const stats = (await fetch(`api/mongodb/stats/${data.user.email}`).then(result => result.json())).stats

            if(stats){
                setUserStats(stats)
            } else {
                setUserStats({
                    dayStreak: 0,
                    studied: [],
                })
            }
            

        } catch (e) {
            console.error(e)
            await fetchUserStats()
        }
    }

    const handleBlur = (event) => {
        if (!pfpAndMenuRef.current.contains(event.relatedTarget)) {
            //console.log("blur")
            setProfilePicWindow(false);
        }
    };

    const action = (
        <Fragment>
          <Button size="small" onClick={handleOpenAbout}>
            How to use this website
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnack}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Fragment>
    );

    const SnackAlert = () => {
        return <Snackbar 
            open={openAlertSnack} 
            autoHideDuration={6000} 
            onClose={handleCloseAlertSnack}
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        >
            <Alert
                onClose={handleCloseAlertSnack}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                Kanji recognition has returned! Thank you for your patience!
            </Alert>
        </Snackbar>
    }

    const SignedInTutorial = () => {
        return (
        <>
            <h2 style={{color: "cyan"}}>User-exclusive features</h2>
            <h3>Deck Creation</h3>
            <p>Access deck features by clicking on &quot;<span style={{color: "#32abe3"}}>Start Studying</span>&quot; above the drawing pad.</p>
            <p>Type a name and click on &quot;<span style={{color: "#32abe3"}}>Create New Deck</span>&quot;</p>
            <p>To add kanji to the deck, click on &quot;<span style={{color: "#32abe3"}}>Edit Deck</span>&quot; and then &quot;<span style={{color: "#32abe3"}}>Add/Remove Kanji</span>&quot;</p>
            <p>You can access more deck settings by clicking on &quot;<span style={{color: "#32abe3"}}>Deck Settings</span>&quot;</p>
            <br/>
            <h3>Accessing Deck</h3>
            <p>To change the list to display the kanji in your deck, click the dropdown next to &quot;<span style={{color: "#32abe3"}}>Start Studying</span>&quot;.
            By default, it will show &quot;<span style={{color: "cyan"}}>All Kanji</span>&quot;.</p>
            <br/>
            <h3>Study Tool</h3>
            <p>To start a study session, click on &quot;<span style={{color: "#fc2be7"}}>Start Study</span>&quot; on the desired deck in the Deck Manager.</p>
            <p>Trace Kanji&apos;s study tool is inspired by <a href='https://apps.ankiweb.net/' target='_blank'>Anki&apos;s spaced-repetition system.</a></p>
            <br/>
            <p>1. Look at the keyword at the top, and attempt to redraw that kanji from memory.</p>
            <p>2. Click &quot;<span style={{color: "#fc2be7"}}>Show Answer</span>&quot;, and check how you did.</p>
            <p>3. Pick your confidence in recalling that kanji by choosing
                <span style={{color: "red"}}> Again</span>, 
                <span style={{color: "orange"}}> Hard</span>, 
                <span style={{color: "green"}}> Good</span>, or 
                <span style={{color: "cyan"}}> Easy</span>.</p>
            <p>Under each choice, you can see a time interval. This means that the card will reappear after that amount of time. For example, if the confidence
                you chose had <span style={{color: "#fc2be7"}}>1d</span>, the kanji will reappear after one day.
            </p>
        </>
        )
    }

    const AboutDialog = () => {
        return (
          <Dialog className={styles.aboutDialog} open={openAbout} onClose={handleCloseAbout} scroll='paper'>
            <DialogTitle>About Trace Kanji</DialogTitle>
            <DialogContent>
              <div className={styles.main}>
                <h3 style={{color: "#00c853"}}>How to use this website</h3>
                <p>Use the search bar to lookup kanji meanings, on/kun readings, or the kanji itself. <span style={{color: '#1e88e5'}}>You can use kana as well!</span></p>
                <p>Click on a kanji to show info, and also overlay it on the draw area</p>
                <p>You can toggle the overlay, undo, and reset the drawing by using the buttons below the drawing pad.</p>
                <p><span style={{color: '#1e88e5'}}>Click and drag (desktop)</span> or <span style={{color: '#1e88e5'}}>drag your finger</span> to draw on the pad.</p>
                <p>Click the<span style={{color: '#f57f17'}}> Enable Kanji Recognition</span> button and start drawing. The website will give you the best matching kanji in the list.</p>
                <br/><hr/><br/>

                {status !== "authenticated" ? (
                    <>
                    <h3 style={{color: "#00c853"}}>Sign-in to access more useful features!</h3>
                    <p>Log in using your Google Account in order to access features such as deck creation, an SRS study tool, and more.</p>
                    <p><span style={{color: '#00c853'}}>It&apos;s completely free! Start studying today!</span></p>
                    </>
                ) : <SignedInTutorial/>}
                

                <br/><hr/><br/><br/>
                <h3>Credits</h3>
                <p>Logo and UI/UX designed by <a href={"https://jemrra.artstation.com"} target="_blank">Jemrra</a></p>
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
            <ThemeProvider theme={theme}>
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
                            alt='☰ Menu'
                        />
                        {profilePicWindow &&
                        <div className={styles.menu} tabIndex={0}>
                            <ul>
                                <li className={styles.helloName}>
                                    <p style={{fontSize: "15px", overflow: "hidden"}}>{data.user.name.split(" ")[0]}, こんにちは!</p>
                                </li>
                                <li>
                                    <p>📈</p>
                                    <div>
                                        <p style={{marginBottom: "0px"}}>Stats</p>
                                        <p style={{fontSize: "10px", margin: "0px"}}>Coming soon...</p>
                                    </div>
                                    <p style={{fontSize: "14px", color: "blue"}}>Day Streak: <span style={{fontWeight: "bold"}}>{userStats.dayStreak}</span></p>
                                </li>
                                <li onClick={() => handleOpenSettings()} className={styles.menuButton}>
                                    <p>⚙️</p>
                                    <p>Settings</p>
                                </li>
                                <li onClick={() => handleOpenAbout()} className={styles.menuButton}>
                                    <p style={{marginLeft: "3px", marginRight: "12px", border: "solid black", borderRadius: "10px",padding:"0px 2px"}}>ℹ️</p>
                                    <p>Help/About</p>
                                </li>
                                <li onClick={() => signOut()} className={styles.menuButton}>
                                    <p>🚪🏃</p>
                                    <p>Log Out</p>
                                </li>
                            </ul>
                        </div>
                    }
                    </div>
                    <AboutDialog/>
                    <SettingsPage 
                        open={openSettings} 
                        onClose={handleCloseSettings} 
                        theme={theme} 
                        userSettings={userSettings}
                        setUserSettings={setUserSettings}
                        email={data.user.email}
                    />
                </div>
                {/* <SnackAlert/> */}
            </ThemeProvider>
        )
    }
    return (
        <ThemeProvider theme={theme}>
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
                        style={{padding: "10px", width: "100px"}}
                    >
                        <span style={{fontFamily: 'UDDigitalKyokasho', fontSize: "18px"}}>☰ Menu</span>
                    </div>
                    {profilePicWindow &&
                    <div className={styles.menu} style={{height: "160px"}} tabIndex={0}>
                        <ul>
                            <li onClick={() => handleOpenAbout()} className={styles.menuButton}>
                                <p style={{marginLeft: "5px", marginRight: "10px"}}>🛈</p>
                                <p>Help/About</p>
                            </li>
                            <li onClick={() => signIn('google')} className={styles.menuButton}>
                                <img className={styles.google} src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"/>
                                <p>Sign In with Google</p>
                            </li>
                        </ul>
                    </div>
                }
                </div>
                <AboutDialog/>
            </div>
            {/* <SnackAlert/> */}
            <Snackbar
                open={openSnack}
                onClose={handleCloseSnack}
                message="Welcome to Trace Kanji!"
                action={action}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
            />
            
        </ThemeProvider>
    )
}

