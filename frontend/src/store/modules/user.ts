export default {
    namespaced: true,
    state: {
        user: null
    },
    getters: {

    },
    mutations: {
        setUser({state, user}: { state: any, user: any }){
            state.user = user
        }
    }
}