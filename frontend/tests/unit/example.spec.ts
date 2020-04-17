import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import Vue from 'vue';
import TheSnackbar from '@/components/TheSnackbar.vue'

const localVue = createLocalVue();

describe('TheSnackbar.vue', () => {

    let vuetify: any;

    beforeAll(() => {
        Vue.use(Vuetify);
    });

    beforeEach(() => {
        vuetify = new Vuetify();
    });

    it('renders props.message when passed', () => {
        const message = 'Hello_World'
        const wrapper = shallowMount(TheSnackbar, {
            localVue,
            vuetify,
            propsData: {message: message}
        })

        expect(wrapper.html()).toContain(message)
    })
})
