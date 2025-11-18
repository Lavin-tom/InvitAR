let videoCurrentTime = 0.0;
let videoHasPlayedFully = false;

const showPortfolio = (done) => {
  const portfolio = document.querySelector("#portfolio-panel");
  let y = -0.5;
  portfolio.setAttribute("visible", true);
  const id = setInterval(() => {
    y += 0.008;
    if (y >= 0) {
      clearInterval(id);
      setTimeout(done, 500);
    }
    portfolio.setAttribute("position", `0 ${y} -0.01`);
  }, 10);
};

function openWhatsapp() {
  const phoneNumber = "+919539827508";
  const message = "Hey Lavin & Sujitha! Excited for your big day! ♥️";
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

function openCalendar() {
  const icsContent = [
    'BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
    'UID:lavin-sujitha-wedding@yourdomain.com','DTSTAMP:20250823T100000Z','DTSTART:20260114T053000Z','DTEND:20260114T073000Z',
    'SUMMARY:Lavin & Sujitha Wedding Day','DESCRIPTION:Join us for a beautiful celebration of love!',
    'LOCATION:Jerusalem Mar Thoma Syrian Church, Koothrapally','URL:https://maps.app.goo.gl/3M8UD9NZdfzCyPJd6',
    'BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:Join us for a beautiful celebration of love!','END:VALARM',
    'END:VEVENT','END:VCALENDAR'
  ].join('\n');
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Lavin-Sujitha-wedding.ics";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function openGoogleMapsChurch() { window.open(`https://maps.app.goo.gl/3M8UD9NZdfzCyPJd6`, '_blank'); }
function openGoogleMapsHall() { window.open(`https://maps.app.goo.gl/EkU42vjUJ82Gnher8`, '_blank'); }
function openGoogleMapsReception() { window.open(`https://maps.app.goo.gl/RYkDX36Jk4QCZmjw5`, '_blank'); }

function getOrdinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return "th";
  switch (n % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function callConfetti(){
  if (typeof confetti !== "undefined") {
    const emojis = ['💖','💘','💕','❤️','💞','💝','💖','💓','❣️'];
    const shape = confetti.shapeFromText({ text: emojis[Math.floor(Math.random() * emojis.length)], scalar: 2 });
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 }, shapes: [shape] });
  }
}

function updateCountdown() {
  const eventDate = new Date("January 14, 2026 11:00:00");
  const now = new Date();
  const timeDiff = eventDate - now;
  if (timeDiff <= 0) return;

  const countdownElement = document.querySelector("#countdown");
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  countdownElement.setAttribute('text', 'value', `${days}d ${hours}h ${minutes}m ${seconds}s`);
}
setInterval(updateCountdown, 1000);

// Helper to toggle both button + icon visibility
function toggleButtonAndIcon(buttonId, iconId, visible) {
  const btn = document.querySelector(buttonId);
  const icon = document.querySelector(iconId);
  if (btn) btn.setAttribute('visible', visible);
  if (icon) icon.setAttribute('visible', visible);
}

