<template>
    <v-app>
        <TheSnackbar/>
        <v-app-bar app clipped-left dark color="primary" >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer">
            </v-app-bar-nav-icon>

            <router-link to="/">
                <v-toolbar-title class="font-weight-bold">
                    <span class="white--text">COVID-19 Verdachtsfall-Verwaltung</span>
                </v-toolbar-title>

            </router-link>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <CallReminderButton id="app-callReminderButton"></CallReminderButton>
            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn id="app-link-faq" text fab v-on="on" :href=faqLink target="_blank">
                    <v-icon class="white--text">mdi-help-circle</v-icon>
                </v-btn>
            </template>
                <span>FAQs</span>
            </v-tooltip>
            <v-tooltip bottom>
            <template v-slot:activator="{ on }">
                <v-btn id="app-link-handbuch" text fab v-on="on" :href=benutzerhandbuchLink target="_blank">
                    <v-icon class="white--text">mdi-information</v-icon>
                </v-btn>
            </template>
                <span>Benutzerhandbuch</span>
            </v-tooltip>
        </v-app-bar>
        <v-navigation-drawer app clipped v-model="drawer">
            <v-list>
                <v-subheader>Personen</v-subheader>
                  <v-list-item id="app-link-create" :to="{path: '/create'}">
                    <v-list-item-content>
                        <v-list-item-title><v-icon left>mdi-account-plus</v-icon>Person erstellen</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                <v-list-item id="app-link-search" :to="{path: '/search'}">
                    <v-list-item-content>
                        <v-list-item-title><v-icon left>mdi-magnify</v-icon>Personen suchen</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-subheader>Anrufe</v-subheader>
                <v-list-item id="app-link-abschlussgespraeche" :to="{path: '/endCalls/Index'}">
                    <v-list-item-content>
                        <v-list-item-title><v-icon left>mdi-calendar-check</v-icon>Abschluss Index</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                <v-list-item id="app-link-abschlussgespraeche" :to="{path: '/endCalls/Kontaktperson'}">
                    <v-list-item-content>
                        <v-list-item-title><v-icon left>mdi-calendar-check</v-icon>Abschluss KP</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                <v-list-item id="app-link-dailyCalls" :to="{path: '/dailyCalls'}">
                    <v-list-item-content>
                        <v-list-item-title><v-icon left>mdi-calendar-clock</v-icon>Tägliche Anrufe</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                <v-list-item id="app-link-anrufsplanung" :to="{path: '/calldisposition'}">
                    <v-list-item-content>
                        <v-list-item-title><v-icon left>mdi-phone-log</v-icon>Anrufsplanung</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-subheader>Berichte</v-subheader>
                <v-list-item id="app-link-berichte" :to="{path: '/bericht'}">
                    <v-list-item-content>
                        <v-list-item-title><v-icon left>mdi-file-chart</v-icon>Bericht erstellen</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-content class="main">
            <v-container fluid>
                <v-fade-transition mode="out-in">
                    <router-view></router-view>
                </v-fade-transition>
            </v-container>
        </v-content>
    </v-app>
</template>

<style>
    .main {
        background-color: white;
    }
</style>

<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {Watch} from 'vue-property-decorator';
    import TheSnackbar from '@/components/TheSnackbar.vue'
    import CallReminderButton from '@/components/call/CallReminderButton.vue'

    @Component({
        components: {TheSnackbar, CallReminderButton}
    })
    export default class App extends Vue{

        drawer: boolean = true
        query:string = ''
        faqLink = process.env.VUE_APP_FAQ
        benutzerhandbuchLink = process.env.VUE_APP_BENUTZERHANDBUCH

        mounted() {
            this.query = this.$route.params.query;
        }

        @Watch('$route.params.query')
        function (query: string) {
            if (this.query !== query)
                this.query = query;
        }

    }
</script>