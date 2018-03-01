var initMap = function() {
    // Constructor creates a new map - only center and zoom are required.
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 45.51, lng: -122.66},
        zoom: 13,
        mapControl: false
    });

    var largeInfowindow = new google.maps.InfoWindow();
    // These two following functions were taken from udacity Fullstack
    // Nanodegree/The Frontend: JavaScript AJAX/Lesson7
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFA000');
    var clickedIcon = makeMarkerIcon('C6FF00');
    // This section was taken from udacity Fullstack Nanodegree/The Frontend:
    // JavaScript & AJAX/Lesson7/ud864/Project_Code_7_Drawing.html.
    // The following group uses the location array to create an array of
    // markers on initialize.

    vm.locations().forEach(function(location) {
        // Get the position from the location array.
        var position = location.location;
        var title = location.keywords;
        var quadrant = location.quadrant;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            map: map,
            title: title,
            quadrant: quadrant,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
        });
        location.marker = marker;
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            fillInfoWindow(this, largeInfowindow);
            this.setIcon(clickedIcon);
            toggleAnimation(this);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
                this.setIcon(defaultIcon);
        });
    });
};



// This function was taken from udacity Fullstack Nanodegree/The Frontend:
// JavaScript $ AJAX/Lesson7/ud864/Project_Code_7_Drawing.html.
// This function takes in a color, and then creates a new marker
// icon of that color.
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+
        markerColor +'|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

// This function was taken from udacity Fullstack Nanodegree/The Frontend:
// JavaScript $ AJAX/Lesson7/ud864/Project_Code_7_Drawing.html
// This function populates the infowindow when the marker is clicked. Only
// one infowindow is allowed which will open at the marker that is clicked,
// and populate based on that markers position.
function fillInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared when infowindow is closed.
        infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
        marker.setAnimation(null);
        });
        //console.log(marker.title);
        var wikiUrl =
            'https://en.wikipedia.org/w/api.php?action=opensearch&search=' +
            marker.title + '&format=json&callback=wikiCallback';
        var wikiRequestTimeout = setTimeout(function(){
            infowindow.setContent('failed to get wikipedia resources');
        }, 8000);

        $.ajax({
            url: wikiUrl,
            dataType: "jsonp",
            jsonp: "callback",
            success: function(response){
                //The data recieved from wikipedia differs from the rest,
                //so it had to be handled.
                if (marker.title == 'Rogue Ales') {
                    var markerTitle = response[1][0];
                    var markerInfo = response[2][0];
                    var markerLink = response[3][0];
                } else {
                    var markerTitle = response[1];
                    var markerInfo = response[2];
                    var markerLink = response[3];
                }
                infowindow.setContent(
                    '<div class="infowindow"><div class="marker_name"><span>'
                    + markerTitle +
                    '<span></br></div><div class="marker_info"><span>' +
                    markerInfo +
                    '<span></br></div><div class="marker_link"><span><a href="'
                     + markerLink + '">Wikipedia</a><span></br></div></div>');

                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);
                clearTimeout(wikiRequestTimeout);
            }
        }).fail(function() {
                alert("Request Failure");
           });
    } else if (infowindow.marker == marker && marker.getAnimation() === null) {
        infowindow.open(map, marker);
    } else if (infowindow.marker == marker) {
        infowindow.close();
        infowindow.marker = null;
        marker.setAnimation(null);
    }
}
//Toggle animation on and off
function toggleAnimation(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1400)
    }
}

//Filter the markers on the map
function filterLocations(quadrant, markers) {
    console.log(filterForm.quadrantlist.value);
    quadrant = filterForm.quadrantlist.value;
    vm.locations().forEach(function(location) {
        //list_item = $("ul li:eq(i)");
        //console.log(marker);
        //console.log(list_item);
        //console.log(marker.quadrant);
        if (location.marker.quadrant == quadrant || quadrant == 'All') {
            location.marker.setVisible(true);
        } else {
            location.marker.setVisible(false);
        }
    });
}

function googleMapsErrorHandler() {
    alert("There was an error while attempting to load google maps. We apologize for the inconvenience.")
}