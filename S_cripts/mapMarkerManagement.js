var customMarkerIcon = './I_mages/mapIcon.svg';
    // size: new google.maps.Size(32, 32),
    // origin: new google.maps.Point(0, 0),
    // anchor: new google.maps.Point(16, 16)

// var customMarkerIcon = {
//     url: 'https://i.weed.in.th/map-icon-large-green.svg',
//     size: new google.maps.Size(32, 32),
//     origin: new google.maps.Point(0, 0),
//     anchor: new google.maps.Point(16, 16)
//   };

function PlaceSingleShopMarker(_index)
{
    bounds = new google.maps.LatLngBounds();
    var parsedLocation = JSON.parse(loadedStores[_index].sLocation);
    var position = new google.maps.LatLng(parsedLocation.lat, parsedLocation.lng);
    markers.push(
        new google.maps.Marker({
            position: position,
            map: map,
            icon: customMarkerIcon
        })
    );

    bounds.extend(position);

    markers[_index].addListener("click", () => {
        map.setZoom(15);
        map.setCenter(markers[_index].getPosition());
        GetMarkerDetails(_index);
    });


    // Show hover box
    var infoWindow = new google.maps.InfoWindow({
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(0, -40),
        zIndex: null,
        boxStyle: {
            background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
            width: "150px"
        },
        closeBoxURL: "",
    });

    markers[_index].addListener('mouseover', function () {
        ShowHoverBox(_index, infoWindow);
    });

    // Destroy hoverbox
    markers[_index].addListener('mouseout', function () {
        DestoryHoverBox(infoWindow);
    });
}
  
function PlaceShopMarkers(_startOffset, _endingOffset) 
{
    bounds = new google.maps.LatLngBounds();
    
    for (let x = _startOffset; x < _endingOffset - 1; x++) 
    {
        if (x < loadedStores.length)
        {
            var parsedLocation = JSON.parse(loadedStores[x].sLocation);
            var position = new google.maps.LatLng(parsedLocation.lat, parsedLocation.lng);
            markers.push(
                new google.maps.Marker({
                    position: position,
                    map: map,
                    icon: customMarkerIcon
                })
            );
    
            bounds.extend(position);
    
            markers[x].addListener("click", () => {
                map.setZoom(15);
                map.setCenter(markers[x].getPosition());
                GetMarkerDetails(x);
            });
    
    
            // Show hover box
            var infoWindow = new google.maps.InfoWindow({
                disableAutoPan: true,
                pixelOffset: new google.maps.Size(0, -40),
                zIndex: null,
                boxStyle: {
                    background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                    width: "150px"
                },
                closeBoxURL: "",
            });
    
            markers[x].addListener('mouseover', function () {
                ShowHoverBox(x, infoWindow);
            });
    
            // Destroy hoverbox
            markers[x].addListener('mouseout', function () {
                DestoryHoverBox(infoWindow);
            });
        }
        // map.fitBounds(bounds);
    }

    console.log("Total markers: " + markers.length);
}

function GetMarkerDetails(_index) {
    DestroyReviewSection();
    SetHighlightedMarkerBackToDefault();
    LoadSecondPage(_index);
}

function ShowHoverBox(_index, _iW) {
    var storeName = loadedStores[_index].sName;
    var rating = loadedStores[_index].sOverallRatings + " (" + loadedStores[_index].sTotalUserRatings + " ratings)";
    // var image = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&maxheight=150&photo_reference=" + loadedStores[_index].photos[0].photo_reference + "&key=AIzaSyC-SXO3gxMlHd8XUGLM-vEPkiD3hdV1ccs";
    var image = "https://thaiweeds.info/" + loadedStores[_index].sId + "/main_cover.jpg";
    const content = '<div  class="listItemContainerMap row">'+
    '<div class=" col-3">' +
        '<div id="_storeImageContainer" class="listItemStoreImageContainerMap">' +
            '<img src="' + image +'" class="listItemStoreImageMap">' +
        '</div>' +
    '</div>'+
    '<div class=" col-9">' +
        '<div id="_storeNameContainer" class="storeNameContainerMap">' +
        '<a id="_storeName" class="storeName">' + storeName + '</a>' +
        '</div>' +
        '<div id="_storeRatingContainer" class="storeRatingContainerMap">' +
           ' <p class="storeRatingText">' + rating + '</p>' +
       '</div>' +
    '</div>' +
'</div>';

    _iW.setContent(content);
    var parsedLocation = JSON.parse(loadedStores[_index].sLocation);
    _iW.setPosition(parsedLocation);
    _iW.open(map);
}

function DestoryHoverBox(_iW) {
    _iW.close();
}