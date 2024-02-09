import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import styles from './css/changelog.module.css';

const ContactInfo = () => {
  return (
    <div className={styles.contactInfo}>
        <p>
            Questions or suggestions?&nbsp;
            <a href = "mailto:sicfran.774@gmail.com?subject=Trace Kanji Feedback">
                Contact me!
            </a>
        </p>
    </div>
  );
};

const Changelog = () => {
  return (
    <div className={styles.changelog}>
      <Typography variant="h6"><u>0.2.2 (2/9/2024)</u></Typography>
      <ul>
        <li>- Improved deck manager accessibility</li>
      </ul>
      <Typography variant="h6"><u>0.2.1 (2/8/2024)</u></Typography>
      <ul>
        <li>- Dark/light mode color schemes based on system</li>
        <li>- Added this changelog</li>
        <li>- Bug fixes</li>
      </ul>
      <Typography variant="h6"><u>0.2 (1/27/2024)</u></Typography>
      <ul>
        <li>- Kanji recognition! Click the &quot;Enable Kanji Recognition&quot; button to try it out!</li>
      </ul>
      <Typography variant="h6"><u>0.1 (11/30/2023)</u></Typography>
      <ul>
        <li>- Sign in to access deck manager to save specific kanji</li>
        <li>- Mobile-accessibility</li>
      </ul>
    </div>
  );
};

const ChangelogDialog = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className={styles.dialog}>
      <DialogTitle>Changelog</DialogTitle>
      <DialogContent>
        <ContactInfo />
        <Changelog />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangelogDialog;
