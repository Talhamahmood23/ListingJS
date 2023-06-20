

var loadedStores = [];
var searchLoadedStores = [];
var storeNamesFileName = "./Data_Related_Files/StoreNames.txt";
var startOffset = 0;
var endingOffset = 10;

function OpenDetailsPage(_index)
{
    console.log("trying to open second page!");
    LoadSecondPage(_index);
}

function urlExists(url, callback) {
    fetch(url, { method: 'head' })
    .then(function(status) {
      callback(status.ok)
      });
  }
  

function GetStoreInformationFromDatabase()
{
    var storeInformationUrl = 'https://thaiweeds.info/api/getStoreDetails.php';
    fetch(storeInformationUrl).then(function(response) 
    {
        document.getElementById("_secondPage").className = 'hiddenElements';
        return response.json();
    })
    .then(function(data) 
    {
        var jsonData = JSON.parse(JSON.stringify(data));
        // var parentDiv = document.getElementById("_ListContainer");
        
        for (let x=0; x<jsonData.length; x++)
        {
            loadedStores.push(jsonData[x]);
        }
        
        LoadStoresInDiv();

        document.getElementById('_searchBar').onkeyup = function(){ FilterSearchResults() };
        document.getElementById('_citySelector').onchange = function(){ SearchByCityFilter() };
        
        // document.body.on('touchmove', LoadStoresInDiv);
        document.getElementById("_ListContainer").addEventListener("touchmove", LoadStoresInDiv);
        document.getElementById("_ListContainer").addEventListener("wheel", LoadStoresInDiv);
        
        
    })
    .catch(function(err) 
    {
        console.log('Fetch Error :-S', err);
    });
}

function GetStoreInformationFromDatabaseForSearch()
{
    var storeInformationUrlForSearch = 'https://thaiweeds.info/api/getStoreDetails.php';
    fetch(storeInformationUrlForSearch).then(function(response) 
    {
        document.getElementById("_secondPage").className = 'hiddenElements';
        return response.json();
    })
    .then(function(data) 
    {
        var jsonData = JSON.parse(JSON.stringify(data));
        // var parentDiv = document.getElementById("_ListContainer");
        
        for (let x=0; x<jsonData.length; x++)
        {
            searchLoadedStores.push(jsonData[x]);
            console.log(searchLoadedStores.length);
            // console.log(searchLoadedStores[x].children[1].children[2].innerHTML);
        }
        
    })
    .catch(function(err) 
    {
        console.log('Fetch Error :-S', err);
    });
}









