<template>
    <v-container>
        <v-card cols="8" flat>
            <div class="headline">Person bearbeiten</div>
            <v-row
                    v-if="loading"
                    class="fill-height"
                    align-content="center"
                    justify="center"
            >
                <v-col
                        class="subtitle-1 text-center"
                        cols="12"
                >
                    Lade Daten....
                </v-col>
                <v-col cols="6">
                    <v-progress-linear
                            indeterminate
                            rounded
                            height="6"
                    ></v-progress-linear>
                </v-col>
            </v-row>
            <v-form v-if="!loading" ref="form">
                <person-fields id="personeditview-personFields" :valid="valid" v-model="person"></person-fields>
                <v-row justify="center">
                    <v-col cols="12" md="12">
                        <kontakt-table id="personeditview-kontaktTable" v-model="person.kontakte"
                                       :parent-person-id="person.id"></kontakt-table>
                        <v-divider class="mt-5 mb-12"></v-divider>
                        <probe-table id="personeditview-probeTable" v-model="person.proben"></probe-table>
                        <v-divider class="mt-5 mb-12"></v-divider>
                    </v-col>
                </v-row>
            </v-form>
            <v-card-actions v-if="!loading">
                <v-spacer></v-spacer>
                <v-btn id="personeditview-btn-speichern" :enabled="valid" :loading="loading" color="primary"
                       @click="save">Speichern
                </v-btn>
            </v-card-actions>
        </v-card>
        <yes-no-dialog
                id="personeditview-yesNoDialog"
                ref="saveLeaveDialog"
                :dialogtitle="saveLeaveDialogTitle"
                :dialogtext="saveLeaveDialogText"
                v-model="saveLeaveDialog"
                @yes="leave"
                @no="cancel"
        >
        </yes-no-dialog>
    </v-container>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    //api
    import PersonService from "@/api/PersonService.ts"
    // components
    import PersonFields from "@/components/PersonFields.vue";
    import KontaktTable from "@/components/KontaktTable.vue";
    import ProbeTable from "@/components/ProbeTable.vue";
    import YesNoDialog from "@/components/Common/YesNoDialog.vue"
    import SaveLeaveMixin from "@/mixins/saveLeaveMixin";
    // model
    import Person, {equalsPerson, Quarantäne} from "../types/Person";
    import {Levels} from "@/api/error";
    import {deepEqual, deepStrictEqual} from 'assert';

    @Component({
        components: {PersonFields, KontaktTable, ProbeTable, YesNoDialog}
    })
    export default class PersonEditView extends SaveLeaveMixin {
        person: Person = {quarantaene: {}, kontakte: [], proben: []} as unknown as Person;
        personCopy: Person = {quarantaene: {}, kontakte: [], proben: []} as unknown as Person;
        loading: boolean = false;
        valid: boolean = false;
        saved = false;

        save() {
            let form = this.$refs.form as any;
            if (form.validate()) {
                this.loading = true;
                PersonService.updatePerson(this.person)
                    .then((resp) => {
                        this.$store.dispatch('snackbar/showMessage', {message: "Person wurde erfolgreich gespeichert."});
                        this.saved = true;
                        this.navigateRead();
                    })
                    .catch((error) => this.$store.dispatch('snackbar/showMessage', error))
                    .finally(() => this.loading = false);
            } else {
                this.$store.dispatch('snackbar/showMessage', {
                    level: Levels.WARNING,
                    message: "Bitte Fehleingaben korrigieren."
                });
            }
        }

        navigateRead() {
            this.$router.push(`/read/${this.person.id}`);
        }

        mounted() {
            this.loading = true;
            PersonService.readPerson(this.$route.params.id, true)
                .then(response => {
                    if (!response.quarantaene) {
                        response.quarantaene = {} as Quarantäne;
                    }
                    this.person = response;
                    this.personCopy = JSON.parse(JSON.stringify(response));
                })
                .finally(() => this.loading = false)
        }

        isDirty(): boolean {
            return !(this.saved || equalsPerson(this.person, this.personCopy));
        }
    }
</script>
