import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles'
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import styles from './css/settings.module.css'

export default function SettingsPage({ open, onClose, theme }){
    return (
        <ThemeProvider theme={theme}>
            <Dialog className={styles.aboutDialog} open={open} onClose={onClose} scroll='paper'>
                <DialogTitle>User Settings</DialogTitle>
                <DialogContent>
                    <div className={styles.main}>
                    
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )

    
}