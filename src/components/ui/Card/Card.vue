<template>
    <div class="card">
        <h2 class="card__title">{{ cardTitle }}</h2>
        <slot></slot>
    </div>
</template>

<script>
import {defineComponent} from 'vue'

export default defineComponent({
    name: "Card",
    props: ['cardTitle']
})
</script>

<style scoped lang="scss">
@import "@/scss/mixins";

.card {
  @include common-card;
}

.card__title {
  margin: 0.5rem auto;
  font-size: 17px;
}
</style>