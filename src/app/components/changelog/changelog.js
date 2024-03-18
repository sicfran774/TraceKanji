import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import styles from './css/changelog.module.css';

const ContactInfo = () => {
  return (
    <div className={styles.contactInfo}>
        <p>
            Questions or suggestions?&nbsp;
            <a href = "mailto:study@tracekanji.com?subject=Trace Kanji Feedback">
                Contact me!
            </a>
        </p>
    </div>
  );
};

const Changelog = () => {
  return (
    <div className={styles.changelog}>
      <Typography variant="h6"><u>0.3.3 (3/18/2024)</u></Typography>
      <ul>
        <li>- <b>Added feature:</b> Change user settings</li>
        <li>- <b>Added feature:</b> Daily kanji reminder</li>
        <li>- Edit drawing pen width, change study settings, and get daily kanji reminders to your email</li>
        <li>- Correct dialog themes based on light/dark mode</li>
        <li>- Fixed light/dark mode switching errors</li>
        <li>- Added help info on usage of deck features and study tool</li>
      </ul>
      <Typography variant="h6"><u>0.3.2 (3/15/2024)</u></Typography>
      <ul>
        <li>- Change deck max cards/day and max reviews/day</li>
        <li>- Reduce the amount of cards due everyday to your own pace</li>
        <li>- Added Jinmeiyō kanji</li>
        <li>- Forced zoom out on mobile</li>
        <li>- Bug fixes</li>
      </ul>
      <Typography variant="h6"><u>0.3.1 (3/5/2024)</u></Typography>
      <ul>
        <li>- <b>Added feature:</b> Change deck settings</li>
        <li>- Edit name, learning interval, ease, and more.</li>
        <li>- Bug fixes</li>
      </ul>
      <Typography variant="h6"><u>0.3 (2/29/2024)</u></Typography>
      <ul>
        <li>- <b>New study feature!</b> Go to Deck Manager and click &quot;Start Study&quot; on any of your created decks.</li>
        <li>- Spaced-repetition system, streamlining which cards to study that day</li>
        <li>- Edit cards to change the hint that appears; cards default to Heisig keywords</li>
        <li>- Reset card intervals</li>
        <li>- Able to download a backup of your decks in case of any data loss. Contact me if this occurs.</li>
      </ul>
      <Typography variant="h6"><u>0.2.3 (2/10/2024)</u></Typography>
      <ul>
        <li>- Fixed search bar where it loses focus if no kanji are found</li>
        <li>- Added grid lines in draw area</li>
        <li>- Improved feedback when kanji recognition is enabled (light-mode background changes)</li>
      </ul>
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
    <Dialog open={open} onClose={onClose} className={styles.dialog} scroll='paper'>
      <DialogTitle>Changelog </DialogTitle>
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