AFRAME.registerComponent('mytarget', {
  init: function() {
    let confettiTriggered = false;
    this.found = false;

    this.el.addEventListener('targetFound', () => {
      this.found = true;
      const eventDate = new Date("January 14, 2026 11:30:00");
      const now = new Date();
      const audio = document.querySelector("#musicmp3");
      const baseVideo = document.querySelector("#Base-video");
      const videoOverlay = document.querySelector("#video-white-bg");
      const countdownEl = document.querySelector("#countdown");
      const postEventPanel = document.querySelector("#post-event-panel");
      const postEventLabel = document.querySelector("#post-event-label");

      countdownEl.setAttribute("visible", false);
      postEventPanel.setAttribute("visible", false);
      postEventLabel.setAttribute("visible", false);

      const uiPairs = [
        { btn: '#locationbutton1', icon: '#icon-church-img' },
        { btn: '#locationbutton2', icon: '#icon-hall-img' },
        { btn: '#locationbutton3', icon: '#icon-reception-img' },
        { btn: '#whatsappbutton', icon: '#icon-whatsapp-img' },
        { btn: '#Calendarbutton', icon: '#icon-calendar-img' }
      ];

      if (now < eventDate) {
        if (videoOverlay) videoOverlay.setAttribute("visible", false);
        audio?.play().catch(()=>{});
        baseVideo.currentTime = videoCurrentTime;
        baseVideo.play().catch(()=>{});
        uiPairs.forEach(pair => toggleButtonAndIcon(pair.btn, pair.icon, true));

        baseVideo.onended = () => {
          videoHasPlayedFully = true;
          videoCurrentTime = 0;
          baseVideo.parentElement.setAttribute("visible", false);
          if (videoOverlay) videoOverlay.setAttribute("visible", true);
          countdownEl.setAttribute("visible", true);
          updateCountdown();
          uiPairs.forEach(pair => toggleButtonAndIcon(pair.btn, pair.icon, true));
        };
      } else {
        baseVideo.pause();
        baseVideo.parentElement.setAttribute("visible", false);
        uiPairs.forEach(pair => toggleButtonAndIcon(pair.btn, pair.icon, false));
        if (videoOverlay) videoOverlay.setAttribute("visible", true);
        postEventPanel.setAttribute("visible", true);
        postEventLabel.setAttribute("visible", true);

        const updatePassed = () => {
          const now = new Date();
          const diff = now - eventDate;
          const y = Math.floor(diff / (365*24*60*60*1000));
          const d = Math.floor((diff % (365*24*60*60*1000)) / (24*60*60*1000));
          const h = Math.floor((diff % (24*60*60*1000)) / (60*60*1000));
          const m = Math.floor((diff % (60*60*1000)) / (60*1000));
          const s = Math.floor((diff % (60*1000)) / 1000);
          let text;
          if (now.getDate() === eventDate.getDate() && now.getMonth() === eventDate.getMonth()) {
            const ann = y + 1;
            text = `Happy ${ann}${getOrdinal(ann)} Anniversary, Lavin & Sujitha! 💖`;
            if (!confettiTriggered) { callConfetti(); confettiTriggered = true; }
          } else {
            text = `We've been together for ${y}y ${d}d ${h}h ${m}m ${s}s`;
          }
          postEventLabel.setAttribute("text", "value", text);
        };
        updatePassed();
        this.passedInterval = setInterval(updatePassed, 1000);
      }
      callConfetti();
      setTimeout(()=> showPortfolio(()=>{}), 300);
    });

    this.el.addEventListener('targetLost', () => {
      this.found = false; // mark immediately
      const audio = document.querySelector("#musicmp3");
      const baseVideo = document.querySelector("#Base-video");
      const videoOverlay = document.querySelector("#video-white-bg");

      setTimeout(() => {
        if (!this.found) { // only hide if still lost after delay
          videoCurrentTime = parseFloat(baseVideo.currentTime.toFixed(3));
          audio?.pause();
          baseVideo.pause();

          document.querySelector("#countdown").setAttribute("visible", false);
          document.querySelector("#post-event-panel").setAttribute("visible", false);
          document.querySelector("#post-event-label").setAttribute("visible", false);
          baseVideo.parentElement.setAttribute("visible", true);
          if (videoOverlay) videoOverlay.setAttribute("visible", false);
          if (this.passedInterval) { clearInterval(this.passedInterval); this.passedInterval = null; }
        }
      }, 500); // grace period
    });
  }
});

window.addEventListener('load', () => {
    const sceneEl = document.querySelector('a-scene');
    sceneEl.addEventListener('loaded', () => {
        document.querySelector('#locationbutton1').addEventListener('click', openGoogleMapsChurch);
        document.querySelector('#locationbutton2').addEventListener('click', openGoogleMapsHall);
        document.querySelector('#whatsappbutton').addEventListener('click', openWhatsapp);
        document.querySelector('#locationbutton3').addEventListener('click', openGoogleMapsReception);
        document.querySelector('#Calendarbutton').addEventListener('click', openCalendar);
    });
});

// Helper to toggle both button + icon visibility
function toggleButtonAndIcon(buttonId, iconSelector, visible) {
  const btn = document.querySelector(buttonId);
  const icon = document.querySelector(iconSelector);
  if (btn) btn.setAttribute('visible', visible);
  if (icon) icon.setAttribute('visible', visible);
}