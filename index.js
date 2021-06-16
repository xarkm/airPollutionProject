// ------------------------------------------------------------------------------------------------------
// --------------------------------------------LICENSING-------------------------------------------------
/**
    LONDON AIR QUALITY API LICENSE
    Contains public sector information licensed under the Open Government Licence v2.0.


    LEAFLET API LICENSE
    Copyright (c) 2010-2021, Vladimir Agafonkin
    Copyright (c) 2010-2011, CloudMade
    All rights reserved.

    Redistribution and use in source and binary forms, with or without modification, are
    permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this list of
        conditions and the following disclaimer.

    2. Redistributions in binary form must reproduce the above copyright notice, this list
        of conditions and the following disclaimer in the documentation and/or other materials
        provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
    MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
    COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
    EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
    SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
    HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


    HEATMAP.JS PLUGIN LICENSE
    Copyright (c) 2015 Patrick Wied

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    
    CHARTJS API LICENSE
    Copyright 2021 Chart.js contributors

    Permission is hereby granted, free of charge, to any person obtaining a copy of 
    this software and associated documentation files (the "Software"), to deal in the 
    Software without restriction, including without limitation the rights to use, copy, 
    modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
    and to permit persons to whom the Software is furnished to do so, subject to the 
    following conditions:

    The above copyright notice and this permission notice shall be included in all copies 
    or substantial portions of the Software.
 */


// -------------------------------------------------------------------------------------------------------
// -------------------------------------CLASS AND VARIABLE SETUP------------------------------------------

// Class for cfg instances to be used for heatmap overlay, since all instances will have the same cfg 
// variable values. It has been slightly modified from example code on the heatmap.js website
class CFGClass {
    constructor() {
        this.cfg = {
            "radius": 0.030,
            "maxOpacity": 0.7,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // Heatmap uses the global maximum for colorization
            "useLocalExtrema": false,
            latField: 'lat',
            lngField: 'lng',
            valueField: 'count',
            blur: 0.7,
        };
    }
}

// Class for tile layers for Leaflet maps, since all instances will have the same baselayer variable 
// values. It has been slightly modified from example code on the Leaflet website
class TileLayerClass {
    constructor() {
        this.baseLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 13,
            minZoom: 8,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoieGFya20iLCJhIjoiY2trY3BwNmhrMDQyZTJvcXUxZTZua2g0byJ9.uaUCDMZ4RD3TR5BqaFTZHw'
        });
    }
}

// Short month names to be used to fetch data from the LAQ API
var shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Where the datapoints for a specific date-pollutant pair will be stored, one for each map
var laqData1 = { max: 10, min: 0, data: [] };
var laqData2 = { max: 10, min: 0, data: [] };
var laqData3 = { max: 10, min: 0, data: [] };
var laqData4 = { max: 10, min: 0, data: [] };
var laqData5 = { max: 10, min: 0, data: [] };

// Setup for base layer of each map
var baseLayer1 = (new TileLayerClass()).baseLayer;
var baseLayer2 = (new TileLayerClass()).baseLayer;
var baseLayer3 = (new TileLayerClass()).baseLayer;
var baseLayer4 = (new TileLayerClass()).baseLayer;
var baseLayer5 = (new TileLayerClass()).baseLayer;

// Setup for heatmap layer of each map
var heatmapLayer1 = new HeatmapOverlay((new CFGClass()).cfg);
var heatmapLayer2 = new HeatmapOverlay((new CFGClass()).cfg);
var heatmapLayer3 = new HeatmapOverlay((new CFGClass()).cfg);
var heatmapLayer4 = new HeatmapOverlay((new CFGClass()).cfg);
var heatmapLayer5 = new HeatmapOverlay((new CFGClass()).cfg);

// Sets up whole map to include base and heatmap layers
var map1 = L.map('mapid1', {fullscreenControl: true, center: new L.LatLng(51.5, -0.11), zoom: 9, layers: [baseLayer1, heatmapLayer1]});
var map2 = L.map('mapid2', {fullscreenControl: true, center: new L.LatLng(51.5, -0.11), zoom: 9, layers: [baseLayer2, heatmapLayer2]});
var map3 = L.map('mapid3', {fullscreenControl: true, center: new L.LatLng(51.5, -0.11), zoom: 9, layers: [baseLayer3, heatmapLayer3]});
var map4 = L.map('mapid4', {fullscreenControl: true, center: new L.LatLng(51.5, -0.11), zoom: 9, layers: [baseLayer4, heatmapLayer4]});
var map5 = L.map('mapid5', {fullscreenControl: true, center: new L.LatLng(51.5, -0.11), zoom: 9, layers: [baseLayer5, heatmapLayer5]});

// Sets the min and max dates allowed to be selected by the user. Maximum date is set to current day, 
// but will be updated to date with most recently available data
var maxDate = new Date();
const minDate = new Date("1995-01-01");

