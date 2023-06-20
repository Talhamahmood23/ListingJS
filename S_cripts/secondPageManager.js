var placeDetailsResult;
var currentShopIndex;
var isOnSecondPage;


function LoadSecondPage(shopIndex)
{
    document.getElementById("_firstPage").className = 'hiddenElements';
    document.getElementById("_secondPage").className = 'showElements';
    document.getElementById("secondPageMainContent").className = '_secondPageMainContentBlurred';
    document.getElementById("nonVerifiedSellerPopupParent").className = '_secondPageMainContentHidden';
    // document.getElementById("nonQualifiedSellerPopupParent").className = '_secondPageMainContentHidden';
    
    SetupPageElements(shopIndex);

    // Use this to rest the map marker
    currentShopIndex = shopIndex;

    // Use this to determine if user is on 2nd page
    isOnSecondPage = true;
}

function SetupPageElements(shopIndex)
{
    var isSellerVerified = loadedStores[shopIndex]['sVerified']
    var isSellerQualified = loadedStores[shopIndex]['sQualified']
if (!isSellerVerified.includes("Verified") || isSellerQualified.includes("Not"))
    {
        SeupPopupWindow(loadedStores[shopIndex]['sName']);
    }
    else
    {
        document.getElementById("secondPageMainContent").className = '_secondPageMainContentShown';
        document.getElementById("nonVerifiedSellerPopupParent").className = '_secondPageMainContentHidden';
        // document.getElementById("nonQualifiedSellerPopupParent").className = '_secondPageMainContentHidden';
        
    }
    
    FetchReviewsFromDatabase(shopIndex);
    
    // // Setup link elements
    document.getElementById("mapsLink").onclick = function () { OnClick_MapsIcon(); }
    document.getElementById("phoneLink").onclick = function () { OnClick_PhoneIcon(); }
    document.getElementById("urlLink").onclick = function () { OnClick_WebsiteIcon(); }

    // Update location on maps
    // UpdateMapsLocation(shopIndex);
}

function SeupPopupWindow(storeName)
{
    document.getElementById("secondPageMainContent").className = '_secondPageMainContentBlurred';
    document.getElementById("nonVerifiedSellerPopupParent").className = '_nonVerifiedSellerPopupParent';
    // document.getElementById("nonQualifiedSellerPopupParent").className = '_secondPageMainContentHidden';
    document.getElementById("popupShopName").innerHTML = storeName;
    loadImg(document.getElementById("popupLogo"), "./I_mages/man-gesturing-no.png");
    document.getElementById("nonVerifiedSellerPopupParent").onclick = function () { OnClick_PopupWindow(); }
}

function OnClick_PopupWindow()
{
    OnClick_BackBtn();
//     document.getElementById("secondPageMainContent").className = '_secondPageMainContentShown';
//     document.getElementById("nonVerifiedSellerPopupParent").className = '_secondPageMainContentHidden';
}

