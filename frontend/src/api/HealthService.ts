import {ApiError, Levels} from '@/api/error';
import HealthState from "@/types/HealthState";
import FetchUtils from "@/api/FetchUtils";

export default class HealthService {

    private static base: string | undefined = process.env.VUE_APP_API_URL

    static checkHealth(): Promise<HealthState> {
        return fetch(`${this.base}/actuator/health`, FetchUtils.getGETConfig())
            .then(response => {
                FetchUtils.defaultResponseHandler(response, "Beim Laden der Daten vom API-Gateway ist ein Fehler aufgetreten.");
                return response.json();
            })
            .catch(error => {
                throw new ApiError({
                    level: Levels.ERROR,
                    message: "Verbindung zum API-Gateway konnte nicht aufgebaut werden."
                });

            })
    }
}