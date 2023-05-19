<template>
  <app-modal :show-modal="pathIsIncorrect">
    <h2 class="modal-title">Oops! Seems that the URL path is not correct</h2>
    <div class="modal-content">
          <span class="modal-content__btn">
            <button class="btn btn-secondary" @click="goHome">Back home</button>
          </span>
    </div>
  </app-modal>
</template>

<script>
import {goHomeMixin} from "@/mixin/goHomeMixin";
import AppModal from "@/components/ui/Modal/AppModal.vue";

export default {
  components: {AppModal},
  data() {
    return {
      pathIsIncorrect: true
    }
  },
  mixins: [goHomeMixin],
};
</script>
