class RemoveCoordinateFromEntries < ActiveRecord::Migration
  def change
    remove_column :entries, :coordinate
  end
end