// Sets up the initial chart that will display the average and max count for each map. It has been 
// slightly modified from example code on the Chart.js website
var ctxBarChart = document.getElementById("countMapChart");
var barChart = new Chart(ctxBarChart, {
    type: 'bar',
    data: {
        labels: ['None', 'None', 'None', 'None', 'None'],
        datasets: [{
            label: 'Average',
            data: [1, 1, 1, 1, 1],
            backgroundColor: [
                'rgba(0, 0, 205, 0.3)',
                'rgba(0, 0, 205, 0.3)',
                'rgba(0, 0, 205, 0.3)',
                'rgba(0, 0, 205, 0.3)',
                'rgba(0, 0, 205, 0.3)',
            ],
            borderColor: [
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
            ],
            borderWidth: 1
        }, {
            label: 'Max',
            data: [1, 1, 1, 1, 1],
            backgroundColor: [
                'rgba(0, 0, 205, 0.6)',
                'rgba(0, 0, 205, 0.6)',
                'rgba(0, 0, 205, 0.6)',
                'rgba(0, 0, 205, 0.6)',
                'rgba(0, 0, 205, 0.6)',
            ],
            borderColor: [
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
                'rgba(0, 0, 205, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: "Average and Max Count Per Map - Load some data to update the graph"
        }
    }
});
// Sets up the initial line chart that will display the average count per year in a range chosen by the 
// user. It has been slightly modified from example code on the Chart.js website
var ctxLineChart = document.getElementById("annualCountChart");
var lineChart = new Chart(ctxLineChart, {
    type: 'line',
    data: {
        labels: ['None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None'],
        datasets: [{
            label: 'NO2',
            data: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9],
            borderColor: 'rgba(0, 0, 205, 0.3)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
        }, {
            label: 'PM10',
            data: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6, 0.6],
            borderColor: 'rgba(0, 0, 205, 0.6)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
        }, {
            label: 'PM2.5',
            data: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
            borderColor: 'rgba(0, 0, 205, 1)',
            backgroundColor: 'rgba(0, 0, 0, 0)',
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            text: "Annual ug/m3 means for NO2, PM10, and PM2.5 - Load some data to update the graph"
        }
    }
});
// Arrays that will store the respective dates, average counts, and max counts for each map
var allDatesPollutants = ['None','None','None','None','None'];
var allAverageCounts = [0,0,0,0,0];
var allMaxCounts = [0,0,0,0,0];

// Counter for how many maps are currently being updated, so that the user can't request new data for
// all the maps while data is still being loaded. This is to avoid maps being updated with the wrong 
// data
var requestAllDisabledCounter = 0;
// Counter for many daily JSON files per map need to be loaded in, used for loading in monthly data 
// because the LAQ API doesn't have the ability to download data by month, and yearly files do not 
// differentiate by month
var infoLoadingCounter1 = 0;
var infoLoadingCounter2 = 0;
var infoLoadingCounter3 = 0;
var infoLoadingCounter4 = 0;
var infoLoadingCounter5 = 0;
// Counter for how many annual JSON files still need to be loaded in
var yearRangeLoadingCounter = 0;


// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------



// -------------------------------------------------------------------------------------------------------
// -------------------------------------DISPLAY DATA METHODS----------------------------------------------

// ----------------------------START UP METHODS---------------------------
/**
 * Starting from the current date, check if there is any data available for the NO2 pollutant (as it 
 * usually has many datapoints), and if not, continually check the next previous day until a day with data 
 * is found. The maximum date the user may select will be set to it. No buttons will be able to be pressed 
 * while this occurs. This function will be run when the page is initially loaded
 */
function findRecentData() {
    // Disable all selection and submit options initially
    document.querySelectorAll("button").forEach(btn => btn.disabled = true);
    document.querySelectorAll("input").forEach(inp => inp.disabled = true);
    document.querySelectorAll("select").forEach(sel => sel.disabled = true);

    // Try to find date with most recently available data
    getLAQDailyData(maxDate, "NO2", "recentdataloading", "1", "")
        .then(function(dataList) {
            laqData1 = dataList;
            requestAllDisabledCounter -= 1;
            // If current max date doesn't have data, decrement it and recursively try the next date
            if (laqData1.data.length == 0) { 
                maxDate.setDate(maxDate.getDate() - 1);
                findRecentData();
            }
            // If current max date does have data, then update the rest of the website with this max 
            // date
            else { 
                const formatted = getFormattedInputDate();
                updateSiteWithMaxDate(formatted);
            }
        })
        .catch(function(error) { 
            document.getElementById("waittoload").innerHTML = "File failed to load, please reload the page";
            console.log('Couldn\'t load data', error); 
        });
}

/**
 * Using the new and final maximum date, update the rest of the website. This includes, updating the 
 * maximum dates selectable, re-enabling all the selection and submission features, and letting the user 
 * know the data has been succesfully found
 * @param {String} formatted Formatted date that can be used to update the maximum date for the HTML input 
 * forms
 */
function updateSiteWithMaxDate(formatted) {
    // Update maximum date allowed to be selected, since the HTML side has no native 'get today's date' 
    // functionality
    document.getElementById("map1newdate").value = formatted;
    document.getElementById("map2newdate").setAttribute("max", formatted);
    document.getElementById("map3newdate").setAttribute("max", formatted);
    document.getElementById("map4newdate").setAttribute("max", formatted);
    document.getElementById("map5newdate").setAttribute("max", formatted);

    // With the maximum date now set, update the possible selectable years for the annual chart
    addYearRangeOptions();

    // Enables all button, inputs, and dropdown boxes, and remove message that data is loading
    document.getElementById("waittoload").innerHTML = "";
    document.querySelectorAll("button").forEach(btn => btn.disabled = false);
    document.querySelectorAll("input").forEach(inp => inp.disabled = false);
    document.querySelectorAll("select").forEach(sel => sel.disabled = false);

    // Let the user know the most recent data has been successfully found, then reset the message after 
    // 3 seconds
    document.getElementById("recentdataloading").innerHTML = "Success";
    setTimeout(function(){ document.getElementById("recentdataloading").innerHTML = ""; }, 3000);
}

/**
 * Add in the range of years that can be selected for the annual line chart. The first year will range 
 * from the minimum year (1995) to the maximum year - 1 (since there must be a minimum range of 2 years), 
 * and the last year will range from minimum + 1 (1996) to the maximum year, for the same reason. The 
 * ranges are added only after the maximum date has been found for the rare cases such as the user trying 
 * to get data on New Years Day, where the actual current year doesn't have any data
 */
function addYearRangeOptions() {
    var min = minDate.getFullYear();
    var max = maxDate.getFullYear();
    var optionsStart = "";
    var optionsEnd = "";
    for (year = min; year <= max - 1; year++) {
        optionsStart += "<option>"+ year +"</option>";
    }
    for (year = min + 1; year <= max; year++) {
        optionsEnd += "<option>"+ year +"</option>";
    }
    document.getElementById("startyearrange").innerHTML = optionsStart;
    document.getElementById("endyearrange").innerHTML = optionsEnd;
}

/**
 * Called when the maximum date has been set to its final value, and creates a formatted String that can 
 * be used for the HTML input form
 * @return {String} String with correct format for use in the HTML input forms
 */
function getFormattedInputDate() {
    // Get correctly formatted date
    var year = maxDate.getFullYear();
    var month = 0;
    var day = 0;
    // If month < 9, increment the month and start the month string with 0 (to be int 2 digit form), else 
    // simply increment the month
    if (maxDate.getMonth() < 9) { month = "0" + (maxDate.getMonth() + 1); }
    else { month = maxDate.getMonth() + 1; }
    // If day < 10, append 0 at the start (to be in 2 digit form)
    if (maxDate.getDate() < 10) { day = "0" + maxDate.getDate(); }
    else { day = maxDate.getDate(); }
    return (year + "-" + month + "-" + day);
}


// --------------METHODS FOR LOADING LONDON AIR QUALITY DATA--------------
/** 
 * Fetches daily data using LAQ API, and if successful, returns a list of datapoints for the selected date 
 * and pollutant
 * @param {Object} dataList Where datapoints for the specific date-pollutant pair will be stored 
 * temporarily
 * @param {Date} currentDate The date for which data will be fetched with the LAQ API
 * @param {String} pollutant The pollutant for which data will be fetched with the LAQ API
 * @param {String} htmlID ID of the HTML element to update the information on the data displayed on the 
 * relevant map
 * @param {String} buttonID ID of the button element to disable it while the map's data is loading
 * @return {Promise} that contains data list with all the datapoints corresponding to the chosen date and 
 * pollutant, or the error message when unsuccessful
 * @param {Number} infoLoadingCounter counter for number of files loading in for the relevant map
 */
var getLAQDailyData = function(currentDate, pollutant, htmlID, buttonIndex, infoLoadingCounter) {
    // Disable the corresponding submit buttons
    document.getElementById("newDataMapDaily" + buttonIndex).disabled = true;
    document.getElementById("newDataMapMonthly" + buttonIndex).disabled = true;
    // Disable the default data and switch between daily and monthly buttons
    document.getElementById("defaultdatabutton").disabled = true;
    // Increment the counter that keeps the default data button disabled when != 0
    requestAllDisabledCounter += 1;

    // Start with a fresh dataList with same structure as the laqData lists
    var dataList = { max: 10, min: 0, data: [] };
    const httpRequest = new XMLHttpRequest();
    const urlLAQ = "https://api.erg.ic.ac.uk/AirQuality/Daily/MonitoringIndex/GroupName=London/Date=" + getFormattedLAQDailyDate(currentDate) + "/Json";
    
    return new Promise(function(resolve, reject) {
        // Tries to load data for a given date, and if successful, only add to the dataList the entries 
        // that count the chosen pollutant. There are several ways in which the data is stored, as 
        // lists or singluar objects, in further nested lists or objects
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState !== 4) return;
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
                var localFile = JSON.parse(this.responseText);
                // Checks each subsequent object or array to see if there are datapoints with the 
                // correct pollutant if LocalAuthority is defined and an array
                if (typeof localFile.DailyAirQualityIndex.LocalAuthority != "undefined" && Array.isArray(localFile.DailyAirQualityIndex.LocalAuthority)) {
                    localFile.DailyAirQualityIndex.LocalAuthority.forEach(locAuth => {
                        // if Site is defined
                        if (typeof locAuth.Site != "undefined") {
                            // if Site is an array
                            if (Array.isArray(locAuth.Site)) {
                                locAuth.Site.forEach(site => {
                                    // if Species is defined
                                    if (typeof site.Species != "undefined") {
                                        // if defined Species is an array
                                        if (Array.isArray(site.Species)) {
                                            site.Species.forEach(species => {
                                                if (species["@SpeciesCode"] == pollutant) {
                                                    dataList.data.push({lat:site["@Latitude"], lng:site["@Longitude"], count:species["@AirQualityIndex"]});
                                                }
                                            });
                                        }
                                        // if defined Species is an object
                                        else {
                                            if (site.Species["@SpeciesCode"] == pollutant) {
                                                dataList.data.push({lat:site["@Latitude"], lng:site["@Longitude"], count:site.Species["@AirQualityIndex"]});
                                            }
                                        }
                                    }
                                });
                            }
                            // if Site is an object
                            else {
                                // if Species is defined
                                if (typeof locAuth.Site.Species != "undefined") {
                                    // if defined Species is an array
                                    if (Array.isArray(locAuth.Site.Species)) {
                                        locAuth.Site.Species.forEach(species => {
                                            if (species["@SpeciesCode"] == pollutant) {
                                                dataList.data.push({lat:locAuth.Site["@Latitude"], lng:locAuth.Site["@Longitude"], count:species["@AirQualityIndex"]});
                                            }
                                        });
                                    }
                                    // if defined Species is an object
                                    else {
                                        if (locAuth.Site.Species["@SpeciesCode"] == pollutant) {
                                            dataList.data.push({lat:locAuth.Site["@Latitude"], lng:locAuth.Site["@Longitude"], count:locAuth.Site.Species["@AirQualityIndex"]});
                                        }
                                    }
                                }
                            }
                        }
                    });
                    // Get rid of duplicate datapoints
                    var uniqueDataPoints = removeDuplicate(dataList.data);
                    dataList.data = uniqueDataPoints;
                    document.getElementById(htmlID).innerHTML = dataList.data.length + " datapoints: " + currentDate.getDate() + " " + shortMonths[currentDate.getMonth()] + " " + currentDate.getFullYear() + " - " + pollutant;
                }
                resolve(dataList);
            }
            else {
                reject({
                    status: httpRequest.status,
                    statusText: httpRequest.statusText
                });
            }
        }
        // Set the text box under the map to 'Loading' so the user knows they have to wait for the data 
        // in load in
        document.getElementById(htmlID).innerHTML = infoLoadingCounter + " Files Loading";
        httpRequest.open("GET", urlLAQ, true);
        httpRequest.send();
    })
}