async function LoadStoresInDiv()
{
    if (endingOffset >= loadedStores.length)
    {
        console.log("Reached end!");
        return;
    }
    
    var limitReached = false;
    var parentDiv = document.getElementById("_ListContainer");

    for (let x=startOffset; x < endingOffset; x++)
    {
        if (x < loadedStores.length)
        {
            // Main list item container
            PlaceSingleShopMarker(x);
            var listItemContainerDiv = document.createElement('div');
            listItemContainerDiv.id = 'listItem_' + x;
            listItemContainerDiv.className = 'listItemContainer row';
            listItemContainerDiv.onclick = function() { OpenDetailsPage(x); };
    
            // Image div
            var imageContainerDiv = document.createElement('div');
            imageContainerDiv.id = '_storeImageContainer';
            imageContainerDiv.className = 'listItemStoreImageContainer';
            var _image = document.createElement('img');
            var _constructedUrl = "https://thaiweeds.info/" + loadedStores[x].sId + "/main_cover.jpg";
            loadImg(_image, _constructedUrl);
    
            _image.className = 'listItemStoreImage';
            imageContainerDiv.appendChild(_image);
    
            // left side item container
            var LeftsideItemContainer = document.createElement('div');
            // LeftsideItemContainer.id = 'listItem_' + x;
            LeftsideItemContainer.className = ' col-3';
            LeftsideItemContainer.appendChild(imageContainerDiv);
            
            // Name div
            var storeNameDiv = document.createElement('div');
            storeNameDiv.id = '_storeNameContainer';
            storeNameDiv.className = 'storeNameContainer';
            var storeName = document.createElement('a');
            storeName.id = '_storeName';
            storeName.className = 'storeName';
            storeName.innerHTML = loadedStores[x].sName;
            storeNameDiv.appendChild(storeName);
    
            // Store Rating div
            var storeRatingDiv = document.createElement('div');
            storeRatingDiv.id = '_storeRatingContainer';
            storeRatingDiv.className = 'storeRatingContainer';
            var storeRating = document.createElement('p');
            storeRating.className = 'storeRatingText';
            storeRating.innerHTML =  "⭐️" + loadedStores[x].sOverallRatings + " (" + loadedStores[x].sTotalUserRatings + " ratings)";
            // storeRating.innerHTML = jsonData[x].sOverallRatings + " (" + jsonData[x].sTotalUserRatings + " ratings)";
            storeRatingDiv.appendChild(storeRating);
            
            
            
            // VerifiedSeller div
            var verifiedSellerDiv = null;
            var vS = loadedStores[x].sVerified;
            // console.log(`Vs value: ${vS}`);
            var verifiedSeller = null;
            if(vS.includes("Verified"))
            {
                // console.log('string was not empty');
                verifiedSellerDiv = document.createElement('p');
                verifiedSellerDiv.id = '_verifiedSellerContainer';
                storeRatingDiv.className = 'verifiedSellerContainer';
                verifiedSeller = document.createElement('p');
                verifiedSeller.className = 'verifiedSellerText';
                verifiedSeller.innerHTML = "✔️" + vS;
                verifiedSellerDiv.appendChild(verifiedSeller);
            }
            
            
             // QualifiedSeller div
            var qualifiedSellerDiv = null;
            var qS = loadedStores[x].sQualified;
            // console.log(`qs value: ${qS}`);
            var qualifiedSeller = null;
            if(qS.includes("Not"))
            {
                // console.log('string was not empty');
                qualifiedSellerDiv = document.createElement('p');
                qualifiedSellerDiv.id = '_qualifiedSellerContainer';
                storeRatingDiv.className = 'qualifiedSellerContainer';
                qualifiedSeller = document.createElement('p');
                qualifiedSeller.className = 'qualifiedSellerText';
                qualifiedSeller.innerHTML = "✖️" + qS;
                qualifiedSellerDiv.appendChild(qualifiedSeller);
            }
            
            
            // City name div
            var sC = loadedStores[x].sCity;
            var cityNameDiv = document.createElement('div');
            cityNameDiv.id = '_storeCityNameContainer';
            cityNameDiv.className = 'storeCityContainer';
            var cityName = document.createElement('a');
            cityName.className = 'storeCityText';
            splittedCityName = loadedStores[x].sAddress.split(" ");
            cityName.text = splittedCityName[splittedCityName.length - 3];
            if(cityName.text == "undefined")
            {
                cityName.text = sC;
                cityNameDiv.appendChild(cityName);
            }
            else
            {
            cityNameDiv.appendChild(cityName);
            }
            
            
            
            // Store Type div
            var storeTypeDiv = document.createElement('div');
            storeTypeDiv.id = '_storeTypeContainer';
            storeTypeDiv.className = 'storeTypeContainer';
            var storeType = document.createElement('p');
            storeType.className = 'storeTypeText';
            var splittedStoreTypes = loadedStores[x].sType.split(",");
            for (let z=0; z<splittedStoreTypes.length; z++)
            {
                if (splittedStoreTypes[z].includes("[\""))
                {
                    splittedStoreTypes[z] = splittedStoreTypes[z].replace("[\"", "");
                }
                
                 if (splittedStoreTypes[z].includes("\""))
                {
                    splittedStoreTypes[z] = splittedStoreTypes[z].replace("[\"", "");
                }
                
                if (splittedStoreTypes[z].includes("\"]"))
                {
                    splittedStoreTypes[z] = splittedStoreTypes[z].replace("\"]", "");
                }
                
                if (splittedStoreTypes[z].includes("\""))
                {
                    splittedStoreTypes[z] = splittedStoreTypes[z].replace("\"", "");
                }
            }
            
            if (splittedStoreTypes.length > 0)
                storeType.innerHTML = splittedStoreTypes[0];
            else
                storeType.innerHTML = "store";
                
            storeTypeDiv.appendChild(storeType);
    
            // Right side item container
            var RightsideItemContainer = document.createElement('div');
            // RightsideItemContainer.id = 'listItem_' + x;
            RightsideItemContainer.className = ' col-9';
            RightsideItemContainer.appendChild(storeNameDiv);
            RightsideItemContainer.appendChild(storeRatingDiv);
            //for verified Seller
            if(verifiedSeller)
            {
              RightsideItemContainer.appendChild(verifiedSeller);
            }
            // For Non-Qualified Seller
            if(qualifiedSeller)
            {
              RightsideItemContainer.appendChild(qualifiedSeller);
            }
            RightsideItemContainer.appendChild(cityNameDiv);
            RightsideItemContainer.appendChild(storeTypeDiv);
    
            listItemContainerDiv.appendChild(LeftsideItemContainer);
            listItemContainerDiv.appendChild(RightsideItemContainer);
    
            parentDiv.appendChild(listItemContainerDiv);
            listItemContainerDiv.display = "none";
            // PlaceShopMarkers(x, x+1);
        }
        else
        {
            limitReached = true;
            break;
        }
    }
    
    if (!limitReached)
    {
        // setTimeout(function(){ PlaceShopMarkers(startOffset, endingOffset) }, 1500);
        // PlaceShopMarkers(startOffset, endingOffset);
        startOffset = endingOffset;
        endingOffset += 1;
    }
}


