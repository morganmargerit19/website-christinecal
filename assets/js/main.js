(function () {
    "use strict";

    // Dissuasion: bloque le menu contextuel SUR LES IMAGES uniquement
    // (clic-droit "Enregistrer l'image sous…"). Le reste du site conserve
    // le clic-droit normal pour ne pas frustrer les visiteurs légitimes.
    document.addEventListener("contextmenu", function (e) {
        if (e.target && e.target.tagName === "IMG") {
            e.preventDefault();
        }
    });

    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            const open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(open));
        });

        nav.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () {
                if (window.matchMedia("(max-width: 880px)").matches) {
                    nav.classList.remove("is-open");
                    toggle.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    const videoPlaceholders = document.querySelectorAll(".video-placeholder[data-youtube]");
    videoPlaceholders.forEach(function (el) {
        el.addEventListener("click", function () {
            const id = el.dataset.youtube;
            if (!id) return;
            const iframe = document.createElement("iframe");
            iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
            iframe.title = el.dataset.title || "Vidéo";
            iframe.loading = "lazy";
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            el.replaceWith(iframe);
        });
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                el.click();
            }
        });
    });
})();
