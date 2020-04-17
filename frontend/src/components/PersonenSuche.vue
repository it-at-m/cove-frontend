<template>
    <v-form ref="form">
        <v-row align="center" justify="center">
        <v-col cols="12" md="5">
            <v-text-field
                id="personensuche-textfield-vornachname"
                @keyup.enter.native="search" 
                v-model="name" 
                label="Vor- und Nachname" 
                filled
                dense
                outlined
                hide-details
            ></v-text-field>
        </v-col>
        <v-col cols="12" md="5">
            <v-select 
                id="personensuche-select-kategorie"
                @keyup.enter.native="search" 
                v-model="selectedKategorie" 
                :items="kategorieArten" 
                label="Kategorie" 
                filled
                dense
                outlined
                hide-details></v-select>
        </v-col>
        <v-col cols="12" md="2">
            <v-btn 
                id="personensuche-btn-suchen"
                class="self-center"
                @click="search" 
                :loading="value"
                color="primary">
            <v-icon left dark>mdi-magnify</v-icon>Suchen</v-btn>
        </v-col>
        </v-row>
    </v-form>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
import Kategorie from "@/types/Kategorie";
import { KategorieToText } from "@/types/Kategorie";
import Person from "@/types/Person";
import PersonService from '../api/PersonService';
import PersonSearchParams from '../api/types/PersonSearchparams';
import Vuetify from 'vuetify';

@Component
export default class PersonenSuche extends Vue {
    $store!: Vue["$store"];

    name: string = '';
    selectedKategorie: Kategorie = '' as Kategorie;
    kategorieArten: any = [];
    @Prop()
    value!: boolean; //Loading Flag
 
    search() {
        if(!this.value && (this.$refs.form as any).validate()) {
            (this as Vue).$emit("search", new PersonSearchParams(this.name, this.selectedKategorie));
        }
    }

    mounted() {
        let tmpArten = [];
        // Default selection: alle
        tmpArten.push({
            text: "Alle Kategorien",
            value: ''
        } as any)
        // Alle Kategorien hinzufügen
        tmpArten = tmpArten.concat(
            Object.values(Kategorie).map(key => {
                return {
                    text: KategorieToText.get(key) as string,
                    value: key
                };
            })
        );
        // Setzen fürs Databinding
        this.kategorieArten = tmpArten;
    }

}
</script>