/**
 * Fetches annual data using LAQ API, and if successful, returns a list of datapoints for the selected 
 * year. These datapoints will be the ug/m3 mean values for NO2, PM10, and PM2.5, as SO2 and O3 do not 
 * have these values available.
 * @param {Number} year Year that we want to download annual data for
 * @return {Promise} Returns a Promise with array of Objects with variables for 'species' and 'ugm3'
 */
var getLAQAnnualData = function(year) {
    // Start with a fresh dataList with same structure as the laqData lists
    var dataList = []
    const httpRequest = new XMLHttpRequest();
    const urlLAQ = "https://api.erg.ic.ac.uk/AirQuality/Annual/MonitoringObjective/GroupName=London/Year=" + year + "/Json";

    return new Promise(function(resolve, reject) {
        httpRequest.onreadystatechange = function() {
            if (httpRequest.readyState !== 4) return;
            if (httpRequest.status >= 200 && httpRequest.status < 300) {
                var localFile = JSON.parse(this.responseText);
                // Checks each subsequent array to see if there are datapoints that describes the ug/m3 
                // as an annual mean for NO2, PM10, and PM2.5 (SO2 and O3 do not have this data 
                // available, and DUST is not available as daily data). First check if Site is an array 
                // (may not be if it is too early in the year)
                if (typeof localFile.SiteObjectives.Site != "undefined" && Array.isArray(localFile.SiteObjectives.Site)) {
                    // For each site
                    localFile.SiteObjectives.Site.forEach(site => {
                        // If Objective in each site is defined and an array
                        if (typeof site.Objective != "undefined" && Array.isArray(site.Objective)) {
                            //For each objective at each site
                            site.Objective.forEach(obj => {
                                // If objective gives the value of ug/m3 as an annual mean
                                if (obj["@ObjectiveName"] == "40 ug/m3 as an annual mean" || obj["@ObjectiveName"] == "25 ug/m3 as an annual mean") {
                                    // Exclude datapoints of pollutant 'dust' as data isn't available 
                                    // for it in daily data
                                    if (obj["@SpeciesCode"] != "DUST") {
                                        dataList.push({species:obj["@SpeciesCode"], ugm3:obj["@Value"]});
                                    }
                                }
                            })
                        }
                    })
                }
                resolve(dataList);
            }
            else {
                reject({
                    status: httpRequest.status,
                    statusText: httpRequest.statusText
                })
            }
        }
        httpRequest.open("GET", urlLAQ);
        httpRequest.send();
    })
}

