require 'foursquare2'

CLIENT_ID = 'FS54GGNXTPNTYAUZQKIMYUJYZALXHPRDZ2GMFYLYACAIRG5L'
CLIENT_SECRET = 'T0DOLFSDBVWFRGJUPIHNJXRWWTUIOIPU0MFVWGCVSAGRQXHB'
API_VERSION = '20160101'

client = Foursquare2::Client.new(client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET, api_version: API_VERSION)

entries = client.search_venues_by_tip(ll: '57.611039,39.861719', query: 'музеи', limit: 50)
p entries.size
entries.each do |e|
  p e.name
  p e.location
  puts
end


# <Hashie::Mash
#   categories=[
#     <Hashie::Mash id="4deefb944765f83613cdba6e" name="Historic Site" pluralName="Historic Sites" primary=true shortName="Historic Site">]
#   contact=#<Hashie::Mash> id="4d4d42fb6335cbffddad8931" location=#<Hashie::Mash address="ул. 50 лет Октября" cc="RU" city="Ростов" country="Россия" distance=54476 formattedAddress=["ул. 50 лет Октября", "Ростов", "Россия"] lat=57.18469842693398 lng=39.415812492370605 state="Ярославская обл"> name="Ростовский кремль" stats=#<Hashie::Mash checkinsCount=5111 tipCount=65 usersCount=4595> url="http://www.rostmuseum.ru" verified=false>
