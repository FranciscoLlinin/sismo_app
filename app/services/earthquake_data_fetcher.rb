require 'net/http'
require 'json'

class EarthquakeDataFetcher
  USGS_FEED_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'.freeze

  def fetch_data
    uri = URI(USGS_FEED_URL)
    response = Net::HTTP.get(uri)
    data = JSON.parse(response)

    data['features'].map do |feature|
      {
        external_id: feature['id'],
        magnitude: feature['properties']['mag'],
        place: feature['properties']['place'],
        time: Time.at(feature['properties']['time'] / 1000),
        url: feature['properties']['url'],
        tsunami: feature['properties']['tsunami'],
        mag_type: feature['properties']['magType'],
        title: feature['properties']['title'],
        longitude: feature['geometry']['coordinates'][0],
        latitude: feature['geometry']['coordinates'][1]
      }
    end
  end
end