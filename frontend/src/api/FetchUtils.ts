import { ApiError, Levels } from "@/api/error";

export default class FetchUtils {

    /**
     * Liefert eine default GET-Config für fetch
     */
    static getGETConfig() : RequestInit {
        return {
            headers: this.getHeaders(),
            mode: 'cors',
            credentials: 'include',
            redirect: 'manual'
        };
    }

    /**
     * Liefert eine default POST-Config für fetch
     * @param body Optional zu übertragender Body
     */
    static getPOSTConfig(body:any) : RequestInit {
        return {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            headers: FetchUtils.getHeaders(),
            mode: 'cors',
            credentials: 'include',
            redirect: "manual"
        }
    }

    /**
     * Liefert eine default PUT-Config für fetch
     * In dieser wird, wenn vorhanden, die Version der zu aktualisierenden Entität
     * als "If-Match"-Header mitgesetzt.
     * @param body Optional zu übertragender Body
     */
    static getPUTConfig(body:any) : RequestInit {
        let headers = FetchUtils.getHeaders();
        if(body.version) {
            headers.append("If-Match", body.version)
        }
        return {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
            headers,
            mode: 'cors',
            credentials: 'include',
            redirect: "manual"
        }
    }

    /**
     * Liefert eine default PATCH-Config für fetch
     * In dieser wird, wenn vorhanden, die Version der zu aktualisierenden Entität
     * als "If-Match"-Header mitgesetzt.
     * @param body Optional zu übertragender Body
     */
    static getPATCHConfig(body:any) : RequestInit {
        let headers = FetchUtils.getHeaders();
        if(body.version !== undefined) {
            headers.append("If-Match", body.version)
        }
        return {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
            headers,
            mode: 'cors',
            credentials: 'include',
            redirect: "manual"
        }
    }

    /**
     * Default Catch-Handler für alle Anfragen des Personen-Service.
     * Schmeißt derzeit nur einen ApiError
     * @param error die Fehlermeldung aus fetch-Befehl
     */
    static defaultPersonenServiceCatchHandler(error : Error) : PromiseLike<never> {
        throw new ApiError({
            level: Levels.ERROR,
            message: "Verbindung zum Personen-Service konnte nicht aufgebaut werden."
        });
    }

    /**
     * Deckt das Default-Handling einer Response ab. Dazu zählt:
     * 
     * - Fehler bei fehlenden Berechtigungen --> HTTP 403
     * - Reload der App bei Session-Timeout --> HTTP 3xx
     * - Default-Fehler bei allen HTTP-Codes !2xx
     * 
     * @param response Die response aus fetch-Befehl die geprüft werden soll.
     * @param errorMessage Die Fehlermeldung, welche bei einem HTTP-Code != 2xx angezeigt werden soll.
     */
    static defaultResponseHandler(response : Response, errorMessage : string = "Es ist ein unbekannter Fehler aufgetreten.") {
        if (!response.ok) {
            if(response.status === 403) {
                throw new ApiError({
                    level: Levels.ERROR,
                    message: `Sie haben nicht die nötigen Rechte um diese Aktion durchzuführen.`
                });
            } else if (response.type === "opaqueredirect") {
                location.reload()
            }
            throw new ApiError({
                level: Levels.WARNING,
                message: errorMessage
            });
        }
    }

    /**
     *  Baut den Header fuer den Request auf
     * @returns {Headers}
     */
    static getHeaders(): Headers {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let csrf_cookie = this._getXSRFToken();
        if (csrf_cookie !== '') {
            headers.append('X-XSRF-TOKEN', csrf_cookie);
        }
        return headers;
    }

    /**
     * Liefert den XSRF-TOKEN zurück.
     * @returns {string|string}
     */
    static _getXSRFToken(): string {
        let help = document.cookie.match('(^|;)\\s*' + 'XSRF-TOKEN' + '\\s*=\\s*([^;]+)');
        return (help ? help.pop() : '') as string;
    }

}
