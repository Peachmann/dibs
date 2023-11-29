import '../styles.css';
import {
  Card,
  IconButton,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Button,
  Typography,
  Grid,
  CardHeader,
  Box,
  styled,
  alpha
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import { FullScreenDialog } from './ItemDetails';

export const AvailableItem = ({ item }) => {
  return (
    <Card variant="outlined" sx={{ maxWidth: 345 }}>
      <CardHeader title={item.title} />
      <CardMedia sx={{ height: 140 }} image={item.picture} title={item.title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {item.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">DIBS</Button>
      </CardActions>
    </Card>
  );
};

const PriceGrid = styled(Grid)(({ theme }) => ({
  background: alpha(theme.palette.primary.main, 0.5),
  border: '1px solid #E0E0E0',
  borderRadius: theme.shape.borderRadius,
  justifyContent: 'center',
  display: 'flex'
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  color: 'white'
}));

const FavoriteButton = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    console.log('Favorite button clicked');
    setIsFavorite(!isFavorite);
    console.log(isFavorite);
  };

  const FavButton = styled(IconButton)(({ theme }) => ({
    color: isFavorite
      ? theme.palette.secondary.main
      : theme.palette.background.paper,
    border: '1px solid ' + theme.palette.primary.main,
    borderRadius: '50%',
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  }));

  return (
    <FavButton onClick={toggleFavorite}>
      <FavoriteIcon />
    </FavButton>
  );
};

export const DibsItem = ({ hg, item }) => {
  const [openDibsDialog, setOpenDibsDialog] = useState(false);

  const handleClickOpen = () => {
    setOpenDibsDialog(true);
  };

  return (
    <Box sx={{ height: hg }} onDoubleClick={() => handleClickOpen(true)}>
      <FullScreenDialog
        open={openDibsDialog}
        setOpen={setOpenDibsDialog}
        item={item}
      />
      <Card
        variant="outlined"
        sx={{
          position: 'relative',
          margin: '0 auto',
          height: '100%'
        }}
      >
        <CardMedia
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            right: 0
          }}
          component="img"
          image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardContent
            sx={{ position: 'relative', backgroundColor: 'transparent' }}
          >
            <Grid container alignItems="center">
              <PriceGrid item xs={6}>
                <PriceTypography variant="h6">
                  {item.price} € - 💵 💳
                </PriceTypography>
              </PriceGrid>
              <Grid item xs={6} container justifyContent="flex-end">
                <FavoriteButton variant="contained" />
              </Grid>
            </Grid>
          </CardContent>

          <CardActions
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignContent: 'flex-start',
              position: 'relative',
              marginTop: 'auto',
              backgroundColor: 'rgba(124,145,197,0.5)'
            }}
          >
            <Typography variant="h5" sx={{ color: 'white' }}>
              {item.title}
            </Typography>
            <Typography sx={{ fontSize: '12px', color: 'white' }}>
              {item.description}
            </Typography>
          </CardActions>
        </Box>
      </Card>
    </Box>
  );
};

export default AvailableItem;
