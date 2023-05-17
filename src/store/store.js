import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tasks: [],
    },
    mutations: {
        setTasks(state, tasks) {
            state.tasks = tasks;
        },
        addTask(state, newTask) {
            state.tasks.push(newTask);
        },
        updateTaskCompletion(state, { taskId, completed }) {
            const task = state.tasks.find((task) => task.id === taskId);
            if (task) {
                task.completed = completed;
                this.dispatch('saveTasksToLS');
            }

        },
        updateSubtaskCompletion(state, { taskId, subtaskId, completed }) {
            const task = state.tasks.find((task) => task.id === taskId);
            if (task) {
                const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
                if (subtask) {
                    subtask.completed = completed;
                    this.dispatch('saveTasksToLS');
                }
            }
        },
    },
    actions: {
        retrieveTasksFromLS({ commit }) {
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                const tasks = JSON.parse(storedTasks);
                commit('setTasks', tasks);
            }
        },
        saveTasksToLS({ state }) {
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        createTask({ commit, dispatch, state }, newTask) {
            newTask.id = state.tasks.length + 1;
            commit('addTask', newTask);
            this.dispatch('saveTasksToLS');
        },
        updateTaskCompletion(state, { taskId, completed }) {
            const task = state.tasks.find((task) => task.id === taskId);
            if (task) {
                task.completed = completed;
                this.dispatch('saveTasksToLS');
            }
        },
        updateSubtaskCompletion(state, { taskId, subtaskId, completed }) {
            const task = state.tasks.find((task) => task.id === taskId);
            if (task) {
                const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
                if (subtask) {
                    subtask.completed = completed;
                    if (!completed) {
                        task.subtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId);
                    }
                    this.dispatch('saveTasksToLS');
                }
            }
        },
    },
    getters: {
        totalSubtasks: (state) => (taskId) => {
            const task = state.tasks.find((task) => task.id === taskId);
            return task ? task.subtasks.length : 0;
        },
        completedSubtasksCount(state) {
            let count = 0;
            state.tasks.forEach((task) => {
                count += task.subtasks.filter((subtask) => subtask.completed).length;
            });
            return count;
        },
    },
});
