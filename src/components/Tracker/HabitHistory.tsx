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

const HabitHistory: React.FC<HabitHistoryProps> = ({ habit, style }) => {
  const today = dayjs();

  const renderDay = (
    date: Dayjs,
    _selectedDates: Array<Dayjs | null>,
    pickersDayProps: PickersDayProps,
  ) => {
    const dateStr = date.format("YYYY-MM-DD");
    const isFuture = date.isAfter(today, "day");
    const isAfterStart =
      date.isAfter(dayjs(habit.startDate)) ||
      date.isSame(dayjs(habit.startDate), "day");

    const hasStartedTracking = habit.history.length > 0;

    // Logic: Use trackingStartDate if available, otherwise assume tracking started on the day of the first completion.
    // If no history and no explicit start date, we can't really show "missed" days accurately.
    const trackingStart = habit.trackingStartDate
      ? dayjs(habit.trackingStartDate)
      : hasStartedTracking
        ? dayjs(habit.history[0])
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
        dotColor = "var(--color-status-success)";
        customStyles = {
          bgcolor: "var(--color-status-success)",
          color: "var(--color-surface-pure-white)",
          borderRadius: "50%",
          fontWeight: "var(--font-weight-bold)",
          "&:hover": { bgcolor: "var(--color-surface-success-intense)" },
        };
      } else {
        dotColor = "var(--color-status-error)";
        customStyles = {
          bgcolor: "var(--color-status-error)",
          color: "var(--color-surface-pure-white)",
          borderRadius: "50%",
          fontWeight: "var(--font-weight-bold)",
          "&:hover": { bgcolor: "var(--color-status-error-hover)" },
        };
      }
    } else if (!isFuture && isAfterStart && !hasStartedTracking) {
      dotColor = "var(--color-text-muted)";
      customStyles = {
        border: "1px solid var(--color-text-muted)",
        borderRadius: "50%",
        "&:hover": { bgcolor: "rgba(153, 153, 153, 0.1)" },
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
              fontSize: "var(--font-size-base)",
              lineHeight: 1,
              fontWeight: "var(--font-weight-bold)",
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
    <div className={style.HabitDetails_History}>
      <h3 className={style.HabitDetails_HistoryTitle}>
        📆 Habit History
        {habit.history.length === 0 && (
          <span
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--color-text-muted)",
              display: "block",
            }}
          >
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
            margin: "0 auto",
            width: "100%",
            maxWidth: "350px",
            transform: "scale(0.95)",
            transformOrigin: "top center",

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

            // Mobile-only styles
            "@media (max-width: 768px)": {
              transform: "scale(1.0)",
              transformOrigin: "top center",
              padding: "0.5rem",

              "& .MuiPickersDay-root": {
                fontSize: "1rem",
                width: "28px",
                height: "28px",
              },

              "& .MuiDayCalendar-weekDayLabel": {
                fontSize: "1rem",
                width: "28px",
                height: "28px",
              },

              "& .MuiPickersCalendarHeader-label": {
                fontSize: "1rem",
              },
            },
          }}
          slots={{ day: (props) => renderDay(props.day, [], props) }}
        />
      </LocalizationProvider>
    </div>
  );
};

export default HabitHistory;
