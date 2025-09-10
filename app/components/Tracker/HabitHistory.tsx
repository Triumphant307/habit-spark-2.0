import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import dayjs, { Dayjs } from "dayjs";

interface Habit {
  history: string[];
  startDate: string;
  trackingStartDate?: string;
}

interface HabitHistoryProps {
  habit: Habit;
  style: Record<string, string>;
}

const HabitHistory: React.FC<HabitHistoryProps> = ({ habit, style }) => {
  const today = dayjs();

  const renderDay = (
    date: Dayjs,
    _selectedDates: Array<Dayjs | null>,
    pickersDayProps: PickersDayProps
  ) => {
    const dateStr = date.format("ddd MMM DD YYYY");
    const isFuture = date.isAfter(today, "day");
    const isAfterStart =
      date.isAfter(dayjs(habit.startDate)) ||
      date.isSame(dayjs(habit.startDate), "day");

    const hasStartedTracking = habit.history.length > 0;
    const trackingStart = habit.trackingStartDate
      ? dayjs(habit.trackingStartDate)
      : hasStartedTracking
      ? dayjs(habit.history[0]).subtract(0, "day")
      : null;

    const isAfterTrackingStart = trackingStart
      ? date.isAfter(trackingStart) || date.isSame(trackingStart, "day")
      : false;

    const isDone = habit.history.includes(dateStr);

    let customStyles = {};
    let dotColor: string | null = null;

    if (
      !isFuture &&
      isAfterStart &&
      hasStartedTracking &&
      isAfterTrackingStart
    ) {
      if (isDone) {
        dotColor = "#4CAF50";
        customStyles = {
          bgcolor: "#4CAF50",
          color: "#FFFFFF",
          borderRadius: "50%",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#45A049" },
        };
      } else {
        dotColor = "#F44336";
        customStyles = {
          bgcolor: "#F44336",
          color: "#FFFFFF",
          borderRadius: "50%",
          fontWeight: "bold",
          "&:hover": { bgcolor: "#E53935" },
        };
      }
    } else if (!isFuture && isAfterStart && !hasStartedTracking) {
      dotColor = "#BDBDBD";
      customStyles = {
        border: "1px solid #BDBDBD",
        borderRadius: "50%",
        "&:hover": { bgcolor: "rgba(189, 189, 189, 0.1)" },
      };
    }

    return (
      <div style={{ position: "relative" }}>
        <PickersDay {...pickersDayProps} sx={customStyles} />
        {dotColor && (
          <span
            style={{
              position: "absolute",
              bottom: 2,
              left: "50%",
              transform: "translateX(-50%)",
              color: dotColor,
              fontSize: "1rem",
              lineHeight: 1,
              fontWeight: "bold",
              textShadow: "0 0 2px rgba(0,0,0,0.3)",
            }}
          >
            •
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={style.history}>
      <h3 className={style.historyTitle}>
        📆 Habit History
        {habit.history.length === 0 && (
          <span style={{ fontSize: "0.8rem", color: "#666", display: "block" }}>
            Complete your first day to start tracking!
          </span>
        )}
      </h3>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          sx={{
            color: "var(--text-primary)",
            borderRadius: "16px",
            padding: "1rem",

            "& .MuiPickersCalendarHeader-root .MuiIconButton-root": {
              color: "var(--text-primary)",
            },

            "& .MuiDayCalendar-weekDayLabel": {
              color: "var(--text-primary)",
              fontWeight: "600",
            },

            "& .MuiPickersDay-root": {
              fontSize: "0.9rem",
              color: "var(--text-primary)",
            },

            "& .MuiPickersDay-today": {
              border: "2px solid var(--calendar-today-border)",
            },

            "& .Mui-selected": {
              backgroundColor: "var(--calendar-selected-bg) !important",
              color: "var(--text-primary) !important",
            },

            "& .MuiPickersDay-dayOutsideCurrentMonth": {
              color: "rgba(0,0,0,0.38)",
            },

            "& .Mui-disabled": {
              color: "rgba(0,0,0,0.26)",
            },
          }}
          slots={{ day: (props) => renderDay(props.day, [], props) }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default HabitHistory;
