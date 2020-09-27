// requestAnimationFrame polyfill
(function () {
    var lastTime = 0;
    var vendors = ["ms", "moz", "webkit", "o"];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame =
            window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame =
            window[vendors[x] + "CancelAnimationFrame"] ||
            window[vendors[x] + "CancelRequestAnimationFrame"];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
})();

// conparison slider
Array.prototype.slice
    .call(document.querySelectorAll(".comparison-slider"))
    .forEach(function (element) {
        var slider = document.createElement("div");
        var resizeElement = element.getElementsByTagName("figure")[1];
        if (!resizeElement) return;
        var figcaption = {
            first: element.getElementsByTagName("figcaption")[0],
            second: element.getElementsByTagName("figcaption")[1],
        };
        var arrow = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );
        var path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        var ticking = false;
        var dragging = false;

        function slide(event) {
            if (dragging && !ticking) {
                ticking = true;
                requestAnimationFrame(function () {
                    ticking = false;

                    // sliding image
                    var clientX =
                        event.clientX !== undefined
                            ? event.clientX
                            : event.touches[0].clientX;
                    var x = clientX - element.offsetLeft;
                    var percentage = ((x / element.offsetWidth) * 10000) / 100;

                    if (percentage >= 100) {
                        percentage = 100;
                    }

                    if (percentage <= 0) {
                        percentage = 0;
                    }

                    slider.style.left = "".concat(percentage, "%");
                    resizeElement.style.width = "".concat(percentage, "%");

                    // hiding figcaption
                    if (figcaption.first) {
                        if (
                            element.offsetWidth - x <=
                            figcaption.second.offsetWidth
                        ) {
                            figcaption.first.classList.add("hide");
                        } else {
                            figcaption.first.classList.remove("hide");
                        }
                    }

                    if (figcaption.second) {
                        if (x <= figcaption.first.offsetWidth) {
                            figcaption.second.classList.add("hide");
                        } else {
                            figcaption.second.classList.remove("hide");
                        }
                    }
                });
            }
        }

        function dragStart() {
            dragging = true;
            element.classList.add("dragging");
        }

        function dragDone() {
            dragging = false;
            element.classList.remove("dragging");
        }

        slider.addEventListener("mousedown", dragStart, {
            passive: true,
        });
        slider.addEventListener("touchstart", dragStart, {
            passive: true,
        });
        element.addEventListener("mousemove", slide, {
            passive: true,
        });
        element.addEventListener("touchmove", slide, {
            passive: true,
        });
        document.addEventListener("mouseup", dragDone, {
            passive: true,
        });
        document.addEventListener("touchend", dragDone, {
            passive: true,
        });
        document.addEventListener("touchcancel", dragDone, {
            passive: true,
        });
        slider.classList.add("slider");
        arrow.setAttribute("width", "20");
        arrow.setAttribute("height", "20");
        arrow.setAttribute("viewBox", "0 0 30 30");
        path.setAttribute(
            "d",
            "M1,14.9l7.8-7.6v4.2h12.3V7.3l7.9,7.6l-7.9,7.7v-4.2H8.8v4.2L1,14.9z"
        );
        arrow.appendChild(path);
        slider.appendChild(arrow);
        element.appendChild(slider);
    });
