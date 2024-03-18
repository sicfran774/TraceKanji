import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles'
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, Slider, Checkbox, FormControl } from '@mui/material';
import { updateSettingsInDB } from '@/app/util/interval';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import styles from './css/settings.module.css'

export default function SettingsPage({ open, onClose, theme, userSettings, setUserSettings, email }){

    const [sliderValue, setSliderValue] = useState(userSettings.penWidth)
    const [autoShowTracing, setAutoShowTracing] = useState(userSettings.autoShowTracing)
    const [subscribed, setSubscribed] = useState(userSettings.subscribed)

    useEffect(() => {
        setSliderValue(userSettings.penWidth)
        setAutoShowTracing(userSettings.autoShowTracing)
        setSubscribed(userSettings.subscribed)
    }, [userSettings])

    const changePenWidth = (event, value) => {
        setSliderValue(value)
    }

    const changeAutoShowTracing = (event) => {
        setAutoShowTracing(event.target.checked)
    }

    const changeSubscribed = (event) => {
        setSubscribed(event.target.checked)
    }

    const saveSettingsAndQuit = () => {
        const newUserSettings = {
            penWidth: sliderValue,
            autoShowTracing: autoShowTracing,
            subscribed: subscribed
        }
        setUserSettings(newUserSettings)
        const result = updateSettingsInDB(email, newUserSettings)
        onClose()
    }

    return (
        <ThemeProvider theme={theme}>
            <Dialog className={styles.aboutDialog} open={open} onClose={onClose} scroll='paper'>
                <DialogTitle>User Settings</DialogTitle>
                <DialogContent>
                    <FormControl>
                        <FormGroup>
                            <h3>Draw Settings</h3>
                            <div>
                                Pen width: {sliderValue}
                                <Slider
                                    min={5}
                                    max={20}
                                    step={1}
                                    value={sliderValue}
                                    onChange={changePenWidth}
                                    aria-labelledby="continuous-slider"
                                />
                            </div>
                            <h3>Study Settings</h3>
                            <div>
                                <FormControlLabel 
                                    control={
                                    <Checkbox 
                                        checked={autoShowTracing} 
                                        onChange={changeAutoShowTracing}
                                    />} 
                                    label="Auto show kanji tracing after hitting &quot;Show Answer&quot;" 
                                />
                                <FormControlLabel 
                                    control={
                                    <Checkbox 
                                        checked={subscribed} 
                                        onChange={changeSubscribed}
                                    />} 
                                    label="Get daily email reminders to study due kanji in your decks" 
                                />
                            </div>
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={saveSettingsAndQuit} color="primary">
                        save
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}