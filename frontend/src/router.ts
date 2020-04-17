import Vue from "vue";
import Router from "vue-router";
import Main from './views/Main.vue'
import BerichtView from './views/BerichtView.vue'
import PersonCreateView from './views/PersonCreateView.vue'
import PersonSearchView from './views/PersonSearchView.vue'
import PersonEditView from './views/PersonEditView.vue'
import PersonReadView from './views/PersonReadView.vue'
import EndgespraecheView from './views/EndgespraecheView.vue'
import TaeglicheAnrufeView from './views/TaeglicheAnrufeView.vue'
import AnrufsplanungView from "@/views/AnrufsplanungView.vue";

Vue.use(Router);

/*
* Preventing "NavigationDuplicated" errors in console in Vue-router >= 3.1.0
* https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
* */
const routerMethods = ['push', 'replace'];
routerMethods.forEach((method: string) => {
    const originalCall = (Router.prototype as any)[method];
    (Router.prototype as any)[method] = function(location: any, onResolve: any, onReject: any): Promise<any> {
        if (onResolve || onReject) {
            return originalCall.call(this, location, onResolve, onReject);
        }
        return (originalCall.call(this, location) as any).catch((err: any) => err);
    };
});

export default new Router({
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/create",
            name: "create",
            component: PersonCreateView
        },
        {
            path: "/bericht",
            name: "bericht",
            component: BerichtView
        },
        {
            path: "/search",
            name: "search",
            component: PersonSearchView
        },
        {
            path: "/edit/:id",
            name: "edit",
            component: PersonEditView
        },
        {
            path: "/read/:id",
            name: "read",
            component: PersonReadView
        },
        {
            path: "/endCalls/",
            redirect: "/endcalls/Index"
        },
        {
            path: "/endCalls/:type",
            component: EndgespraecheView
        },
        {
            path: "/dailyCalls",
            component: TaeglicheAnrufeView
        },
        {
            path: "/calldisposition",
            name: "calldisposition",
            component: AnrufsplanungView
        },
        {path: '/', redirect: '/create'}, //Fallback 1
        {path: '*', redirect: '/create'} //Fallback 2
    ]
});