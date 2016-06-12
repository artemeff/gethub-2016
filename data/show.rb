require 'json'

file = File.read('./recommendations.json')
json = JSON.load(file)

json['response']['group']['results'].each do |e|
  e = e['venue']
  p e['name']
  p e['location']['address']
  puts
end
