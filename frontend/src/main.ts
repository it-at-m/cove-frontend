import Vue from 'vue';
import 'babel-polyfill'
import Vuetify from "./plugins/vuetify";
import store from './store'
import App from './App.vue';
import router from "./router";
import moment from "moment";

Vue.config.productionTip = false;

moment.locale(window.navigator.language);

new Vue({
    router,
    store: store,
    vuetify: Vuetify,
    render: h => h(App),
}).$mount('#app');
