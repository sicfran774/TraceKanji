import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button } from '@mui/material';
import styles from '../../changelog/css/changelog.module.css'
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from '@/app/util/colors';
import { useEffect, useState } from 'react';

const DeckInterval = () => {
    return (
      <div className={styles.changelog}>
        <p className={styles.tooltip}>A card&apos;s learning interval determines when it will show up again.</p>
        <p className={styles.tooltip}>If you say &quot;Good&quot; on a card, it will go up a learning step.</p>
        <p className={styles.tooltip}>Steps are separated by commas.</p>
        <p className={styles.tooltip}>Example: 10s,10m,1h,1d,1M,1y</p>
        <p className={styles.tooltip}>10 seconds, 10 minutes, 1 hour, 1 day, 1 month, 1 year.</p>
      </div>
    );
};

const GradInterval = () => {
    return (
      <div className={styles.changelog}>
        <p className={styles.tooltip}>Interval after &quot;Good&quot; is clicked on the final learning step.</p>
        <p className={styles.tooltip}>Pressing &quot;Good&quot; on this step will graduate it, making it susceptible to the ease factor.</p>
      </div>
    );
};

const EasyInterval = () => {
    return (
      <div className={styles.changelog}>
        <p className={styles.tooltip}>Interval after &quot;Easy&quot; is clicked on a learning card.</p>
        <p className={styles.tooltip}>This will instantly graduate the card.</p>
      </div>
    );
};

const Ease = () => {
    return (
      <div className={styles.changelog}>
        <p className={styles.tooltip}>If a card is graduated and the user clicks &quot;Good&quot;, the interval will increase by this multiplier.</p>
        <p className={styles.tooltip}>For example, if the ease is &quot;3&quot;, a card with a &quot;3d&quot; interval will increase to &quot;9d&quot;.</p>
      </div>
    );
};

const Easy = () => {
    return (
      <div className={styles.changelog}>
        <p className={styles.tooltip}>If a card is graduated and the user clicks &quot;Easy&quot;, the interval will increase by the ease factor plus this easy factor.</p>
        <p className={styles.tooltip}>For example, if the ease is &quot;1.5&quot; and the easy factor is &quot;0.5&quot;, the card&apos;s interval will be multiplied by &quot;2&quot;.</p>
      </div>
    );
};

const NewCards = () => {
  return (
    <div className={styles.changelog}>
      <p className={styles.tooltip}>The maximum amount of new cards that will appear. Set this number lower or to 0 if you are struggling with remembering your current cards.</p>
      <p className={styles.tooltip}>This number is represented in <span style={{color: "lightblue"}}>blue</span>.</p>
    </div>
  );
};

const MaxCards = () => {
  return (
    <div className={styles.changelog}>
      <p className={styles.tooltip}>The maximum amount of reviews you can do per day. This is indicated in <span style={{color: "red"}}>red</span> (learning) and <span style={{color: "green"}}>green</span> (graduated).</p>
    </div>
  );
};

const sections = [DeckInterval(), GradInterval(), EasyInterval(), Ease(), Easy(), NewCards(), MaxCards()]

export default function DeckInfoDialog({ open, onClose, section }){
    const titles = ["Learning interval", "Graduating interval", "Easy interval", "Ease", "Easy factor", "New cards/day", "Max reviews/day"]

    const [theme, setTheme] = useState(lightTheme)

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

    return (
      <ThemeProvider theme={theme}>
        <Dialog open={open} onClose={onClose} className={styles.dialog} scroll='paper'>
        <DialogTitle>{titles[section]}</DialogTitle>
        <DialogContent>
            {sections[section]}
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary">
                Close
            </Button>
        </DialogActions>
        </Dialog>
      </ThemeProvider>
    );
};