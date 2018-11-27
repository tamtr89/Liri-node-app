// dotenv package
require("dotenv").config();

// Declare variable
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var fs = require("fs"); //The fs package to handle read/write.
var axios = require("axios"); //Grab data from the OMDB API and the Bands In Town API
var moment = require('moment');

const chalk = require('chalk');


// Take 2 arguments
var liriCmd = process.argv[2];
var input = process.argv.slice(3).join(" ");
// console.log("INPUT----------------", input);
// console.log(chalk.cyan.bold.underline("\n--------------------------------------\n"));
console.log('\033c'); // clears out the terminal... usually.
    console.log(chalk.magenta("   __ _      _ "));
    console.log(chalk.magenta("  / /(_)_ __(_)"));
    console.log(chalk.yellow(" / / | | '__| |"));
    console.log(chalk.green("/ /__| | |  | |"));
    console.log(chalk.blue("\\____/_|_|  |_|"));
    console.log(chalk.blue("Welcome to Liri, the world's lamest personal assistant."));
    console.log(chalk.gray("───────────────────────────────────────────"));



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
    // var artist = input;
    var queryUrlBand = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    // console.log(queryUrlBand);

    axios.get(queryUrlBand).then(
        function (response) {
            // console.log(response.data);
            console.log(chalk.black.bgGreen.bold("*****CONCERT INFORMATION*****") + "\n");
            
            console.log(chalk.green("Venue: ") + chalk.red.bold (response.data[0].venue.name) + "\n");
            console.log(chalk.green("Location: ") + response.data[0].venue.city + "\n");
            console.log(chalk.green("Date of event: ") + moment(response.data[0].datetime).format("MM-DD-YYYY") + "\n");
            console.log("\n--------------------------------------\n");
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
    // console.log(songName);

    // Search for song name:
    spotify.search({ type: 'track', query: songName, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log("data for song name: ", data.tracks.items[0]);

        console.log(chalk.bgMagenta.bold("*****SONG INFORMATION*****") + "\n");
        
        // Artist(s)
        console.log(chalk.magentaBright("Artist Name: ") + chalk.yellow.bold (data.tracks.items[0].album.artists[0].name) + "\n");

        // The song's name
        console.log(chalk.magentaBright("Song Name: ") + data.tracks.items[0].name + "\n");

        // A preview link of the song from Spotify
        console.log(chalk.magentaBright("Preview Link: ") + data.tracks.items[0].href + "\n");

        // The album that the song is from
        console.log(chalk.magentaBright("Album Name: ") + data.tracks.items[0].album.name + "\n");
        console.log("\n--------------------------------------\n");

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
    // console.log("MOVIE>>>>>>", movieName)
    // If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    if (!movieName) {
        movieName = "mr nobody";
        console.log(chalk.magentaBright.bgBlue("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/") + "\n");
	 	console.log(chalk.magentaBright.bgBlue.bold("It's on Netflix!" + "\r\n"))
    }
    // Run a request with axios
    // var movieName = process.argv[2]; //test in Node before I run function
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    // console.log(queryUrl); //help debugging

    axios.request(queryUrl).then(
        function (response) {
            // console.log(response.data);
            console.log(chalk.yellow.bgMagenta.bold("*****MOVIE INFORMATION*****" + "\n"));
            
            console.log(chalk.cyan.bold("Title: ") + chalk.yellow.bold(response.data.Title)  + "\n");
            console.log(chalk.cyan.bold("Year: ") + response.data.Year + "\n");
            console.log(chalk.cyan.bold("IMDB Rating: ") + response.data.imdbRating + "\n");
            console.log(chalk.cyan.bold("Rotten Tomatoes Rating: ") + response.data.Ratings[1].Value + "\n");
            console.log(chalk.cyan.bold("Country: ") + response.data.Country + "\n");
            console.log(chalk.cyan.bold("Language: ") + response.data.Language + "\n");
            console.log(chalk.cyan.bold("Movie Plot: ") + response.data.Plot + "\n");
            console.log(chalk.cyan.bold("Movie Actors: ") + response.data.Actors + "\n");
            console.log("\n--------------------------------------\n");
            logResults(response);
        }
    )
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
        console.log("\n" + "testing: " + randomData[0] + randomData[1]);
        console.log("\n--------------------------------------\n");

    });
};

// FUNCTION to log results from the other funtions
function logResults(data) {
    fs.appendFile("log.txt", data, function (err) {
        if (err) throw err;
    });
};

liriApps(liriCmd, input);