<template>
    <v-snackbar
            id="snackbar"
            v-model="show"
            :color="color"
            :timeout="timeout"
    >
        {{message}}
        <v-btn
                color="primary"
                text
                @click="show = false"
                v-if="color === 'error'"
        >
            Schließen
        </v-btn>
    </v-snackbar>
</template>

<script lang="ts">
    import {Component, Watch, Vue} from 'vue-property-decorator';

    @Component
    export default class TheSnackbar extends Vue {
        $store!: Vue["$store"];

        static defaultTimeout:number = 5000;

        show: boolean = false;
        timeout: number = TheSnackbar.defaultTimeout;
        message: string = '';
        color: string = 'info';

        @Watch('$store.state.snackbar.aktive')
        setMessage() {
            if(this.$store.state.snackbar.aktive) {
                this.message = this.$store.state.snackbar.message;
                this.setColor();
                this.show = true;
            }
        }

        setColor() {
            this.color = this.$store.state.snackbar.level;
            if(this.color === 'error') {
                this.timeout = 0;
            } else {
                this.timeout = TheSnackbar.defaultTimeout;
            }
        }

        @Watch("show")
        setShow() {
            if(!this.show)
                this.$store.dispatch('snackbar/deactivate');
        }
    }
</script>

