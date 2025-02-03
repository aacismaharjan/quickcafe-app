import React, { useState, useEffect } from 'react';
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

const LedgerPage = () => {
  const [ledgers, setLedgers] = useState<LedgerTypeI[]>([]);

  // Fetch menu items
  const fetchMenus = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/ledgers');
      const data = await response.json();
      setLedgers(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:8080/api/v1/ledgers/${id}`, {
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
        <Typography variant="h5">Ledgers</Typography>
        <Button component={Link} to="/dashboard/ledger/create" variant="contained" startIcon={<AddIcon />}>
          Add Book
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
            {ledgers.map((item) => {
              const created_at_date = moment(item.created_at).format('DD MMM YYYY');
              const created_at_time = moment(item.created_at).format('h:mm a');
              return (
                <StyledTableRow key={item.id}>
                  <StyledTableCell>{item.id}</StyledTableCell>
                  <StyledTableCell>
                    <span>{item.name}</span>
                  </StyledTableCell>
                  <StyledTableCell>{item.description}</StyledTableCell>
                  <StyledTableCell>
                    <div>{created_at_date}</div>
                    <div>{created_at_time}</div>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Chip
                      variant="outlined"
                      color={item.isActive === true ? 'success' : 'error'}
                      size="small"
                      label={item.isActive === true ? 'Active' : 'Disabled'}
                    />
                  </StyledTableCell>
                  <StyledTableCell sx={{ minWidth: 120 }} align="center">
                    <IconButton component={Link} to={`/dashboard/ledger/${item.id}/edit`} color="primary">
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

export default LedgerPage;
