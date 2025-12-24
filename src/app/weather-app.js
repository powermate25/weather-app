const clog = console.log


/// Code


if (process.env.NODE_ENV !== 'production') { console.log('Looks like we are in development mode!') }

// Code

const dateNow = new Date()
const dateNowHours = dateNow.getUTCHours()
const dateNowDay = dateNow.getUTCDay()
const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const getDayString = function(){
    return dayArray[dateNowDay]
}

clog(dateNowDay)
clog(getDayString())

const getRawWeatherData = async function(location = "london") {
    skeletonLoadingBegins()
    const serverBaseUrl = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline"
    const apiKey = "7SZB422JF2656H4U2T3XMFNE5"
    const url = `${serverBaseUrl}/${location}?key=${apiKey}`
    
    try {
    const rawWeatherData = await fetch( url )
    const weatherData = await rawWeatherData.json()
    skeletonLoadingEnds()
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
    clog(dayConditions)
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

// weatherToday("paris").then(msg => { clog(msg.description) })

/// DOM manipulation

// Function to start skeleton loading by adding "skeleton" classes to group
// Skeleton are always enabled  on page load by default at css (animation)

function skeletonLoadingBegins() {
    
    const allLoadingDivBg = document.querySelectorAll(".container-top, .div-right, .container-body ")
    const allLoadingDiv = document.querySelectorAll(".div-left")

    allLoadingDivBg.forEach(i => {
        i.classList.add("loading-div-bg")
    })

    allLoadingDiv.forEach(i => {
        i.classList.add("loading-div")
    })
}

// Function to stop skeleton loading by removing "skeleton" classes from group

 function skeletonLoadingEnds() {
    // grouping divs by classes
    const allLoadingDivBg = document.querySelectorAll(".container-top, .div-right, .container-body ")
    const allLoadingDiv = document.querySelectorAll(".div-left")

    allLoadingDivBg.forEach(i => {
        i.classList.remove("loading-div-bg")
    })

    allLoadingDiv.forEach(i => {
        i.classList.remove("loading-div")
    })
}

// Will disable skeleton only if weather data become available


// Data conversion

const tempButton = document.querySelector(".weather-temp-intro button")
const tempDegSymbolDiv = document.querySelector(".weather-temp-div .temp-deg-symbol")

let currentMetric = "intl"

function toCelsius(f) {
    return (f - 32) * 5/9
}

function toFahrenheit(c) {
    return (c * 9/5) + 32
}

function toMph(kmh) {
    return kmh / 1.609
}

function toKmh(mph) {
    return mph * 1.609
}

tempButton.addEventListener("click", () => {
    toggleMetric()
})

// let strTest = "Wind: 10.8 mph" 
// clog(strTest.slice(5).slice(0, -4))


// Event listeners

function toggleMetric() {
    const tempNumberDiv = document.querySelector(".weather-temp-div .temp-number")
    const windSpeedDiv = document.querySelector(".weather-info-div .info3")
    
    let degNumber = Number(tempNumberDiv.textContent)
    clog(`🚨 CurrentMetric = ${currentMetric}`)
    if (currentMetric === "us") {
        tempButton.textContent = "°C"
        tempDegSymbolDiv.textContent = "°C"
        tempNumberDiv.textContent = toCelsius(degNumber).toFixed(0)
        let windSpeed = Number( `${windSpeedDiv.textContent.slice(6).slice(0, -4)} ` )
        windSpeedDiv.textContent = `Wind: ${ toKmh(windSpeed).toFixed(1) } km/h` 
        clog(`🔔 extracted windSpeed number is: ${windSpeed}` )
        currentMetric = "intl"
        clog("🔔 Converted to international format (Celsius & kmh).")
    }
    else if(currentMetric === "intl") {
        tempButton.textContent = "°F"
        tempDegSymbolDiv.textContent = "°F"
        tempNumberDiv.textContent = toFahrenheit(degNumber).toFixed(0)
        let windSpeed = Number( `${windSpeedDiv.textContent.slice(6).slice(0, -5)} ` )
        windSpeedDiv.textContent = `Wind: ${ toMph(windSpeed).toFixed(1) } mph` 
        currentMetric = "us"
        clog("🔔 Converted to us format (Fahrenheit & mph).")
    }
    
}


const populateDisplay = async function(searchedLocation, selectedMetric){
    if (!searchedLocation) {
        clog("🔔 No search term provided!")
        return
    }
    else {
        const cityDiv = document.querySelector(".div-right .weather-title")
        const descriptionDiv = document.querySelector(".div-right .weather-description")
        const dateDiv = document.querySelector(".div-right .weather-date")
        const tempDegDiv = document.querySelector(".div-left .temp-number")
        const tempDegSymbolDiv = document.querySelector(".div-left .temp-deg-symbol")
        const tempDegBtnDiv = document.querySelector(".weather-temp-intro button")
        const info1Div = document.querySelector(".div-left .info1")
        const info2Div = document.querySelector(".div-left .info2")
        const info3Div = document.querySelector(".div-left .info3")
        
        let responseData = await weatherToday(searchedLocation)

        const getWeatherIcon = async function() {
            let fileName = responseData.dayConditions.icon 
            if(fileName === "fog" || fileName === "thunder" ){
                fileName = await import(`./images/icons/${fileName}.png`)
                return {fileName}
            }
            else { 
                fileName = await import(`./images/icons/${fileName}.svg`)
                return {fileName} }
        }
        
        await getWeatherIcon().then(msg => clog(msg.fileName.default))
        const weatherIconDiv = document.querySelector(".weather-now-div .weather-now-icon")
        const weatherIconPath = await getWeatherIcon().then(msg => msg.fileName.default)
        weatherIconDiv.setAttribute("src", `${weatherIconPath}`)

        let city = responseData.address
        let description = responseData.description
        let degUsFormat = responseData.dayConditions.temp.toFixed(0)
        let windSpeedUsFormat = responseData.dayConditions.windspeed.toFixed(1)
        let precipitation = responseData.dayConditions.precipprob
        let humidity = responseData.dayConditions.humidity
        // Converting data based on user settings
        let tempDeg
        let windSpeed
        if (currentMetric === "intl") {
            clog("🔔 Pre-converting data to intl format")
            tempDeg = toCelsius(degUsFormat).toFixed(0)
            windSpeed =  toKmh(windSpeedUsFormat).toFixed(1)
            tempDegSymbolDiv.textContent = "°C"
            tempDegBtnDiv.textContent = "°C"
            info3Div.textContent = `Wind: ${windSpeed} km/h`
        } 
        else if (currentMetric === "us") {
            clog("🔔 Pre-converting data to us format")
            clog(degUsFormat)
            tempDeg = degUsFormat
            windSpeed = windSpeedUsFormat
            tempDegSymbolDiv.textContent = "°F"
            tempDegBtnDiv.textContent = "°F"
            info3Div.textContent = `Wind: ${windSpeed} mph`
        }
        
        cityDiv.textContent = city.slice(0, 1).toUpperCase() + city.slice(1)
        descriptionDiv.textContent = description
        dateDiv.textContent = `${getDayString()} ${dateNowHours}:00`
        tempDegDiv.textContent = tempDeg
        info1Div.textContent = `Precipitation: ${precipitation}%`
        info2Div.textContent = `Humidity: ${humidity}%` 
        
        // Dynamic Background-images
        const backgroundDiv = document.querySelector("body")
        let bgImage = await import(`./images/bg/${responseData.dayConditions.icon}.jpg`)
        clog(bgImage)
        const bgImageFile = bgImage.default
        backgroundDiv.style.cssText = `background-image: url("${bgImageFile}");`
        clog(backgroundDiv.style.backgroundImage)

        /// Bottom cards

        // Looping days using "for ... loop" below
        // Will be incrementing "base" date by 
        // twentyFourHours (24h = 8.64e+7ms) each iteration 

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
            const cardIconDiv = document.querySelector(`#weather-card${i} .icon`)
            const cardTempDiv = document.querySelector(`#weather-card${i} .temp`)

            // Giving day title & temp data to div element based on "currentDateDay"
            // currentDateDay will returns successive date each iteration)
            // Each date corresponds to one of the 7 days of the week.
            cardDayDiv.textContent = `${dayArray[currentDateDay]}`
            cardTempDiv.textContent = `${responseData.data15Days[i-1].temp}°F`

            const getNextDayIcon = async function() {
                let fileName = responseData.data15Days[i-1].icon 
                if(fileName === "fog" || fileName === "thunder" ){
                    fileName = await import(`./images/icons/${fileName}.png`)
                    return fileName
                }
                else { 
                    fileName = await import(`./images/icons/${fileName}.svg`)
                    return fileName
                }
            }
            const nextDayIconPath = await getNextDayIcon().then(msg => msg.default)
            cardIconDiv.setAttribute("src", `${nextDayIconPath}` ) 
        }
    }
}


// Search functionalities

const searchInput = document.querySelector("label input")
const searchBtn = document.querySelector("label button")

searchBtn.addEventListener("click", (e) => {
    if (searchInput.value){
        e.preventDefault()
        populateDisplay(searchInput.value)
    }
    else {
        searchInput.reportValidity()
        if (!searchInput.validity.valid){
          searchInput.setCustomValidity("Please enter a city to get forecast") 
        }
    }
})

// Loading page by default with live weather data
populateDisplay("tokyo") 
// skeletonLoadingEnds()
