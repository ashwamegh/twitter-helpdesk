import React from 'react';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const handleLogout = () => {
  firebase.auth().signOut();
  localStorage.removeItem('twitterHelpdesk.expectSignIn');
}

const SimpleAppBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Twitter HelpDesk
          </Typography>
          <Button color="inherit" onClick={() => handleLogout()}>Logout</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default SimpleAppBar;