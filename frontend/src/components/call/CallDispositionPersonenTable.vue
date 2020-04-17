<template>
    <v-data-table id="calldisppersonentable-table" :headers="tableHeaders" :items="value">
        <template #item.erstKontaktErfolgtAm="{item}">{{formatDate(item.erstKontaktErfolgtAm)}}</template>
        <template #item.letzterKontakt="{item}">{{formatDateTime(item.letzterKontakt)}}</template>
        <template #item.quarantaene.start="{item}">{{formatDate(item.quarantaene.start)}}</template>
        <template #item.quarantaene.ende="{item}">{{formatDate(item.quarantaene.ende)}}</template>
        <template v-slot:no-data>Keine Daten vorhanden</template>
    </v-data-table>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import Person from '../../types/Person';
    import Formatter from "@/mixins/formatter";

    @Component({
        mixins: [Formatter]
    })
    export default class CallDispositionPersonenTable extends Vue {
        @Prop()
        value!: Person[];

        tableHeaders = [
            {text: "Name", value: "vornameNachname", sort: false},
            {text: "Telefon", value: "telefon", sort: false},
            {text: "Mobil", value: "mobile", sort: false, divider:true},
            {text: "Erstkontakt am", value: "erstKontaktErfolgtAm", sort: false},
            {text: "Zuletzt kontaktiert am", value: "letzterKontakt", sort: false},
            {text: "In Quarantäne seit", value: "quarantaene.start", sort: false},
            {text: "In Quarantäne bis", value: "quarantaene.ende", sort: false, divider:true},
            {text: "Strasse", value: "strasse", sort: false},
            {text: "PLZ", value: "plz", sort: false},
            {text: "Ort", value: "ort", sort: false, divider:true},
            {text: "Telefon-Notizen", value: "telefonnotizen", sort: false},
            {text: "Dokumentation", value: "doku", sort: false},
        ];
    }
</script>

