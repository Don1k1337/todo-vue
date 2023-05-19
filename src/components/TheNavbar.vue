<template>
  <nav class="navbar">
    <h1 class="navbar__title">Simple Todo App</h1>
    <router-link to="/">Home</router-link>
  </nav>
</template>

<style scoped lang="scss">
@import "@/scss/variables";

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  background: #fff;

  a {
    font-weight: bold;
    color: #2c3e50;
    text-decoration: none;
    margin: 0 18px;

    &.router-link-exact-active {
      color: #13114d;
    }
  }

  .navbar__title, a {
    margin: 0 18px;
    font-size: 18px;

    @media #{$common-screen-size} {
      font-weight: 700;
      font-size: 14px;
    }
  }
}
</style>
