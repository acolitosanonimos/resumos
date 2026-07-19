(function () {
  var NAV_GROUPS = [
    {
      title: "Missa Rezada",
      items: [
        { label: "Acólito 2", href: "acolito-2-missa-rezada.html" },
        { label: "Acólito 1", href: "acolito-1-missa-rezada.html" },
        { label: "Acólito Sozinho", href: "manual-missa-rezada.html" }
      ]
    },
    {
      title: "Missa Cantada",
      items: [
        { label: "Acólito 2", href: "acolito-2-missa-cantada.html" },
        { label: "Acólito 1" },
        { label: "Cruciferário", href: "cruciferario.html" },
        { label: "Tocheiro", href: "tocheiro.html" },
        { label: "Turiferário" },
        { label: "Mc" }
      ]
    },
    {
      title: "A decorar",
      items: [
        { label: "Orações a decorar", href: "oracoes-a-decorar.html" },
        { label: "Oração da Arquiconfraria", href: "oracao-arquiconfraria.html" },
        { label: "4 regras & 4 recomendações", href: "regras-recomendacoes.html" }
      ]
    },
    {
      title: "Missa Solene",
      items: [
        { label: "Padre" },
        { label: "Diácono" },
        { label: "Subdiácono" },
        { label: "Mc" },
        { label: "Acólitos e Tf" }
      ]
    }
  ];

  function init() {
    var root = document.getElementById("site-header");
    if (!root) return;

    var inPages = location.pathname.indexOf("/pages/") !== -1;
    var base = inPages ? "" : "pages/";
    var indexHref = inPages ? "../index.html" : "index.html";
    var currentFile = location.pathname.split("/").pop();

    function renderItem(item) {
      var classes = ["nav-button"];
      if (!item.href) {
        classes.push("disabled");
        return '<span class="' + classes.join(" ") + '" aria-disabled="true" title="Em breve">' + item.label + "</span>";
      }
      if (item.href === currentFile) classes.push("active");
      var href = base + item.href;
      return '<a class="' + classes.join(" ") + '" href="' + href + '">' + item.label + "</a>";
    }

    var linksHtml = NAV_GROUPS.map(function (group) {
      return '<h2 class="nav-group-title">' + group.title + "</h2>" + group.items.map(renderItem).join("");
    }).join("");
    var logoHref = base === "pages/" ? "aa.png" : "../aa.png";

    root.innerHTML =
      '<div class="header-inner">' +
        '<button type="button" class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-drawer" aria-label="Abrir menu">' +
          '<span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>' +
        "</button>" +
        '<a class="brand" href="' + indexHref + '">' +
          '<img class="brand-logo" src="' + logoHref + '" alt="Acólitos Anônimos" width="40" height="40">' +
          '<span class="brand-text">Resumos <small>Acólitos Anônimos</small></span>' +
        "</a>" +
        '<span class="nav-spacer" aria-hidden="true"></span>' +
      "</div>";

    // Rendered outside #site-header: the header's backdrop-filter creates a
    // new containing block, which would clip fixed-position descendants to
    // the header's own box instead of the viewport.
    var overlayHost = document.createElement("div");
    overlayHost.innerHTML =
      '<div class="nav-overlay" id="nav-overlay" hidden></div>' +
      '<aside class="nav-drawer" id="nav-drawer" aria-label="Menu" aria-hidden="true">' +
        '<div class="nav-drawer-head">' +
          '<a class="brand" href="' + indexHref + '">' +
            '<img class="brand-logo" src="' + logoHref + '" alt="Acólitos Anônimos" width="32" height="32">' +
            '<span class="brand-text">Resumos <small>Acólitos Anônimos</small></span>' +
          "</a>" +
          '<button type="button" class="nav-close" id="nav-close" aria-label="Fechar menu">&times;</button>' +
        "</div>" +
        '<nav class="drawer-nav" aria-label="Menu principal">' + linksHtml + "</nav>" +
      "</aside>";
    while (overlayHost.firstChild) {
      document.body.appendChild(overlayHost.firstChild);
    }

    var toggle = document.getElementById("nav-toggle");
    var closeBtn = document.getElementById("nav-close");
    var drawer = document.getElementById("nav-drawer");
    var overlay = document.getElementById("nav-overlay");
    var hideOverlayTimer = null;

    function onKeydown(e) {
      if (e.key === "Escape") closeDrawer();
    }

    function openDrawer() {
      clearTimeout(hideOverlayTimer);
      overlay.hidden = false;
      requestAnimationFrame(function () {
        drawer.classList.add("open");
        overlay.classList.add("open");
      });
      drawer.setAttribute("aria-hidden", "false");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }

    function closeDrawer() {
      drawer.classList.remove("open");
      overlay.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKeydown);
      toggle.focus();
      hideOverlayTimer = setTimeout(function () {
        overlay.hidden = true;
      }, 320);
    }

    toggle.addEventListener("click", function () {
      if (drawer.classList.contains("open")) closeDrawer();
      else openDrawer();
    });
    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);
    drawer.querySelectorAll("a.nav-button").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
