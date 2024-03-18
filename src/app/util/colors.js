import { createTheme } from "@mui/material"

export const selectedColor = '#31a387'
export const selectedDarkModeColor = '#31a387'
export const darkModeColor = '#2d313a'
export const darkModeBackgroundColor = '#101012'

export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export const lightTheme = createTheme({
    palette: {
      mode: 'light',
    },
});