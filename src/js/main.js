//*** JavaScript Document
//*** main.js
//*** Document for Connect60Plus Website @ MAG
//*** author Wolfley
//****************************************************************************************************************
var map;
var mapContainer = null;
var dirContainer = null;
var fromInput = null;
var toInput = null;
var travelModeInput = null;
var unitInput = null;
var dirService = null;
var dirRenderer = null;
var layers = [];

// API Objects
var rendererOptions = {
  draggable: true
};

// Enable the visual refresh
google.maps.visualRefresh = true;


function initialize() {  

  mapContainer = document.getElementById('map-canvas');
  dirContainer = document.getElementById('dir-container');
  fromInput = document.getElementById('fromAddress');
  toInput = document.getElementById('toAddress');
  travelModeInput = document.getElementById('travel-mode-input');
  unitInput = document.getElementById('unit-input');

  var mapOptions = {
    zoom: 12,
    minZoom: 9,
    center: new google.maps.LatLng(33.50, -112.00),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scaleControl: true,

    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.TOP_RIGHT
    },

    panControl: true,
    panControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP
    },

    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.RIGHT_TOP
    },

    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
    },

  };

  map = new google.maps.Map(mapContainer, mapOptions);
  geocoder2 = new google.maps.Geocoder();
  dirService = new google.maps.DirectionsService();
  dirRenderer = new google.maps.DirectionsRenderer(rendererOptions);
  dirRenderer.setMap(map);

//**************************************************************************************************************
//KML Layers
 var CountyLayer = new google.maps.KmlLayer({
      url: County,
      preserveViewport: true,
      suppressInfoWindows: true
    });
    CountyLayer.setMap(map);

//group layers
layers[0] = new google.maps.KmlLayer({url: entertainment, preserveViewport: true, suppressInfoWindows: false});
layers[1] = new google.maps.KmlLayer({url: interest, preserveViewport: true, suppressInfoWindows: false});
layers[2] = new google.maps.KmlLayer({url: sports, preserveViewport: true, suppressInfoWindows: false});
layers[3] = new google.maps.KmlLayer({url: accommodations, preserveViewport: true, suppressInfoWindows: false});
layers[4] = new google.maps.KmlLayer({url: education, preserveViewport: true, suppressInfoWindows: false});
layers[5] = new google.maps.KmlLayer({url: government, preserveViewport: true, suppressInfoWindows: false});
layers[6] = new google.maps.KmlLayer({url: saftey, preserveViewport: true, suppressInfoWindows: false});

for (var i = 0; i < layers.length; i++) {
        layers[i].setMap(map);
      }

//**************************************************************************************************************
        map.enableKeyDragZoom({
                boxStyle: {
                  border: "2px solid red"
                },
                paneStyle: {
                  backgroundColor: "gray",
                  opacity: 0.2
                }
          });

     //address auto complete dropdown
     var options = {
      types: ["geocode"],
      componentRestrictions: {country: "us"}
     };

     var input0 = document.getElementById('address');
      autocomplete = new google.maps.places.Autocomplete(input0, options);
     var input1 = document.getElementById('fromAddress');
      autocomplete = new google.maps.places.Autocomplete(input1, options);
     var input2 = document.getElementById('toAddress');
     autocomplete = new google.maps.places.Autocomplete(input2, options);
  
    autocomplete.bindTo('bounds', map); 

}
//for IE to render properly when loaded
setTimeout('google.maps.event.trigger(map, "resize");map.setZoom(map.getZoom());map.setCenter(map.getCenter());', 500);
//**************************************************************************************************************
function toggleLayer(i) {
      if(layers[i].getMap() === null) {
        layers[i].setMap(map);
      }
      else {
        layers[i].setMap(null);
      }
    }

//**************************************************************************************************************
function codeAddress() {
  var address = document.getElementById('address').value;
  geocoder2.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);

      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
      });
      marker.setTitle(results[0].formatted_address);
      map.setZoom(16);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
//**************************************************************************************************************
//**** Direction Service
function showDirections (dirResult, dirStatus) {
  if (dirStatus != google.maps.DirectionsStatus.OK) {
    alert('Directions failed: ' + dirStatus);
    return;
  }

// Show directions
  dirRenderer.setMap(map);
  dirRenderer.setPanel(dirContainer);
  dirRenderer.setDirections(dirResult);
  
}

function getSelectedTravelMode () {
  var value = travelModeInput.options[travelModeInput.selectedIndex].value;

  if (value == 'driving') {
    value = google.maps.DirectionsTravelMode.DRIVING;
  } else if (value == 'transit') {
    value = google.maps.DirectionsTravelMode.TRANSIT;
  } else if (value == 'bicycling') {
    value = google.maps.DirectionsTravelMode.BICYCLING;
  } else if (value == 'walking') {
    value = google.maps.DirectionsTravelMode.WALKING;
  } else {
    alert('Unsupported travel mode.');
  }
  return value;
}

function getDirections () {
  clearAll();
  var fromStr = fromAddress.value;
  var toStr = toAddress.value;
  var dirRequest = {
    origin: fromStr,
    destination: toStr,
    travelMode: getSelectedTravelMode(),
    unitSystem: google.maps.DirectionsUnitSystem.IMPERIAL,
    provideRouteAlternatives: true
  };
  dirService.route(dirRequest, showDirections);
}

