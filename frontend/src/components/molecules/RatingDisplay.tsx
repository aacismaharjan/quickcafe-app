import { Rating } from '@mui/material'; // Ensure you have @mui/material installed
import { Box } from '@mui/material';

const RatingDisplay = ({ rating, reviewersNo }: ReviewsStat) => {
  return (
    <div>
      <Rating name="read-only" value={rating || 0} readOnly />
      <Box style={{ display: 'inline-block', position: 'relative', top: -6, left: 8 }}>({reviewersNo})</Box>
    </div>
  );
};

export default RatingDisplay;
