class EarthquakeDataSyncTask
    def perform
      data = EarthquakeDataFetcher.new.fetch_data
  
      data.each do |feature_data|
        feature = Feature.find_or_initialize_by(external_id: feature_data[:external_id])
        feature.assign_attributes(feature_data)
  
        unless feature.save
          Rails.logger.error("Error saving feature: #{feature.errors.full_messages}")
          next
        end
      end
    end
  end