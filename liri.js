// required node packages and commands

require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

// switch statement performed based on the command input type
// each case will capture the different command input directions (artist, song, movie, random)

var type = process.argv[2];

switch (type) {

    case "concert-this": // show upcoming concerts for artists using Bands in Town; if no results respond accordingly

        var artist = process.argv[3];

        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

        axios.get(queryURL).then(
            function (response) {

                if (response.data.length === 0) {
                    console.log("No upcoming concerts for " + artist);
                }

                else {
                    console.log("Upcoming concerts for " + artist + ":");
                    for (var i = 0; i < response.data.length; i++)
                        console.log(response.data[i].venue.name + " in " + response.data[i].venue.city + ", " + response.data[i].venue.region + " on " + moment(response.data[i].datetime).format("MM-DD-YY"));
                }
            }
        )
        break;

    case "spotify-this-song": // show details for any song using Spotify; if no song provided use "Ace of Base, The Sign"

        var song = process.argv[3];

        if (song) {
            spotify.search({ type: "track", query: song })
                .then(function (response) {
                    for (var i = 0; i < response.tracks.items.length; i++) {
                        console.log("--------------------" + "\nArtist: " + response.tracks.items[i].artists[0].name + "\nSong: " + response.tracks.items[i].name + "\nPreview: " + response.tracks.items[i].preview_url + "\nAlbum: " + response.tracks.items[i].album.name);
                    }
                })
        }

        else {
            spotify.request("https://api.spotify.com/v1/tracks/0hrBpAOgrt8RXigk83LLNE")
                .then(function (response) {
                    console.log("--------------------" + "\nArtist: " + response.artists[0].name + "\nSong: " + response.name + "\nPreview: " + response.preview_url + "\nAlbum: " + response.album.name);
                })
        }

        break;

    case "movie-this": // show details for any movie entered; if no movie provided use "Mr. Nobody"

        var movie = process.argv[3];

        var queryURL = "http://www.omdbapi.com/?t=" + movie + "&plot=full&apikey=trilogy"

        if (movie) {
            axios.get(queryURL).then(
                function (response) {
                    console.log("Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nRated: " + response.data.Rated + "\nIMDB Rating: " + response.data.imdbRating + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors);
                }
            )
        }

        else {
            axios.get("http://www.omdbapi.com/?t=mr+nobody&plot=full&apikey=trilogy").then(
                function (response) {
                    console.log("Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nRated: " + response.data.Rated + "\nIMDB Rating: " + response.data.imdbRating + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors);
                }
            )
        };

        break;

    case "do-what-it-says": // provide details for a song, concert, or movie, pulling from an external file

        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            else {
                var dataArr = data.split(", ");
                var command = dataArr[0];
                var input = dataArr[1];

                if (command === "spotify-this-song") {

                    spotify.search({ type: "track", query: input })
                        .then(function (response) {
                            for (var i = 0; i < response.tracks.items.length; i++) {
                                console.log("--------------------" + "\nArtist: " + response.tracks.items[i].artists[0].name + "\nSong: " + response.tracks.items[i].name + "\nPreview: " + response.tracks.items[i].preview_url + "\nAlbum: " + response.tracks.items[i].album.name);
                            }
                        })
                }

                if (command === "movie-this") {

                    axios.get("http://www.omdbapi.com/?t=" + input + "&plot=full&apikey=trilogy").then(
                        function (response) {
                            console.log("Title: " + response.data.Title + "\nYear: " + response.data.Year + "\nRated: " + response.data.Rated + "\nIMDB Rating: " + response.data.imdbRating + "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\nCountry: " + response.data.Country + "\nLanguage: " + response.data.Language + "\nPlot: " + response.data.Plot + "\nActors: " + response.data.Actors);
                        }
                    )
                }

                if (command === "concert-this") {

                    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
                        function (response) {
                            console.log("Upcoming concerts for " + input + ":");
                            for (var i = 0; i < response.data.length; i++)
                                console.log(response.data[i].venue.name + " in " + response.data[i].venue.city + ", " + response.data[i].venue.region + " on " + moment(response.data[i].datetime).format("MM-DD-YY"));
                        }
                    )
                }
            }
        })
}
