import styles from "@/Styles/Suggestion/Suggestion.module.css";
import SuggestionCard from "@/components/Suggestion/SuggestionCard";
import SuggestionForm from "@/components/Suggestion/SuggestionForm";

const Suggestions = () => {
  return (
    <div className={styles.suggestions}>
      <h1 className={styles.title}>Habit Suggestions</h1>
      <SuggestionForm />
      <SuggestionCard />
    </div>
  );
};

export default Suggestions;
