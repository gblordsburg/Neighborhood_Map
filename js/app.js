// Locations are hardcoded here, but they can be obtained via a third party API
// such as Foursquare
var locations =
    [
         {
            title: 'St. Johns Twin Cinemas',
            quadrant: 'NW',
            keywords: 'St. Johns Twin Cinemas',
            location: {lat: 45.590587, lng: -122.755645}
        },
         {
            title: 'Cinema 21',
            quadrant: 'NW',
            keywords: 'Cinema 21',
            location: {lat: 45.527361, lng: -122.694307}
        },
         {
            title: 'Hollywood Theatre',
            quadrant: 'NE',
            keywords: 'Hollywood Theatre',
            location: {lat: 45.535444, lng: -122.620631}
        },
         {
            title: 'Laurelhurst Theater',
            quadrant: 'NE',
            keywords: 'Laurelhurst Theater',
            location: {lat: 45.523255, lng: -122.637492}
        },
        {
            title: 'Baghdad Theatre',
            quadrant: 'SE',
            keywords: 'Baghdad Theatre',
            location: {lat: 45.511908, lng: -122.625533}
        },
         {
            title: 'Moreland Theatre',
            quadrant: 'SW',
            keywords: 'Moreland Theatre',
            location: {lat: 45.474203, lng:-122.648682}
        },
         {
            title: '5th Avenue Cinema',
            quadrant: 'SW',
            keywords: '5th Avenue Cinema',
            location: {lat: 45.510151, lng: -122.682682}
        }
    ];

var Location = function(location) {
    this.title = location.title;
    this.quadrant = location.quadrant;
    this.keywords = location.keywords;
    this.location = location.location;
};

var myViewModel = function() {
    var self = this;

    //Create list of locations
    self.locations = ko.observableArray([]);
    locations.forEach(function(location){
        self.locations.push(new Location(location));
    });
    //Store the filter
    // inspired by https:/stackoverflow.com/question/20857594/knockout-filtering-on-observable-array
    //filter array using ko.utils.arrayFilter learned from above url and
    // http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    self.currentFilter = ko.observable();
    self.filteredLocations = ko.computed(function() {
        if (!self.currentFilter() || self.currentFilter() == 'All') {
            return self.locations();
        } else {
            return ko.utils.arrayFilter(self.locations(), function(location) {
                return location.quadrant == self.currentFilter();
            });
        }
    });


    this.availableQuadrants = ko.observableArray([
        'All', 'SW', 'SE', 'NE', 'NW'
    ]);

    //This trick picked up from https://github.com/Aqueum/UFS-NeighborhoodMap/blob/master/js/app.js
    this.listClick = function(location) {
        google.maps.event.trigger(location.marker, "click");
    };
    //Filter the map markers, then run a function to filter the list
    this.filterClick = function(quadrant) {
        filterLocations(quadrant, self.locations);
        self.setFilter(quadrant);
    };
    //Filter the list
    self.setFilter = function(quadrant) {
        quadrant = filterForm.quadrantlist.value;
        self.currentFilter(quadrant);
    };
};

var vm = new myViewModel();
ko.applyBindings(vm);