const loadImg = function(img, url) {
    return new Promise((resolve, reject) => {
      img.src = url;    
      img.onload = () => 
      {
          resolve(img);
      }
      
      img.onerror = () => 
      {
          img.src = "./I_mages/tempLoadingImage.gif";
        //   reject(img);
      }
    });
}


function FilterSearchResults() 
{
    var input, filter
    input = document.getElementById('_searchBar');
    filter = input.value;
    filter = String(filter);
    
    for (let i = 0; i < loadedStores.length; i++) 
    {
        var listElement = document.getElementById("listItem_"+i);
        var placeName = String(listElement.children[1].children[0].innerHTML);
        
        if (placeName.toLowerCase().includes(filter.toLowerCase())) 
        {
            listElement.style.display = "";
        } 
        else 
        {
            listElement.style.display = "none";
        }
    }
}

function SearchByCityFilter()
{
    let selectedCity = document.getElementById("_citySelector").value;
    selectedCity = String(selectedCity);

    if (selectedCity.toLowerCase() == "aot")
    {
        for (let i = 0; i < loadedStores.length; i++) 
        {
            var listElement = document.getElementById("listItem_"+i);
            listElement.style.display = "";
        }

        return;
    }

    for (let i = 0; i < loadedStores.length; i++) 
    {
        var listElement = document.getElementById("listItem_"+i);
        var cityName = loadedStores[i].sCity;
        var cityChildName = String(listElement.children[1].children[2].innerHTML);
        
        
        if (cityName.toLowerCase().includes(selectedCity.toLowerCase()) || cityChildName.toLowerCase().includes(selectedCity.toLowerCase()))
        {
            listElement.style.display = "";
        }
        
        
        
        
        // if (cityChildName.toLowerCase().includes(selectedCity.toLowerCase())) 
        // {
        //     listElement.style.display = "";
        // } 
        
        
        
        else 
        {
            listElement.style.display = "none";
        }
    }
}


GetStoreInformationFromDatabase();
GetStoreInformationFromDatabaseForSearch();
// LoadStoreNamesAndDetails(storeNamesFileName);
