# HabitSpark 2.0 - Backend API Specification

This document defines the REST API endpoints required to support the HabitSpark 2.0 frontend with full cloud synchronization.

## 🔑 Authentication
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register new user | `{ email, password, nickname }` |
| `POST` | `/auth/login` | Authenticate user | `{ email, password }` |
| `POST` | `/auth/logout` | Invalidate session | `N/A` |
| `GET` | `/auth/me` | Verify token & get user | `N/A` |

## 👤 User & Onboarding
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/user/onboarding` | Save wizard results | `{ goal, commitment, firstHabit: {} }` |
| `GET` | `/user/preferences` | Get theme/UI settings | `N/A` |
| `PATCH` | `/user/preferences` | Update UI settings | `{ theme, sidebarCollapsed, etc }` |

## 🚀 Cloud Sync (The Core)
These endpoints are designed for high-performance "Local-First" synchronization.

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/sync` | Pull latest changes | Query Param: `?since=[iso_timestamp]` |
| `POST` | `/sync` | Push local changes | `{ habits: Habit[], deletedIds: string[] }` |

## ⚡ Habits (CRUD)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `GET` | `/habits` | Fetch all habits | `N/A` |
| `POST` | `/habits` | Create new habit | `{ title, icon, target, category }` |
| `PATCH` | `/habits/:id` | Edit habit details | `{ title, target, icon, category }` |
| `DELETE` | `/habits/:id` | Remove habit | `N/A` |
| `POST` | `/habits/reorder`| Save drag-and-drop order | `{ idArray: string[] }` |

## 🔥 Tracking & Progress
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| `POST` | `/habits/:id/complete`| Mark done for today | `{ date: "YYYY-MM-DD" }` |
| `POST` | `/habits/:id/reset` | Reset streak to zero | `N/A` |
| `GET` | `/habits/:id/stats` | Get detailed analytics | `N/A` |

## 💡 Suggestions
| Method | Endpoint | Description | Payload / Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/suggestions` | Fetch curated tips | Query Params: `?page=1&limit=20&category=Health&q=water` |
| `POST` | `/suggestions/fav` | Toggle favorite tip | `{ tipId, isFavorite: boolean }` |
| `GET` | `/suggestions/categories`| Get list of available tags | `N/A` |

### Suggestion Query Details:
- **Pagination**: Use `page` and `limit` to prevent loading thousands of tips at once.
- **Search**: The `q` parameter should perform a partial match (regex or `LIKE`) on tip titles and descriptions.
- **Filtering**: The `category` parameter allows focusing on specific user goals (Productivity, Wellness, etc.).