/**
 * Removes from the array any duplicate entries (same longitude, latitude, and count) for the daily
 * data
 * @param {Array} dataArray List of datapoints to potentially be reduced
 */
function removeDuplicate(dataArray) {
    unique = []
    for(i = 0; i < dataArray.length; i++) {
        noDupeFound = true;
        // Check all current uniques, and if no dupes found, then add to array
        unique.forEach(unq => { if (dataArray[i].lat == unq.lat && dataArray[i].lng == unq.lng && dataArray[i].count == unq.count) { noDupeFound = false } });
        if (noDupeFound) { unique.push(dataArray[i]); }
    }
    return unique;
}

/**
 * Called when daily data for a map has been successfully loaded. Decreases the counter for 
 * requestAllDisabledCounter, and if it's 0 (meaning that all maps have loaded in their data), 
 * then the button can be re-enabled
 */
function decreaseRequestAllDisabledCounter() {
    requestAllDisabledCounter -= 1;
    if (requestAllDisabledCounter == 0) {
        document.getElementById("defaultdatabutton").disabled = false;
    }
}


// -------------METHODS FOR LOADING AND DISPLAYING DAILY DATA-------------
/**
 * Format Date object to be usable for fetching data from LAQ API
 * @param {Date} currentDate Date object to be reformatted
 * @return {String} Reformatted date so that it is usable for the LAQ API
 */
function getFormattedLAQDailyDate(currentDate) {
    var formattedDate = (currentDate.getDate()).toString() + shortMonths[currentDate.getMonth()] + currentDate.getFullYear().toString();
    return formattedDate;
}

/**
 * Checks that the user selected date is valid (not NaN, and in the min and max bounds defined in 
 * minDate and maxDate), and if not, print out an error message on the console
 * @param {*} calendarValue For a valid value, it has to be an instance of Date, otherwise an error 
 * message is made
 * @return {String} If a valid date, returns empty string, otherwise return message to help user
 */
function checkDateSelected(calendarValue) {
    // If no date selected, return error on screen and on console log
    if (calendarValue.toString() == "" || calendarValue == null) {
        console.warn("No date selected");
        return "Please select a date to display.";
    }

    const newDate = new Date(calendarValue);
    // If selected date is not a number, or outside of minimum and maximum decided dates, return error 
    // on screen and on console log
    if (isNaN(newDate.getFullYear())|| newDate.getTime() < minDate.getTime() || maxDate.getTime() < newDate.getTime()) {
        console.warn("Date out of bounds");
        return ("Please select a valid date between " + minDate.toDateString() + " and " + maxDate.toDateString() + ".");
    }

    return "";
}

/**
 * Checks that the user selected pollutant is valid (is any option other than "default"), and if not, 
 * print out an error message on the console
 * @param {String} pollutantValue For a valid value, it has to be any option other than "default"
 * @return {String} If a valid pollutant, returns empty string, otherwise return message to help user
 */
