// theme.ts
import { deepOrange } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
  },
});

export default theme;
