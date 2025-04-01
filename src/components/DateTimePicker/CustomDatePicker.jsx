import React, { useState } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { es } from 'date-fns/locale';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Paper, TextField } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ef4444', // color barber-accent (rojo)
    },
  },
});

const CustomDatePicker = ({ formData, setFormData }) => {
  // Estado local para manejar la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(formData.date ? new Date(formData.date) : null);
  const [selectedTime, setSelectedTime] = useState(formData.hour ? new Date(`2024-01-01T${formData.hour}`) : null);

  // Función para manejar el cambio de fecha
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const formattedDate = newDate.toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
  };

  // Función para manejar el cambio de hora
  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    if (newTime) {
      const formattedTime = newTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setFormData(prev => ({
        ...prev,
        hour: formattedTime
      }));
    }
  };

  // Función para deshabilitar los domingos
  const shouldDisableDate = (date) => {
    return date.getDay() === 0; // 0 = Domingo
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2,
          '& .MuiPickersDay-root.Mui-selected': {
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#dc2626',
            }
          }
        }}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} />}
              minDate={new Date()} // No permite seleccionar fechas pasadas
              shouldDisableDate={shouldDisableDate}
              sx={{
                width: '100%',
                '& .MuiPickersDay-today': {
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                },
              }}
            />
          </Paper>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <TimePicker
              label="Hora de la cita"
              value={selectedTime}
              onChange={handleTimeChange}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#ef4444',
                      },
                    },
                  }}
                />
              }
              minTime={new Date(0, 0, 0, 9)} // Hora mínima: 9:00
              maxTime={new Date(0, 0, 0, 19)} // Hora máxima: 19:00
              minutesStep={40} // Intervalos de 40 minutos
            />
          </Paper>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default CustomDatePicker;