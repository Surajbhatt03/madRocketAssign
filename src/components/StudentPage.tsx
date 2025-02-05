import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Typography, Box, useTheme, useMediaQuery,
  Card, CardContent, Grid, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../firebase';
import AddStudentModal from './AddStudentModal';
import ViewStudentModal from './ViewStudentModal';
import EditStudentModal from './EditStudentModal';

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  className: string;
  section: string;
  rollNumber: string;
}

function StudentsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [students, setStudents] = useState<Student[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsData = querySnapshot.docs.map(document => ({
        id: document.id,
        ...document.data()
      })) as Student[];
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students data");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      if (!id) throw new Error('Invalid student ID');
      const confirmDelete = window.confirm('Are you sure you want to delete this student?');
      if (!confirmDelete) return;
      const studentRef = doc(db, 'students', id);
      await deleteDoc(studentRef);
      await fetchStudents();
      toast.success('Student deleted successfully');
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(`Deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const StudentCard = ({ student }: { student: Student }) => (
    <Card sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ color: '#1976d2' }}>
              {student.firstName} {student.lastName}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">ID: {student.studentId}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2">{student.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Class: {student.className}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Section: {student.section}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedStudent(student);
                  setViewModalOpen(true);
                }}
                sx={{ color: '#1976d2' }}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedStudent(student);
                  setEditModalOpen(true);
                }}
                sx={{ color: '#2e7d32' }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDelete(student.id)}
                sx={{ color: '#d32f2f' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: isMobile ? 4 : 8,
        px: 2,
        backgroundColor: 'white',
        borderRadius: 2,
        mt: 2,
        textAlign: 'center'
      }}
    >
      <PeopleOutlineIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        sx={{ 
          color: '#1976d2', 
          mb: 1,
          fontWeight: 'bold'
        }}
      >
        No Students Found
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#666', 
          mb: 3,
          maxWidth: '500px'
        }}
      >
        Your student list is empty. Start building your class by adding your first student.
      </Typography>
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        onClick={() => setOpenModal(true)}
        sx={{
          backgroundColor: '#1976d2',
          '&:hover': { backgroundColor: '#1565c0' },
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontSize: isMobile ? '0.9rem' : '1rem'
        }}
      >
        Add Your First Student
      </Button>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        mb: 3,
        gap: 2
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1976d2',
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}
        >
          Students List
        </Typography>
        {students.length > 0 && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
              borderRadius: 2,
              px: { xs: 2, sm: 3 },
              py: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              whiteSpace: 'nowrap',
              minWidth: { xs: '100%', sm: 'auto' }
            }}
          >
            Add Student
          </Button>
        )}
      </Box>

      {students.length === 0 ? (
        <EmptyState />
      ) : isMobile ? (
        <Box>
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#ffffff' }}>
                {[
                  { id: 'studentId', label: 'ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'address', label: 'Address' },
                  { id: 'class', label: 'Class' },
                  { id: 'section', label: 'Section' },
                  { id: 'rollNo', label: 'Roll No' },
                  { id: 'actions', label: 'Actions' }
                ].map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      color: '#1976d2',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}
                  >
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow 
                  key={student.id}
                  sx={{
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.phoneNumber}</TableCell>
                  <TableCell>{`${student.address}, ${student.city}, ${student.state} ${student.zip}`}</TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{student.section}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStudent(student);
                          setViewModalOpen(true);
                        }}
                        sx={{ color: '#1976d2' }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedStudent(student);
                          setEditModalOpen(true);
                        }}
                        sx={{ color: '#2e7d32' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(student.id)}
                        sx={{ color: '#d32f2f' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {openModal && (
        <AddStudentModal 
          handleClose={() => {
            setOpenModal(false);
            fetchStudents();
          }}
        />
      )}

      {selectedStudent && (
        <>
          <ViewStudentModal
            open={viewModalOpen}
            student={selectedStudent}
            handleClose={() => setViewModalOpen(false)}
          />
          <EditStudentModal
            open={editModalOpen}
            student={selectedStudent}
            handleClose={() => setEditModalOpen(false)}
            refreshData={fetchStudents}
          />
        </>
      )}
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Box>
  );
}

export default StudentsPage;

