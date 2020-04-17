import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import snackbar from './modules/snackbar'

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        user,
        snackbar
    },
    strict: debug
})
