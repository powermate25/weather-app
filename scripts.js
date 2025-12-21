const clog = console.log
clog("Welcome!")

// Code

let dateNow = new Date()
let dateNowHours = dateNow.getHours()
let dateNowDay = dateNow.getUTCDay()
dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const getDayString = function(){
    return dayArray[dateNowDay]
}

clog(dateNowDay)
clog(getDayString())

const getRawWeatherData = async function(location = "london", selectedMetric) {
    let url
    let serverBaseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
    let apiKey = "7SZB422JF2656H4U2T3XMFNE5"
    if(selectedMetric === "us-metric"){ url = `${serverBaseUrl}/${location}?key=${apiKey}`}
    else if (selectedMetric === "intl-metric") {url = `${serverBaseUrl}/${location}?unitGroup=metric&key=${apiKey}`}
    else {url = `${serverBaseUrl}/${location}?key=${apiKey}`}
    
    try {
    let rawWeatherData = await fetch( url )
    let weatherData = await rawWeatherData.json()
    return weatherData

    } catch(error) {clog(error)}

}

const weatherToday = async function(location, selectedMetric) {
    let weatherData = await getRawWeatherData(location, selectedMetric)
    clog("🔔 Raw weatherData below: ")
    clog(weatherData)
    let data = weatherData.days[0]
    let icon = weatherData.days[0].icon
    let description = weatherData.days[0].description
    let dayConditions = weatherData.days[0].hours[dateNowHours]
    let address = weatherData.address
    return {data, icon, description, dayConditions, address }
}
// clog( weatherToday("paris").then(msg => { clog(msg.description) }) )

// clog( weatherToday("paris") ) 

const weatherTomorrow = async function(location, selectedMetric) { 
    let weatherData = await getRawWeatherData(location, selectedMetric)
    clog("🔔 Raw weatherData below: ")
    clog(weatherData)
    let data = weatherData.days[1]
    let icon = weatherData.days[1].icon
    let description = weatherData.days[1].description
    let dayConditions = weatherData.days[1].hours[dateNowHours]
    let address = weatherData.address
    return {data, icon, description, dayConditions, address}
}
// clog( weatherTomorrow("canada") )

const weatherNextComingDays = async function(days = 7, location, selectedMetric ) {
    let weatherData = await getRawWeatherData(location, selectedMetric)
    clog("🔔 Raw weatherData below: ")
    clog(weatherData)
    let tempArray = []
    let nextComingDaysData = ""
    if(days > 15 || days < 1) {
        alert("🔔 Forecast data only available for the next 15 days.")
        return
    }
    else {
        for (let i = 1; i <= days; i++) { tempArray.push( weatherData.days[i] ) }
        tempArray
        nextComingDaysData = tempArray
        clog(`🔔 Next coming days weather data array is:`)
        clog(nextComingDaysData)
    }

    return nextComingDaysData
}
// clog( weatherNextComingDays(3, "paris", "intl-metric") )

// weatherToday("paris").then(msg => { clog(msg.description) })



// DOM manipulation

const tempButton = document.querySelector(".weather-temp-intro button")
const tempDegSymbolDiv = document.querySelector(".weather-temp-div .temp-deg-symbol")

let currentMetric = "us"
let requiredConversion = false

const toCelsius = function(c){
    return (c - 32) * 5/9
}

const toFahrenheit = function(f){
    return (f * 9/5) + 32
}

const toMph = function(kmh){
    return kmh / 1.609
}

const toKmh = function(mph){
    return mph * 1.609
}

clog(toMph(4))
clog(toKmh(4))
clog( toCelsius(30) )
clog( toFahrenheit(1) )

tempButton.addEventListener("click", () => {
    requiredConversion = true
    toggleMetric()
})

let strTest = "Wind: 10.8 mph"
clog(strTest.slice(5).slice(0, -4))

const toggleMetric = function() {
    const tempNumberDiv = document.querySelector(".weather-temp-div .temp-number")
    const windSpeedDiv = document.querySelector(".weather-info-div .info3")
    
    let degNumber = Number(tempNumberDiv.textContent)
    currentMetric

    if(currentMetric === "us" && requiredConversion === false) {
        tempButton.textContent = "°F"
        tempDegSymbolDiv.textContent = "°F"
        clog("🔔 No conversion happens on page load.")
    }
    else if(currentMetric === "us" && requiredConversion === true) {
        tempButton.textContent = "°C"
        tempDegSymbolDiv.textContent = "°C"
        tempNumberDiv.textContent = toCelsius(degNumber).toFixed(0)
        let windSpeed = Number( `${windSpeedDiv.textContent.slice(6).slice(0, -4)} ` )
        windSpeedDiv.textContent = `Wind: ${ toKmh(windSpeed).toFixed(1) } km/h` 
        clog(`🔔 extracted windSpeed number is: ${windSpeed}` )
        currentMetric = "intl"
        clog("🔔 To international format (Celsius & kmh).")
    }
    else if(currentMetric === "intl" && requiredConversion === true) {
        tempButton.textContent = "°F"
        tempDegSymbolDiv.textContent = "°F"
        tempNumberDiv.textContent = toFahrenheit(degNumber).toFixed(0)
        let windSpeed = Number( `${windSpeedDiv.textContent.slice(6).slice(0, -5)} ` )
        windSpeedDiv.textContent = `Wind: ${ toMph(windSpeed).toFixed(1) } mph` 
        currentMetric = "us"
        clog("🔔 To To us format (Fahrenheit & mph).")
    }
}
toggleMetric()








const populateDisplay = async function(searchedLocation, selectedMetric){
    if (!searchedLocation) {
        clog("🔔 No search term provided!")
        return
    }
    else {
        let responseData = await weatherToday(searchedLocation)
        let city = responseData.address
        let description = responseData.description
        let tempDeg = responseData.dayConditions.temp.toFixed(0)
        clog(`🔔 tempDeg = ${tempDeg} `)
        let precipitation = responseData.dayConditions.precipprob
        let humidity = responseData.dayConditions.humidity
        let windSpeed = responseData.dayConditions.windspeed

        const cityDiv = document.querySelector(".div-right .weather-title")
        const descriptionDiv = document.querySelector(".div-right .weather-description")
        const dateDiv = document.querySelector(".div-right .weather-date")
        const tempDegDiv = document.querySelector(".div-left .temp-number")
        const info1Div = document.querySelector(".div-left .info1")
        const info2Div = document.querySelector(".div-left .info2")
        const info3Div = document.querySelector(".div-left .info3")
        
        
        cityDiv.textContent = city.slice(0, 1).toUpperCase() + city.slice(1)
        descriptionDiv.textContent = description
        dateDiv.textContent = `${getDayString()} ${dateNowHours}:00`
        tempDegDiv.textContent = tempDeg
        info1Div.textContent = `Precipitation: ${precipitation}%`
        info2Div.textContent = `Humidity: ${humidity}%` 
        info3Div.textContent = `Wind: ${windSpeed} mph`
    }
    
}

// populateDisplay("canada")

const searchInput = document.querySelector("label input")
const searchBtn = document.querySelector("label button")
clog(searchInput)

searchBtn.addEventListener("click", (e) => {
    if(searchInput.value){
        e.preventDefault()
        populateDisplay(searchInput.value)
        requiredConversion = true
        clog("🚨 Showing default unit but set requiredConversion.")
    }
    else {
        searchInput.reportValidity()
        if (!searchInput.validity.valid){
          searchInput.setCustomValidity("Please enter a city to get forecast") 
        }
    }
})


