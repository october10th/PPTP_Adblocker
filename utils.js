// sets logging level
var VERBOSE = false

if (typeof NON_ENGLISH_LOCALE === 'undefined') {
    var NON_ENGLISH_LOCALE = false
}

// return whether the container is already covered
function alreadyCovered(container) {
    return (container.find(".PPTP_adBlockerCover").length > 0)
}

// true if we want to overlay non-ads as well
var showNonAd = false;

// return whether the container is already covered by the same type
// of container. That is, if there is already an ad or non-ad container
// we don't want to ad a container of a new type, but if an adchoices
// icon has been added and it changed from non-ad to ad, we do want
// to update.
function alreadyCoveredSameType(container, newCoverIsAd) {
    var alreadyCovered = (container.find(".PPTP_adBlockerCover").length > 0)
    var alreadyAd = (container.find(".PPTP_isAnAd").length > 0)
    return alreadyCovered && (alreadyAd || !newCoverIsAd)
}

// Add a cover with "THIS IS AN AD" and the "Sponsored" text in the given
// locale's language (if non-english).
// container is the container to cover.
// coverText is the text to show on the cover
// matchingText only has a value if we are on Facebook in a non-english locale.
// deepestOnly is true if we only want to include the deepest cover for this
// area.
// isAd is true if it is an ad
// hasInterval is true if there is an interval check associated with this cover
// intervalID is the id of that interval
function coverContainer(container, coverText, matchingText, deepestOnly, isAd, hasInterval, intervalID) {
    // if we aren't doing anything to non-ads and this isn't an ad, do nothing.
    if (!isAd && !showNonAd) {
        return false
    }

    // don't cover if this container is already covered;
    if (alreadyCoveredSameType(container, false)) {
        return false
    }

    // remove any existing covers (if we are moving from non-ad to ad)
    container.find(".PPTP_adBlockerCover").remove()

    // vary the color and classes based on whether this is an ad or not.
    var color
    var classes = "PPTP_adBlockerCover"
    if (isAd) {
        if (showNonAd) {
            color = "rgba(255, 0, 0, 0.8)"
        } else {
            color = "rgba(255, 255, 255, 0.8)"
        }
        classes += " PPTP_isAnAd"
    } else {
        color = "rgba(255, 255, 255, 0.8)"
    }

    // some google ads have a height of 0 and then everything in overflow,
    // so if that is the case set the height of the cover to be the overflow
    // height.
    var setHeight
    var containerHeight = container.height()
    var containerScrollHeight = container.prop('scrollHeight')
    if (containerHeight == 0 && containerScrollHeight > 0) {
        setHeight = containerScrollHeight + "px"
    } else {
        setHeight = "100%"
    }

    // images
    var imageSrcs = [
        "https://pbs.twimg.com/media/DRFcbJhVoAY6T77.jpg", // POP w
        "https://pbs.twimg.com/media/DQ2WFD-VwAE0rE9.jpg", // DVD vol.1
        "https://pbs.twimg.com/media/DQ2WFECVwAEVvqo.jpg", // BD  vol.1
        "https://pbs.twimg.com/media/DTVKzXPU8AA2JUQ.jpg", // shop 2nd season
        "https://pbs.twimg.com/media/DESeFnBVYAApYEF.jpg", // shop
        "https://pbs.twimg.com/media/DESd43RVYAAIiYC.jpg", // sit
        "https://pbs.twimg.com/media/DTFh5QrU8AAjKId.jpg", // POP  凸
        "https://pbs.twimg.com/media/DTFh5QqV4AAYrB1.jpg", // PIPI 凸
        "https://pbs.twimg.com/media/DCsMgrzVwAAswg0.jpg", // POP  < o w o >
        "https://pbs.twimg.com/media/DCsMgtQUIAAQTpq.jpg", // PIPI \ o w o /
        "https://pbs.twimg.com/media/C_N3IyIUwAAk9Bu.jpg", // POP PIPI
        "https://pbs.twimg.com/media/C8VhpcMVYAQugj7.jpg", // PIPI / o w o \
        "https://pbs.twimg.com/media/C8VhilbU0AEzsdG.jpg", // POP  / o w o \
        "https://pbs.twimg.com/media/C8VfhXbUMAQbOgs.jpg", // snow
        "https://pbs.twimg.com/media/DTvfza4VAAE8u8h.jpg", // scramble
        "https://pbs.twimg.com/media/DTvf2MeUQAEoVlE.jpg", // ball
        "https://pbs.twimg.com/media/DP8GNcwVQAAKX6b.jpg", // wafuku
        "https://pbs.twimg.com/media/DBHrxjQWAAAypme.jpg", // start
        "https://pbs.twimg.com/media/DUdJkYjU0AAHJO1.jpg", // knife
        "https://pbs.twimg.com/media/DU4NKDYU8AEvmsO.jpg", // PIPI melt
        "https://pbs.twimg.com/media/DVsAg08VMAAWUQY.jpg", // DVD vol.2
        "https://pbs.twimg.com/media/DVsAg1AVAAA-5fJ.jpg", // BD vol.2
        "https://pbs.twimg.com/media/DV6h048UQAAJ66G.jpg", // [5-3] ポプテピピック シーズン3【5】
        "https://pbs.twimg.com/media/DV_M1UYVMAEqfRf.jpg", // [5-4] ポプテピピック シーズン3【5】
        "https://pbs.twimg.com/media/DXYJ9vYVQAAzFAY.jpg", // OST
        "https://pbs.twimg.com/media/DXPtNv2VwAAe4-E.jpg", // みんなくそ。
        "https://pbs.twimg.com/media/DX8M9OzU8AA6iK-.jpg", // BD vol.3
        "https://pbs.twimg.com/media/DX8M9O1VoAAcpll.jpg", // DVD vol.3
        "https://pbs.twimg.com/media/DYgTqiyU8AA1CDl.jpg"  // ボブネミミッミ



    ];
    imgSrc = imageSrcs[Math.floor(Math.random() * imageSrcs.length)]

    // create the cover to prepend.
    var prepend = "<div class=\"" + classes + "\" style=\"height: " + setHeight + ";position: absolute;width: 100%; color:white; background-color: " + color + " !important; opacity: 0.95; z-index: 100; visibility: visible; display:flex; display:flex; flex-direction:column; justify-content:center; align-items:center; flex-wrap:nowrap; overflow: hidden;\">"
    prepend += "<div id=\"PPTP_filter\" style=\"position: absolute;height:100%; width:100%; background-image: url(" + imgSrc + "); background-position: center; background-size:cover; background-color:rgba(0,0,0,0.3); display:flex;\">"
    prepend += "</div>"
    prepend += "<style>#PPTP_filter{filter:brightness(0.9);} #PPTP_filter:hover{opacity:0.7;filter:blur(7px) brightness(0.4);}</style>"
    prepend += "<div class=\"PPTP_closeButton\" style=\"position: absolute; right: 5px; top: 5px; cursor: pointer; padding: 0px 3px; border: 1px solid black; border-radius: 5px\">"
    prepend += "<strong>"
    prepend += "X"
    prepend += "</strong>"
    prepend += "</div>"
    prepend += "<div style=\"position: absolute; width: 100%; text-align:center;\">"
    prepend += "<span style=\"font-size:40px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black !important;\">"
    prepend += "怒った？"
    prepend += "</span>"
    prepend += "<br/>"
        // if we have "Sponsored" text in another language, add it below "THIS IS AN AD"
    if (NON_ENGLISH_LOCALE && matchingText !== "") {
        if (matchingText == "贊助") {
            prepend += "<br/>"
            prepend += "<span style=\"font-size:30px; font-weight:bold; letter-spacing: 30px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black !important; \">"
            prepend += "提供"
            prepend += "</span>"
            prepend += "<br/>"
            prepend += "<br/>"
            prepend += "<span style=\"font-size:30px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black !important; \">"
            prepend += "Facebook 粉絲專頁贊助"
            prepend += "</span>"
        } else {
            prepend += "<br/>"
            prepend += "<span style=\"font-size:40px; letter-spacing: 15px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;\">"
            prepend += matchingText
            prepend += "</span>"
        }
    }
    prepend += "</div>"
    prepend += "</div>"
    var myPrepend = prepend
        // if we only want the deepest, remove any above this
    if (deepestOnly) {
        container.parents().each(function(index) {
            $(this).children(".PPTP_adBlockerCover").remove()
        })
    }
    // if we only want the deepest covers and there is a cover within
    // this container already, don't ad this cover.
    if (!deepestOnly || !(container.find(".PPTP_adBlockerCover").length > 0)) {
        // prepend the cover
        container.css("position", "relative")
        container.prepend(myPrepend)

        // make sure the close button closes the cover
        container.children().children(".PPTP_closeButton").on("click", function() {
            container.children(".PPTP_adBlockerCover").css("visibility", "hidden")
        });
    }


    // if this is an ad and we have an interval, stop the search for ads.
    if (hasInterval && isAd) {
        clearInterval(intervalID)
    }
}