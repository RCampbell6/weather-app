$(document).ready(function () {

    function getWeather(url) {
        $.getJSON(url, function (weather) {

            //Unsuccessful API result
            if (weather.query.results == null) {
                $("#content").animate({
                    opacity: 0
                }, 800, function () {
                    $("#icon").css("background-image", 'url("http://image.flaticon.com/icons/svg/178/178354.svg")');
                    $("#temp-window").css("display", "none");
                    $("#info").css("opacity", "0");
                    $("#text").html("City not recognised. Please try again.");
                    $("#content").animate({
                        opacity: 1
                    }, 800);
                });
                return;
            }

            //Successful API result
            $("#content").animate({
                opacity: 0
            }, 800, function () {
                var weatherPath = weather.query.results.channel;
                var country = weatherPath.location.country;
                if (country == "United States" || country == "The Bahamas" || country == "Belize" || country == "Cayman Islands" || country == "Palau" || country == "Puerto Rico" || country == "Guam" || country == "US Virgin Islands") {
                    $("#unit-btn").html("&degC");
                    $("#temp").html(cToF(weatherPath.item.condition.temp) + "&degF");
                } else {
                    $("#unit-btn").html("&degF");
                    $("#temp").html(weatherPath.item.condition.temp + "&degC");
                }
                $("#info").css("opacity", "1");
                $("#temp-window").css("border-color", "#f7cf52");
                document.forms["city-search-form"].reset();

                //Get icon for weather. Temp-window movements to fit icon. Set descriptor text.
                var pathEnd = "";
                var description = "";
                var weatherID = weatherPath.item.condition.code;
                var weatherDesc = weatherPath.item.condition.text.toLowerCase();
                var weatherType;
                var daytime = true;
                //var currentTime = Date.now() / 1000;
                var currentTime = timeToSeconds(weatherPath.lastBuildDate.substring(17, 25));
                var sunrise = timeToSeconds(weatherPath.astronomy.sunrise);
                var sunset = timeToSeconds(weatherPath.astronomy.sunset);
                if (currentTime < sunrise || currentTime > sunset) {
                    daytime = false;
                }

                //Change background, colours based on day/night
                if (daytime) {
                    $("#temp-window").css(
                        "background", "#99b6d2");
                    $("#night").animate({
                        opacity: 0
                    }, 800);
                } else {
                    $("#temp-window").css(
                        "background", "#38374d");
                    $("#night").animate({
                        opacity: 1
                    }, 800);
                }

                //Thunderstorms
                if (weatherID == 3 || weatherID == 4 || (weatherID > 36 && weatherID < 39) || weatherID == 45 || weatherID == 47) {
                    pathEnd = "178/178343.svg";
                    $("#temp-window").attr("class", "window-thunderstorm");
                    description = "There are " + weatherDesc + " over ";
                }
                    //Drizzle
                else if (weatherID == 8 || weatherID == 9) {
                    if (daytime) {
                        pathEnd = "178/178344.svg";
                        $("#temp-window").attr("class", "window-drizzle-day");
                    } else {
                        pathEnd = "178/178345.svg";
                        $("#temp-window").attr("class", "window-drizzle-night");
                    }
                    description = "A " + weatherDesc + " falls over ";
                }
                    //Rain
                else if (weatherID == 11 || weatherID == 12 || weatherID == 39 || weatherID == 40) {
                    pathEnd = "178/178340.svg";
                    $("#temp-window").attr("class", "window-rain");
                    description = "There are " + weatherDesc + " over ";
                }
                    //Snow
                else if ((weatherID > 4 && weatherID < 8) || weatherID == 10 || (weatherID > 12 && weatherID < 17) || weatherID == 18 || (weatherID > 40 && weatherID < 44) || weatherID == 46) {
                    weatherType = "snow";
                    pathEnd = "178/178330.svg";
                    $("#temp-window").attr("class", "window-snow");
                    var desc = weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);
                    description = " lies under " + desc + ".";
                }
                    //Atmosphere - Dust, fog, smoke etc.
                else if (weatherID > 18 && weatherID < 24) {
                    pathEnd = "182/182264.svg";
                    $("#temp-window").attr("class", "window-atmosphere");
                    if (weatherID == 19) {
                        weatherDesc = "dusty";
                    } else if (weatherID == 21) {
                        weatherDesc = "hazy";
                    }
                    description = "The air is " + weatherDesc + " over ";
                }
                    //Clear
                else if (weatherID > 30 && weatherID < 35) {
                    if (daytime) {
                        pathEnd = "178/178325.svg";
                    } else {
                        pathEnd = "178/178353.svg";
                    }
                    $("#temp-window").attr("class", "window-clear");
                    description = "The skies are clear above ";
                }
                    //Cloudy
                else if (weatherID == 29 || weatherID == 30 || weatherID == 44) {
                    if (daytime) {
                        pathEnd = "178/178342.svg";
                        $("#temp-window").attr("class", "window-cloudy-day");
                    } else {
                        pathEnd = "178/178339.svg";
                        $("#temp-window").attr("class", "window-cloudy-night");
                    }
                    description = "There are a few clouds over ";
                }
                    //Cloudier
                else if (weatherID == 27 || weatherID == 28) {
                    pathEnd = "178/178338.svg";
                    $("#temp-window").attr("class", "window-cloudier");
                    description = "It is mostly cloudy over ";
                }
                    //Cloudiest
                else if (weatherID == 26) {
                    pathEnd = "178/178346.svg";
                    $("#temp-window").attr("class", "window-cloudiest");
                    description = "It is cloudy above ";
                }
                    //TODO: Icons for various extremes.
                else {
                    pathEnd = "178/178329.svg";
                    if (weatherID == 23) {
                        pathEnd = "178/178328.svg";
                    }
                    $("#temp-window").attr("class", "window-thunderstorm");
                    description = "There are " + weatherDesc + " conditions in ";
                }

                //Apply data and stylings
                var svgURL = 'url("http://image.flaticon.com/icons/svg/' + pathEnd + '")';
                $("#icon").css("background-image", svgURL);
                $("#temp-window").css("display", "inline-block");
                if (weatherType == "snow") {
                    $("#text").html("<span class='text-highlight'><b>" + weatherPath.location.city + ", " + weatherPath.location.country + "</b></span>" + description);
                } else {
                    $("#text").html(description + "<span class='text-highlight'><b>" + weatherPath.location.city + ", " + weatherPath.location.country + "</b></span>");
                }
                $("#pressure").html(Math.round(weatherPath.atmosphere.pressure / 3.37685) / 10 + "hPa");
                $("#humidity").html(weatherPath.atmosphere.humidity + "%");
                $("#wind-speed").html(Math.round(weatherPath.wind.speed * 10) / 10 + "km/h");
                $("#wind-direction").html(weatherPath.wind.direction + "&deg");
                                
                $("#content").delay(200).animate({
                    opacity: 1
                }, 800);
            });
        });
    }

    //Form for manual city search
    $('.city-form').on('submit', function (e) {
        e.preventDefault();
        var searchValue = $(".city");
        if (searchValue.val() != "") {
            var cityURL = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20u%3D'c'%20and%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + encodeURIComponent(searchValue.val().toLowerCase()) + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys"
            getWeather(cityURL)
        } else {
            alert('Address cannot be blank!');
        }
    });

    function location(callback) {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        function success(position) {
            var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20u%3D'c'%20and%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(" + position.coords.latitude + "%2C" + position.coords.longitude + ")%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback="
            callback(url);
        };
        function error() {
            alert("Unable to retrieve your location");
        };
        var options = { enableHighAccuracy: true };
        navigator.geolocation.getCurrentPosition(success, error, options);
    }

    location(function (url) {
        getWeather(url);
    });
});

function cToF(temp) {
    var f = Math.round((temp * 1.8) + 32);
    return (f);
}

function timeToSeconds(time) {
    var array = time.split(' ');
    var hours = array[0].substring(0, array[0].indexOf(':'));
    var minutes = array[0].substring(array[0].indexOf(':') + 1, array[0].length);
    var seconds = parseInt(hours) * 3600 + parseInt(minutes) * 60;
    if (array[1].toLowerCase() == "pm") {
        seconds += 43200;
    }
    if (hours == "12") {
        seconds -= 43200;
    }
    return (seconds);
}

//Button to change between C/F
$("#unit-btn").on("click", function () {
    var str = $("#temp").text();
    var degrees = parseInt(str.slice(0, str.length - 2));
    $("#temp").animate({
        opacity: 0
    }, 200, function () {
        if ($("#unit-btn").text()[1] === "F") {
            $("#temp").html(Math.round((degrees * 1.8) + 32) + "&degF");
            $("#unit-btn").html("&degC");
        } else {
            $("#temp").html(Math.round((degrees - 32) / 1.8) + "&degC");
            $("#unit-btn").html("&degF");
        }
        $("#temp").animate({
            opacity: 1
        }, 200);
    });
});
