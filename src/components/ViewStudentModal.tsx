import React from 'react';
import {
  Modal,
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ViewStudentModalProps {
  open: boolean;
  student: any;
  handleClose: () => void;
}

const ViewStudentModal: React.FC<ViewStudentModalProps> = ({ open, student, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : 500,
    maxHeight: '90vh',
    overflow: 'auto',
    bgcolor: 'background.paper',
    borderRadius: 2,
    p: 3,
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper sx={modalStyle} elevation={24}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Student Details
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon sx={{ color: '#1976d2' }} />
          </IconButton>
        </Box>

        {student && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>ID:</strong> {student.studentId}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Name:</strong> {student.firstName} {student.lastName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Email:</strong> {student.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Phone:</strong> {student.phoneNumber}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Address:</strong> {student.address}, {student.city}, {student.state} {student.zip}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Class:</strong> {student.className}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                <strong>Section:</strong> {student.section}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Roll Number:</strong> {student.rollNumber}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Box sx={{ mt: 3 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              textTransform: 'none',
              fontSize: '1rem',
            }}
          >
            Close
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default ViewStudentModal;

