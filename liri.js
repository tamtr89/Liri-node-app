// dotenv package
require("dotenv").config();

// Declare variable
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var fs = require("fs"); //The fs package to handle read/write.
var axios = require("axios"); //Grab data from the OMDB API and the Bands In Town API
var moment = require('moment');


// Take 2 arguments
var liriCmd = process.argv[2];
var input = process.argv[3];

// The switch-case will direct which function gets run.
function liriApps(liriCmd, input) {
    switch (liriCmd) {
        case "concert-this":
            getConcert(input);
            break;

        case "spotify-this-song":
            getSong(input);
            break;

        case "movie-this":
            getMovie(input);
            break;

        case "do-what-it-says":
            getRandom();
            break;
        // If nothing entered, run default message to user
        default:
            console.log("Please enter one of the following commands: 'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says'");
    }
}
// ------------------------------------------------------------------------------------------------------------------------------------

// FUNCTION FOR CONCERT-THIS
function getConcert(artist) {
    var artist = input;
    var queryUrlBand = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    console.log(queryUrlBand);

    axios.get(queryUrlBand).then(
        function (response) {
            // console.log(response.data);
            console.log("Name of the venue: " + response.data[0].venue.name + "\r\n");
            console.log("Venue Location: " + response.data[0].venue.city + "\r\n");
            console.log("Date of event: " + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\r\n");
        }
    )
}

// FUNCTION SPOTIFY-THIS-SONG
function getSong(songName) {
    var spotify = new Spotify(keys.spotify);

    // If no song is provided then your program will default to "The Sign" by Ace of Base.
    if (!songName) {
        songName = "The Sign";
    };
    console.log(songName);

    // Search for song name:
    spotify.search({ type: 'track', query: songName }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // Artist(s)
        console.log("Artist Name: " + data.tracks.items[0].album.artists[0].name);

        // The song's name
        console.log("Song Name: " + data.tracks.items[0].name);

        // A preview link of the song from Spotify
        console.log("Preview Link: " + data.tracks.items[0].href);

        // The album that the song is from
        console.log("Album Name: " + data.tracks.items[0].album.name);

        // Append text into log.txt file
        var logSong = "Artist: " + data.tracks.items[0].album.artists[0].name + "\nSong Name: " + data.tracks.items[0].name + "\n Preview Link: " + data.tracks.items[0].href + "\nAlbum Name: " + data.tracks.items[0].album.name + "\n";

        fs.appendFile("log.txt", logSong, function (err) {
            if (err) throw err;
        });

        logResults(data)
    });
};

// FUNCTION FOR MOVIE-THIS
function getMovie(movieName) {
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if (!movieName) {
        movieName = "mr nobody";
    }
    // Run a request with axios
    // var movieName = process.argv[2]; //test in Node before I run function
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    console.log(queryUrl); //help debugging

    axios.get(queryUrl).then(
        function (response) {
            // console.log(response.data);

            console.log("Title: " + response.data.Title + "\r\n");
            console.log("Year: " + response.data.Year + "\r\n");
            console.log("IMDB Rating: " + response.data.imdbRating + "\r\n");
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value + "\r\n");
            console.log("Country: " + response.data.Country + "\r\n");
            console.log("Language: " + response.data.Language + "\r\n");
            console.log("Movie Plot: " + response.data.Plot + "\r\n");
            console.log("Movie Actors: " + response.data.Actors + "\r\n");
            "===================END================" + "\r\n";
        }
        )
        logResults(response);
}


// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// FUNCTION RANDOM
function getRandom() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);

        } else {
            console.log(data);

            var randomData = data.split(",");
            liriApps(randomData[0], randomData[1]);
        }
        console.log("testing" + randomData[0] + randomData[1]);

    });
};

// FUNCTION to log results from the other funtions
function logResults(data){
    fs.appendFile("log.txt", data, function(err) {
        if (err) throw err;
    });
};

liriApps(liriCmd,input);