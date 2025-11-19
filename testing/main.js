		const showPortfolio = (done) => {
			const portfolio = document.querySelector("#portfolio-panel");
			let y = -0.5;
			portfolio.setAttribute("visible", true);

			const animate = () => {
				y += 0.008;
				if (y >= 0) {
					portfolio.setAttribute("position", `0 0 -0.01`);
					setTimeout(done, 500);
					return;
				}
				portfolio.setAttribute("position", `0 ${y} -0.01`);
				requestAnimationFrame(animate);
			};

			requestAnimationFrame(animate);
		};
        function openWhatsapp() {
            const phoneNumber = "+919539827508".replace(/\D/g, '');
            const message = "Hey Lavin & Sujitha! Excited for your big day! ♥️";
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
        function openCalendar() {
			const icsContent = [
				'BEGIN:VCALENDAR',
				'VERSION:2.0',
				'CALSCALE:GREGORIAN',
				'METHOD:PUBLISH',
				'BEGIN:VEVENT',
				'UID:lavin-sujitha-wedding@yourdomain.com',
				'DTSTAMP:20250823T100000Z',
				'DTSTART;TZID=Asia/Kolkata:20260114T113000', 
				'DTEND;TZID=Asia/Kolkata:20260114T133000',    
				'SUMMARY:Lavin & Sujitha Wedding Day',
				'DESCRIPTION:Join us for a beautiful celebration of love!',
				'LOCATION:Jerusalem Mar Thoma Syrian Church, Koothrapally',
				'URL:https://maps.app.goo.gl/3M8UD9NZdfzCyPJd6',
				'BEGIN:VALARM',
				'TRIGGER:-PT1H',
				'ACTION:DISPLAY',
				'DESCRIPTION:Join us for a beautiful celebration of love!',
				'END:VALARM',
				'END:VEVENT',
				'END:VCALENDAR'
			].join('\r\n');
            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "Lavin-Sujitha-wedding.ics";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        function openGoogleMapsChurch() { 
			const googleMapsUrl = `https://maps.app.goo.gl/3M8UD9NZdfzCyPJd6`;
            window.open(googleMapsUrl, '_blank');
        } 
        function openGoogleMapsHall() {
            const googleMapsUrl = `https://maps.app.goo.gl/EkU42vjUJ82Gnher8`;
            window.open(googleMapsUrl, '_blank');
        }
        function openGoogleMapsReception() {
            const googleMapsUrl = `https://maps.app.goo.gl/RYkDX36Jk4QCZmjw5`;
            window.open(googleMapsUrl, '_blank');
        }
		function getOrdinal(n) {
			const s = ["th", "st", "nd", "rd"];
			const v = n % 100;
			if (v >= 11 && v <= 13) return "th";
			return s[(v % 10)] || s[0];
		}
        function callConfetti(){
            const emojis = ['💖','💘','💕','❤️','💞','💝','💖','💓','❣️'];
            const shape = confetti.shapeFromText({ text: emojis[Math.floor(Math.random() * emojis.length)], scalar: 2 });
                confetti({
                    particleCount: 250,
                    spread: 150,
                    origin: { y: 0.6 },
                    shapes: [shape]
                });
        }
        // Countdown to Event
		function updateCountdown() {
			const eventDate = new Date("January 14, 2026 11:30:00");
			const now = new Date();
			const timeDiff = eventDate - now;
			const countdownElement = document.querySelector("#countdown");

			if (timeDiff <= 0) {
				countdownElement.setAttribute('value', "Event Started!");
				return;
			}

			const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

			countdownElement.setAttribute('value', `${days}d ${hours}h ${minutes}m ${seconds}s`);
		}
        setInterval(updateCountdown, 1000);
		AFRAME.registerComponent('mytarget', {
			init: function() {
				let confettiTriggered = false;
				let videoCurrentTime = 0.0;
				let videoHasPlayedFully = false;

				this.el.addEventListener('targetFound', () => {
					const eventDate = new Date("January 14, 2026 11:00:00");
					const now = new Date();
					const audio = document.querySelector("#musicmp3");
					const baseVideo = document.querySelector("#Base-video");
					const countdownEl = document.querySelector("#countdown");
					const postEventPanel = document.querySelector("#post-event-panel");
					const postEventLabel = document.querySelector("#post-event-label");

					// Hide all initially
					countdownEl.setAttribute("visible", false);
					postEventPanel.setAttribute("visible", false);
					postEventLabel.setAttribute("visible", false);

					if (now < eventDate) {
						if (videoHasPlayedFully) {
							// Skip video, show countdown immediately
							countdownEl.setAttribute("visible", true);
							updateCountdown();
							showButtons();
						} else {
							// Resume video from last position
							audio.play().catch(()=>{});
							baseVideo.currentTime = videoCurrentTime; 
							baseVideo.play().catch(()=>{});

							baseVideo.onended = () => {
								videoHasPlayedFully = true;
								videoCurrentTime = 0;
								countdownEl.setAttribute("visible", true);
								updateCountdown();
								showButtons();
							};
						}
					} else {
						// Post-event logic
						baseVideo.pause();
						document.querySelector("a-video").setAttribute("visible", false);
						postEventPanel.setAttribute("visible", true);
						postEventLabel.setAttribute("visible", true);
						startPostEventTimer(eventDate, postEventLabel);
					}
				});

				this.el.addEventListener('targetLost', () => {
					const audio = document.querySelector("#musicmp3");
					const baseVideo = document.querySelector("#Base-video");
					videoCurrentTime = parseFloat(baseVideo.currentTime.toFixed(3)); 
					audio.pause();
					baseVideo.pause();
				});

				function showButtons() {
					const ids = ["#coupleNamebutton","#locationbutton1","#locationbutton2","#whatsappbutton","#locationbutton3","#Calendarbutton","#text-hall","#text-church","#text-contact","#text-event","#text-reception"];
					ids.forEach(id => document.querySelector(id).setAttribute("visible", true));
				}

				function startPostEventTimer(eventDate, postEventLabel) {
					const updatePassedTime = () => {
						const now = new Date();
						const diff = now - eventDate;
						const y = Math.floor(diff / (365*24*60*60*1000));
						const d = Math.floor((diff % (365*24*60*60*1000)) / (24*60*60*1000));
						const h = Math.floor((diff % (24*60*60*1000)) / (60*60*1000));
						const m = Math.floor((diff % (60*60*1000)) / (60*1000));
						const s = Math.floor((diff % (60*1000)) / 1000);
						let text = `We've been together for ${y}y ${d}d ${h}h ${m}m ${s}s`;
						postEventLabel.setAttribute("value", text);
					};
					updatePassedTime();
					this.passedInterval = setInterval(updatePassedTime, 1000);
				}
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