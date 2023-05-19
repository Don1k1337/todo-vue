import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tasks: [],
        loading: false
    },
    mutations: {
        SET_LOADING(state, tasks) {
            state.loading = tasks
        },
        SET_TASKS(state, tasks) {
            state.tasks = tasks;
        },
        ADD_TASK(state, newTask) {
            state.tasks.push(newTask);
        },
        DELETE_TASK(state, taskId) {
            state.tasks = state.tasks.filter(task => task.id !== taskId);
            this.dispatch('saveTasksToLS');
        },
        UPDATE_TASK(state, updatedTask) {
            const taskIndex = state.tasks.findIndex(task => task.id === updatedTask.id);
            if (taskIndex !== -1) {
                state.tasks.splice(taskIndex, 1, updatedTask);
                this.dispatch('saveTasksToLS');
            }
        },
        UPDATE_SUBTASK(state, payload) {
            const {taskId, subtaskId, completed} = payload;
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
                const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
                if (subtask) {
                    subtask.completed = completed;
                }
            }
        },
        UPDATE_TASK_COMPLETION(state, {taskId, completed}) {
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
                task.completed = completed;
                this.dispatch('saveTasksToLS');
            }
        },
        UPDATE_SUBTASK_COMPLETION(state, {taskId, subtaskId, completed}) {
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
                const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
                if (subtask) {
                    subtask.completed = completed;
                    if (!completed) {
                        task.subtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
                    }
                    this.dispatch('saveTasksToLS');
                }
            }
        },
    },
    actions: {
        updateTaskAndSubtasks({commit, dispatch, state}, editedTask) {
            const originalTask = state.tasks.find(task => task.id === editedTask.id);

            // Check if task completion or details have changed
            const hasTaskChanges =
                originalTask.completed !== editedTask.completed ||
                originalTask.name !== editedTask.name ||
                originalTask.description !== editedTask.description;

            // Commit the mutation if there are changes to the task
            if (hasTaskChanges) {
                commit('UPDATE_TASK', editedTask);
                dispatch('saveTasksToLS');
            }

            // Update subtasks
            editedTask.subtasks.forEach(subtask => {
                const originalSubtask = originalTask.subtasks.find(st => st.id === subtask.id);
                if (originalSubtask) {
                    const subtaskChanges =
                        originalSubtask.completed !== subtask.completed ||
                        originalSubtask.name !== subtask.name;

                    // Commit the mutation if there are changes to the subtask
                    if (subtaskChanges) {
                        commit('UPDATE_SUBTASK', {
                            taskId: editedTask.id,
                            subtaskId: subtask.id,
                            completed: subtask.completed,
                            name: subtask.name
                        });
                    }
                }
            });

            dispatch('saveTasksToLS');
        },
        retrieveTasksFromLS({commit}) {
            return new Promise((resolve, reject) => {
                const storedTasks = localStorage.getItem('tasks');

                if (storedTasks) {
                    const tasks = JSON.parse(storedTasks);
                    commit('SET_TASKS', tasks);
                    resolve(tasks);
                } else {
                    reject(new Error('No tasks found in local storage.'));
                }
            });
        },

        retrieveTaskById({state}, taskId) {
            return state.tasks.find(task => task.id === taskId);
        },
        saveTasksToLS({state}) {
            const tasksToSave = state.tasks.map(task => {
                const nonEmptySubtasks = task.subtasks.filter(subtask => subtask.name.trim() !== '');
                return {...task, subtasks: nonEmptySubtasks};
            });
            localStorage.setItem('tasks', JSON.stringify(tasksToSave));
        },
        createTask({commit, dispatch, state}, newTask) {
            newTask.id = state.tasks.length + 1;

            if (newTask.subtasks && newTask.subtasks.length > 0) {
                newTask.subtasks = newTask.subtasks.map((subtask, index) => ({
                    id: index + 1,
                    name: subtask.name,
                    completed: false
                }));
            }

            commit('ADD_TASK', newTask);
            dispatch('saveTasksToLS');
        },
        deleteTask({commit, dispatch}, taskId) {
            commit('DELETE_TASK', taskId);
            dispatch('saveTasksToLS');
        },
        updateTaskCompletion({commit, dispatch}, {taskId, completed}) {
            commit('UPDATE_TASK_COMPLETION', {taskId, completed});
            dispatch('saveTasksToLS');
        },
        editTask({commit, dispatch}, {taskId, updatedTask}) {
            commit('EDIT_TASK', {taskId, updatedTask});
            dispatch('saveTasksToLS');
        },
        updateSubtaskCompletion({commit, dispatch, state}, {taskId, subtaskId, completed}) {
            const task = state.tasks.find(task => task.id === taskId);
            if (task) {
                const subtask = task.subtasks.find(subtask => subtask.id === subtaskId);
                if (subtask) {
                    subtask.completed = completed;
                    if (!completed) {
                        task.subtasks = task.subtasks.filter(st => st.id !== subtaskId);
                    }
                    dispatch('saveTasksToLS');
                }
            }
        },
    },
    getters: {
        totalSubtasks: state => taskId => {
            const task = state.tasks.find(task => task.id === taskId);
            return task ? task.subtasks.length : 0;
        },
        completedSubtasksCount: state => taskId => {
            const task = state.tasks.find(task => task.id === taskId);
            return task ? task.subtasks.filter(subtask => subtask.completed).length : 0;
        },
        retrieveTaskById: (state) => (taskId) => {
            return state.tasks.find((task) => task.id === taskId);
        },
    }
});
