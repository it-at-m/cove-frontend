<template>
    <v-dialog
            :value="value"
            persistent
            width="600"
            :key="value"
            @input="changed"
    >
        <template #activator="{on}">
            <template v-if="buttontext !== undefined">
                <v-btn
                        color="primary"
                        v-on="on"
                >
                    {{buttontext}}
                </v-btn>
            </template>
            <template v-else-if="icontext !== undefined">
                <v-btn
                        text
                        color="primary"
                        v-on="on"
                >
                    <v-icon large>{{icontext}}</v-icon>
                </v-btn>
            </template>
        </template>
        <v-card>
            <v-card-title>
                {{dialogtitle}}
            </v-card-title>
            <v-card-text>
                {{dialogtext}}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        id="loeschendialog-btn-abbrechen"
                        text
                        @click="cancel"
                >
                    Abbrechen
                </v-btn>
                <v-btn
                        id="loeschendialog-btn-loeschen"
                        color="primary"
                        @click="loeschen"
                >
                    Löschen
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

    export default {
        name: 'LoeschenDialog',
        components: {},
        props: {
            buttontext: {
                type: String
            },
            icontext: {
                type: String
            },
            dialogtitle: {
                type: String
            },
            value: {
                type: Boolean
            },
            dialogtext: {
                type: String
            }
        },
        methods: {
            cancel() {
                this.$emit('canceled')
            },
            loeschen() {
                this.$emit('deleted')
            },
            changed(val) {
                this.$emit("input", val)
            }
        }
    }
</script>