<template>
  <div>
    <app-modal :show-modal="showModalDelete || showModalEdit">
      <h3 class="task-modal__title">Please confirm the action</h3>
      <div class="task-modal__content">
        <span class="task-modal__btn">
          <button class="btn btn-danger" @click="cancelAction">Cancel</button>
        </span>
        <span class="task-modal__btn">
          <button class="btn btn-primary" @click="confirmAction">Confirm</button>
        </span>
      </div>
    </app-modal>
    <template v-if="!task || !taskLoaded">
      <app-modal :show-modal="taskNotFound = true">
        <h2 class="task-modal__title">Oops! Seems that the URL path is not correct, or the task is not found</h2>
        <div class="task-modal__content">
          <span class="task-modal__btn">
            <button class="btn btn-secondary" @click="goHome">Back home</button>
          </span>
        </div>
      </app-modal>
    </template>
    <card :card-title="'Task editor'" v-else>
      <template>
        <app-alert :message="alertResponse" v-if="savedSuccessfully"/>
        <div>
          <h3 class="task-editor__title">Task</h3>
          <input class="task-editor__input" v-model="editedTask.name" type="text" />
          <input type="checkbox" v-model="editedTask.completed" />
        </div>
        <h4 v-if="editedTask.subtasks.length > 0" class="task-editor__subtitle">Subtasks</h4>
        <span v-else class="task-editor__empty-message">
          There are no subtasks yet, but you can add up to or equal to 5.
        </span>
        <div class="task-editor" v-for="(subtask, index) in editedTask.subtasks" :key="subtask.id">
          <input class="task-editor__input" v-model="subtask.name" type="text" />
          <button class="task-editor__delete-btn" @click="deleteSubtask(index)">X</button>
          <input v-if="subtask.name" type="checkbox" v-model="subtask.completed" :class="{ 'task-editor__checkbox--completed': subtask.completed }" />
        </div>
        <div class="editor-actions">
          <span>
            <button class="btn btn-primary" @click="saveTask">Save</button>
          </span>
          <span>
            <button class="btn btn-warning" @click="showConfirmationDialog(task, 'edit')">Cancel</button>
          </span>
          <span>
            <button class="btn btn-secondary" @click="addNewSubtaskField" :disabled="isDisabled">New subtask</button>
          </span>
          <span>
            <button class="btn btn-danger" @click="showConfirmationDialog(task, 'delete')">Delete</button>
          </span>
        </div>
      </template>
    </card>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import Card from "@/components/ui/Card/Card.vue";
import AppModal from "@/components/ui/Modal/AppModal.vue";
import router from "@/router";
import AppAlert from "@/components/ui/Alert/AppAlert.vue";

export default defineComponent({
  name: 'TaskEdit',
  props: {
    task: {
      type: Object,
      required: true,
    }
  },
  components: {AppAlert, AppModal, Card },
  data() {
    return {
      editedTask: {},
      taskNotFound: false,
      taskLoaded: false,
      showModalDelete: false,
      showModalEdit: false,
      actionType: '',
      cancelActionType: '',
      alertMsg: '',
      savedSuccessfully: false
    };
  },
  watch: {
    task: {
      immediate: true,
      handler(newTask) {
        if (newTask) {
          this.editedTask = { ...newTask }
          this.taskLoaded = true
        }
      }
    }
  },
  methods: {
    addNewSubtaskField() {
      if (this.isDisabled) {
        return;
      }
      this.editedTask.subtasks.push({ id: Date.now(), name: '' });
    },

    cancelAction() {
      this.showModalDelete = false;
      this.showModalEdit = false;
    },
    confirmAction() {
      console.log('Action Type:', this.actionType);
      if (this.actionType === 'edit') {
        this.confirmEdit();
      } else if (this.actionType === 'delete') {
        this.confirmDeletion();
      }
    },
    confirmEdit() {
      this.goHome();
    },
    goHome: () => {
      router.push('/');
    },
    confirmDeletion() {
      this.goHome();
      this.$store.dispatch('deleteTask', this.taskToDelete.id);
      this.showModalDelete = false;
    },
    cancelDeletion() {
      this.showModalDelete = false;
    },
    showConfirmationDialog(task, type) {
      this.actionType = type;
      if (type === 'edit') {
        this.showModalEdit = true;
      } else if (type === 'delete') {
        this.showModalDelete = true;
      }
      this.taskToDelete = task;
    },
    deleteSubtask(index) {
      this.editedTask.subtasks.splice(index, 1);
    },
    saveTask() {
      // Filter out empty subtasks
      // Update the editedTask with non-empty subtasks
      this.editedTask.subtasks = this.editedTask.subtasks.filter(subtask => subtask.name.trim() !== '');

      // Check if changes were made
      const originalTask = this.$store.state.tasks.find(task => task.id === this.editedTask.id);
      const hasChanges = JSON.stringify(originalTask) !== JSON.stringify(this.editedTask);

      if (hasChanges) {
        // Create a batch object to store the mutations
        const mutationBatch = [];

        // Check if task completion has changed
        if (originalTask.completed !== this.editedTask.completed) {
          mutationBatch.push({
            type: 'UPDATE_TASK_COMPLETION',
            payload: { taskId: this.editedTask.id, completed: this.editedTask.completed }
          });
        }

        // Check if subtask completion has changed
        this.editedTask.subtasks.forEach(subtask => {
          const originalSubtask = originalTask.subtasks.find(st => st.id === subtask.id);
          if (originalSubtask && originalSubtask.completed !== subtask.completed) {
            mutationBatch.push({
              type: 'UPDATE_SUBTASK_COMPLETION',
              payload: { taskId: this.editedTask.id, subtaskId: subtask.id, completed: subtask.completed }
            });
          }
          console.log(mutationBatch)
        });

        // Check if task details have changed
        if (originalTask.name !== this.editedTask.name || originalTask.description !== this.editedTask.description) {
          mutationBatch.push({
            type: 'UPDATE_TASK',
            payload: this.editedTask
          });
        }

        // Commit the batch of mutations if there are changes
        if (mutationBatch.length > 0) {
          this.$store.commit('BATCH_MUTATIONS', mutationBatch);
          this.$store.dispatch('saveTasksToLS');
          this.savedSuccessfully = true;
        } else {
          this.savedSuccessfully = false;
        }
      } else {
        this.savedSuccessfully = true;
      }
    }

    // need to implement this logic
    // revertAction () {
    // },
    // redoRevertAction () {
    // }
  },
  computed: {
    isDisabled() {
      return this.editedTask.subtasks.length >= 5
    },
    alertResponse() {
      if (this.savedSuccessfully === false) {
        return 'Not saved';
      } else {
        return 'Saved successfully!';
      }
    },
    undoDisabled() {
      return this.$store.state.history.length === 0;
    },
    redoDisabled() {
      return this.$store.state.redoHistory.length === 0;
    },

  }
});
</script>

<style scoped lang="scss">
@import '@/scss/mixins';

.task-modal {
  margin: 1rem;
}

.task-editor__title, .task-editor__subtitle {
  margin-top: 0.8rem;
}

.task-editor__empty-message {
  margin-top: 1000rem;
}
.task-editor__input {
  @include common-input;
  width: 200px;
}
.task-modal__content {
  display: flex;
  justify-content: space-evenly;
}
.editor-actions {
  display: flex;
  justify-content: space-evenly;
}
.btn {
  margin-top: 1rem;
}

</style>