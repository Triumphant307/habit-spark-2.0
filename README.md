# HabitSpark

HabitSpark is a modern, intuitive, and feature-rich Progressive Web Application (PWA) designed to empower users in cultivating positive habits and achieving their personal growth objectives. It addresses the common challenge of habit formation by providing a streamlined, engaging platform for tracking progress, maintaining motivation, and fostering consistency. The application achieves this through a user-friendly interface, motivational cues, and intelligent tracking mechanisms that adapt to the user's journey.

## Live Demo

Experience HabitSpark in action! Click below to access the live application:

[Launch HabitSpark Online](https://habit-spark-2-0.vercel.app/)

## Visuals

<!--
  Please add relevant screenshots or GIFs here to showcase the application's functionality.
  Examples:
  - Screenshot of the main dashboard with habit streaks.
  - GIF demonstrating habit creation and completion.
  - Screenshot of the habit details page.
  - Screenshot of the suggestion feature.
-->
![HabitSpark Dashboard](/app/assets/gif/Animation.gif)
*Overview of the main dashboard, showcasing active habits and daily progress.*

![Habit Creation in Action](/app/assets/gif/Animation2.gif)
*Overview of habit creation in progress and also showing the suggestions.*


![Habit Tracking in Action](/app/assets/gif/Animation3.gif)
*A GIF demonstrating the seamless process of marking a habit as complete and viewing streak updates.*

## Installation

Follow these step-by-step instructions to set up HabitSpark in your local development environment.

### Prerequisites

Ensure you have the following software installed on your system:

*   **Node.js**: Version 18.x or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm**: Node Package Manager, which comes bundled with Node.js.

### Steps

1.  **Clone the Repository**
    Begin by cloning the HabitSpark project repository to your local machine:

    ```bash
    git clone https://github.com/Triumphant307/habit-spark-2.0.git
    cd habit-spark-2.0
    ```

2.  **Install Dependencies**
    Navigate into the project directory and install all required npm packages:

    ```bash
    npm install
    ```

3.  **Run the Development Server**
    Start the Next.js development server. The application will be accessible via your web browser.

    ```bash
    npm run dev
    ```

    The application will typically be available at `http://localhost:3000`.

## Usage

HabitSpark is designed for intuitive interaction. Here’s a brief guide on how to utilize its core features:

1.  **Creating a New Habit:**
    *   Navigate to the "Add Habit" section.
    *   Provide a name, select an icon, set a target streak, and choose a category.
    *   Save your new habit to begin tracking.

2.  **Tracking Daily Progress:**
    *   From the dashboard, locate your active habits.
    *   Click the "Done" button next to a habit to mark it as completed for the day and update your streak.

3.  **Viewing Habit Details:**
    *   Click on any habit card to view a detailed breakdown of its progress, history, and statistics.

4.  **Receiving Motivation:**
    *   The home screen features motivational quotes that refresh periodically to keep you inspired.

## Documentation & API

For developers and contributors, the codebase is structured to be self-documenting with clear naming conventions and inline comments where necessary.

*   **`app/` Directory:** Contains all Next.js routes, UI components, and client-side logic.
*   **`core/` Directory:** Houses the core business logic, state management (using a custom Reactor pattern), and intent handling for habits and other application features.
*   **`public/` Directory:** Stores static assets such such as images.

Developers are encouraged to explore these directories to understand the application's architecture and internal APIs.

## Contributing Guidelines

We welcome and appreciate contributions from the community! If you have suggestions for improvements, new features, or bug fixes, please follow these guidelines:

1.  **Fork the Repository:** Start by forking the `habit-spark-2.0` repository to your GitHub account.
2.  **Create a Feature Branch:** For any new features or bug fixes, create a dedicated branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
    or
    ```bash
    git checkout -b bugfix/issue-description
    ```
3.  **Implement Your Changes:** Write your code, ensuring it adheres to the project's coding standards and includes relevant tests if applicable.
4.  **Commit Your Changes:** Write clear, concise commit messages.
    ```bash
    git commit -m 'feat: Add amazing new feature'
    ```
5.  **Push to Your Branch:** Push your local branch to your forked repository on GitHub:
    ```bash
    git push origin feature/your-feature-name
    ```
6.  **Open a Pull Request:** Submit a pull request to the `main` branch of the original `habit-spark-2.0` repository. Provide a detailed description of your changes.

### Reporting Issues

If you encounter any bugs or have feature requests, please open an issue on the [GitHub Issues page](https://github.com/Triumphant307/habit-spark-2.0/issues).

## License

This project is distributed under the **ISC License**. For more details, see the `LICENSE` file in the repository root.

## Badges

<!-- Add 3-6 relevant badges here. Examples: -->
[![GitHub last commit](https://img.shields.io/github/last-commit/Triumphant307/habit-spark-2.0)](https://github.com/Triumphant307/habit-spark-2.0/commits/main)
[![GitHub stars](https://img.shields.io/github/stars/Triumphant307/habit-spark-2.0?style=social)](https://github.com/Triumphant307/habit-spark-2.0/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Triumphant307/habit-spark-2.0?style=social)](https://github.com/Triumphant307/habit-spark-2.0/network/members)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Project Status](https://img.shields.io/badge/Status-Active-green.svg)](https://github.com/Triumphant307/habit-spark-2.0)
