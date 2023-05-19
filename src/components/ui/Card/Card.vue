<template>
  <div class="card">
    <h2 class="card__title">{{ cardTitle }}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: ['cardTitle']
}
</script>

<style scoped lang="scss">
@import "@/scss/mixins";
@import "@/scss/variables";

.card {
  @include common-card;

  .card__title {
    font-weight: 700;
    margin: 0.5rem auto;
    font-size: 17px;
  }

  @media #{$common-screen-size} {
    .card__title {
      font-size: 14px;
    }
  }
}
</style>
