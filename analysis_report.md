# Project Architecture Analysis Report

## Overview
This project is a Vue 3 application built with a component-based architecture. It leverages Pinia for centralized state management and Vue Router for declarative navigation. The application is structured to support different user roles (Consumer, Farmer, Member) and features modular API interactions, reusable UI components, and a clear separation of concerns.

## Directory Structure Analysis

### `src/`
The `src/` directory serves as the main source code repository for the application. It encapsulates all the core logic, components, views, and assets, organized into distinct subdirectories to promote maintainability and scalability.

### `src/main.js`
This file is the entry point of the Vue 3 application. It is responsible for:
-   Creating the Vue application instance using `createApp(App)`.
-   Setting up and mounting Pinia for global state management.
-   Configuring and installing Vue Router for client-side navigation.
-   Globally registering the `Footer` component for application-wide use.
-   Defining a global utility property `$img` that uses `resolveImg` for dynamic image path resolution.
-   Importing global styles from `assets/style.css`.

### `src/App.vue`
`App.vue` is the root Vue component of the application. Its primary responsibilities include:
-   Housing the main layout structure.
-   Utilizing `<router-view>` to render the component corresponding to the current route.
-   Conditionally applying a `Layout` component wrapper to most pages, excluding the `/select-role` page, ensuring a consistent header, padding, and whitespace across the application.

### `src/router/`
This directory manages the application's routing configuration.
-   **`index.js`**: Defines all application routes using `createWebHistory`. It implements lazy loading for most view components to optimize initial load times. A crucial aspect is the implementation of a `router.beforeEach` navigation guard, which handles authentication by checking for user tokens and information in `localStorage` and redirects unauthenticated users from protected routes to the login page, while also storing the intended destination for post-login redirection.

### `src/store/`
This directory contains Pinia stores for managing global application state.
-   **`user.js`**: This Pinia store is dedicated to managing user authentication and related state. It persists user data (token, ID, name, role) in `localStorage` and provides actions for login, logout, setting user information, and managing authentication status. It also includes a getter for constructing the `Authorization` header for API requests.

### `src/api/`
This directory is responsible for handling all interactions with the backend API.
-   **`client.js`**: Configures an Axios-based HTTP client. It sets a base URL (configurable via environment variables), defines request interceptors to attach authentication tokens from the `userStore`, and includes response interceptors for global error handling (e.g., 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error). It also provides methods for common HTTP verbs (GET, POST, PUT, DELETE, PATCH).
-   **`index.js`**: Acts as an aggregation point, re-exporting the core `request` client and specific API modules (`foodApi`, `recipeApi`, `favoriteApi`, `memberApi`) from their respective files. This promotes a modular approach to API endpoint definitions.
-   **`food.js`, `recipe.js`, `favorite.js`, `member.js`**: These files (and potentially others) define specific API endpoints and methods related to different functional domains of the application, such as food data, recipes, user favorites, and member-related operations.

### `src/components/`
This directory houses reusable UI components that can be used across different parts of the application.
-   **Core Components**: `Footer.vue`, `Header.vue`, `Layout.vue`, `RoleToggle.vue` provide fundamental structural and interactive elements.
-   **Categorized Subdirectories**: Subdirectories like `CCC`, `ConsumerHome`, `Recipe`, and `Veggie` organize components based on their functional area or the specific views they are primarily used within, enhancing discoverability and modularity.

### `src/views/`
This directory contains the main page-level components of the application.
-   **Core Views**: `Home.vue`, `RoleSelect.vue`, and `test.vue` represent primary application screens.
-   **Categorized Subdirectories**: `Consumer`, `Farmer`, and `Member` subdirectories group views specific to different user roles or major sections of the application, aligning with the application's multi-role design.

#### Recent Enhancements
Recent updates have introduced significant new features and UI improvements, particularly within the `Member` and `Consumer` views:

-   **Comprehensive User Profile (`Profile.vue`)**: The member profile page has been completely redesigned into a full-featured user center. It now includes a sidebar for navigation and a tabbed interface for managing different aspects of the user's account, including:
    -   A detailed profile form to update user information.
    -   Sections for "Food Collection" and "Veggie Collection", which are powered by new, dedicated components.
    -   Enhanced API integration with `memberApi` for fetching and updating user data, with `localStorage` used for caching.

-   **Token-Based Registration (`Register.vue`)**: The user registration process has been made more secure by implementing a token-based verification step.

-   **In-Season Feature**: The `VegetableList.vue` and `VeggieInfoPage.vue` components now include logic to check and display whether a product is "in-season". This is aimed at providing users with more timely and relevant information about produce.

-   **Price Display UI/UX**: The price change indicator in `VegetableList.vue` has been enhanced. It now includes a "stable" state for minor price fluctuations and a helpful tooltip to explain the meaning of the price change, improving user understanding.

### `src/views/Member/6424/`
This new subdirectory houses components related to the enhanced user profile features.
-   **`Favorites.vue`**: A new component responsible for displaying and managing the user's favorite food collections.
-   **`VeggieFav.vue`**: A new component for managing the user's favorite vegetable collections.

### `src/utils/`
This directory contains utility functions that provide common functionalities used throughout the application.
-   **`resolveImg.js`**: Likely handles the dynamic resolution of image paths, possibly for assets that are not directly imported or are determined at runtime.
-   **`role.js`**: Contains utility functions related to user roles, such as checking permissions or role-based logic.

### `src/data/`
This directory stores various data files, which might include mock data for development, configuration settings, or static content.
-   Files like `consumerDashboardData.js`, `mockVeggieData.js`, `nutrientStats.js`, `nutritionData.js`, `priceTrendData.js`, `RecipeData.js`, `searchIndex.js`, and `VeggieData.js` suggest the presence of local data sources for different features, potentially used for initial rendering, testing, or offline capabilities.
-   The `6424` subdirectory might contain additional data or configurations specific to a particular module or version.