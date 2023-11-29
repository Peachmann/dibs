import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { useState } from 'react';
import { SellSharp, FavoriteRounded } from '@mui/icons-material';
import { SellDialog } from './SellDialog';

const actionSize = {
  width: 50,
  height: 50,
  backgroundColor: 'lightblue'
};

export const SellButton = () => {
  const [openSellingDialog, setOpenSellingDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenSellingDialog(true);
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          transform: 'translateZ(0px)',
          flexGrow: 1,
          bottom: 20,
          right: 20
        }}
      >
        <SpeedDial
          ariaLabel="Sell Item"
          sx={{
            position: 'relative',
            '& .MuiFab-primary': {
              width: 80,
              height: 80
            }
          }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            key={'Sell'}
            icon={<SellSharp />}
            tooltipTitle={'Sell'}
            sx={actionSize}
            onClick={() => handleClickOpen(true)}
          />
        </SpeedDial>

        <SellDialog open={openSellingDialog} setOpen={setOpenSellingDialog} />
      </Box>
    </>
  );
};
