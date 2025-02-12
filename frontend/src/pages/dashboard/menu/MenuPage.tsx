import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StyledTableCell, StyledTableRow } from '../menu-item/MenuDetailPage';
import { API_SERVER } from '../../../utils/AxiosInstance';
import { useOwnerCanteenID } from '../utils/useOwnerCanteenID';

const MenuPage = () => {
  const { ownerCanteenID } = useOwnerCanteenID();
  const [menus, setMenus] = useState<MenuTypeI[]>([]);

  // Fetch menu items
  const fetchMenus = async () => {
    try {
      const response = await fetch(`${API_SERVER}/api/v1/canteens/${ownerCanteenID}/menus`);
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_SERVER}/api/v1/menus/${id}`, {
        method: 'DELETE',
      }).then(() => {
        toast.success('Menu deleted successfully');
      });
      fetchMenus();
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Menus</Typography>
        <Button component={Link} to="/dashboard/menu/create" variant="contained" startIcon={<AddIcon />}>
          Add Menu
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {menus.map((item) => {
              const created_at_date = moment(item.created_at).format('DD MMM YYYY');
              const created_at_time = moment(item.created_at).format('h:mm a');
              return (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>{item.id}</StyledTableCell>
                  <StyledTableCell>
                    <span>{item.name}</span>
                  </StyledTableCell>
                  <StyledTableCell>{item.status}</StyledTableCell>
                  <StyledTableCell>
                    <div>{created_at_date}</div>
                    <div>{created_at_time}</div>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Chip
                      variant="outlined"
                      color={item.is_active === true ? 'success' : 'error'}
                      size="small"
                      label={item.is_active === true ? 'Active' : 'Disabled'}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ minWidth: 120 }} align="center">
                    <IconButton component={Link} to={`/dashboard/menu/${item.id}/edit`} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MenuPage;
