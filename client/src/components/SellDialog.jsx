import { forwardRef, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import {
  TextField,
  Button,
  Dialog,
  Box,
  Checkbox,
  styled,
  alpha,
  FormControl,
  FormGroup,
  ImageList,
  ImageListItem,
  DialogActions,
  Fab
} from '@mui/material';
import { CreditCard, CreditCardOff, Savings, Add } from '@mui/icons-material';
import { createItem } from '../services/itemService';
import { useAuth } from '../services/AuthContext';

const SellGrid = styled(Box)(({ theme }) => ({
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

const DetailsBox = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.background.default, 0.5),
  minHeight: '10vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
}));

const NumericFormatCustom = forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      valueIsNumericString
    />
  );
});

const MAX_COUNT = 5;

export const SellDialog = ({ open, setOpen, setChange, change }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [price, setPrice] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        file.url = URL.createObjectURL(file);
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const handleClose = () => {
    setUploadedFiles([]);
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      name: name,
      address: address,
      description: description,
      price: price,
      images: uploadedFiles
    };

    await createItem(itemData, user);
    setOpen(false);
    setChange(!change);
    setUploadedFiles([]);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormControl>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <SellGrid
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
                display: 'flex'
              }}
            >
              <TextField
                label="Price"
                name="price"
                id="price"
                InputProps={{
                  inputComponent: NumericFormatCustom
                }}
                variant="outlined"
                onInput={(e) => setPrice(e.target.value)}
                required
              />
              <Checkbox
                checked={true}
                icon={<CreditCardOff />}
                checkedIcon={<CreditCard />}
              />
              <Checkbox icon={<Savings />} checkedIcon={<Savings />} />
            </Box>

            <Box sx={{ flexGrow: '1', alignSelf: 'stretch' }}>
              <ImageList cols={3} rowHeight={164}>
                <ImageListItem
                  sx={{
                    top: '30%',
                    justifyItems: 'center',
                    alignItems: 'center'
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    multiple
                    type="file"
                    onChange={handleFileEvent}
                    disabled={fileLimit}
                  />
                  <label htmlFor="image-upload">
                    <Fab
                      type="file"
                      color="primary"
                      aria-label="add"
                      component="span"
                    >
                      <Add />
                    </Fab>
                  </label>
                </ImageListItem>

                {uploadedFiles.map((file) => (
                  <ImageListItem
                    sx={{ border: '1px solid white' }}
                    key={file.url}
                  >
                    <img src={file.url} alt={file.name} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>

            <DetailsBox>
              <TextField
                label="Item name"
                name="name"
                id="name"
                required
                onInput={(e) => setName(e.target.value)}
              />
              <TextField
                label="Address"
                name="address"
                id="address"
                required
                onInput={(e) => setAddress(e.target.value)}
              />
              <TextField
                label="Description"
                name="description"
                id="description"
                onInput={(e) => setDescription(e.target.value)}
              />
            </DetailsBox>
            <DialogActions>
              <Button variant="contained" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Sell Item!
              </Button>
            </DialogActions>
          </SellGrid>
        </form>
      </FormControl>
    </Dialog>
  );
};
