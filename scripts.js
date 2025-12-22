const clog = console.log
clog("Welcome!")

// Code

const dateNow = new Date()
const dateNowHours = dateNow.getHours()
const dateNowDay = dateNow.getUTCDay()
dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const getDayString = function(){
    return dayArray[dateNowDay]
}

clog(dateNowDay)
clog(getDayString())

const getRawWeatherData = async function(location = "london") {
    const serverBaseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
    const apiKey = "7SZB422JF2656H4U2T3XMFNE5"
    const url = `${serverBaseUrl}/${location}?key=${apiKey}`
    
    try {
    const rawWeatherData = await fetch( url )
    const weatherData = await rawWeatherData.json()
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
    let data15Days = weatherData.days
    // clog(data15Days)
    return {data, icon, description, dayConditions, address, data15Days }
}
// clog( weatherToday("paris").then(msg => { clog(msg.description) }) )

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
// clog( weatherNextComingDays(2) )


/// DOM manipulation

const tempButton = document.querySelector(".weather-temp-intro button")
const tempDegSymbolDiv = document.querySelector(".weather-temp-div .temp-deg-symbol")

// data conversion
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

tempButton.addEventListener("click", () => {
    requiredConversion = true
    toggleMetric()
})

// let strTest = "Wind: 10.8 mph"
// clog(strTest.slice(5).slice(0, -4))


// Event listeners

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
        // clog(`🔔 tempDeg = ${tempDeg} `)
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

        /// Bottom cards

        // Looping days using "for ... loop" below
        // Will be incrementing "base" date by twentyFourHours (24h = 8.64e+7ms) each iteration 

        let twentyFourHours = 0
        for (let i = 1; i <= 8; i++) {
            twentyFourHours += 8.64e+7

            // subtracting 24h (in milliseconds) (from "base") helps starts 
            // iterating from today's date
            let base = Date.now() - 8.64e+7

            // Now ready to start incrementing.
            let currentDate = base + twentyFourHours
            let currentDateDay = new Date(currentDate).getDay()
            clog(currentDateDay)
            // Indexing div element by ids based on current (i) index
            const cardDayDiv = document.querySelector(`#weather-card${i} .day`)
            const cardTempDiv = document.querySelector(`#weather-card${i} .temp`)

            // Giving day title & temp data to div element based on "currentDateDay"
            // currentDateDay will returns successive date each iteration)
            // Each date corresponds to one of the 7 days of the week.
            cardDayDiv.textContent = `${dayArray[currentDateDay]}`
            cardTempDiv.textContent = `${responseData.data15Days[i-1].temp}°`
        }
    }
}

populateDisplay("tokyo") 

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


