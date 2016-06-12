//= require jquery
//= require jquery_ujs
//= require leaflet
//= require leaflet.draw
//= require request
//= require cookie

$(function() {
  var entryInfoBlock = $('.main__entry');
  var entryInfoContent = $('.main__entry__block');
  var entryCloseBlock = $('.main__entry__close');
  var entryAddButton = $('#add_entry');
  var entryAddForm = $('.main__form');
  var entryFormClose = $('.main__form__close');
  var typeChooser = $('#type_chooser');
  var cityChooser = $('#city_chooser');
  var svgIcon = undefined;
  var map = L.map('map', {
    // center: [57.6227, 39.8872],
    center: [64.2422, 100.0195],
    // zoom: 12,
    zoom: 3,
    crs: L.CRS.EPSG3395
  });
  var typeId = undefined;
  var isStateAddEntry = false;
  var markerIcon = L.divIcon({
    className: 'marker',
    iconSize: [25, 25]
  });

  getRequest('/assets/marker.svg', function(resp) {
    svgIcon = resp;
  });

  var onMarkerClick = function(e) {
    getRequest('/api/entries/' + this.id, function(body) {
      entryInfoContent.html(body);
    });

    entryInfoContent.empty();
    entryInfoBlock.fadeIn(250);
  }

  if (getCookie('type')) {
    var type = getCookie('type');
    typeChooser.val(type);
    typeId = type;
  }

  typeChooser.on('change', function(e) {
    if (e.target.value === '0') {
      typeId = undefined;
    } else {
      typeId = e.target.value;
    }

    createCookie('type', e.target.value, 30);
  });

  var showCity = function(value) {
      var vals = value.split(',');
      var lat = vals[0];
      var lon = vals[1];
      var zoom = vals[2];

      map.setView([lat, lon], zoom);
  }

  if (getCookie('city')) {
    showCity(getCookie('city'));
    cityChooser.val(getCookie('city'));
  }

  cityChooser.on('change', function(e) {
    if (e.target.value) {
      showCity(e.target.value);
      createCookie('city', e.target.value, 30);
    } else {
      createCookie('city', undefined, -1);
    }
  });

  var fetchEntries = function(latlngs, typeId) {
    postRequest('/api/entries', {polygon: latlngs, type_id: typeId}, function(resp) {
      for (var i = resp.entries.length - 1; i >= 0; i--) {
        var entry = resp.entries[i];
        var icon = L.divIcon({className: 'marker ' + entry.type_color, iconSize: [25, 25], html: svgIcon});
        var marker = L.marker(entry.latlng, {icon: icon});

        marker.on('click', onMarkerClick.bind(entry));
        marker.addTo(markerLayer);
      }
    });
  }

  entryCloseBlock.on('click', function(e) {
    entryInfoBlock.fadeOut(250);
  });

  entryAddButton.on('click', function(e) {
    document.body.classList.toggle('cursor-crossing');

    if (document.body.classList.contains('cursor-crossing')) {
      isStateAddEntry = true;
      entryAddButton.text('отменить');
    } else {
      isStateAddEntry = false;
      entryAddButton.text('добавить точку');
    }
  });

  entryFormClose.on('click', function(e) {
    document.body.classList.toggle('cursor-crossing');
    isStateAddEntry = false;
    entryAddButton.text('добавить точку');
    entryAddForm.fadeOut();
  });

  L.tileLayer('http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU', {
    subdomains: ['01', '02', '03', '04'],
    attribution: '<a http="yandex.ru" target="_blank">Яндекс</a>',
    reuseTiles: true,
    updateWhenIdle: false,
    zoomControl: false,
    maxNativeZoom: 17
  }).addTo(map);

  // Initialise the FeatureGroup to store editable layers
  var editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);

  // marker layer
  var markerLayer = new L.FeatureGroup();
  map.addLayer(markerLayer);

  // Initialise the draw control and pass it the FeatureGroup of editable layers
  var drawControl = new L.Control.Draw({
    edit: {
      featureGroup: editableLayers, //REQUIRED!!
      remove: false,
      edit: false
    },
    draw: {
      // TODO
      rectangle: false,
      circle: false,
      // ...
      marker: false,
      polyline: false
      // polygon: {
      //   allowIntersection: false
      // }
    }
  });

  map.addControl(drawControl);

  // ...
  map.on('draw:drawvertex', function(e) {
    markerLayer.clearLayers();
    editableLayers.clearLayers();
  });

  // draw early created polygon
  if (getCookie('latlngs')) {
    var coordinates = JSON.parse(getCookie('latlngs'));
    var latlngs = [];

    for (var i = coordinates.length - 1; i >= 0; i--) {
      var coord = coordinates[i];

      latlngs.push(L.latLng(coord['lat'], coord['lng']));
    }

    var polygon = L.polygon(latlngs);

    editableLayers.addLayer(polygon);

    fetchEntries(coordinates, typeId);
  }

  // ...
  map.on('draw:created', function (e) {
    var layer = e.layer;
    var latlngs = e.layer.getLatLngs()[0];

    createCookie('latlngs', JSON.stringify(latlngs), 30);
    editableLayers.addLayer(layer);
    fetchEntries(latlngs, typeId);
  });

  map.on('click', function(e) {
    if (isStateAddEntry) {
      entryAddForm.fadeIn();

      $('#entry_lat').attr('value', e.latlng.lat);
      $('#entry_lon').attr('value', e.latlng.lng);
    }
  });

  $("#new_entry").on("ajax:success", function(e, data, status, xhr) {
    document.body.classList.toggle('cursor-crossing');
    isStateAddEntry = false;
    entryAddButton.text('добавить точку');
    entryAddForm.fadeOut();
  });
});
