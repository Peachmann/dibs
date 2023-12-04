import {
  Dialog,
  Slider,
  Box,
  styled,
  alpha,
  Typography,
  DialogActions,
  Button
} from '@mui/material';
import { useState } from 'react';

const FilterGrid = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.5),
  border: '1px solid #E0E0E0',
  borderRadius: theme.shape.borderRadius,
  minHeight: '60vh',
  minWidth: '40vh',
  maxHeight: '60vh',
  maxWidth: '40vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
}));

const PriceSlider = ({ priceFilter }) => {
  const minRange = 10;

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      priceFilter[1]([
        Math.min(newValue[0], priceFilter[0][1] - minRange),
        priceFilter[0][1]
      ]);
    } else {
      priceFilter[1]([
        priceFilter[0][0],
        Math.max(newValue[1], priceFilter[0][0] + minRange)
      ]);
    }
  };

  return (
    <>
      <Typography variant="h6">
        Price range: {priceFilter[0][0]} - {priceFilter[0][1]} EUR
      </Typography>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        sx={{ marginLeft: '3%' }}
        value={priceFilter[0]}
        onChange={handleChange1}
        valueLabelDisplay="auto"
        disableSwap
        max={300}
      />
    </>
  );
};

export const FilterDialog = ({ open, setOpen, priceFilter }) => {
  const [originalPrice, setOriginalPrice] = useState([
    priceFilter[0][0],
    priceFilter[0][1]
  ]);
  const [newPriceFilter, setNewPriceFilter] = useState([
    priceFilter[0][0],
    priceFilter[0][1]
  ]);

  const handleClose = () => {
    setNewPriceFilter([originalPrice[0], originalPrice[1]]);
    setOpen(false);
  };

  const filterItems = () => {
    setOriginalPrice([newPriceFilter[0], newPriceFilter[1]]);
    priceFilter[1]([newPriceFilter[0], newPriceFilter[1]]);

    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <FilterGrid
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Box
          sx={{
            alignSelf: 'flex-start',
            marginTop: '5%',
            marginLeft: '5%',
            display: 'flex',
            flexDirection: 'column',
            width: '85%'
          }}
        >
          <PriceSlider priceFilter={[newPriceFilter, setNewPriceFilter]} />
        </Box>

        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" onClick={filterItems}>
            Set Filters!
          </Button>
        </DialogActions>
      </FilterGrid>
    </Dialog>
  );
};
