class Entry < ActiveRecord::Base
  SRID = 4326

  attr_accessor :lat, :lon

  belongs_to :type

  validates :location, :name, :type_id, presence: true

  class << self
    def by_polygon(latlngs)
      # make closed polygon
      latlngs.push(latlngs[0])
      # make string for linestring function
      string = latlngs.map { |p| "#{p['lat']} #{p['lng']}" }.join(',')

      where("ST_Intersects(location, ST_Polygon(ST_GeomFromText('LINESTRING(#{string})'), #{SRID}))")
    end
  end

  def assign_latlon
    self.location = "POINT(#{lat} #{lon})"
  end
end
