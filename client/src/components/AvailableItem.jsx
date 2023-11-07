import '../styles.css';
import { Card, IconButton, CardActions, CardContent, CardMedia, Container, Button, Typography, Grid, CardHeader, Box, styled, alpha } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';

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

const ItemHeaderContainer = styled(Container)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  // backgroundColor: alpha(theme.palette.primary.main, 0.54),
  color: 'white',
  padding: '10px',
  display: 'inline-flex',
}));

const PriceGrid = styled(Grid)(({ theme }) => ({
    background: alpha(theme.palette.primary.main, 0.5),
    border: '1px solid #E0E0E0',
    borderRadius: theme.shape.borderRadius,
    justifyContent: 'center',
    display: 'flex',
}));

const PriceTypography = styled(Typography)(({ theme }) => ({
  color: 'white',
}));

const FavoriteButton = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    console.log('Favorite button clicked');
    setIsFavorite(!isFavorite);
    console.log(isFavorite);
  };

  const FavButton = styled(IconButton)(({ theme }) => ({
    color: isFavorite ?  theme.palette.secondary.main : theme.palette.background.paper,
    border: '1px solid ' + theme.palette.primary.main,
    borderRadius: '50%',
    padding: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  }));

  return (
    <FavButton onClick={toggleFavorite}>
      <FavoriteIcon />
    </FavButton>
  );
};

export const CardWithOverlay = ({ item }) => {
  return (
    <Card variant="outlined" sx={{ maxWidth: 345, margin: '0 auto', position: 'relative' }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
        />
        <ItemHeaderContainer>
          <Grid container alignItems="center">
          <PriceGrid item xs={6}>
            <PriceTypography variant="h6">
              {item.price} € - 💵 💳
            </PriceTypography>
          </PriceGrid>
          <Grid item xs={6} container justifyContent="flex-end">
            <FavoriteButton variant="contained"/>
          </Grid>
         </Grid>
        </ItemHeaderContainer>
      </Box>
      <Typography variant="h6">
        {item.title}
      </Typography>
      <Typography sx={{ fontSize: '12px' }}>
        {item.price}
      </Typography>
    </Card>
  );
};

export default AvailableItem;
