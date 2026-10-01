# /*

ANCIENT INDIAN YOGA STUDIO
Main Website JavaScript
=======================

Purpose:

* Mobile navigation
* Accessibility enhancements
* Current year handling
* Lightweight website interactions

This file intentionally uses plain JavaScript so that
the website remains fast, portable and easy to maintain.
========================================================

*/

"use strict";

/* =========================================================

1. MOBILE NAVIGATION
   ========================================================= */

const menuButton = document.querySelector(
'nav[aria-label="Main navigation"] > button'
);

const mainMenu = document.getElementById("main-menu");

if (menuButton && mainMenu) {

```
menuButton.addEventListener("click", function () {

    const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
    );

    if (isOpen) {

        mainMenu.style.display = "none";

    } else {

        mainMenu.style.display = "flex";

    }

});


/* =====================================================
   CLOSE MENU WITH ESCAPE KEY
   ===================================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        const isOpen =
            menuButton.getAttribute("aria-expanded") === "true";

        if (isOpen) {

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            mainMenu.style.display = "none";

            menuButton.focus();

        }

    }

});


/* =====================================================
   CLOSE MOBILE MENU AFTER LINK SELECTION
   ===================================================== */

const menuLinks = mainMenu.querySelectorAll("a");

menuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        mainMenu.style.display = "none";

    });

});
```

}

/* =========================================================
2. RESPONSIVE MENU RESET
========================

When the browser returns to desktop width, the navigation
should automatically become visible again.
========================================================= */

function resetNavigationForDesktop() {

```
if (!menuButton || !mainMenu) {
    return;
}

if (window.innerWidth > 900) {

    mainMenu.style.display = "flex";

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

} else {

    mainMenu.style.display = "none";

}
```

}

window.addEventListener(
"resize",
resetNavigationForDesktop
);

resetNavigationForDesktop();

/* =========================================================
3. CURRENT YEAR
========================================================= */

const currentYearElements =
document.querySelectorAll("[data-current-year]");

currentYearElements.forEach(function (element) {

```
element.textContent =
    new Date().getFullYear();
```

});

/* =========================================================
4. EXTERNAL / NEW-TAB SAFETY
============================

Any future link using target="_blank" receives the
appropriate relationship automatically.
========================================================= */

const externalLinks =
document.querySelectorAll(
'a[target="_blank"]'
);

externalLinks.forEach(function (link) {

```
const existingRel =
    link.getAttribute("rel") || "";

const relValues =
    existingRel
        .split(" ")
        .filter(Boolean);

if (!relValues.includes("noopener")) {
    relValues.push("noopener");
}

if (!relValues.includes("noreferrer")) {
    relValues.push("noreferrer");
}

link.setAttribute(
    "rel",
    relValues.join(" ")
);
```

});

/* =========================================================
5. ACCESSIBILITY: BUTTON KEYBOARD SUPPORT
========================================================= */

if (menuButton) {

```
menuButton.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            menuButton.click();

        }

    }
);
```

}

/* =========================================================
6. INITIAL PAGE STATE
========================================================= */

document.documentElement.classList.add(
"js-enabled"
);

/* =========================================================
7. FUTURE EXPANSION AREA
========================

Future versions may add:

* Class schedule filtering
* Yoga learning progress
* FAQ accordions
* Gallery controls
* Video controls
* Language switching
* Teacher resources
* Search functionality
* Accessible dialogs
* Theme preferences

These will be added only when the corresponding
website features are created.
========================================================= */

/* =========================================================
END OF SCRIPT
========================================================= */
