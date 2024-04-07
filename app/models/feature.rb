class Feature < ApplicationRecord
  has_many :comments

  validates :title, :url, :place, :mag_type, presence: true
  validates :magnitude, inclusion: { in: -1.0..10.0 }
  validates :latitude, inclusion: { in: -90.0..90.0 }
  validates :longitude, inclusion: { in: -180.0..180.0 }
end