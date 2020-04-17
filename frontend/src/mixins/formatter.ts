import {Component, Vue} from 'vue-property-decorator';
import moment from "moment";

@Component
export default class Formatter extends Vue {

    startingCharUpperCase(text:string) {
        return text ? text.toLowerCase().replace(/^\w/, c => c.toUpperCase()): ""
    }
    formatDate(date: Date | undefined | null) {
        return date ? moment(date).format('L'): ""
    }
    formatDateTime(date: Date | undefined | null) {
        return date ? moment(date).format('L - LT'): ""
    }

}