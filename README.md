# todo-app

## Description

This is a simple single-page application (SPA) built with Vue.js that allows users to manage their to-do tasks. The main functionality of the app includes:

- Adding tasks: Users can add new tasks to their to-do list.
- Saving tasks to local storage: The app saves the tasks to the browser's local storage, so they persist even after the page is refreshed.
- Retrieving tasks from local storage: When the app loads, it retrieves the tasks from local storage and displays them in the to-do list.
- Editing tasks by ID: Users can edit existing tasks by specifying their ID. They can modify the task's title, description, due date, and other properties.
- Completing tasks: Users can mark tasks as complete. Completed tasks are visually distinguished from active tasks.
- Reverting changes in the edit page: If users make changes to a task in the edit page but decide to revert them, they can restore the task's original state. They can also create new subtasks or delete existing subtasks.

The app utilizes Vuex for state management and Vue Router for handling the routing between different pages. It also uses HTML for structuring the application and SCSS for styling.
Additionally, the app uses a stack data structure to manage the task editing history. This allows users to Undo & Redo changes made to a task during the editing process. The stack data structure ensures that the previous states of the task are preserved, enabling users to revert changes easily.

## Technologies Used

- Vue.js: A JavaScript framework for building user interfaces.
- Vuex: A state management pattern and library for Vue.js applications.
- Vue Router: The official router for Vue.js, used for handling the routing between different pages.
- HTML: The standard markup language for creating web pages.
- SCSS: A CSS preprocessor that extends the capabilities of CSS with variables, mixins, and more.

Feel free to explore and modify the code to suit your needs. Happy task managing!


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
