import "./styles.css";
import { format } from "date-fns";
import { menuDisplay } from "./app/menu.js"
import { nextCarousel } from "./app/carousel.js"
import { previousCarousel } from "./app/carousel.js"

if (process.env.NODE_ENV !== 'production') { console.log('Looks like we are in development mode!') }

const clog = console.log
clog("Welcome!")

/// Drop-down menu

menuDisplay(".menuItem1", ".title", "ul")
menuDisplay(".menuItem2", ".title", "ul")
menuDisplay(".menuItem3", ".title", "ul")


// Image Carousel

const nextShowBtn = document.querySelector(".main-frame #nav-right")
nextShowBtn.addEventListener("click", () => {
    nextCarousel()
}) 

const previousShowBtn = document.querySelector(".main-frame #nav-left")
previousShowBtn.addEventListener("click", () => {
    previousCarousel()
})

// Advancing carousel every 5 secondes
setInterval( () => { nextCarousel() }, 5000 );
