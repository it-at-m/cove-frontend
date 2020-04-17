import {Levels} from "@/api/error";

export interface SnackbarState {
    message: string | undefined,
    level: Levels,
    aktive: boolean
}

export default {
    namespaced: true,
    state: {
        message: undefined,
        level: Levels.INFO,
        aktive: false
    } as SnackbarState,
    getters: {
    },
    mutations: {
        SET_MESSAGE(state:SnackbarState, message:string) {
            state.message = message
        },
        SET_LEVEL(state:SnackbarState, level:Levels) {
            state.level = level
        },
        SET_AKTIVE(state:SnackbarState, aktive:boolean) {
            state.aktive = aktive
        }
    },
    actions: {
        showMessage(context: any, message: SnackbarState) {
            context.commit('SET_LEVEL', message.level ? message.level : Levels.INFO);
            context.commit('SET_MESSAGE', message.message);
            context.commit('SET_AKTIVE', true);
        },
        deactivate(context: any) {
            context.commit('SET_AKTIVE', false);
        }
    }
}