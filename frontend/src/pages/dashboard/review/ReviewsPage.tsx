import { useState, useEffect } from 'react';
import {
  Box,
  CardMedia,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Rating,
  styled,
} from '@mui/material';
import moment from 'moment';
import { API_SERVER } from '../../../utils/AxiosInstance';
import { useOwnerCanteenID } from '../utils/useOwnerCanteenID';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey.A700,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ReviewsPage = () => {
  const { ownerCanteenID } = useOwnerCanteenID();

  const [reviews, setReviews] = useState<ReviewTypeI[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_SERVER}/api/v1/canteens/${ownerCanteenID}/reviews`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Reviews
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Menu Item</StyledTableCell>
              <StyledTableCell>Rating</StyledTableCell>
              <StyledTableCell>Comment</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <StyledTableRow key={review.id}>
                <TableCell>
                  {review.user.firstName} {review.user.lastName}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 50, height: 50, borderRadius: 1 }}
                      image={`${API_SERVER}/${review.menuItem.image_url}`}
                      alt={review.menuItem.name}
                    />
                    {review.menuItem.name}
                  </Box>
                </TableCell>
                <TableCell>
                  <Rating value={review.rating} precision={0.5} readOnly />
                </TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>{moment(review.createdAt).format('DD MMM YYYY')}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ReviewsPage;
