namespace :data do
  desc "load data"
  task load: :environment do
    file = File.read("#{Rails.root}/data/recommendations.json")
    json = JSON.load(file)
    type = Type.find(3)

    json['response']['group']['results'].each do |venue|
      entry = venue['venue']
      location = entry['location']

      e = Entry.create(lat: location['lat'], lon: location['lng'], name: entry['name'],
        address: location['address'], type_id: type.id)
      e.assign_latlon
      e.save
    end
  end

  task migrate: :environment do
    Entry.all.each do |e|
      e.location = e.coordinate
      e.save
    end
  end
end
