
var App = function () {
    var geoc;

    var data = [
        {
            caseNo: '1117786',
            spNo: '14 SP 156',
            county: 'Johnston, NC',
            saleDate: '10/7/2014',
            propertyAddress: '121 Happy Trails Drive',
            propertyCity: 'Angier',
            propertyState: 'NC',
            propertyZip: '27501',
            deedOfTrust: '2931 / 600',
            bidAmount: ' Bid upset 12/1/2014, increasing bid to $27,595.68',
        },
        {
            caseNo: '1129534',
            spNo: '14 SP 126',
            county: 'Catawba, NC',
            saleDate: '10/14/2014',
            propertyAddress: '4133 Oxford School Road',
            propertyCity: 'Columbia',
            propertyState: 'NC',
            propertyZip: '28609',
            deedOfTrust: '2632 / 557',
            bidAmount: ' Bid upset 12/5/2014, increasing bid to $44,669.87',
        },
        {
            caseNo: '1139252',
            spNo: '14 SP 597',
            county: 'New Hanover, NC',
            saleDate: '10/18/2014',
            propertyAddress: '717 Devon Court',
            propertyCity: 'Willmington',
            propertyState: 'NC',
            propertyZip: '28403',
            deedOfTrust: '3781 / 352',
            bidAmount: ' Bid upset 12/3/2014, increasing bid to $125,585.64',
        }

    ];

    var columns = [
        'Case No.',
        'SP#',
        'County',
        'Sale Date',
        'Property Address',
        'Property CSZ',
        'Deed of Trust Book/Page',
        'Bid Amount'
    ];




    var createHeaders = function (cols) {
        $('#myTable > thead').append('<tr>');
        var tr = $('#myTable > thead > tr');

        $.each(cols, function (i, val) {
            tr.append($('<th>').text(val));
        });
    }

    var addRows = function (rowData) {
        $.each(rowData, function (i, val) {
            $('#myTable > tbody')
                .append($('<tr>')
                    .append($('<td>').text(val.caseNo))
                    .append($('<td>').text(val.spNo))
                    .append($('<td>').text(val.county))
                    .append($('<td>').text(val.saleDate))
                    .append($('<td>').text(val.propertyAddress))
                    .append($('<td>').text(val.propertyCity + ', ' + val.propertyState + ' ' + val.propertyZip))
                    .append($('<td>').text(val.deedOfTrust))
                    .append($('<td>').text(val.bidAmount))
                    .data(val) // associate the data value with the row
                    );

        });
    }

    var tableRowClicked = function (tableRow) {
        // todo: show a nice popup that displays the data
        console.log('row clicked ' + $(tableRow).data().caseNo);
    }

    // initialize view controls
    var initializeViewControls = function () {
        $('#gridView').show();
        $('#mapView').hide();
        $('#viewGrid').click(setViewOption);
        $('#viewMap').click(setViewOption);
    }

    // Handle clicks on view radio buttons
    var setViewOption = function () {
        if (this.value == 'viewMap') {
            $('#gridView').hide();
            $('#mapView').show();
            if (geoc == null) {
                initializeMap();
            }
        }
        else if (this.value == 'viewGrid') {
            $('#mapView').hide();
            $('#gridView').show();
        }
    }

    // configure the table
    var configureTable = function () {

        // click handlers for table rows
        $('#myTable > tbody > tr').click(function () {
            tableRowClicked(this);
        });

        // apply sorting behavior using tablesorter plugin
        $('#myTable').tablesorter();
    }

    // initialize the map
    var initializeMap = function () {

        geoc = new google.maps.Geocoder();

        // pick a place to center the map on
        var req = { address: '400 Poole Rd, Raeford NC' };
        geoc.geocode(req, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {

                // if the geocode succeeds for the center point
                // then create the map object
                var mapProp = {
                    center: results[0].geometry.location,
                    zoom: 7,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map($('#map')[0], mapProp);

                // for each address in the data set geocode the address
                // and place it on the map
                $.each(data, function (i, val) {

                    geoc.geocode({ address: val.propertyAddress + ", " + val.propertyCity + " " + val.propertyState },
                    function (results, status) {

                        // if the geocode of the address succeeds place a marker 
                        // on the map
                        if (status == google.maps.GeocoderStatus.OK) {

                            var calcContent = "<div style='height:90px'>"
                                + val.propertyAddress + "<br>"
                                + val.propertyCity + ", " + val.propertyState + "<br><br>"
                                + val.bidAmount
                                + "</div>"
                            var info = new google.maps.InfoWindow({
                                content: calcContent
                            });

                            var marker = new google.maps.Marker({
                                position: results[0].geometry.location,
                                title: val.propertyAddress
                            });

                            marker.info = info;

                            google.maps.event.addListener(marker, 'click', function () {
                                this.info.open(map, this);
                            });

                            marker.setMap(map);
                        }
                    });
                });
            }
        });
    }


    this.start = function () {
        createHeaders(columns);
        addRows(data);
        configureTable();
        initializeViewControls();
    }
}



$(document).ready(function () {
    var app = new App();
    app.start();
});