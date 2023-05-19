import Vue from 'vue';

export const goHomeMixin = {
    methods: {
        async goHome() {
            await this.$router.push('/');
        },
    },
};

Vue.mixin(goHomeMixin);


