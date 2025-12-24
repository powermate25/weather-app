const clog = console.log
clog("menu.js")

/// Code

// This module works with 3 parameters.
// NB: Make sure parent element and it's children follow the correct hierarchy.
// Parameter 1. <menuDivElement> - Unique parent element selector, eg: <#elementID> or <.elementClass>
// Parameter 2. <menuBtnElement> - First Child as Title: div element, eg: <#elementID> or <.elementClass>
// Parameter 3. <menuListElement> - Second Child as List: ordered or Unordered List element, eg: <#elementID> or <.elementClass>



const menuDisplay = function (menuDivElement, menuBtnElement, menuListElement) {
    const menuBtn = document.querySelector(`${menuDivElement} ${menuBtnElement}`)
    const menuList = document.querySelector(`${menuDivElement} ${menuListElement}`)

    if (menuBtn && menuList) {
        const showMenuList = function () {
            menuList.style.visibility = "visible"
            menuList.style.position = "absolute"
            menuList.style.listStyle = "none"
            menuList.style.margin = "0"
            menuList.style.padding = "0"
            // menuBtn.classList.add("showing-menu") 
        }

        const hideMenuList = function () {
            menuList.style.visibility = "hidden"
            menuList.style.position = "fixed"
        }

        // Hiding menu list by default
        hideMenuList()

        // Menu list shown on menu button hover
        menuBtn.addEventListener("mouseenter", () => {
        showMenuList()
        })

        menuList.addEventListener("mouseenter", () => {
            showMenuList()
        })

        // Menu list hidden on mouse leave
        menuList.addEventListener("mouseleave", () => {
            hideMenuList()
        })

        menuBtn.addEventListener("mouseleave", () => {
            hideMenuList()
        })
        
    } else { throw new Error("🔔 Waiting for valid element selectors as function parameters") }
}

export { menuDisplay }