function checkPollutantSelected(pollutantValue) {
    // If selected pollutant is the default (not a pollutant) option, then log error on console, and tell
    // tell user to choose a valid option
    if (pollutantValue == "default") {
        console.warn("No pollutant selected");
        return "Please select a pollutant to display.";
    }

    return "";
}

/**
 * Try to load daily data, and if successful, then update the relevant features
 * @param {Object} initialDataList Datalist for relevant map
 * @param {Date} newDate Date for which data will be loaded
 * @param {String} pollutantValue Pollutant for which data will be loaded
 * @param {String} laqInfoLabel ID of the relevant HTML element which has info about the data displayed 
 * on the respective map
 * @param {Number} buttonIndex Index of the submit buttons for the relevant map
 * @param {HeatmapOverlay} heatmapLayer Heatmap layer for the relevant map
 * @param {Number} arrayIndex Index for relevant map's chart arrays, always -1 to the ID number of the map
 * @param {Number} infoLoadingCounter counter for number of files loading in for the relevant map
 */
function getDailyDataAndUpdate(initialDataList, newDate, pollutantValue, laqInfoLabel, buttonIndex, heatmapLayer, arrayIndex, infoLoadingCounter) {
    infoLoadingCounter += 1;
    getLAQDailyData(newDate, pollutantValue, laqInfoLabel, buttonIndex, infoLoadingCounter)
        .then(function(dataList) {
            initialDataList = dataList;
            heatmapLayer.setData(initialDataList);
            document.getElementById("newDataMapDaily" + buttonIndex).disabled = false;
            document.getElementById("newDataMapMonthly" + buttonIndex).disabled = false;
            infoLoadingCounter -= 1;
            decreaseRequestAllDisabledCounter();
            allDatesPollutants[arrayIndex] = getFormattedLAQDailyDate(newDate) + ' - ' + pollutantValue;
            updateAllCounts(initialDataList, arrayIndex);
            updateChart();
        })
        .catch(function(error) { 
            document.getElementById("waittoload").innerHTML = "File failed to load, please reload the page";
            console.log('Couldn\'t load data', error); 
        });
}

/** 
 * Using information selected by user (date and pollutant), updates the data displayed for the relevant 
 * map, if the selected options are valid
 * @param {Number} idNumber Number of the map ranging from 2 to 5, so the relevant map and label can be 
 * updated
 */
function getNewDailyDataForChosenMap(idNumber) {
    // Get values of user selected date and pollutant
    const calendarValue = document.getElementById("map" + idNumber + "newdate").value;
    const pollutantValue = document.getElementById("pollutant" + idNumber).value;

    // Check that date and pollutant selected are valid
    const errorMessage = checkDateSelected(calendarValue) + " " + checkPollutantSelected(pollutantValue);
    const errorMessageID = "map" + idNumber + "newdateerror";

    // If selected options are valid, the error message contains " ", so the data for those options can be
    // displayed
    if (errorMessage === " ") {
        const newDate = new Date(calendarValue);
        document.getElementById(errorMessageID).innerHTML = "";
        
        // For the relevant map, if the data is successfully loaded, update its heatmap layer with the new 
        // data, re-enable its submit button, and try to re-enable the request default data button
        if (idNumber == 1) { getDailyDataAndUpdate(laqData1, maxDate, pollutantValue, "laqDataInfo1", "1", heatmapLayer1, 0, infoLoadingCounter1); }
        else if (idNumber == 2) { getDailyDataAndUpdate(laqData2, newDate, pollutantValue, "laqDataInfo2", "2", heatmapLayer2, 1, infoLoadingCounter2); }
        else if (idNumber == 3) { getDailyDataAndUpdate(laqData3, newDate, pollutantValue, "laqDataInfo3", "3", heatmapLayer3, 2, infoLoadingCounter3); }
        else if (idNumber == 4) { getDailyDataAndUpdate(laqData4, newDate, pollutantValue, "laqDataInfo4", "4", heatmapLayer4, 3, infoLoadingCounter4); }
        else if (idNumber == 5) { getDailyDataAndUpdate(laqData5, newDate, pollutantValue, "laqDataInfo5", "5", heatmapLayer5, 4, infoLoadingCounter5); }
    }
    else {
        document.getElementById(errorMessageID).innerHTML = errorMessage;
    }
}

/** 
 * Displays some default data fetched from LAQ database - subsequently previous days starting from the 
 * mostrecently available data
 */
function getDefaulDailyDataForAllMaps() {
    // Dates chosen are the successively previous date starting from the most recent date where data is
    // available
    date2 = new Date(maxDate);
    date2.setDate(date2.getDate() - 1);
    date3 = new Date(date2);
    date3.setDate(date3.getDate() - 1);
    date4 = new Date(date3);
    date4.setDate(date4.getDate() - 1);
    date5 = new Date(date4);
    date5.setDate(date5.getDate() - 1);
    // Date and pollutant are prescribed (i.e., user selections not checked), use default selections 
    // instead
    getDailyDataAndUpdate(laqData1, maxDate, "NO2", "laqDataInfo1", "1", heatmapLayer1, 0, infoLoadingCounter1);
    getDailyDataAndUpdate(laqData2, date2, "NO2", "laqDataInfo2", "2", heatmapLayer2, 1, infoLoadingCounter2);
    getDailyDataAndUpdate(laqData3, date3, "NO2", "laqDataInfo3", "3", heatmapLayer3, 2, infoLoadingCounter3);
    getDailyDataAndUpdate(laqData4, date4, "NO2", "laqDataInfo4", "4", heatmapLayer4, 3, infoLoadingCounter4);
    getDailyDataAndUpdate(laqData5, date5, "NO2", "laqDataInfo5", "5", heatmapLayer5, 4, infoLoadingCounter5);
}


// ------------METHODS FOR LOADING AND DISPLAYING MONTHLY DATA------------
/**
 * Get all the dates in the month selected. If the month selected is the current month, only data up to 
 * the most recently available will be downloaded
 * @param {Date} selectedDate User selected date, of which the month and the year are the focus
 * @returns {Array} Array of Date objects in the month selected
 */
