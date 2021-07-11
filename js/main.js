document.querySelectorAll(".comparison-slider").forEach((element) => {
    const slider = document.createElement("div");
    const resizeElement = element.getElementsByTagName("figure")[1];
    if (!resizeElement) return;
    const captions = [
        element.getElementsByTagName("figcaption")[0],
        element.getElementsByTagName("figcaption")[1],
    ];
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    let ticking = false;

    const slide = (event) => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;

                // sliding image
                const clientX = event.clientX ?? event.touches[0].clientX;
                const x = clientX - element.offsetLeft;
                let percentage = ((x / element.offsetWidth) * 10000) / 100;

                if (percentage >= 100) {
                    percentage = 100;
                }
                if (percentage <= 0) {
                    percentage = 0;
                }

                slider.style.left = `${percentage}%`;
                resizeElement.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;

                // hiding figcaption
                if (captions[0]) {
                    if (x <= captions[0].offsetWidth) {
                        captions[0].classList.add("hide");
                    } else {
                        captions[0].classList.remove("hide");
                    }
                }

                if (captions[1]) {
                    if (element.offsetWidth - x <= captions[1].offsetWidth) {
                        captions[1].classList.add("hide");
                    } else {
                        captions[1].classList.remove("hide");
                    }
                }
            });
        }
    };
    const dragStart = () => {
        element.addEventListener("mousemove", slide, { passive: true });
        element.addEventListener("touchmove", slide, { passive: true });
        element.classList.add("dragging");
    };
    const dragDone = () => {
        element.removeEventListener("mousemove", slide);
        element.removeEventListener("touchmove", slide);
        element.classList.remove("dragging");
    };

    slider.addEventListener("mousedown", dragStart, { passive: true });
    slider.addEventListener("touchstart", dragStart, { passive: true });

    document.addEventListener("mouseup", dragDone, { passive: true });
    document.addEventListener("touchend", dragDone, { passive: true });
    document.addEventListener("touchcancel", dragDone, { passive: true });

    slider.classList.add("slider");
    arrow.setAttribute("width", "20");
    arrow.setAttribute("height", "20");
    arrow.setAttribute("viewBox", "0 0 30 30");
    path.setAttribute(
        "d",
        "M1,14.9l7.8-7.6v4.2h12.3V7.3l7.9,7.6l-7.9,7.7v-4.2H8.8v4.2L1,14.9z"
    );
    arrow.append(path);
    slider.append(arrow);

    element.append(slider);
});