function clearAll() {
    dirRenderer.setMap(null);
    dirRenderer.setPanel(null);
}
//**************************************************************************************************************
//*** Dropdown Points of Interest (poi) ***//
function toggleLeg() {
    if ($("#poi").is(':hidden')) {
        $("#poi").slideDown();
        $("#directions, #findAddress, #info").slideUp();
        $("#poi").draggable({containment: '#map-canvas'});
        $('#poiTab').html('Points of Interest');
    } else {
        $("#poi").slideUp();
        $('#poiTab').html('Points of Interest');
    }
}

$(document).ready(function () {
    $("#poiTab").fadeTo('slow');
    $("#poi").fadeTo('slow');
    legTop = $("#poiTab").height();
    $("#poi").css('top', poiTab);
    $("#poiTab").click(function () {
        toggleLeg();
    });

});

//sets original position of dropdown
$(document).ready(function () {
    $("#poi").hide(); 
});
//*** /Dropdown Points of Interest (poi) ***//
//************************************************************************************************************** 
//*** Dropdown Directions ***//
function toggleDirections() {
    if ($("#directions").is(':hidden')) {
        $("#directions").slideDown();
        $("#directions").draggable({containment: '#map-canvas'});
        $("#poi, #findAddress, #info").slideUp();
        $('#directionTab').html('Directions');
    } else {
        $("#directions").slideUp();
        $('#directionTab').html('Directions');
    }
}

$(document).ready(function () {
    $("#directionTab").fadeTo('slow');
    $("#directions").fadeTo('slow');
    legTop = $("#directionTab").height();
    $("#directions").css('top', directionTab);
    $("#directionTab").click(function () {
        toggleDirections();
    });

});

//sets original position of dropdown
$(document).ready(function () {
    $("#directions").hide(); 
});
//*** /Dropdown Directions ***//
//************************************************************************************************************** 
//*** Dropdown Address ***//
function toggleAddress() {
    if ($("#findAddress").is(':hidden')) {
        $("#findAddress").slideDown();
        $("#findAddress").draggable({containment: '#map-canvas'});
        $("#directions, #poi, #info").slideUp();
        $('#addressTab').html('Address');
    } else {
        $("#findAddress").slideUp();
        $('#addressTab').html('Address');
    }
}

$(document).ready(function () {
    $("#addressTab").fadeTo('slow');
    $("#findAddress").fadeTo('slow');
    legTop = $("#addressTab").height();
    $("#findAddress").css('top', addressTab);
    $("#addressTab").click(function () {
        toggleAddress();
    });

});

//sets original position of dropdown
$(document).ready(function () {
    $("#findAddress").hide(); 
});

//*** /Dropdown Address ***//
//************************************************************************************************************** 
//*** Dropdown Info ***//
function toggleInfo() {
    if ($("#info").is(':hidden')) {
        $("#info").slideDown();
        $("#info").draggable({containment: '#map-canvas'});
        $("#directions, #findAddress, #poi").slideUp();
        $('#infoTab').html('Info/Help');
    } else {
        $("#info").slideUp();
        $('#infoTab').html('Info/Help');
    }
}

$(document).ready(function () {
    $("#infoTab").fadeTo('slow');
    $("#info").fadeTo('slow');
    legTop = $("#infoTab").height();
    $("#info").css('top', infoTab);
    $("#infoTab").click(function () {
        toggleInfo();
    });

});

//sets original position of dropdown
$(document).ready(function () {
    $("#info").hide(); 
});

//*** /Dropdown Info ***//
//************************************************************************************************************** 
//hover over any nav tab changes css
var style1 = {
  color: "#E8E8E8",
  backgroundColor: "#1B1B1B",
  fontSize: 14,
  padding: "14.5px 20px 14.5px",
}

var style2 = {
  color: "#888888",
  backgroundColor: "#1B1B1B",
  fontSize: 16,
  padding: "10px 20px 10px",
}


$(".nav")
.on( "mouseenter", function() {
  $(this).css( style2 );
})
.on( "mouseleave", function() {
  $(this).css( style1 );
});

//**************************************************************************************************************

//*** Open Email Window ***//
function openemailwin() {
    var emailURL = href=jasonemail;
    win = window.open(emailURL,'', 'resizable=no,location=no,menubar=no,scrollbars=no,status=no,toolbar=no,fullscreen=no,dependent=no,width=600px,height=660px');
}
//*** /Open Email Window ***//
//**************************************************************************************************************
function print(){}
$(document).ready(function() {
  $('#printMap').click(function() {
    $(this).attr('href', PrintGmap.getPrintUrl([fromAddress.value, toAddress.value]));
  });
});

var PrintGmap = {
      
     getPrintUrl : function(addresses)
      {
        // Set default values
        //if(!travelmode) var travelmode = G_TRAVEL_MODE_WALKING;
        //if(!lang) var lang = "en";

        // Prepare URL
        var url = "http://maps.google.com/maps?f=d&source=s_d";
        
        // Add list of addresses to URL
        for(i = 0; i < addresses.length; i++)
        {
          if(i == 0)
          {
            url += "&saddr=";
          }
          else if(i == 1)
          {
            url += "&daddr=";
          }
          url += addresses[i].replace(/ /g, '+');
          if(i != addresses.length - 1 && i != 0)
          {
            url += "+to:";
          }
        }
             
        url += "&layer=c&ie=UTF8&z=10&pw=2&hl=en";

        // Set travel mode if necessary
        //if(travelmode == G_TRAVEL_MODE_WALKING)
          //url += "&dirflg=w";
        
        // ready
        return url;
      }

};
//**************************************************************************************************************
google.maps.event.addDomListener(window, 'load', initialize);