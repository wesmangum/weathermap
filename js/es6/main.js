(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    initMap(38, -95, 4);
    $('#add').click(add);
  }
  var map;
  var charts = {};
  function initMap(lat, lng, zoom) {
    var styles = [{
      'featureType': 'water',
      'elementType': 'geometry',
      'stylers': [{'color': '#a2daf2'}]
    }, {
      'featureType': 'landscape.man_made',
      'elementType': 'geometry',
      'stylers': [{'color': '#f7f1df'}]
    }, {
      'featureType': 'landscape.natural',
      'elementType': 'geometry',
      'stylers': [{'color': '#d0e3b4'}]
    }, {
      'featureType': 'landscape.natural.terrain',
      'elementType': 'geometry',
      'stylers': [{'visibility': 'off'}]
    }, {
      'featureType': 'poi.park',
      'elementType': 'geometry',
      'stylers': [{'color': '#bde6ab'}]
    }, {
      'featureType': 'poi',
      'elementType': 'labels',
      'stylers': [{'visibility': 'off'}]
    }, {
      'featureType': 'poi.medical',
      'elementType': 'geometry',
      'stylers': [{'color': '#fbd3da'}]
    }, {
      'featureType': 'poi.business',
      'stylers': [{'visibility': 'off'}]
    }, {
      'featureType': 'road',
      'elementType': 'geometry.stroke',
      'stylers': [{'visibility': 'off'}]
    }, {
      'featureType': 'road',
      'elementType': 'labels',
      'stylers': [{'visibility': 'off'}]
    }, {
      'featureType': 'road.highway',
      'elementType': 'geometry.fill',
      'stylers': [{'color': '#ffe15f'}]
    }, {
      'featureType': 'road.highway',
      'elementType': 'geometry.stroke',
      'stylers': [{'color': '#efd151'}]
    }, {
      'featureType': 'road.arterial',
      'elementType': 'geometry.fill',
      'stylers': [{'color': '#ffffff'}]
    }, {
      'featureType': 'road.local',
      'elementType': 'geometry.fill',
      'stylers': [{'color': 'black'}]
    }, {
      'featureType': 'transit.station.airport',
      'elementType': 'geometry.fill',
      'stylers': [{'color': '#cfb2db'}]
    }];
    var mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: zoom,
      mapTypeId: google.maps.MapTypeId.MAP,
      styles: styles
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    debugger;
    var weatherLayer = new google.maps.weather.WeatherLayer({temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT});
    weatherLayer.setMap(map);
    var cloudLayer = new google.maps.weather.CloudLayer();
    cloudLayer.setMap(map);
  }
  function add() {
    var zip = $('#zip').val();
    $('#zip').val('');
    $('#zip').focus();
    getWeather(zip);
    show(zip);
  }
  function getWeather(zip) {
    var url = 'http://api.wunderground.com/api/11cb146a56f12140/forecast10day/q/' + zip + '.json?callback=?';
    $.getJSON(url, (function(data) {
      $('#charts').append(("<div class=chart data-zip=" + zip + "></div>"));
      initChart(zip);
      tenDay(data, zip);
    }));
  }
  function tenDay(data, zip) {
    var forecast = data.forecast.simpleforecast.forecastday;
    forecast.forEach((function(z) {
      return charts[$traceurRuntime.toProperty(zip)].dataProvider.push({
        high: z.high.fahrenheit,
        low: z.low.fahrenheit,
        title: (z.date.month + "/" + z.date.day)
      });
    }));
    charts[$traceurRuntime.toProperty(zip)].validateData();
  }
  function addMarker(lat, lng, name, icon) {
    var latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({
      map: map,
      position: latLng,
      title: name,
      icon: icon
    });
  }
  function show(zip) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: zip}, (function(results, status) {
      var name = results[0].formatted_address;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      addMarker(lat, lng, name, './media/pin.png');
      var latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);
    }));
  }
  function initChart(zip) {
    var chart = $((".chart[data-zip=" + zip + "]"))[0];
    $traceurRuntime.setProperty(charts, zip, AmCharts.makeChart(chart, {
      'type': 'serial',
      'theme': 'dark',
      'pathToImages': 'http://www.amcharts.com/lib/3/images/',
      'legend': {'useGraphSettings': true},
      'titles': [{
        'text': ("" + zip),
        'size': 15
      }],
      'dataProvider': [],
      'valueAxes': [{
        'id': 'v1',
        'minimum': 0,
        'maximum': 100,
        'axisColor': '#FF6600',
        'axisThickness': 2,
        'gridAlpha': 0,
        'axisAlpha': 1,
        'position': 'left',
        'title': 'Temperature'
      }],
      'graphs': [{
        'valueAxis': 'v1',
        'lineColor': '#e7022b',
        'bullet': 'round',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'high',
        'valueField': 'high',
        'fillAlphas': 0
      }, {
        'valueAxis': 'v1',
        'lineColor': '#09e0e0',
        'bullet': 'triangleUp',
        'bulletBorderThickness': 1,
        'hideBulletsCount': 30,
        'title': 'high',
        'valueField': 'low',
        'fillAlphas': 0
      }],
      'chartCursor': {'cursorPosition': 'mouse'},
      'categoryField': 'title',
      'categoryAxis': {
        'axisColor': '#DADADA',
        'minorGridEnabled': true
      }
    }));
  }
})();

//# sourceMappingURL=main.map