async function FetchReviewsFromDatabase(_si)
{
    var _detailsUrl = "https://thaiweeds.info/api/getStoreReviews.php";
    var formData = new FormData();
    formData.append("id", loadedStores[_si]['sId']);

    fetch(_detailsUrl, {
        method: 'POST', 
        // headers: {
        //     'Content-Type': 'text/html; charset=utf-8'
        // }, 
        body: formData}).then(function(response) 
    {
        document.getElementById("_backBtn2ndPage").onclick = function () { OnClick_BackBtn() };
        document.getElementById("_searchBtn2ndPage").onclick = function () { OnClick_BackBtn() };
        document.getElementById("_storeName2").innerText = loadedStores[_si]['sName'];
        document.getElementById("_review2").innerText = loadedStores[_si]['sOverallRatings'] + " (" + loadedStores[_si]['sTotalUserRatings'] + " ratings)";
        splittedCityName = loadedStores[_si]['sAddress'].split(" ");
        document.getElementById("_cityName2").innerText = splittedCityName[splittedCityName.length - 3];

        return response.json();
    })
    .then(function(data) 
    {
        var jsonData = JSON.parse(JSON.stringify(data));
        document.getElementById("_mainImage2").loading = "lazy"; 
        document.getElementById("_childImage1").loading = "lazy"; 
        document.getElementById("_childImage2").loading = "lazy"; 
        document.getElementById("_childImage3").loading = "lazy";
        document.getElementById("_childImage4").loading = "lazy";

        loadImg(document.getElementById("_mainImage2"), "https://thaiweeds.info/" + loadedStores[_si]['sId'] + "/main_cover.jpg");

        // Set photos
        for (let x=1; x<5; x++)
        {
            loadImg(document.getElementById("_childImage" + x), "https://thaiweeds.info/" +  loadedStores[_si]['sId'] + "/place_photos/" + x + ".jpg");
        }
        
        document.getElementById("_RemainingImagesCount").innerHTML = "+";
        
        

        var modal = document.getElementById("myModal");
        
        // Get the image and insert it inside the modal - use its "alt" text as a caption
        
        var img = document.getElementById("_childImageContainer4");
        var modalImg = document.getElementById("img01");
        // var captionText = document.getElementById("caption");
        // img.onclick = function(){
        //   modal.style.display = "block";
        //   modalImg.src = this.src;
        // //   captionText.innerHTML = this.alt;
        // }
        
        // // Get the <span> element that closes the modal
        // var span = document.getElementsByClassName("close")[0];
        
        // // When the user clicks on <span> (x), close the modal
        // span.onclick = function() {
        //   modal.style.display = "none";
        // } 




        var modal = document.getElementById("myModal");
        // var mainModalImage = document.getElementById("_childImage4");
        
        var mainModalImage = document.getElementById("_childImageContainer4");
        
        mainModalImage.onclick = function()
        {
            console.log("Tapped on modal image!");
            modal.style.display = "block";
            plusSlides(1);
        }

        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
        }
    
    
    
    
    
    
        var hoursOfOperationIds = ["hoMonday", "hoTuesday", "hoWednesday", "hoThursday", "hoFriday", "hoSaturday", "hoSunday"]
        var _days = ["Monday:", "Tuesday:", "Wednesday:", "Thursday:", "Friday:", "Saturday:", "Sunday:"];
        // var _days = ["", "", "", "", "", "", ""];
        var mainSpaceSize = [10+5, 10+5, 5+4, 8+5, 13+6, 9+5, 11+6];
        var weekDays = jsonData.weekdays;
        weekDays = JSON.stringify(weekDays);
        weekDays = weekDays.split(",");

        if (weekDays.length == 1)
        {
            for (let x=0; x<hoursOfOperationIds.length; x++)
            {
                var reconstructedString = _days[x];
                
                for (let i=0; i<mainSpaceSize[x]; i++)
                {
                    reconstructedString += '&nbsp';
                }
                
                reconstructedString += "Closed";

                document.getElementById(hoursOfOperationIds[x]).innerHTML = reconstructedString;
            }
        }
        else if (weekDays.length > 1)
        {
            for (let x=0; x<hoursOfOperationIds.length; x++)
            {
                
                    weekDays[x] = weekDays[x].replace('Monday:', "");
                    weekDays[x] = weekDays[x].replace('Tuesday:', "");
                    weekDays[x] = weekDays[x].replace('Wednesday:', "");
                    weekDays[x] = weekDays[x].replace('Thursday:', "");
                    weekDays[x] = weekDays[x].replace('Friday:', "");
                    weekDays[x] = weekDays[x].replace('Saturday:', "");
                    weekDays[x] = weekDays[x].replace('Sunday:', "");
                    
                
                    
                    weekDays[x] = weekDays[x].replace("[\"", "");
                    weekDays[x] = weekDays[x].replace("\"", "");
                    weekDays[x] = weekDays[x].replace("\"]", "");
                    weekDays[x] = weekDays[x].replace("\\", "");
                    weekDays[x] = weekDays[x].replace("\\\"", "");
                    weekDays[x] = weekDays[x].replace('-', ':');
                    weekDays[x] = weekDays[x].replace('PM\"', 'PM');
                    weekDays[x] = weekDays[x].replace('AM\"', 'AM');
                    weekDays[x] = weekDays[x].replace(/[^\x00-\x7F]/g, "");
                
                var splittedResult = weekDays[x].split(" ");
                
                var reconstructedString = _days[x];
                
                for (let i=0; i<mainSpaceSize[x]; i++)
                {
                    reconstructedString += '&nbsp';
                }
    
                var _constructionCount = 0;
                for (let i=0; i<splittedResult.length; i++)
                {
                    if (!splittedResult[i])
                    {
                    }
                    else
                    {
                        if (_constructionCount == 2)
                        {
                            reconstructedString += " - "
                        }
                        reconstructedString += splittedResult[i] + " ";
                        _constructionCount++;
                    }
                }
    
                document.getElementById(hoursOfOperationIds[x]).innerHTML = reconstructedString;
            }
        }
        
        const dt = new Date(Date.now());
        switch(dt.getDay())
        {
            case 0:
                document.getElementById("hoSunday").className = "openingHoursTextStyleClose";
                break;

            case 1:
                document.getElementById("hoMonday").className = "openingHoursTextStyleClose";
                break;

            case 2:
                document.getElementById("hoTuesday").className = "openingHoursTextStyleClose";
                break;

            case 3:
                document.getElementById("hoWednesday").className = "openingHoursTextStyleClose";
                break;

            case 4:
                document.getElementById("hoThursday").className = "openingHoursTextStyleClose";
                break;

            case 5:
                document.getElementById("hoFriday").className = "openingHoursTextStyleClose";
                break;

            case 6:
                document.getElementById("hoSaturday").className = "openingHoursTextStyleClose";
                break;
        }

        var userReviewsParentDivContainer = document.getElementById("_userReviewsContainer");
        
        var aNames = jsonData.authors;
        var aPictures = jsonData.photos;
        var aRatings = jsonData.ratings;
        var aReviews = jsonData.reviews;
        
        // console.log(aNames);

        for (let x=0; x<aNames.length; x++)
        {
            var userReviewItemContainer = document.createElement("div");
            userReviewItemContainer.id = "_userReviewListItem" + x;
            userReviewItemContainer.className = "userReviewListItemContainer";
    
            var userReviewItemSectionOne = document.createElement("div");
            userReviewItemSectionOne.className = "userReviewListItemSectionOne";
    
            var userImageObject = document.createElement("img");
            // userImageObject.src = placeDetailsResult.reviews[x].profile_photo_url;
            userImageObject.id = "_userReviewImage"+x;
            userImageObject.className = "userReviewImage";
            loadImg(userImageObject, aPictures[x]);
    
            var userNameObject = document.createElement("p");
            userNameObject.id = "_reviewerName";
            userNameObject.className = "reviewerName";
            userNameObject.innerHTML = aNames[x];
    
            var userReviewAndTimeObject = document.createElement("p");
            userReviewAndTimeObject.id = "_userReviewAndTime";
            userReviewAndTimeObject.className = "userReviewAndTime";
            userReviewAndTimeObject.innerHTML = "<div class='star-rating'>" + aRatings[x] + "</div>"; /* "</br>" + placeDetailsResult.reviews[x].relative_time_description; */
    
            var userReviewObject = document.createElement("p");
            userReviewObject.id = "_userReview";
            userReviewObject.className = "userReview";
            userReviewObject.innerHTML = aReviews[x];
    
    
            userReviewItemSectionOne.appendChild(userImageObject);
            userReviewItemSectionOne.appendChild(userNameObject);
            userReviewItemSectionOne.appendChild(userReviewAndTimeObject);
    
            userReviewItemContainer.appendChild(userReviewItemSectionOne);
            userReviewItemContainer.appendChild(userReviewObject);
    
            userReviewsParentDivContainer.appendChild(userReviewItemContainer);
        }
    })
    .catch(function(err) 
    {
        console.log('Fetch Error :-S', err);
    })
}

