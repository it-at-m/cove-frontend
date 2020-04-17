import { ApiError, Levels } from '@/api/error';
import FetchUtils from './FetchUtils';
import DailyCallReport from '@/types/DailyCallReport';
import Bericht from '@/types/Bericht';

export default class BerichtService {

    private static base: string | undefined = process.env.VUE_APP_API_URL + "/api/cove-backend-service";

    static getBericht(): Promise<Bericht> {
        return fetch(`${this.base}/persons/bericht`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, `Beim Erstellen des Berichts ist ein Fehler aufgetreten.`);
                return new Promise((resolve) => resolve(response.json()));
            })
    }

    static getDailyCallStatistik(): Promise<DailyCallReport> {
        return fetch(`${this.base}/persons/dailyCallStatistik`, FetchUtils.getGETConfig())
            .catch(FetchUtils.defaultPersonenServiceCatchHandler)
            .then(response => {
                FetchUtils.defaultResponseHandler(response, `Beim Erstellen des täglichen Anrufsfortschritts ist ein Fehler aufgetreten.`);
                return new Promise((resolve) => resolve(response.json()));
            })
    }
}