"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";
import { Habit } from "@/core/types/habit";

interface HabitHistoryProps {
  habit: Habit;
  style: Record<string, string>;
}

const HabitHistory: React.FC<HabitHistoryProps> = ({ habit }) => {
  const today = dayjs();

  const renderDay = (date: Dayjs, _selectedDates: Array<Dayjs | null>, pickersDayProps: PickersDayProps) => {
    const dateStr = date.format("YYYY-MM-DD");
    const isFuture = date.isAfter(today, "day");

    const isDone = habit.history.includes(dateStr);

    let customStyles = {
      borderRadius: "var(--shape-radius-sm)",
      transition: "all 0.2s ease",
      margin: "2px",
    };

    if (isDone) {
      Object.assign(customStyles, {
        background: "var(--gradient-surface-primary) !important",
        color: "white !important",
        boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
      });
    } else if (!isFuture && date.isAfter(dayjs(habit.startDate).subtract(1, "day"))) {
      // Missed day
      Object.assign(customStyles, {
        background: "rgba(239, 68, 68, 0.1) !important",
        border: "1px dashed rgba(239, 68, 68, 0.3)",
        color: "var(--color-text-secondary)",
      });
    }

    return <PickersDay {...pickersDayProps} sx={customStyles} />;
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{
            background: "transparent",
            width: "100%",
            maxWidth: "400px",

            "& .MuiPickersCalendarHeader-root": {
              color: "var(--color-text-primary)",
            },

            "& .MuiPickersCalendarHeader-label": {
              fontWeight: 700,
              fontSize: "1rem",
            },

            "& .MuiIconButton-root": {
              color: "var(--color-text-secondary)",
              background: "rgba(255, 255, 255, 0.05)",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.1)",
              },
            },

            "& .MuiDayCalendar-weekDayLabel": {
              color: "var(--color-text-muted)",
              fontWeight: 600,
            },

            "& .MuiPickersDay-root": {
              color: "var(--color-text-secondary)",
              fontWeight: 500,
              "&:hover": {
                background: "rgba(255, 255, 255, 0.05)",
              },
              "&.Mui-disabled": {
                color: "var(--color-text-muted)",
                opacity: 0.3,
              },
            },

            "& .MuiPickersDay-today": {
              borderColor: "var(--color-brand-primary) !important",
              borderWidth: "2px",
            },
          }}
          slots={{ day: (props) => renderDay(props.day, [], props) }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default HabitHistory;
