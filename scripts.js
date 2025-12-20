const clog = console.log
clog("Welcome!")

// Code

const getRawWeatherData = async function(location = "london") {
    try {
    let rawWeatherData = await fetch( `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=7SZB422JF2656H4U2T3XMFNE5` )
    let weatherData = await rawWeatherData.json()
    return weatherData

    } catch(error) {clog(error)}

}

const weatherToday = async function(location, extraInfo) {
    let weatherData = await getRawWeatherData(location)
    clog("🔔 Raw weatherData below: ")
    clog(weatherData)
    let data = weatherData.days[0]
    let icon = weatherData.days[0].icon
    let description = weatherData.days[0].description
    this.extraInfo = weatherData.days[0].extraInfo
    return {data, icon, description, extraInfo}
}
// clog( weatherToday("paris").then(msg => { clog(msg.description) }) )
// clog( weatherToday("paris") )

const weatherTomorrow = async function(location, extraInfo) { 
    let weatherData = await getRawWeatherData(location)
    clog("🔔 Raw weatherData below: ")
    clog(weatherData)
    let data = weatherData.days[1]
    let icon = weatherData.days[1].icon
    let description = weatherData.days[1].description
    this.extraInfo = weatherData.days[1].extraInfo
    return {data, icon, description, extraInfo}
}
// clog( weatherTomorrow("canada") )

const weatherNextComingDays = async function(days = 7, location ) {
    let weatherData = await getRawWeatherData(location)
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
//clog( weatherNextComingDays(0, "paris") )

// clog( weatherToday("paris") )

// weatherToday("paris").then(msg => { clog(msg.description) })



//clog ( getRawWeatherData() )

