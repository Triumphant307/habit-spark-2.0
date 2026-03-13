import { FaCheck, FaUndoAlt, FaTrash, FaEdit } from "react-icons/fa";
import { useRipple } from "@/app/Hooks/useRipple";
interface Habit {
  streak: number;
  target: number;
}

interface HabitActionProps {
  habit: Habit;
  handleDone: () => void;
  handleReset: () => void;
  handleDeleteClick: () => void;
  handleEditClick: () => void;
  style: Record<string, string>;
}
const HabitAction: React.FC<HabitActionProps> = ({
  habit,
  handleDone,
  handleReset,
  handleDeleteClick,
  handleEditClick,
  style,
}: HabitActionProps) => {
  const createRipple = useRipple();

  return (
    <>
      <div className={style.actions}>
        {habit.streak < habit.target && (
          <button
            type="button"
            onPointerDown={(e) => createRipple(e)}
            onClick={handleDone}
            title="Done"
            aria-label="Mark habit as complete for today"
          >
            <FaCheck aria-hidden="true" /> Done
          </button>
        )}
        <button
          type="button"
          onPointerDown={(e) => createRipple(e)}
          onClick={handleReset}
          title="Reset Streak"
          aria-label="Reset habit streak to zero"
        >
          <FaUndoAlt aria-hidden="true" /> Reset
        </button>

        <button
          type="button"
          className={style.editBtn}
          onPointerDown={(e) => createRipple(e)}
          onClick={handleEditClick}
          title="Edit Habit"
          aria-label="Edit habit details"
        >
          <FaEdit aria-hidden="true" /> Edit
        </button>
      </div>
      <div className={style.deleteActions}>
        <button
          type="button"
          className={style.deleteBtn}
          onClick={handleDeleteClick}
          onPointerDown={(e) => createRipple(e)}
          aria-label="Delete this habit permanently"
        >
          <FaTrash aria-hidden="true" /> Delete
        </button>
      </div>
    </>
  );
};

export default HabitAction;
