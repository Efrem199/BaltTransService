function YMapAddPlacemark(map, arPlacemark) {
  if (!map || !arPlacemark.LAT || !arPlacemark.LON) return false;
  const props = {};
  if (arPlacemark.TEXT) {
    const idx = arPlacemark.TEXT.indexOf("\n");
    props.hintContent = idx > 0 ? arPlacemark.TEXT.substring(0, idx) : arPlacemark.TEXT;
    props.balloonContent = arPlacemark.TEXT.replace(/\n/g, "<br />");
  }
  const pm = new ymaps.Placemark(
    [arPlacemark.LAT, arPlacemark.LON],
    props,
    { balloonCloseButton: true }
  );
  map.geoObjects.add(pm);
  return pm;
}

ymaps.ready(initMap);
function initMap() {
  const center = [59.99353086367, 30.144326671432];
  const mark   = [59.993589981993, 30.144369586774];
  const map = new ymaps.Map("map", {
    center, zoom: 15, controls: []
  });
  YMapAddPlacemark(map, {
    LAT: mark[0],
    LON: mark[1],
    TEXT:
      "ООО «БТС»\n" +
      "197229, Санкт-Петербург\n" +
      "Лахтинский пр., 85к3с1В\n" +
      "БЦ \"Business Box\""
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Анимация счётчиков
  const counters = document.querySelectorAll(".counter");
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      let cur = 0, step = target/100;
      (function upd() {
        cur += step;
        el.textContent = cur < target ? cur.toFixed(1) : target.toString();
        if (cur < target) requestAnimationFrame(upd);
      })();
      observer.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => obs.observe(c));

  // Chart.js
  const ctx = document.getElementById("progressChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["18.03–31.03","15.04–28.04","13.05–26.05","10.06–23.06","08.07–21.07","12.08–25.08","09.09–22.09","07.10–20.10"],
      datasets: [
        {
          label: "План, %",
          data: [0,6,11,31,50,68,89,100],
          borderColor: "#666",
          backgroundColor: "transparent",
          pointStyle: "rect", pointRadius: 5, tension: .3
        },
        {
          label: "Факт, %",
          data: [0,4,7,28,43,74,92,100],
          borderColor: "#0056c9",
          backgroundColor: "transparent",
          pointStyle: "circle", pointRadius: 6, tension: .3
        }
      ]
    },
    options: {
      responsive: true,
      animation: { duration: 2000 },
      plugins: { legend: { position: "bottom" } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: v => v + "%" }
        }
      }
    }
  });
});
