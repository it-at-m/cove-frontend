import { Component, Vue } from "vue-property-decorator";

Component.registerHooks([
    'beforeRouteLeave',
]);
@Component
export default class SaveLeaveMixin extends Vue{
    name:string = "saveLeaveMixin";


    saveLeaveDialogTitle:string = 'Ungespeicherte Änderungen';
    saveLeaveDialogText:string = 'Es sind ungespeicherte Änderungen vorhanden. Wollen Sie die Seite verlassen?';
    saveLeaveDialog:boolean = false;
    isSave:boolean = false;
    next:any = null;

    beforeRouteLeave (to:any, from:any, next:any) {
        if(this.isDirty() && !this.isSave) {
            this.saveLeaveDialog = true;
            this.next = next;
        } else {
            this.saveLeaveDialog = false;
            next()
        }
    }
    cancel() {
        //erzwingt das Neuladen des Dialogs. Somit werden nicht gespeicherte Eingaben wieder zurückgesetzt.
        this.saveLeaveDialog = false;
        this.next(false);
    }

    leave() {
        this.next();
    }

    isDirty() {
        return true;
    }

}
