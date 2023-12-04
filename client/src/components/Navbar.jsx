import Login from './Login';
import { useAuth } from '../services/AuthContext';
import { logoutHandler } from '../services/AuthService';
import {
  Button,
  Tooltip,
  Avatar,
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Container,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { SearchBar } from './Search';
import { FilterDialog } from './FilterDialog';

const AvatarButton = ({
  anchorElUser,
  handleOpenUserMenu,
  handleCloseUserMenu
}) => {
  const { setAuth, user } = useAuth();

  if (!user) return <></>;

  return (
    <>
      <Box sx={{ flexGrow: 0 }}>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt={user.first_name} src={user.photo_url} />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting} onClick={handleCloseUserMenu}>
              <Typography textAlign="center">{setting}</Typography>
            </MenuItem>
          ))}

          <MenuItem
            key="Logout"
            onClick={() => {
              handleCloseUserMenu();
              logoutHandler(setAuth);
            }}
          >
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

const pages = ['Filter'];
const settings = ['Profile', 'My Items'];

const CustomNavbar = ({ items, filteredItems }) => {
  const { auth } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState([1, 300]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setFilterDialogOpen(true);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const searchResult = items[0].filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const result = searchResult.filter(
      (item) => item.price >= priceFilter[0] && item.price <= priceFilter[1]
    );

    filteredItems[1](result);
  }, [searchTerm, priceFilter]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#302a2f' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            DIBS
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="white"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            DIBS
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <SearchBar search={[searchTerm, setSearchTerm]} />
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key="Sort"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Filters
            </Button>
            <FilterDialog
              open={filterDialogOpen}
              setOpen={setFilterDialogOpen}
              priceFilter={[priceFilter, setPriceFilter]}
            />
          </Box>

          <Box>
            {auth ? (
              <AvatarButton
                handleCloseUserMenu={handleCloseUserMenu}
                handleOpenUserMenu={handleOpenUserMenu}
                anchorElUser={anchorElUser}
              />
            ) : (
              <Login />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default CustomNavbar;
