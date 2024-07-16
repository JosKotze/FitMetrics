import { FitMetricsApi } from "../src/app/api/FitMetricsApi";

export function fitMetricsApiFactory() {
  return new FitMetricsApi(/* constructor parameters if any */);
}