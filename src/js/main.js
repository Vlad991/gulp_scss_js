import {domLoaded, el} from "./functions.js";

domLoaded( function () {
    const testWebP = (callback) => {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height === 2);
        };
        webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
    }

    testWebP((support) => {
        if (support === true) {
            document.querySelector('body').classList.add('webp');
        } else {
            document.querySelector('body').classList.add('no-webp');
        }
    });

    el('.container__anchor').on('click', function (e) {
        e.preventDefault();
        let speed = 0.1;
        let w = window.pageYOffset;
        let top = document.querySelector('#anchor-link').getBoundingClientRect().top;
        let start = null;
        requestAnimationFrame(step);

        function step(time) {
            if (start === null) start = time;
            let progress = time - start,
                r = (top < 0 ? Math.max(w - progress / speed, w + top) : Math.min(w + progress / speed, w + top));
            window.scrollTo(0, r);
            if (r !== w + top) {
                requestAnimationFrame(step);
            } else {
                location.hash = '#anchor-link';
            }
        }
    }, false);
});