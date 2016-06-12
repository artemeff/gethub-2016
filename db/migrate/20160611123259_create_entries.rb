class CreateEntries < ActiveRecord::Migration
  def change
    create_table :entries do |t|
      t.st_point :coordinate, geographic: true
      t.string :name
      t.text :description
      t.string :address
      t.integer :type_id

      t.timestamps null: false
    end

    add_index :entries, :coordinate, using: :gist
  end
end
