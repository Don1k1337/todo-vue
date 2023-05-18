import Vue from 'vue'
import Vuex from 'vuex';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tasks: [],
    },
    mutations: {
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
        UPDATE_TASK_COMPLETION(state, { taskId, completed }) {
            const task = state.tasks.find((task) => task.id === taskId);
            if (task) {
                task.completed = completed;
                this.dispatch('saveTasksToLS');
            }
        },
        UPDATE_SUBTASK_COMPLETION(state, { taskId, subtaskId, completed }) {
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
    actions: {
        retrieveTasksFromLS({ commit }) {
            const storedTasks = localStorage.getItem('tasks');
            if (storedTasks) {
                const tasks = JSON.parse(storedTasks);
                commit('SET_TASKS', tasks);
            }
        },
        saveTasksToLS({ state }) {
            localStorage.setItem('tasks', JSON.stringify(state.tasks));
        },
        createTask({ commit, dispatch, state }, newTask) {
            newTask.id = state.tasks.length + 1;
            commit('ADD_TASK', newTask);
            dispatch('saveTasksToLS');
        },
        deleteTask({ commit, dispatch }, taskId) {
            commit('DELETE_TASK', taskId);
            dispatch('saveTasksToLS');
        },
        updateTaskCompletion({ commit, dispatch }, { taskId, completed }) {
            commit('UPDATE_TASK_COMPLETION', { taskId, completed });
            dispatch('saveTasksToLS');
        },
        updateSubtaskCompletion({ commit, dispatch, state }, { taskId, subtaskId, completed }) {
            const task = state.tasks.find((task) => task.id === taskId);
            if (task) {
                const subtask = task.subtasks.find((subtask) => subtask.id === subtaskId);
                if (subtask) {
                    subtask.completed = completed;
                    if (!completed) {
                        task.subtasks = task.subtasks.filter((st) => st.id !== subtaskId);
                    }
                    dispatch('saveTasksToLS');
                }
            }
        },
    },
    getters: {
        totalSubtasks: (state) => (taskId) => {
            const task = state.tasks.find((task) => task.id === taskId);
            return task ? task.subtasks.length : 0;
        },
        completedSubtasksCount: (state) => (taskId) => {
            const task = state.tasks.find((task) => task.id === taskId);
            return task ? task.subtasks.filter((subtask) => subtask.completed).length : 0;
        },
    },
});
