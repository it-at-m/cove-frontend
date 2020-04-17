<template>
    <v-container>
        <v-layout
                text-center
                wrap
        >
            <v-flex xs12>
                <v-img
                        :src="require('../assets/logo.png')"
                        class="my-3"
                        contain
                        height="200"
                ></v-img>
            </v-flex>

            <v-flex mb-4>
                <h1 class="display-2 font-weight-bold mb-3">
                    Willkommen beim RefArch-Kickstarter
                </h1>
                <p>Das API-Gateway ist: <span v-bind:class="status">{{status}}</span></p>
            </v-flex>

        </v-layout>
    </v-container>
</template>

<style scoped>
    .UP {
        color: limegreen;
    }

    .DOWN {
        color: lightcoral;
    }
</style>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import HealthService from "@/api/HealthService";

    @Component
    export default class App extends Vue {
        $store!: Vue["$store"];

        base: string | undefined = process.env.VUE_APP_API_URL
        status: string = "DOWN"

        mounted() {
            HealthService.checkHealth()
                .then((content:any) => this.status = content.status)
                .catch(error => {
                    this.$store.dispatch('snackbar/showMessage', error)
                })
        }
    }
</script>