function OnClick_PhoneIcon()
{
    document.getElementById("phoneLink").href = 'tel:'+ loadedStores[currentShopIndex]['sPhoneNumber'];
}

function OnClick_MapsIcon()
{
    document.getElementById("mapsLink").href = loadedStores[currentShopIndex]['sMaps'];
}

function OnClick_WebsiteIcon()
{
    document.getElementById("urlLink").href = loadedStores[currentShopIndex]['sWebsite'];
}

/*async function FetchPlaceDetails(placeId)
{
    var request = 
    {
        placeId: placeId
    };
    service = new google.maps.places.PlacesService(map);
    service.getDetails(request, PlaceDetailsCallback);
}*/

function OnModalImageClickCallback(imageSource, _modal, _modalImg)
{
    _modal.style.display = "block";
    _modalImg.src = imageSource;
}

var slideIndex = 4;

// Close the Modal
function closeModal() 
{
    document.getElementById("myModal").style.display = "none";
}

// Next/previous controls
function plusSlides(n) 
{
    slideIndex += n;

    if (slideIndex < 0)
    {
        slideIndex = 0;
        return;
    }

    console.log(slideIndex);
    if (slideIndex < 10)
        showSlides(slideIndex);
    else
        slideIndex -= 1;
}

function showSlides() 
{
    var slides = document.getElementsByClassName("mySlides");
    loadImg(slides[0].childNodes[1], "https://thaiweeds.info/" + loadedStores[currentShopIndex]['sId'] + "/place_photos/" + slideIndex + ".jpg");
    slides[0].style.display = "block";
    
}

