import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
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
import { toast } from "react-toastify";
import { db } from "../firebase";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

interface AddStudentModalProps {
  handleClose: () => void;
}

interface FormValues {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  className: string;
  section: string;
  rollNumber: string;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // For mobile, use a wider percentage; otherwise a fixed width.
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
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      zip: "",
      city: "",
      state: "",
      className: "9",
      section: "A",
      rollNumber: "",
    },
  });

  const zipValue = watch("zip");

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
      await addDoc(collection(db, "students"), data);
      toast.success("Student added successfully!");
      reset();
      handleClose();
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  // Common style for text fields.
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

  return (
    <Modal open onClose={handleClose}>
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            borderBottom: "1px solid #eee",
            pb: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
            Add Student
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="studentId"
            control={control}
            rules={{ required: "Student ID is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Student ID"
                fullWidth
                error={!!errors.studentId}
                helperText={errors.studentId?.message || ""}
                sx={textFieldStyle}
              />
            )}
          />
          {/* First and Last Name */}
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
          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Invalid email format",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message || ""}
                sx={textFieldStyle}
              />
            )}
          />
          {/* Phone Number */}
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: "Phone Number is required",
              pattern: {
                value: /^\d{10}$/,
                message: "Phone number must be 10 digits",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone Number"
                fullWidth
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message || ""}
                inputProps={{ maxLength: 10 }}
                sx={textFieldStyle}
              />
            )}
          />
          {/* Address */}
          <Controller
            name="address"
            control={control}
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                multiline
                rows={2}
                error={!!errors.address}
                helperText={errors.address?.message || ""}
                sx={textFieldStyle}
              />
            )}
          />
          {/* PIN, City, State */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
              gap: 2,
              mb: 2,
            }}
          >
            <Controller
              name="zip"
              control={control}
              rules={{
                required: "ZIP code is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "PIN code must be exactly 6 digits",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="PIN Code"
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
                  error={!!errors.state}
                  helperText={errors.state?.message || ""}
                  sx={textFieldStyle}
                >
                  {INDIAN_STATES.map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>
          {/* Class, Section, Roll Number */}
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
                  error={!!errors.className}
                  helperText={errors.className?.message || ""}
                  sx={textFieldStyle}
                >
                  {["9", "10", "11", "12"].map((cls) => (
                    <MenuItem key={cls} value={cls}>Class {cls}</MenuItem>
                  ))}
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
                  error={!!errors.section}
                  helperText={errors.section?.message || ""}
                  sx={textFieldStyle}
                >
                  {["A", "B", "C", "D"].map((sec) => (
                    <MenuItem key={sec} value={sec}>Section {sec}</MenuItem>
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
            Add Student
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddStudentModal;


