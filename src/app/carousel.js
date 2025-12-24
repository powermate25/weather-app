const mainFrame = document.querySelector(".main-frame")
const slidesContainer = document.querySelector(".slides-container")

const clog = console.log

// Code

const allCarouselSlides = document.querySelectorAll(".slides-container img")
let baseSlideIndex = 1
let nextSlideIndex

// Technically this the carousel logic right below (initSlideShow).

const initSlideShow = function (slideIndex) {
    let slideToShow = document.querySelector(`.slides-container #slide${slideIndex}`)
    allCarouselSlides.forEach( i => {
    if(i.id !== slideToShow.id ){ i.style.display = "none"}
    else { i.style.display = "block" }
    })
    
}
initSlideShow(baseSlideIndex)

// Logic to navigate the slides using initSlideShow function.

const nextCarousel = function () {

    console.log(`🔔 Carousel show running! Previous slide index is: ${baseSlideIndex}`)
    let totalSlides = allCarouselSlides.length
    nextSlideIndex = ++baseSlideIndex

    // Checking nextIndex to show against total carousel length first.
    if ( nextSlideIndex === (totalSlides + 1) ){
        clog (`🚨 End of carousel now reached!`)
        clog (`🚨 Next Slide would be: ${nextSlideIndex}. but total carousel is: ${totalSlides}`)
        clog (`🔄 Will now loop.`)
        nextSlideIndex = 1
        baseSlideIndex = 1
    }
    // Executing next slide show
    if (nextSlideIndex <= totalSlides){
        initSlideShow(nextSlideIndex)
        const clickedNavCircle = document.querySelector(`.nav-circle #slide${nextSlideIndex}`)
        clickedNavCircle.click()
        clog(`🔔 Showing index No: ${nextSlideIndex}`)
    }  
    
}

const previousCarousel = function () {

    console.log(`🔔 Carousel show running! Previous slide index is: ${baseSlideIndex}`)
    const allCarouselImages = document.querySelectorAll(".slides-container img")
    let totalSlides = allCarouselImages.length
    let previousSlideIndex = --baseSlideIndex

    if (previousSlideIndex === 0){
        clog (`🚨 Beginning of carousel now reached!`)
        clog (`🚨 Previous Slide would be: ${previousSlideIndex}. But slide show only starts at 1`)
        clog (`🔄 Will now loop back.`)
        previousSlideIndex = totalSlides
        baseSlideIndex = totalSlides
    } 
    if (previousSlideIndex <= totalSlides) {
        initSlideShow(previousSlideIndex)
        const clickedNavCircle = document.querySelector(`.nav-circle #slide${previousSlideIndex}`)
        clickedNavCircle.click()
        clog(`🔔 Showing index No: ${previousSlideIndex}`)
    }
}

// Linking bottom circles to slideShow navigation
const carouselNavCircles = document.querySelectorAll(".nav-circle .slide-link")

const linkCarouselSlidesToCircle = function () {
    carouselNavCircles.forEach( i => {
        const linkedSlide = document.querySelector(`.slides-container #${i.id}`)
        i.addEventListener("click", (e) => {
            for (let circle in carouselNavCircles){
                let linkCircle = carouselNavCircles[circle]
                clog(linkCircle.id)
                if (linkCircle.id && e.target.id === linkCircle.id ){
                linkCircle.style.backgroundColor = "black"
                // Extracting index number from id and Executing slideShow
                initSlideShow( linkedSlide.id.slice(-1) )
                }
                else if (linkCircle.id) { linkCircle.style.backgroundColor = "#bebebe" }
            }
            let circleIndex = Number ( i.id.slice(-1) ) 
            baseSlideIndex = circleIndex
            clog(`🔔 Linked circle No:${baseSlideIndex} clicked! Now showing linked slide`)
        })
    })
}

linkCarouselSlidesToCircle()

// Linking baseSlideIndex to corresponding circle by default
const clickedCircle = document.querySelector(`.nav-circle #slide${baseSlideIndex}`)
clickedCircle.click()

/// Exporting
export { nextCarousel, previousCarousel }