<template>
  <div>
    <app-modal :show-modal="showModalDelete || showModalEdit">
      <h3>Please confirm the action</h3>
      <div class="task-modal">
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
        <h2>Oops! Seems that the URL path is not correct, or the task is not found</h2>
        <div class="task-modal">
          <span class="task-modal__btn">
            <button class="btn btn-secondary" @click="goHome">Back home</button>
          </span>
        </div>
      </app-modal>
    </template>
    <card :card-title="'Task editor'" v-else>
      <template>
        <h3>Task</h3>
        <input v-model="editedTask.name" type="text" />
        <h4>Subtask</h4>
        <div class="task-editor" v-for="(subtask, id) in editedTask.subtasks" :key="subtask.id">
          <input v-model="subtask.name" type="text" />
        </div>
        <div class="editor-actions">
          <span>
            <button class="btn btn-warning" @click="cancelActionType = actionType; showModalEdit = true">Cancel</button>
          </span>
          <span>
            <button class="btn btn-secondary" @click="addNewSubtaskField" :disabled="isDisabled">New subtask</button>
          </span>
          <span>
            <button class="btn btn-secondary">Revert action</button>
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
import { defineComponent } from 'vue';
import Card from "@/components/Card/Card.vue";
import AppModal from "@/components/Modal/AppModal.vue";
import router from "@/router";

export default defineComponent({
  name: 'TaskEdit',
  props: {
    task: {
      type: Object,
      required: true,
    }
  },
  components: { AppModal, Card },
  data() {
    return {
      editedTask: {},
      taskNotFound: false,
      taskLoaded: false,
      showModalDelete: false,
      showModalEdit: false,
      actionType: '',
      cancelActionType: '',
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
    goHome() {
      router.push('/');
    },
    cancelAction() {
      this.showModalDelete = false;
      this.showModalEdit = false;
    },
    confirmAction() {
      if (this.actionType === 'edit') {
        this.confirmEdit();
      } else if (this.actionType === 'delete') {
        this.confirmDeletion();
      }
    },
    confirmEdit() {
      this.showModalEdit = false;
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
  },
  computed: {
    isDisabled() {
      return this.editedTask.subtasks.length >= 5
    }
  }
});
</script>

<style scoped lang="scss">
.task-modal {
  margin: 1rem;
}
.editor-actions {
  display: flex;
  justify-content: space-evenly;
}
.btn {
  margin-top: 1rem;
}
</style>
