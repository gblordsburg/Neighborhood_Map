// Locations are hardcoded here, but they can be obtained via a third party API
// such as Foursquare
var locations =
    [
        {
            title: 'Deschutes Brewery Portland Public House',
            quadrant: 'NW',
            keywords: 'Deschutes Brewery',
            location: {lat: 45.524527, lng: -122.682030}
        },
        {
            title: 'Rogue Distillery and Public House',
            quadrant: 'NW',
            keywords: 'Rogue Ales',
            location: {lat: 45.525872, lng: -122.685060}
        },
        {
            title: 'Widmer Brothers Brewing',
            quadrant: 'NE',
            keywords: 'Widmer Brothers Brewery',
            location: {lat: 45.541126, lng: -122.676498}
        },
        {
            title: 'Double Mountain Taproom',
            quadrant: 'SE',
            keywords: 'Double Mountain Brewery',
            location: {lat: 45.479029, lng: -122.617760}
        },
        {
            title: 'Hair of the Dog Brewing Company',
            quadrant: 'SE',
            keywords: 'Hair of the Dog Brewing Company',
            location: {lat: 45.515902, lng: -122.665671}
        }
    ];

var Location = function(location) {
    this.title = location.title;
    this.quadrant = location.quadrant;
    this.keywords = location.keywords;
    this.location = location.location;
}

var myViewModel = function() {
    var self = this;

    //Create list of locations
    self.locations = ko.observableArray([]);
    locations.forEach(function(location){
        self.locations.push(new Location(location))
    })
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


    this.availableQuadrants = ko.observableArray(['All', 'SW', 'SE', 'NE', 'NW']);

    //This trick picked up from https://github.com/Aqueum/UFS-NeighborhoodMap/blob/master/js/app.js
    this.listClick = function(location) {
        google.maps.event.trigger(location.marker, "click");
    }
    //Filter the map markers, then run a function to filter the list
    this.filterClick = function(quadrant) {
        filterLocations(quadrant, self.locations);
        self.setFilter(quadrant);
    }
    //Filter the list
    self.setFilter = function(quadrant) {
        quadrant = filterForm.quadrantlist.value;
        self.currentFilter(quadrant);
    }
};

var vm = new myViewModel();
ko.applyBindings(vm);
