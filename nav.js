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
        { label: "Acólito 1", href: "acolito-1-missa-cantada.html", blocked: true },
        { label: "Cruciferário", href: "cruciferario.html" },
        { label: "Tocheiro", href: "tocheiro.html" },
        { label: "Turiferário", href: "turiferario-missa-cantada.html", blocked: true },
        { label: "Mc", href: "mc-missa-cantada.html", blocked: true }
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
        { label: "Acólito 1 e 2", href: "missa-solene-acolitos.html", blocked: true },
        { label: "Turiferário", href: "missa-solene-turiferario.html", blocked: true },
        { label: "Mc", href: "missa-solene-mc.html" },
        { label: "Subdiácono", href: "missa-solene-subdiacono.html" },
        { label: "Diácono", href: "missa-solene-diacono.html" },
        { label: "Celebrante", href: "missa-solene-celebrante.html" }
      ]
    }
  ];

  // Tira de sprites por personagem (largura x altura de um quadro, em px).
  var WALKER_DIMS = {
    padre: [178, 199],
    acolito: [162, 198],
    vela: [142, 223],
    cruz: [136, 229],
    turiferario: [209, 199]
  };

  // Marcas da procissão: páginas onde a composição muda. Fora delas, cada
  // página herda a marca anterior na sequência (carry-forward). A última
  // figura (mais à direita) fica sob a bolinha do progresso.
  var WALKER_MARKS = {
    home: ["acolito"],
    "acolito-1-missa-rezada.html": ["acolito", "acolito"],
    "acolito-2-missa-cantada.html": ["vela", "cruz", "turiferario"],
    "tocheiro.html": ["vela", "vela", "cruz", "turiferario"],
    // O grupo "A decorar" não tem marca própria: herda o Tocheiro por
    // carry-forward, ficando igual ao Mc da Missa Cantada.
    "missa-solene-acolitos.html": ["acolito", "vela", "vela", "cruz", "turiferario"],
    "missa-solene-subdiacono.html": ["padre", "acolito", "vela", "vela", "cruz", "turiferario"]
  };

  function init() {
    var root = document.getElementById("site-header");
    if (!root) return;

    var inPages = location.pathname.indexOf("/pages/") !== -1;
    var base = inPages ? "" : "pages/";
    var indexHref = inPages ? "../index.html" : "index.html";
    var currentFile = location.pathname.split("/").pop();

    function renderItem(item) {
      var classes = ["nav-button"];
      if (!item.href || item.blocked) {
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

    // Ordered sequence of navigable resumos (items with href), in NAV_GROUPS
    // order. The home is step 0, so the first resumo is step 1.
    var order = [];
    NAV_GROUPS.forEach(function (group) {
      group.items.forEach(function (item) {
        if (item.href) order.push(item);
      });
    });

    var isHome = !inPages && (currentFile === "index.html" || currentFile === "");
    var seqIdx = -1; // position in the sequence, or -1 if outside it
    if (isHome) {
      seqIdx = 0;
    } else {
      for (var i = 0; i < order.length; i++) {
        if (order[i].href === currentFile) { seqIdx = i + 1; break; }
      }
    }

    buildProgressDot();
    buildProcession();
    buildPageNav();

    // Progress dot sliding along the header's bottom red bar: far left on the
    // home (step 0), advancing one notch per resumo up to the last one.
    function buildProgressDot() {
      if (seqIdx === -1) return;
      var frac = seqIdx / order.length;
      var dot = document.createElement("span");
      dot.className = "nav-progress-dot";
      dot.setAttribute("aria-hidden", "true");
      dot.style.left = "calc((100% - 14px) * " + frac + ")";
      root.appendChild(dot);
    }

    // Procissão pendurada logo abaixo da barra vermelha. A figura mais à
    // direita fica sob a bolinha; as demais se estendem para a esquerda.
    // A composição é a da marca mais recente na sequência (carry-forward).
    function buildProcession() {
      if (seqIdx === -1) return;

      var marks = [{ pos: 0, set: WALKER_MARKS.home }];
      order.forEach(function (item, i) {
        if (WALKER_MARKS[item.href]) marks.push({ pos: i + 1, set: WALKER_MARKS[item.href] });
      });
      marks.sort(function (a, b) { return a.pos - b.pos; });

      var set = null;
      for (var j = 0; j < marks.length; j++) {
        if (marks[j].pos <= seqIdx) set = marks[j].set; else break;
      }
      if (!set || !set.length) return;

      var assetBase = inPages ? "../assets/procissao/" : "assets/procissao/";
      var frac = seqIdx / order.length;

      var row = document.createElement("div");
      row.className = "nav-procession";
      row.setAttribute("aria-hidden", "true");
      row.innerHTML = set.map(function (slug, i) {
        var d = WALKER_DIMS[slug];
        // --ph: fase (quadro inicial/final) por figura, para a passada nunca
        // ficar em sincronia — inclusive entre as duas velas, que congelam em
        // quadros diferentes ao fim dos 7s.
        var ph = (i * 3) % 8;
        // background-image inline (não via custom property): um url() relativo
        // dentro de var() é resolvido em relação ao styles.css, não à página,
        // o que quebra o caminho nas subpáginas. Inline resolve pela página.
        return '<span class="walker" style="--fw:' + d[0] + '; --fh:' + d[1] +
          "; --ph:" + ph + "; background-image:url('" + assetBase + slug + ".png')\"></span>";
      }).join("");
      root.appendChild(row);

      // Borda direita da fila sob a bolinha, mas ancorada por `left` em px e
      // travada na margem para não transbordar pela esquerda nas páginas
      // iniciais (onde a bolinha fica junto do canto esquerdo). Recalcula no resize.
      var place = function () {
        var rootW = root.getBoundingClientRect().width;
        var dotCenter = frac * (rootW - 14) + 7;
        row.style.left = Math.max(4, dotCenter - row.offsetWidth) + "px";
      };
      place();
      window.addEventListener("resize", place);

      // Some ao rolar; reaparece no topo.
      var onScroll = function () {
        row.classList.toggle("is-hidden", (window.pageYOffset || document.documentElement.scrollTop) > 8);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // Prev/next strip: two small buttons at the top of a resumo page (including
    // the "Em breve" empty pages). The home has no page-card, so it is skipped.
    function buildPageNav() {
      var card = document.querySelector("main.content-shell > .page-card");
      if (!card) return;

      var idx = seqIdx - 1; // back to the index inside `order`
      if (idx < 0 || idx >= order.length || order[idx].href !== currentFile) return;

      var prev = idx > 0 ? order[idx - 1] : null;
      var next = idx < order.length - 1 ? order[idx + 1] : null;

      function slot(item, dir) {
        var arrow = dir === "prev"
          ? '<span class="page-nav-arrow" aria-hidden="true">&larr;</span>'
          : '<span class="page-nav-arrow" aria-hidden="true">&rarr;</span>';
        var text = dir === "prev" ? "Resumo anterior" : "Próximo resumo";
        var label = dir === "prev"
          ? arrow + '<span class="page-nav-text">' + text + "</span>"
          : '<span class="page-nav-text">' + text + "</span>" + arrow;
        if (!item) {
          return '<span class="menu-button page-nav-btn ' + dir + ' disabled" aria-disabled="true">' + label + "</span>";
        }
        return '<a class="menu-button page-nav-btn ' + dir + '" href="' + base + item.href + '" title="' + item.label + '">' + label + "</a>";
      }

      var nav = document.createElement("nav");
      nav.className = "page-nav";
      nav.setAttribute("aria-label", "Navegação entre resumos");
      nav.innerHTML = slot(prev, "prev") + slot(next, "next");
      card.parentNode.insertBefore(nav, card);
    }

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