function getAllDatesInMonth(selectedDate) {
    allDatesInMonth = [];
    // If user has selected the current month, load in data from the first day up to the most recently 
    // available data
    if (selectedDate.getMonth() == maxDate.getMonth() && selectedDate.getFullYear() == maxDate.getFullYear()) {
        for (day = 1; day <= maxDate.getDate(); day++) {
            const newDate = new Date(maxDate.getFullYear() + "-" + (maxDate.getMonth() + 1) + "-" + day);
            allDatesInMonth.push(newDate);
        }
    }
    else {
        // Start with first day of selected month
        var dateInMonth = new Date(selectedDate.getFullYear() + "-" + (selectedDate.getMonth() + 1) + "-01");
        // While dateInMonth is still in the same month, continue adding the new date into allDatesInMonth
        while (dateInMonth.getMonth() == selectedDate.getMonth()) {
            allDatesInMonth.push(dateInMonth);
            // Increment the date, which will continue until it moves onto the next month
            dateInMonth.setDate(dateInMonth.getDate() + 1);
        }
    }
    return allDatesInMonth;
}

/**
 * Try to load monthly data, and if successful, then update the relevant features
 * @param {Object} initialDataList Datalist for relevant map
 * @param {Array} allDatesInMonth Array of all dates in month that user has selected for chosen month
 * @param {Number} infoLoadingCounter Counter for number of JSON files left needed to be loaded for 
 * relevant map
 * @param {String} pollutantValue String value of user selected pollutant
 * @param {String} laqDataLabel ID for HTML element that displays info on displayed data for relevant map
 * @param {String} buttonIndex Index of submit buttons for relevant map
 * @param {Number} arrayIndex Index for relevant map's chart arrays, always -1 to the ID number of the map
 * @param {HeatmapOverlay} heatmapLayer Heatmap layer of the relevant map
 * @param {Date} selectedDate Date selected by the user, of which only the month and year are needed
 */
function getMonthlyDataAndUpdate(initialDataList, allDatesInMonth, infoLoadingCounter, pollutantValue, laqDataLabel, buttonIndex, arrayIndex, heatmapLayer, selectedDate) {
    initialDataList = { max: 10, min: 0, data: [] }
    allDatesInMonth.forEach(dateInMonth => {
        infoLoadingCounter += 1;
        // Append each date's data to the current list of data and decrease the 2 counters
        getLAQDailyData(dateInMonth, pollutantValue, laqDataLabel, buttonIndex, infoLoadingCounter)
            .then(function(dataList) {
                dataList.data.forEach(dp => initialDataList.data.push(dp));
                decreaseRequestAllDisabledCounter();
                infoLoadingCounter -= 1;
                updateMonthlyMapAndChart(infoLoadingCounter, initialDataList, arrayIndex, heatmapLayer, selectedDate, pollutantValue, buttonIndex, laqDataLabel, infoLoadingCounter);
            })
            .catch(function(error) { 
                document.getElementById("waittoload").innerHTML = "File failed to load, please reload the page";
                console.log('Couldn\'t load data', error); 
            })
    })
}

/**
 * Using information selected by user (pollutant and date), displays the average count data in the 
 * selected month 
 * @param {Number} idNumber ID number of the corresponding map and its related features, ranging from 2-5
 */
function getNewMonthlyDataForChosenMap(idNumber) {
    // Get values of user selected date and pollutant
    const calendarValue = document.getElementById("map" + idNumber + "newdate").value;
    const pollutantValue = document.getElementById("pollutant" + idNumber).value;

    // Check that date and pollutant selected are valid
    const errorMessage = checkDateSelected(calendarValue) + " " + checkPollutantSelected(pollutantValue);
    const errorMessageID = "map" + idNumber + "newdateerror";

    // If selected options are valid, the error message contains " ", so the data for those options can be
    // displayed
    if (errorMessage == " ") {
        document.getElementById(errorMessageID).innerHTML = "";
        const selectedDate = new Date(calendarValue);
        const allDatesInMonth = getAllDatesInMonth(selectedDate);
        
        // For the relevant map, try to load the data for all the dates in the month (that have data 
        // available)
        if (idNumber == 1) { getMonthlyDataAndUpdate(laqData1, allDatesInMonth, infoLoadingCounter1, pollutantValue, "laqDataInfo1", "1", 0, heatmapLayer1, selectedDate); }
        else if (idNumber == 2) { getMonthlyDataAndUpdate(laqData2, allDatesInMonth, infoLoadingCounter2, pollutantValue, "laqDataInfo2", "2", 1, heatmapLayer2, selectedDate); }
        else if (idNumber == 3) { getMonthlyDataAndUpdate(laqData3, allDatesInMonth, infoLoadingCounter3, pollutantValue, "laqDataInfo3", "3", 2, heatmapLayer3, selectedDate); }
        else if (idNumber == 4) { getMonthlyDataAndUpdate(laqData4, allDatesInMonth, infoLoadingCounter4, pollutantValue, "laqDataInfo4", "4", 3, heatmapLayer4, selectedDate); }
        else if (idNumber == 5) { getMonthlyDataAndUpdate(laqData5, allDatesInMonth, infoLoadingCounter5, pollutantValue, "laqDataInfo5", "5", 4, heatmapLayer5, selectedDate); }
    }
    else {
        document.getElementById(errorMessageID).innerHTML = errorMessage;
    }
}

