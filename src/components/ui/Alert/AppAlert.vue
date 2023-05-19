<template>
  <div class="alert" :class="`alert-${type}`" v-show="visible">
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'AppAlert',
  props: {
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value),
    },
    message: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 5000
    },
  },
  data() {
    return {
      visible: true,
    };
  },
  mounted() {
    this.setAutoHide();
  },
  methods: {
    setAutoHide() {
      setTimeout(() => {
        this.visible = false;
      }, this.duration);
    },
  },
};
</script>

<style scoped lang="scss">

.alert {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  transition: opacity 0.3s ease-in-out;

  &.alert-info {
    background-color: #d1ecf1;
    color: #0c5460;
  }

  &.alert-success {
    background-color: #d4edda;
    color: #155724;
  }

  &.alert-warning {
    background-color: #fff3cd;
    color: #856404;
  }

  &.alert-error {
    background-color: #f8d7da;
    color: #721c24;
  }

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }
}

</style>