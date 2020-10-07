$(document).ready(function () {

    var searchInput = document.getElementById("searchInput");

    function showStoredInputs() {

        userSearch = searchInput.value.trim();
        var prevSearches = JSON.parse(localStorage.getItem("pastSearches"));
        $("#historyDisplay").text(prevSearches);
    };


    $("#searchButton").on("click", function(event) {
        event.preventDefault();

        var userSearch = searchInput.value.trim();
       
        localStorage.setItem("pastSearches", JSON.stringify(userSearch));
        futrueForecast();
        showStoredInputs();

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + userSearch + "&appid=4ff6ab9359b7b09fa3cf50ce41a36923";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            var weatherIcon = response.weather[0].icon;
            var date = $("<h2>").text(moment().format('l'));
            var icon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
            var finalTemp = (response.main.temp - 273.15) * 1.80 + 32;

            $("#resultCity").text(response.name);
            $("#resultCity").append(date);
            $("#resultCity").append(icon);
            $("#resultTemp").text(finalTemp.toFixed(2) + "F");
            $("#resultHumidity").text(response.main.humidity + "%");
            $("#resultWindSpeed").text(response.wind.speed + "MPH");

            var lat = response.coord.lat
            var lon = response.coord.lon
            queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=4ff6ab9359b7b09fa3cf50ce41a36923" + "&lat=" + lat + "&lon=" + lon;

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                // console.log(response)
                var uvIndex = response.value;

                if (uvIndex < 2.9) {
                    $("#resultUVIndex").addClass("favorable");
                } else if (uvIndex > 3 && uvIndex < 7.9) {
                    $("#resultUVIndex").addClass("moderate");
                } else {
                    $("#resultUVIndex").addClass("severe");
                };

                $("#resultUVIndex").text(response.value);

            });
        });

        function futrueForecast() {

            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + userSearch + "&appid=4ff6ab9359b7b09fa3cf50ce41a36923";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function(response) {
                // console.log(response)
                var counter = 1
                for (var i = 0; i < response.list.length; i += 8) {

                    var date = (response.list[i].dt_txt);
                    var weatherIcon = response.list[i].weather[0].icon;
                    var finalTemp = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                
                    $("#day" + counter).text(date);
                    $("#day" + counter + "Icon").attr("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                    $("#day" + counter + "Temp").text(finalTemp.toFixed(2) + "F");
                    $("#day" + counter + "Humid").text(response.list[i].main.humidity + "%");
                    counter++;
                };
            });
        };
    });
});