/**
 * Called when data for a map has been successfully loaded. When the counter is 0, finds the average count 
 * per location, then updates the heatmap and chart
 * @param {Number} counter Number of the counter, used to enter the main portion of the function when this 
 * is 0
 * @param {Object} laqMonthlyData Contains the dataset for the whole month for the selected pollutant
 * @param {Number} index Used for the chart, where each map's index is its number - 1
 * @param {HeatmapOverlay} hmLayer Heatmap layer for the corresponding map
 * @param {Date} date Date corresponding to the month of the data that needs to be reduced
 * @param {String} pollutantValue Name of the pollutant selected by the user
 * @param {String} buttonIndex String of the corresponding number to the map that is being updated, 
 * ranging from 1-5
 * @param {String} htmlID ID of the div that holds information about the data being displayed on the map
 * @param {Number} infoLoadingCounter counter for number of files loading in for the relevant map
 */
function updateMonthlyMapAndChart(counter, laqMonthlyData, index, hmLayer, date, pollutantValue, buttonIndex, htmlID, infoLoadingCounter) {
    document.getElementById(htmlID).innerHTML = infoLoadingCounter + " Files Loading";
    if (counter == 0) {
        // Re-enable the submit buttons since the data has loaded so there won't be any problems with 
        // loading different datasets
        document.getElementById("newDataMapDaily" + buttonIndex).disabled = false;
        document.getElementById("newDataMapMonthly" + buttonIndex).disabled = false;
        // Resolve the large dataset by finding the average of each location
        const avgMonthData = getAverageMonthlyData(laqMonthlyData);
        // Set the heatmap to this more concise dataset
        hmLayer.setData(avgMonthData);
        // Updates for the chart, to show the monthly average and max counts
        monthlyInfo = shortMonths[date.getMonth()] + ' ' + date.getFullYear() + ' - ' + pollutantValue;
        allDatesPollutants[index] = monthlyInfo;
        updateAllCounts(laqMonthlyData, index);
        updateChart();
        // Update the map info with the total number of datapoints, and the date displayed
        document.getElementById(htmlID).innerHTML = laqMonthlyData.data.length + " datapoints: " + monthlyInfo;
    }
}

/**
 * Firstly creates an array of 4-tuples containing unique lng and lat coordinates, the frequency of the 
 * location, and the total count for it. Then goes through the dataset and increments the frequency for 
 * each location where applicable, and also increases the count by the applicable datapoint's count. From 
 * there return the dataset in the same form as the parameter, but containing unique locations, with their 
 * average counts, rather than all datapoints
 * @param {Object} laqMonthlyData Object containing the list of all datapoints of given map for a given 
 * month
 * @return {Object} Updated Object that now contains condensed datapoints, listing only the average counts 
 * for each unique location, rather than every datapoint like in the parameter
 */
function getAverageMonthlyData(laqMonthlyData) {
    var avgMonthData = { max: 10, min: 0, data: [] };
    // Array that will hold lng-lat-frequency-count tuples. This will be each unique location (lng-lat), 
    // the number of times this location appears, and the total count for each datapoint with that 
    // location
    var locationFrequencyCount = [];
    laqMonthlyData.data.forEach(datapoint => {
        noDupeFound = true;
        // Check all current unique locations, and if no dupes found, then add to arrays
        locationFrequencyCount.forEach(unq => { if (datapoint.lng == unq.lng && datapoint.lat == unq.lat) { noDupeFound = false } });
        if (noDupeFound) { locationFrequencyCount.push({lng:datapoint.lng, lat:datapoint.lat, freq:0.0, totalcount:0.0}); }
    });
    // For each unique location, check each datapoint and if its location matches, update the 
    // corresponding tuple
    for (i = 0; i < locationFrequencyCount.length; i++) {
        // For each datapoint, check if its location matches the current location, and if so update the 
        // correct tuple
        laqMonthlyData.data.forEach(datapoint => {
            if (datapoint.lng == locationFrequencyCount[i].lng && datapoint.lat == locationFrequencyCount[i].lat) {
                locationFrequencyCount[i].freq = locationFrequencyCount[i].freq + 1.0;
                locationFrequencyCount[i].totalcount = locationFrequencyCount[i].totalcount + parseFloat(datapoint.count);
            }
        });
    };
    //Finally append to avgMonthData, the lng, lat, and average counts
    locationFrequencyCount.forEach(datapoint => {
        finalCount = datapoint.totalcount/datapoint.freq;
        avgMonthData.data.push({lat:datapoint.lat, lng:datapoint.lng, count:finalCount});
    });
    return avgMonthData;
}


// -------------METHODS FOR LOADING AND DISPLAYING ANNUAL DATA------------
/**
 * For user selected range of years, if they are within allowed range (2 to 20 years), try to get each 
 * year's annual data with the LAQ API, find the averages for each pollutant for each year, and display 
 * this on the line chart
 */
function getAnnualChanges() {
    startYear = document.getElementById("startyearrange").value;
    endYear = document.getElementById("endyearrange").value;
    range = getYearRange(startYear, endYear);
    errorMessage = getYearRangeErrorMessage(range);
    document.getElementById("yearrangeerror").innerHTML = errorMessage;

    if (range >= 2 && range <= 20) {
        document.getElementById("annualcountchanges").disabled = true;
        no2counts = [];
        pm10counts = [];
        pm25counts = [];
        years = [];
        for (i = 0; i < range; i++) {
            no2counts.push(0.0);
            pm10counts.push(0.0);
            pm25counts.push(0.0);
        }
        for (i = startYear; i <= endYear; i++) { years.push(i); }

        years.forEach(year => {
            yearRangeLoadingCounter += 1;
            getLAQAnnualData(year)
                .then(function(dataList) {
                    getPollutantAnnualAverage(dataList, years.findIndex(ele => ele == year));
                    yearRangeLoadingCounter -= 1;
                    if (yearRangeLoadingCounter == 0) {
                        document.getElementById("annualcountchanges").disabled = false;
                        updateAnnualCountChart(years, no2counts, pm10counts, pm25counts);
                    }
                })
                .catch(function(error) { 
                    document.getElementById("waittoload").innerHTML = "File failed to load, please reload the page";
                    console.log('Couldn\'t load data', error); 
                });
        })
    }
}

