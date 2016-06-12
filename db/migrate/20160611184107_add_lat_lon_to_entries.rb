class AddLatLonToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :location, :st_point, srid: 4326
  end
end
