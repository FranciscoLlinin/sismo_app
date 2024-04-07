class Api::FeaturesController < ApplicationController
  def index

    per_page = (params[:per_page] || 10).to_i
    per_page = 10 if per_page <= 0 || per_page > 1000
    
    mag_types = params.fetch(:mag_type, [])
    mag_types = Array(mag_types)

    features = Feature.all
    if mag_types.present?
      features = features.where(mag_type: mag_types)
    end
    features = features.page(params[:page]).per(per_page)

    render json: {
      data: features.map { |feature| feature_json(feature) },
      pagination: {
        current_page: features.current_page,
        total: features.total_count,
        per_page: features.limit_value
      }
    }
  end

  private

  def feature_json(feature)
    {
      id: feature.id,
      type: 'feature',
      attributes: {
        external_id: feature.external_id,
        magnitude: feature.magnitude,
        place: feature.place,
        time: feature.time.iso8601,
        tsunami: feature.tsunami,
        mag_type: feature.mag_type,
        title: feature.title,
        coordinates: {
          longitude: feature.longitude,
          latitude: feature.latitude
        }
      },
      links: {
        url: feature.url
      }
    }
  end
end