import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../firebase";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface EditStudentModalProps {
  open: boolean;
  student: any;
  handleClose: () => void;
  refreshData: () => void;
}

interface FormValues extends Record<string, any> {
  studentId?: string;
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

const EditStudentModal: React.FC<EditStudentModalProps> = ({
  open,
  student,
  handleClose,
  refreshData
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Responsive modal style: wider and padded on mobile
  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isMobile ? "95%" : 500,
    maxHeight: "90vh",
    overflowY: "auto" as const,
    bgcolor: "background.paper",
    borderRadius: 2,
    p: isMobile ? 2 : 3,
    boxShadow: 24,
  };

  const { control, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FormValues>({ defaultValues: student });

  const zipValue = watch("zip");

  // Auto-fill city and state based on ZIP code
  useEffect(() => {
    const fetchCityState = async () => {
      if (zipValue?.length === 6) {
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${zipValue}`);
          const data = await response.json();
          if (data[0]?.Status === "Success") {
            const postOffice = data[0]?.PostOffice?.[0];
            if (postOffice) {
              setValue("city", postOffice.District);
              setValue("state", postOffice.State);
            }
          }
        } catch (error) {
          console.error("Error fetching city/state:", error);
        }
      }
    };
    fetchCityState();
  }, [zipValue, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      if (!student?.id) throw new Error("Invalid student ID");

      const docRef = doc(db, "students", student.id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        toast.error(`Student document with ID '${student.id}' does not exist`);
        return;
      }

      // Clean the data by removing undefined or null values
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      await updateDoc(docRef, cleanData);
      toast.success("Student updated successfully!");
      refreshData();
      handleClose();
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error(`Update failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Common style for text fields
  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1,
      backgroundColor: "#fff",
      "&.Mui-focused fieldset": {
        borderColor: "#1976d2",
      },
    },
    mb: 2,
  };

  // Using responsive grid layout: single column on mobile, 2 columns on desktop for grouped fields
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, borderBottom: "1px solid #eee", pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Edit Student
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="studentId"
            control={control}
            rules={{ required: "Student ID is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Student ID"
                fullWidth
                margin="normal"
                error={!!errors.studentId}
                helperText={errors.studentId?.message || ""}
                sx={textFieldStyle}
              />
            )}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 2,
              mb: 2,
            }}
          >
            <Controller
              name="firstName"
              control={control}
              rules={{ required: "First Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First Name"
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message || ""}
                  sx={textFieldStyle}
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              rules={{ required: "Last Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last Name"
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message || ""}
                  sx={textFieldStyle}
                />
              )}
            />
          </Box>

          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Invalid email" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message || ""}
                sx={textFieldStyle}
              />
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: "Phone Number is required",
              pattern: { value: /^\d{10}$/, message: "Phone number must be 10 digits" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                margin="normal"
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message || ""}
                inputProps={{ maxLength: 10 }}
                sx={textFieldStyle}
              />
            )}
          />

          <Controller
            name="address"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                margin="normal"
                error={!!errors.address}
                helperText={errors.address?.message || ""}
                sx={textFieldStyle}
              />
            )}
          />

          <Controller
            name="zip"
            control={control}
            rules={{
              required: "ZIP code is required",
              pattern: { value: /^\d{6}$/, message: "Invalid PIN code (6 digits required)" },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="ZIP Code"
                fullWidth
                margin="normal"
                error={!!errors.zip}
                helperText={errors.zip?.message || ""}
                inputProps={{ maxLength: 6 }}
                sx={textFieldStyle}
              />
            )}
          />

          <Controller
            name="city"
            control={control}
            rules={{ required: "City is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                fullWidth
                margin="normal"
                error={!!errors.city}
                helperText={errors.city?.message || ""}
                sx={textFieldStyle}
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            rules={{ required: "State is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="State"
                fullWidth
                margin="normal"
                error={!!errors.state}
                helperText={errors.state?.message || ""}
                sx={textFieldStyle}
              >
                {INDIAN_STATES.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
              gap: 2,
              mb: 2,
            }}
          >
            <Controller
              name="className"
              control={control}
              rules={{ required: "Class is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Class"
                  fullWidth
                  error={!!errors.className}
                  helperText={errors.className?.message || ""}
                  sx={textFieldStyle}
                >
                  <MenuItem value="9">Class 9</MenuItem>
                  <MenuItem value="10">Class 10</MenuItem>
                  <MenuItem value="11">Class 11</MenuItem>
                  <MenuItem value="12">Class 12</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="section"
              control={control}
              rules={{ required: "Section is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Section"
                  fullWidth
                  error={!!errors.section}
                  helperText={errors.section?.message || ""}
                  sx={textFieldStyle}
                >
                  {["A", "B", "C", "D"].map((sec) => (
                    <MenuItem key={sec} value={sec}>
                      Section {sec}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="rollNumber"
              control={control}
              rules={{ required: "Roll Number is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Roll Number"
                  fullWidth
                  error={!!errors.rollNumber}
                  helperText={errors.rollNumber?.message || ""}
                  sx={textFieldStyle}
                />
              )}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              py: 1.5,
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
              borderRadius: 1,
            }}
          >
            Update Student
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditStudentModal;

