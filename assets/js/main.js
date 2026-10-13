(function () {
  "use strict";

  /* ------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Timeline chart (home page hero)
     Months are counted from January of START_YEAR. Months are 0-based,
     and "end" is the first month AFTER the period (exclusive).
     ------------------------------------------------------------------ */
  var timeline = document.getElementById("timeline");

  if (timeline) {
    var START_YEAR = 2020;
    var now = new Date();
    var endYear = now.getFullYear() + 1;
    var total = (endYear - START_YEAR) * 12;

    var daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    var nowPos =
      (now.getFullYear() - START_YEAR) * 12 + now.getMonth() + now.getDate() / daysInMonth;

    function pos(year, month) {
      return (year - START_YEAR) * 12 + month;
    }

    var rows = [
      {
        cls: "bar-edu",
        title: "BSc Biostatistics",
        sub: "JKUAT, 2020 to 2024",
        start: pos(2020, 8),
        end: pos(2024, 6)
      },
      {
        cls: "bar-attach",
        title: "Attachee at KIPPRA",
        sub: "May to Aug 2023",
        start: pos(2023, 4),
        end: pos(2023, 8)
      },
      {
        cls: "bar-work",
        title: "Business sales executive",
        sub: "Co-operative Bank, from Oct 2025",
        start: pos(2025, 9),
        end: nowPos
      }
    ];

    timeline.setAttribute("role", "img");
    timeline.setAttribute(
      "aria-label",
      "Timeline since 2020: BSc Biostatistics from September 2020 to June 2024, " +
        "an attachment at KIPPRA from May to August 2023, and business sales executive " +
        "at Co-operative Bank of Kenya from October 2025 to present."
    );

    timeline.appendChild(el("p", "chart-title", "Study and work since 2020"));

    var plot = el("div", "tl-plot");

    // Year gridlines
    for (var y = START_YEAR; y < endYear; y++) {
      var tick = el("div", "tl-tick");
      tick.style.left = (((y - START_YEAR) * 12) / total) * 100 + "%";
      tick.appendChild(el("span", "", String(y)));
      plot.appendChild(tick);
    }

    // Rows
    rows.forEach(function (r) {
      var left = (r.start / total) * 100;
      var right = (r.end / total) * 100;

      var row = el("div", "tl-row");

      var label = el("div", "tl-label");
      label.appendChild(el("strong", "", r.title));
      label.appendChild(el("span", "", r.sub));
      if (left > 55) {
        label.classList.add("is-right");
        label.style.right = 100 - right + "%";
      } else {
        label.style.left = left + "%";
      }

      var bar = el("div", "tl-bar " + r.cls);
      bar.style.left = left + "%";
      bar.style.width = right - left + "%";

      row.appendChild(label);
      row.appendChild(bar);
      plot.appendChild(row);
    });

    timeline.appendChild(plot);
    timeline.classList.add("is-ready");
  }

  /* ------------------------------------------------------------------
     Certifications
     ------------------------------------------------------------------ */
  var certList = document.getElementById("cert-list");

  if (certList) {
    var certs = Array.isArray(window.CERTIFICATIONS) ? window.CERTIFICATIONS : [];
    var groups = [
      { status: "completed", heading: "Completed" },
      { status: "in-progress", heading: "In progress" },
      { status: "planned", heading: "Planned" }
    ];

    groups.forEach(function (g) {
      var items = certs.filter(function (c) {
        return c.status === g.status;
      });
      if (!items.length) return;

      var group = el("div", "cert-group");
      group.appendChild(el("h3", "", g.heading));

      var ul = el("ul", "cert-items");
      items.forEach(function (c) {
        var li = el("li");
        li.appendChild(el("strong", "", c.title));

        var detail = [c.issuer, c.year].filter(Boolean).join(", ");
        if (detail) li.appendChild(el("span", "", detail));

        if (c.credentialUrl) {
          var a = el("a", "", "View credential");
          a.href = c.credentialUrl;
          a.target = "_blank";
          a.rel = "noopener";
          li.appendChild(a);
        }
        ul.appendChild(li);
      });

      group.appendChild(ul);
      certList.appendChild(group);
    });
  }

  /* ------------------------------------------------------------------
     Projects
     ------------------------------------------------------------------ */
  function linkItem(href, text) {
    var a = el("a", "", text);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  function renderProject(p) {
    var article = el("article", "project");
    var body = el("div");

    body.appendChild(el("h3", "", p.title || "Untitled project"));

    var meta = [];
    if (p.year) meta.push(p.year);
    if (p.tools && p.tools.length) meta.push(p.tools.join(", "));
    if (meta.length) body.appendChild(el("p", "project-meta", meta.join(". ")));

    if (p.summary) body.appendChild(el("p", "", p.summary));

    if (p.liveUrl || p.codeUrl) {
      var links = el("p", "project-links");
      if (p.liveUrl) links.appendChild(linkItem(p.liveUrl, "View live project"));
      if (p.codeUrl) links.appendChild(linkItem(p.codeUrl, "View code"));
      body.appendChild(links);
    }

    article.appendChild(body);

    if (p.image) {
      var img = el("img");
      img.src = p.image;
      img.alt = "Screenshot of " + (p.title || "the project");
      img.loading = "lazy";
      article.classList.add("has-image");
      article.appendChild(img);
    }
    return article;
  }

  function renderEmpty(container) {
    var box = el("div", "empty-state");
    box.appendChild(el("p", "", "Projects are in development: R Shiny and Streamlit apps with AI integration will be listed here as they are deployed."));
    var p = el("p");
    p.appendChild(document.createTextNode("Meanwhile, you can read my "));
    var cv = el("a", "", "CV");
    cv.href = "assets/Melissa_Nyakinyua_CV.pdf";
    cv.target = "_blank";
    cv.rel = "noopener";
    p.appendChild(cv);
    p.appendChild(document.createTextNode(" or "));
    var mail = el("a", "", "email me");
    mail.href = "mailto:nyakinyuamelissa@gmail.com";
    p.appendChild(mail);
    p.appendChild(document.createTextNode("."));
    box.appendChild(p);
    container.appendChild(box);
  }

  function renderProjects(container, list) {
    if (!list.length) {
      renderEmpty(container);
      return;
    }
    list.forEach(function (p) {
      container.appendChild(renderProject(p));
    });
  }

  var all = Array.isArray(window.PROJECTS) ? window.PROJECTS : [];

  var fullList = document.getElementById("project-list");
  if (fullList) renderProjects(fullList, all);

  var preview = document.getElementById("project-preview");
  if (preview) {
    renderProjects(preview, all.slice(0, 3));
    var more = document.getElementById("project-more");
    if (more && all.length > 3) more.hidden = false;
  }
})();
