import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  FormLabel,
  FormControlLabel,
  Divider,
  TextField,
  Select,
  MenuItem,
  Switch,
  Button,
  Avatar,
  Stack,
  Tooltip,
  Zoom,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
} from "@mui/material";
import { ThemeContext } from "../../../App";
import {
  ColorLens,
  Language,
  AccessTime,
  Notifications,
  Person,
  CheckCircle,
  PhotoCamera,
  Save,
  Cancel,
  Warning,
} from "@mui/icons-material";

const themeOptions = [
  {
    name: "Blue Theme",
    primary: "#1976d2",
    secondary: "#90caf9",
    preview: "linear-gradient(45deg, #1976d2 30%, #90caf9 90%)"
  },
  {
    name: "Green Theme",
    primary: "#2e7d32",
    secondary: "#81c784",
    preview: "linear-gradient(45deg, #2e7d32 30%, #81c784 90%)"
  },
  {
    name: "Orange Theme",
    primary: "#ed6c02",
    secondary: "#ffb74d",
    preview: "linear-gradient(45deg, #ed6c02 30%, #ffb74d 90%)"
  }
];

const timezones = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00",
  "UTC-07:00", "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC-03:00",
  "UTC-02:00", "UTC-01:00", "UTC+00:00", "UTC+01:00", "UTC+02:00",
  "UTC+03:00", "UTC+04:00", "UTC+05:00", "UTC+06:00", "UTC+07:00",
  "UTC+08:00", "UTC+09:00", "UTC+10:00", "UTC+11:00", "UTC+12:00"
];

const languages = [
  "English (US)",
  "English (UK)",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Japanese",
  "Korean"
];

