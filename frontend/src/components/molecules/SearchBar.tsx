import React, { useState } from 'react';
import {
  IconButton,
  Typography,
  Box,
  styled,
  alpha,
  InputBase,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import CloseIcon from '@mui/icons-material/Close';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.35),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.4),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '32ch',
      '&:focus': {
        width: '32ch',
      },
    },
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const SearchBar: React.FC = () => {
  const [filter, setFilter] = useState({
    sort: '',
    minPrice: '',
    maxPrice: '',
    name: '',
  });

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  const handleApply = () => {
    const params = new URLSearchParams();
  
    if (filter.sort) {
      params.append('sort', filter.sort === 'high-to-low' ? '-price' : 'price');
    }
    if (filter.minPrice) {
      params.append('price[gt]', filter.minPrice);
    }
    if (filter.maxPrice) {
      params.append('price[lt]', filter.maxPrice);
    }
    if(filter.name) {
        params.append("name", filter.name);
    }
  
    handleClose();
    navigate(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setFilter({
      sort: '',
      minPrice: '',
      maxPrice: '',
      name: '',
    });
    handleClose();
    navigate("/");
  };

  console.log(filter);

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        type="search"
        name="name"
        onChange={handleFilterChange}
        value={filter.name}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          const query = (e.target as HTMLInputElement).value;
          if (e.key === 'Enter' && query) {
            navigate(`/search?name=${query}`);
          }
        }}
      />

      <IconButton
        sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, color: 'white' }}
        onClick={handleClickOpen}
      >
        <FilterListOutlinedIcon />
      </IconButton>

      <Box>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Filter
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent dividers>
            <FormControl>
              <FormLabel>Sort By</FormLabel>
              <RadioGroup name="sort" value={filter.sort} onChange={handleFilterChange}>
                <FormControlLabel value="high-to-low" control={<Radio />} label="Cost: Price high to low" />
                <FormControlLabel value="low-to-high" control={<Radio />} label="Cost: Price low to high" />
              </RadioGroup>
            </FormControl>

            <br />
            <br />

            <FormControl>
              <FormLabel>Pricing</FormLabel>
              <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <TextField
                  name="minPrice"
                  variant="filled"
                  label="Min Price"
                  type="number"
                  value={filter.minPrice}
                  onChange={handleFilterChange}
                />
                <Typography>To</Typography>
                <TextField
                  name="maxPrice"
                  variant="filled"
                  label="Max Price"
                  type="number"
                  value={filter.maxPrice}
                  onChange={handleFilterChange}
                />
              </Box>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClear}>Clear</Button>
            <Button onClick={handleApply}>Apply changes</Button>
          </DialogActions>
        </BootstrapDialog>
      </Box>
    </Search>
  );
};

export default SearchBar;