function OnClick_BackBtn()
{
    isOnSecondPage = false;
    SetHighlightedMarkerBackToDefault();
    DestroyReviewSection();
    document.getElementById("_firstPage").className = 'showElements';
    document.getElementById("_secondPage").className = 'hiddenElements';
    document.getElementById("_mainImage2").src = './Images/tempLoadingImage.gif'; 
    document.getElementById("_childImage1").src = './Images/tempLoadingImage.gif'; 
    document.getElementById("_childImage2").src = './Images/tempLoadingImage.gif'; 
    document.getElementById("_childImage3").src = './Images/tempLoadingImage.gif'; 
    document.getElementById("_childImage4").src = './Images/tempLoadingImage.gif';
}

function DestroyReviewSection()
{
    let childDivs = document.querySelectorAll("#_userReviewsContainer > div");
    for(var i = 0; i < childDivs.length; i++){
        childDivs[i].remove();
      }
}

function SetHighlightedMarkerBackToDefault()
{
    if (currentShopIndex == null)
        return;

    var _x = currentShopIndex;
    var parsedLocation = JSON.parse(loadedStores[_x].sLocation);
    var _lat = parsedLocation.lat;
    var _lng = parsedLocation.lng;
    
    mapLoc = {lat: _lat, lng: _lng};
    map.setCenter({
        lat : _lat,
        lng : _lng
    });

    map.setZoom(12);
    
    markers[_x].setMap(null);
    markers[_x] = null;

    markers[_x] = new google.maps.Marker({
        position: mapLoc,
        map: map,
        animation: google.maps.Animation.DROP,
        });

    markers[_x].addListener("click", () => {
        map.setZoom(15);
        map.setCenter(markers[_x].getPosition());
        GetMarkerDetails(_x);
        });


    // Show hover box
    var infoWindow = new google.maps.InfoWindow({
        disableAutoPan: false,
        pixelOffset: new google.maps.Size(0, -40),
        zIndex: null,
        boxStyle: {
                    background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                    width: "150px" },
        closeBoxURL: "",
    });
    
    markers[_x].addListener('mouseover', function() 
    {
        ShowHoverBox(_x, infoWindow);
    });

    // Destroy hoverbox
    markers[_x].addListener('mouseout', function() 
    {
        DestoryHoverBox(infoWindow);
    });

    currentShopIndex = null;
}

function UpdateMapsLocation(shopIndex)
{
    var parsedLocation = JSON.parse(loadedStores[shopIndex].sLocation);
    var _lat = parsedLocation.lat;
    var _lng = parsedLocation.lng;

    mapLoc = {lat: _lat, lng: _lng};
    map.setCenter({
        lat : _lat,
        lng : _lng
    });

    map.setZoom(16);

    // Remove the current marker
    markers[shopIndex].setMap(null);
    markers[shopIndex] = null;
    
    markers[shopIndex] = new google.maps.Marker({
        position: mapLoc,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

    markers[shopIndex].addListener("click", () => {
        map.setZoom(15);
        map.setCenter(markers[shopIndex].getPosition());
        GetMarkerDetails(shopIndex);
        });


    // Show hover box
    var infoWindow = new google.maps.InfoWindow({
        disableAutoPan: false,
        pixelOffset: new google.maps.Size(0, -40),
        zIndex: null,
        boxStyle: {
                    background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
                    width: "150px" },
        closeBoxURL: "",
    });
    
    markers[shopIndex].addListener('mouseover', function() 
    {
        ShowHoverBox(shopIndex, infoWindow);
    });

    // Destroy hoverbox
    markers[shopIndex].addListener('mouseout', function() 
    {
        DestoryHoverBox(infoWindow);
    });
}