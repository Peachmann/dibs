import { forwardRef, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { NumericFormat } from 'react-number-format';
import {
  Dialog,
  Box,
  Checkbox,
  styled,
  alpha,
  Typography,
  ImageList,
  ImageListItem,
  DialogActions,
  Fab
} from '@mui/material';
import { CreditCard, CreditCardOff, Savings, Add } from '@mui/icons-material';

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
      thousandSeparator
      valueIsNumericString
      prefix="€"
    />
  );
});

const MAX_COUNT = 5;

export const SellDialog = ({ open, setOpen }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);

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
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
            required
          />
          <Checkbox icon={<CreditCardOff />} checkedIcon={<CreditCard />} />
          <Checkbox icon={<Savings />} checkedIcon={<Savings />} />
        </Box>

        <Box
          sx={{ flexGrow: '1', alignSelf: 'stretch', backgroundColor: 'red' }}
        >
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
              <ImageListItem sx={{ border: '1px solid white' }} key={file.url}>
                <img src={file.url} alt={file.name} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        <DetailsBox>
          <TextField label="Item name" name="name" id="name" required />
          <TextField label="Address" name="address" id="address" required />
          <TextField label="Description" name="description" id="description" />
        </DetailsBox>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Sell Item!</Button>
        </DialogActions>
      </SellGrid>
    </Dialog>
  );
};

{
  /* <DialogActions>
<Button onClick={handleClose}>Cancel</Button>
<Button onClick={handleClose}>Sell Item!</Button>
</DialogActions> */
}
