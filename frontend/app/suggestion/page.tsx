import styles from "@/app/Styles/Suggestion/suggestionCard.module.css";
import SuggestionCard from "@/app/components/suggestion/SuggestionCard";
import SuggestionForm from "@/app/components/suggestion/SuggestionForm";

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