const SettingsCard = ({ title, icon, children, onSave, onCancel, hasChanges }) => (
  <Zoom in={true} style={{ transitionDelay: '100ms' }}>
    <Paper 
      sx={{ 
        p: 3, 
        mb: 3,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        {hasChanges && (
          <Box>
            <Tooltip title="Cancel changes" arrow>
              <IconButton 
                onClick={onCancel}
                sx={{ mr: 1 }}
                color="error"
              >
                <Cancel />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save changes" arrow>
              <IconButton 
                onClick={onSave}
                color="primary"
              >
                <Save />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />
      {children}
    </Paper>
  </Zoom>
);

export default function Setting() {
  const { currentTheme, setCurrentTheme } = useContext(ThemeContext);
  
  // Original states to keep track of initial values
  const [originalProfileData] = useState({
    name: "IMD User",
    email: "user@imd.com",
    language: "English (US)",
    timezone: "UTC+00:00"
  });

  const [originalNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    updates: true,
    newsletter: false
  });

  // Current states that can be modified
  const [profileData, setProfileData] = useState(originalProfileData);
  const [notifications, setNotifications] = useState(originalNotifications);
  const [originalTheme] = useState(currentTheme);

  // Track changes in each section
  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [hasThemeChanges, setHasThemeChanges] = useState(false);
  const [hasNotificationChanges, setHasNotificationChanges] = useState(false);

  // Dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Add loading state for save operation
  const [isSaving, setIsSaving] = useState(false);

  // Function to check if there are any unsaved changes
  const hasUnsavedChanges = hasProfileChanges || hasThemeChanges || hasNotificationChanges;

  // Function to save all changes
  const handleSaveAllChanges = async () => {
    showConfirmDialog(
      'Save All Changes?',
      'Are you sure you want to save all changes? This will update all modified settings.',
      async () => {
        try {
          setIsSaving(true);
          
          // Simulate API calls with setTimeout
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Save profile changes if any
          if (hasProfileChanges) {
            // Here you would make an API call to save profile data
            setHasProfileChanges(false);
          }

          // Save theme changes if any
          if (hasThemeChanges) {
            // Theme is already saved in context
            setHasThemeChanges(false);
          }

          // Save notification changes if any
          if (hasNotificationChanges) {
            // Here you would make an API call to save notification settings
            setHasNotificationChanges(false);
          }

          showSnackbar('All changes saved successfully!', 'success');
        } catch (error) {
          showSnackbar('Error saving changes. Please try again.', 'error');
        } finally {
          setIsSaving(false);
        }
      }
    );
  };

  // Function to discard all changes
  const handleDiscardAllChanges = () => {
    showConfirmDialog(
      'Discard All Changes?',
      'Are you sure you want to discard all changes? This action cannot be undone.',
      () => {
        // Reset all states to original values
        setProfileData(originalProfileData);
        setCurrentTheme(originalTheme);
        setNotifications(originalNotifications);
        showSnackbar('All changes have been discarded', 'info');
      }
    );
  };

  // Check for changes in each section
  useEffect(() => {
    setHasProfileChanges(
      JSON.stringify(profileData) !== JSON.stringify(originalProfileData)
    );
  }, [profileData, originalProfileData]);

  useEffect(() => {
    setHasThemeChanges(currentTheme !== originalTheme);
  }, [currentTheme, originalTheme]);

  useEffect(() => {
    setHasNotificationChanges(
      JSON.stringify(notifications) !== JSON.stringify(originalNotifications)
    );
  }, [notifications, originalNotifications]);

  const handleThemeChange = (event) => {
    setCurrentTheme(event.target.value);
  };

  const handleProfileChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value
    });
  };

  const handleNotificationChange = (event) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked
    });
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Save functions
  const handleSaveProfile = () => {
    showConfirmDialog(
      'Save Profile Changes?',
      'Are you sure you want to save your profile changes?',
      () => {
        // Here you would typically make an API call to save the profile
        showSnackbar('Profile settings saved successfully!', 'success');
        setHasProfileChanges(false);
      }
    );
  };

  const handleSaveTheme = () => {
    showConfirmDialog(
      'Save Theme Changes?',
      'Are you sure you want to save the theme changes?',
      () => {
        // Theme is already saved in context, just need to update the original
        showSnackbar('Theme settings saved successfully!', 'success');
        setHasThemeChanges(false);
      }
    );
  };

  const handleSaveNotifications = () => {
    showConfirmDialog(
      'Save Notification Changes?',
      'Are you sure you want to save your notification preferences?',
      () => {
        // Here you would typically make an API call to save notifications
        showSnackbar('Notification settings saved successfully!', 'success');
        setHasNotificationChanges(false);
      }
    );
  };

  // Cancel functions
  const handleCancelProfile = () => {
    showConfirmDialog(
      'Cancel Profile Changes?',
      'Are you sure you want to discard your profile changes?',
      () => {
        setProfileData(originalProfileData);
        showSnackbar('Profile changes discarded', 'info');
      }
    );
  };

  const handleCancelTheme = () => {
    showConfirmDialog(
      'Cancel Theme Changes?',
      'Are you sure you want to discard your theme changes?',
      () => {
        setCurrentTheme(originalTheme);
        showSnackbar('Theme changes discarded', 'info');
      }
    );
  };

  const handleCancelNotifications = () => {
    showConfirmDialog(
      'Cancel Notification Changes?',
      'Are you sure you want to discard your notification changes?',
      () => {
        setNotifications(originalNotifications);
        showSnackbar('Notification changes discarded', 'info');
      }
    );
  };

  // Confirmation dialog helpers
  const showConfirmDialog = (title, message, onConfirm) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm
    });
  };

  const handleCloseDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleConfirmDialog = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    handleCloseDialog();
  };

  return (
    <Box sx={{ p: 3, position: 'relative', pb: 10 }}>
      <Typography variant="h4" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton color="primary" sx={{ mr: 1 }}>
          <Person fontSize="large" />
        </IconButton>
        Settings
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="Profile Settings" 
            icon={<Person color="primary" />}
            onSave={handleSaveProfile}
            onCancel={handleCancelProfile}
            hasChanges={hasProfileChanges}
          >
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  mr: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}>
                  {profileData.name[0]}
                </Avatar>
                <Tooltip title="Change profile picture" arrow>
                  <IconButton color="primary" component="label">
                    <input hidden accept="image/*" type="file" />
                    <PhotoCamera />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <TextField
                fullWidth
                label="Display Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                variant="outlined"
                InputProps={{
                  sx: { '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } } }
                }}
              />
              
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                variant="outlined"
                InputProps={{
                  sx: { '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } } }
                }}
              />
            </Stack>
          </SettingsCard>
        </Grid>

        {/* Theme Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="Theme Settings" 
            icon={<ColorLens color="primary" />}
            onSave={handleSaveTheme}
            onCancel={handleCancelTheme}
            hasChanges={hasThemeChanges}
          >
            <FormControl fullWidth>
              <FormLabel>Select Theme</FormLabel>
              <Select
                value={currentTheme}
                onChange={handleThemeChange}
                fullWidth
                sx={{ 
                  mt: 1,
                  '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }
                }}
              >
                {themeOptions.map((theme) => (
                  <MenuItem 
                    key={theme.name} 
                    value={theme.name}
                    sx={{
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <span>{theme.name}</span>
                      <Box
                        sx={{
                          ml: 'auto',
                          width: 100,
                          height: 24,
                          borderRadius: 1,
                          background: theme.preview,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                          }
                        }}
                      />
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </SettingsCard>
        </Grid>

        {/* Regional Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="Regional Settings" 
            icon={<Language color="primary" />}
            onSave={handleSaveProfile}
            onCancel={handleCancelProfile}
            hasChanges={hasProfileChanges}
          >
            <Stack spacing={3}>
              <FormControl fullWidth>
                <FormLabel>Language</FormLabel>
                <Select
                  value={profileData.language}
                  name="language"
                  onChange={handleProfileChange}
                  sx={{ 
                    mt: 1,
                    '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }
                  }}
                >
                  {languages.map((lang) => (
                    <MenuItem 
                      key={lang} 
                      value={lang}
                      sx={{
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        }
                      }}
                    >
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <FormLabel>Timezone</FormLabel>
                <Select
                  value={profileData.timezone}
                  name="timezone"
                  onChange={handleProfileChange}
                  sx={{ 
                    mt: 1,
                    '&:hover': { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' } }
                  }}
                >
                  {timezones.map((tz) => (
                    <MenuItem 
                      key={tz} 
                      value={tz}
                      sx={{
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        }
                      }}
                    >
                      {tz}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </SettingsCard>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <SettingsCard 
            title="Notification Settings" 
            icon={<Notifications color="primary" />}
            onSave={handleSaveNotifications}
            onCancel={handleCancelNotifications}
            hasChanges={hasNotificationChanges}
          >
            <Stack spacing={2}>
              {Object.entries(notifications).map(([key, value]) => (
                <FormControl 
                  key={key}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value}
                        onChange={handleNotificationChange}
                        name={key}
                        color="primary"
                      />
                    }
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  />
                </FormControl>
              ))}
            </Stack>
          </SettingsCard>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Warning color="warning" sx={{ mr: 1 }} />
            <Typography>{confirmDialog.message}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button 
            onClick={handleConfirmDialog} 
            variant="contained" 
            autoFocus
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          icon={<CheckCircle fontSize="inherit" />}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Fixed position save/cancel buttons */}
      {hasUnsavedChanges && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            py: 2,
            px: 3,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center'
            }}
          >
            <Warning color="warning" sx={{ mr: 1, fontSize: 20 }} />
            You have unsaved changes
          </Typography>
          <Button
            color="inherit"
            onClick={handleDiscardAllChanges}
            disabled={isSaving}
            startIcon={<Cancel />}
          >
            Discard Changes
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAllChanges}
            disabled={isSaving}
            startIcon={<Save />}
          >
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </Paper>
      )}
    </Box>
  );
}
