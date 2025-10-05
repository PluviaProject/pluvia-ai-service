export interface WeatherInsightsInput {
  date: string;
  place: {
    coordinates: number[];
    address: string;
  };
  description?: string;
  temporalAverage: {
    temperature: number;
    windSpeed: number;
    precipitationPercentage: number;
  };
  // projectionAverage: {
  //   temperature: number;
  //   windSpeed: number;
  //   precipitationPercentage: number;
  // };
}

export interface WeatherInsightsResult {
  description: string;
  insights: string[];
}
