const yargs = require("yargs");
const axios = require("axios");

var argv = yargs.options({
    address: {
        describe: "Address of a Location",
        demand: true,
        alias: "a"
    }
}).help().argv;

var encodedAddress = encodeURIComponent(argv.address);
var addressUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyCOAWQqQ_uzvpAMEkeBxTtR1_B3ai8dUaU`;

axios.get(addressUrl).then((response) => {
    if(response.data.status === "ZERO_RESULTS") {
        throw new Error("Invalid Address");
    }
    console.log(`Address : ${response.data.results[0].formatted_address}`);

    var lat = response.data.results[0].geometry.location.lat;
    var lng = response.data.results[0].geometry.location.lng;
    var weatherUrl = `https://api.darksky.net/forecast/75531d68a3592972fa1159eeb1f33827/${lat},${lng}`;

    return axios.get(weatherUrl);
}).then((response) =>{
    var temp = Math.round((response.data.currently.temperature - 32)*(5/9));
    console.log(`Temperature : ${temp}°C`)
}).catch((e) => {
    if(e.code === "ENOTFOUND") {
        console.log("Unable to Connect to API Servers");
    }
    else {
        console.log(e.message); // e.message = "Invalid Address" from line 17
    }
});
