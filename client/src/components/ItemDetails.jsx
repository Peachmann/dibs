import { forwardRef, useState } from 'react';
import {
  Grid,
  Box,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { DibsAlert } from './DibsAlert';
import { useAuth } from '../services/AuthContext';
import { dibsItem } from '../services/itemService';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const FullScreenDialog = ({
  open,
  setOpen,
  item,
  pictures,
  setDibsed
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [openDibsAlertDialog, setOpenDibsAlertDialog] = useState(false);
  const { user } = useAuth();

  const handleDibs = async () => {
    await dibsItem(item.ID, user);
    setDibsed(true);
    setOpenDibsAlertDialog(true);
  };

  if (pictures === null) return null;

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <DibsAlert
          open={openDibsAlertDialog}
          setOpen={setOpenDibsAlertDialog}
          closeDialog={handleClose}
          item={item}
          setDibsed={setDibsed}
        />
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Dibs item {item.title}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            backgroundColor: '#f5e8d5',
            width: '100%',
            height: '100%',
            display: 'flex'
          }}
        >
          <Grid sx={{}} container spacing={2}>
            <Grid
              item
              xs={6}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'
              }}
            >
              <Grid item xs={8}>
                <Carousel showStatus={false} showIndicators={false}>
                  {pictures.map((pic) => (
                    <div>
                      <img src={pic} />
                    </div>
                  ))}
                </Carousel>
              </Grid>
            </Grid>

            <Grid
              item
              xs={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Grid item xs={8}>
                <Typography variant="h4">{item.title}</Typography>

                <Typography variant="h6">{item.pickup_point}</Typography>

                <Typography variant="h6" component="p">
                  {item.description}
                </Typography>

                <Button onClick={handleDibs} variant="contained" size="large">
                  Dibs item!
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};
