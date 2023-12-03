import { forwardRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const DibsAlert = ({ open, setOpen, item, closeDialog }) => {
  const handleClose = () => {
    closeDialog();
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Item dibsed successfully!'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            You have successfully dibsed the item {item.title}. We let the
            seller know that you are interested in the item, please contact the
            seller on Telegram. Seller contact: {item.seller_username}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Understood!</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