/**
 * Simple function to get the range of years selected by the user
 * @param {Number} startYear First year to get annual data for
 * @param {Number} endYear Last year to get annual data for
 * @return {Number} Range of years, inclusive for both start and end years
 */
function getYearRange(startYear, endYear) {
    range = (endYear - startYear) + 1;
    return range;
}

/**
 * Simple function to check the range of years selected by the user is within the allowed range
 * @param {Number} range Range of years to load annual data for
 * @return {String} Error message, which is empty if the value is in the acceptable range
 */
function getYearRangeErrorMessage(range) {
    // Allowed range is minimum of 2 years, maximum of 20
    if (range == 1 || range > 20) {
        return "Please select a range of at least 2, and at most 20 years. Currently selected range of " + range + " years.";
    }
    else if (range <= 0){
        return "Please order the years by smallest year first.";
    }
    else {
        return "";
    }
}

/**
 * Updates the arrays where the annual average for each pollutant (NO2, PM10, PM2.5) are stored
 * @param {Array} dataList Array of Objects with species and ugm3 variables
 * @param {Number} index Index at which the final computed data should be stored
 */
function getPollutantAnnualAverage(dataList, index) {
    // Count and frequency totals for each pollutant
    no2CountTotal = 0.0;
    pm10CountTotal = 0.0;
    pm25CountTotal = 0.0;
    no2Frequency = 0.0;
    pm10Frequency = 0.0;
    pm25Frequency = 0.0;
    // Go through each datapoints, and update the respective counts and frequencies
    dataList.forEach(datapoint => {
        if (datapoint.species === "NO2") {
            no2CountTotal += parseFloat(datapoint.ugm3);
            no2Frequency += 1.0;
        }
        else if (datapoint.species === "PM10") {
            pm10CountTotal += parseFloat(datapoint.ugm3);
            pm10Frequency += 1.0;
        }
        else {
            pm25CountTotal += parseFloat(datapoint.ugm3);
            pm25Frequency += 1.0;
        }
    });
    // Update the relevant arrays with the average ug/m3 values throughout London
    no2counts[index] = no2CountTotal / no2Frequency;
    pm10counts[index] = pm10CountTotal / pm10Frequency;
    pm25counts[index] = pm25CountTotal / pm25Frequency;
}


// ---------------METHODS FOR UPDATING CHARTS AND CHART DATA--------------
/**
 * Updates the index of maxCounts and averageCounts for the given map, with the calculated max and average 
 * counts
 * @param {Array} dataList List of datapoints from which the average and max counts for the corresponding 
 * map will be updated
 * @param {Number} index index of the map that the dataList belongs to (map number - 1)
 */
function updateAllCounts(dataList, index) {
    total = 0.0;
    max = 0.0;
    // For each element in the list, add its count to the total, and check if its the current maximum 
    dataList.data.forEach(element => {
        count = parseFloat(element.count);
        total += count;
        if (count > max) {
            max = count;
        }
    });
    // Update the average and max counts for the given map index 
    allAverageCounts[index] = total/dataList.data.length;
    allMaxCounts[index] = max;
}

/**
 * Updates the visuals displayed on the bar graph, using the newly updated data
 */
function updateChart() {
    barChart.destroy();
    barChart = new Chart(ctxBarChart, {
        type: 'bar',
        data: {
            labels: allDatesPollutants,
            datasets: [{
                // First dataset is for average count, this will be the more transparent of the two bars for each date
                label: 'Average Count',
                data: allAverageCounts,
                backgroundColor: [
                    'rgba(0, 0, 205, 0.3)',
                    'rgba(0, 0, 205, 0.3)',
                    'rgba(0, 0, 205, 0.3)',
                    'rgba(0, 0, 205, 0.3)',
                    'rgba(0, 0, 205, 0.3)',
                ],
                borderColor: [
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                ],
                borderWidth: 1
            }, {
                // Second dataset is for the max count, this will be the more opaque of the two bars for each map
                label: 'Max Count',
                data: allMaxCounts,
                backgroundColor: [
                    'rgba(0, 0, 205, 0.6)',
                    'rgba(0, 0, 205, 0.6)',
                    'rgba(0, 0, 205, 0.6)',
                    'rgba(0, 0, 205, 0.6)',
                    'rgba(0, 0, 205, 0.6)',
                ],
                borderColor: [
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                    'rgba(0, 0, 205, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true,
            title: {
                display: true,
                text: "Average and Max Count Per Map"
            }
        }
    });
}

/**
 * Updates the visuals displayed on the line chart, using the updated annual data
 * @param {Array} yearRange Array of years, from the first year to the last year of the user selected 
 * range
 * @param {Array} no2AnnualAverages Array of ug/m3 annual averages for NO2
 * @param {Array} pm10AnnualAverages Array of ug/m3 annual averages for PM10
 * @param {Array} pm25AnnualAverages Array of ug/m3 annual averages for PM2.5
 */
function updateAnnualCountChart(yearRange, no2AnnualAverages, pm10AnnualAverages, pm25AnnualAverages) {
    lineChart.destroy();
    lineChart = new Chart(ctxLineChart, {
        type: 'line',
        data: {
            labels: yearRange,
            datasets: [{
                label: 'NO2',
                data: no2AnnualAverages,
                borderColor: 'rgba(0, 0, 205, 0.3)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            }, {
                label: 'PM10',
                data: pm10AnnualAverages,
                borderColor: 'rgba(0, 0, 205, 0.6)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            }, {
                label: 'PM2.5',
                data: pm25AnnualAverages,
                borderColor: 'rgba(0, 0, 205, 1)',
                backgroundColor: 'rgba(0, 0, 0, 0)',
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: "Annual ug/m3 means for NO2, PM10, and PM2.5"
            }
        }
    });
}


// -------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------



// -------------------------------------------------------------------------------------------------------
// ------------------------------------------METHODS ON STARTUP-------------------------------------------

findRecentData()