document.addEventListener("DOMContentLoaded", () => {
  // 1. Audio & Music Setup
  const bgMusic = document.getElementById("bg-music");
  const soundBtn = document.getElementById("sound-btn");
  const origSoundBtn = document.querySelector('button.rounded-full.bg-neutral-900\\/85') || soundBtn;
  const envelopeCover = document.getElementById("envelope-cover");
  const envelopeVideo = document.getElementById("envelope-video");
  const heroVideo = document.querySelector('[data-opening-canvas] video');

  let isPlaying = false;

  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.play().catch(() => {});
  }

  function setAudioPlaying(play) {
    if (!bgMusic) return;
    if (play) {
      bgMusic.volume = 0.6;
      bgMusic.play().then(() => {
        isPlaying = true;
        updateSoundIcons(true);
      }).catch(() => {
        isPlaying = false;
        updateSoundIcons(false);
      });
    } else {
      bgMusic.pause();
      isPlaying = false;
      updateSoundIcons(false);
    }
  }

  function updateSoundIcons(playing) {
    const iconOn = document.getElementById("sound-icon-on");
    const iconOff = document.getElementById("sound-icon-off");
    if (iconOn && iconOff) {
      if (playing) {
        iconOn.classList.remove("hidden");
        iconOff.classList.add("hidden");
      } else {
        iconOn.classList.add("hidden");
        iconOff.classList.remove("hidden");
      }
    }
    // The visible floating control is separate from the legacy music button.
    // Keep its icon and accessible label aligned with the actual audio state.
    if (origSoundBtn && origSoundBtn !== soundBtn) {
      origSoundBtn.setAttribute("aria-label", playing ? "Mute music" : "Play music");
      origSoundBtn.style.overflow = "hidden";
      origSoundBtn.innerHTML = playing
        ? '<svg class="lucide lucide-volume2 w-6 h-6" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" aria-hidden="true"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"></path><path d="M16 9a5 5 0 0 1 0 6"></path><path d="M19.364 18.364a9 9 0 0 0 0-12.728"></path></svg>'
        : '<svg class="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3z"></path><path d="M14 7.97v2.21l2.45 2.45c.03-.2.05-.42.05-.63 0-1.77-1.02-3.29-2.5-4.03z"></path><path d="M17.06 7.97A5.49 5.49 0 0 1 19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.93 8.93 0 0 0 21 12c0-2.76-1.61-5.14-3.94-6.27v2.24z"></path><path d="M2 2l20 20" fill="none" stroke="currentColor" stroke-width="3.4"></path></svg>';
    }
  }

  updateSoundIcons(false);

  // Modern browsers allow sound only after a user gesture. Start the invitation
  // music on its first opening interaction, including pages without an envelope.
  let musicStartedByInvite = false;
  function startMusicOnInviteOpen(event) {
    if (musicStartedByInvite || (origSoundBtn && origSoundBtn.contains(event.target))) return;
    musicStartedByInvite = true;
    setAudioPlaying(true);
    document.removeEventListener("pointerdown", startMusicOnInviteOpen, true);
  }
  document.addEventListener("pointerdown", startMusicOnInviteOpen, true);

  // 2. Envelope Tap to Open (First Page -> Second Page Transition)
  if (envelopeCover) {
    let opened = false;
    const mainContent = document.getElementById("invitation-main-content");
    const scrollRsvpIndicator = document.getElementById("scroll-rsvp-indicator");

    function openEnvelope() {
      if (opened) return;
      opened = true;

      if (envelopeVideo) {
        envelopeVideo.currentTime = 0;
        envelopeVideo.play().catch(() => {});
      }
      setAudioPlaying(true);
      musicStartedByInvite = true;

      // Play opening animation (2.4s), then reveal second page
      setTimeout(() => {
        // 1. Reveal second page (main content)
        if (mainContent) {
          mainContent.style.display = "block";
          void mainContent.offsetHeight;
          mainContent.style.opacity = "1";
        }

        // Trigger hero entrance animations
        if (typeof window.triggerHeroNames === "function") {
          window.triggerHeroNames();
        }

        // 2. Unlock scrolling by removing envelope-active
        document.body.classList.remove("envelope-active");

        // 3. Play hero video
        if (heroVideo) {
          heroVideo.muted = true;
          heroVideo.play().catch(() => {});
        }

        // 4. Show scroll to rsvp indicator
        if (scrollRsvpIndicator) {
          scrollRsvpIndicator.style.display = "flex";
          setTimeout(() => {
            scrollRsvpIndicator.style.opacity = "1";
          }, 100);
        }

        // 5. Fade out and remove envelope
        envelopeCover.style.transition = "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        envelopeCover.style.opacity = "0";
        envelopeCover.style.transform = "scale(1.08) translateY(-25px)";
        setTimeout(() => {
          envelopeCover.classList.add("envelope-opened");
          envelopeCover.style.display = "none";
          try { envelopeCover.remove(); } catch (e) {}
        }, 850);
      }, 2400);
    }

    envelopeCover.addEventListener("click", openEnvelope);
    envelopeCover.addEventListener("touchstart", openEnvelope, { passive: true });
  }

  // 3. Sound Button Toggle
  const allSoundBtns = [soundBtn, origSoundBtn].filter(Boolean);
  allSoundBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!bgMusic) return;
      if (bgMusic.paused) {
        setAudioPlaying(true);
      } else {
        setAudioPlaying(false);
      }
    });
  });

  // Send the same ready-to-read invitation text shown in the approved WhatsApp example.
  const whatsappShare = document.getElementById("whatsapp-share");
  if (whatsappShare) {
    whatsappShare.addEventListener("click", () => {
      const invitationUrl = window.location.href;
      const shareText = `🌸 श्री गणेशाय नमः 🌸\n\nWith the blessings of our families,\nwe joyfully invite you to celebrate the wedding of\n\n💕 Viplove & Namrata 💕\n\n📅 10 December 2026\n\nYour presence and blessings will make our special day even more memorable.\n\n✨ View our wedding invitation:\n${invitationUrl}\n\nWarm regards,\nBharadwaj & Tamrakar Family 🙏`;
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    });
  }

  // 4. Smooth Scroll for "SCROLL TO RSVP"
  const scrollBtn = document.getElementById("scroll-to-rsvp-btn") || document.querySelector('[class*="scroll"], [data-opening-canvas] a');
  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const rsvpEl = document.querySelector('[data-demo-block="rsvp"]') || document.querySelector('[data-demo-block="countdown"]');
      if (rsvpEl) {
        rsvpEl.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollBy({ top: 700, behavior: "smooth" });
      }
    });
  }

  // 5. Live Countdown Timer (Target: 10 December 2026)
  const targetDate = new Date("2026-12-10T19:30:00+05:30").getTime();
  const countdownEl = document.querySelector('[data-demo-block="countdown"]');
  if (countdownEl) {
    const valueSpans = countdownEl.querySelectorAll('.countdown-glass-box > span');
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = Math.max(0, targetDate - now);
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (valueSpans.length >= 4) {
        const secStr = String(seconds).padStart(2, "0");
        if (valueSpans[3].textContent !== secStr) {
          valueSpans[3].classList.remove("number-flip-enter");
          void valueSpans[3].offsetWidth;
          valueSpans[3].classList.add("number-flip-enter");
        }
        valueSpans[0].textContent = String(days);
        valueSpans[1].textContent = String(hours).padStart(2, "0");
        valueSpans[2].textContent = String(minutes).padStart(2, "0");
        valueSpans[3].textContent = secStr;
      }
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // 6. Schedule Day 1 / Day 2 Tab Buttons
  const timelineBlock = document.querySelector('[data-demo-block="timeline"]');
  if (timelineBlock) {
    const tabs = timelineBlock.querySelectorAll('button[role="tab"]');
    const panels = [
      document.getElementById("radix-:r6:-content-0"),
      document.getElementById("radix-:r6:-content-1")
    ];
    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t, i) => {
          t.setAttribute("aria-selected", "false");
          t.setAttribute("data-state", "inactive");
          t.style.backgroundColor = "#FFFFFF";
          t.style.color = "#26432A";
          if (panels[i]) {
            panels[i].style.display = "none";
            panels[i].setAttribute("data-state", "inactive");
            panels[i].setAttribute("hidden", "");
          }
        });
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("data-state", "active");
        tab.style.backgroundColor = "#436A48";
        tab.style.color = "#FFFFFF";
        if (panels[idx]) {
          panels[idx].style.display = "block";
          panels[idx].removeAttribute("hidden");
          panels[idx].setAttribute("data-state", "active");
          panels[idx].querySelectorAll(".reveal-left, .reveal-right").forEach(el => el.classList.add("active"));
        }
      });
    });
  }

  // 7. Venues Day 1 / Day 2 Tab Buttons
  const venueBlock = document.querySelector('[data-demo-block="venue"]');
  if (venueBlock) {
    const tabs = venueBlock.querySelectorAll('button[role="tab"]');
    const panels = [
      document.getElementById("radix-:r9:-content-0"),
      document.getElementById("radix-:r9:-content-1")
    ];
    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t, i) => {
          t.setAttribute("aria-selected", "false");
          t.setAttribute("data-state", "inactive");
          t.style.backgroundColor = "#FFFFFF";
          t.style.color = "#26432A";
          if (panels[i]) {
            panels[i].style.display = "none";
            panels[i].setAttribute("data-state", "inactive");
            panels[i].setAttribute("hidden", "");
          }
        });
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("data-state", "active");
        tab.style.backgroundColor = "#436A48";
        tab.style.color = "#FFFFFF";
        if (panels[idx]) {
          panels[idx].style.display = "block";
          panels[idx].removeAttribute("hidden");
          panels[idx].setAttribute("data-state", "active");
          panels[idx].querySelectorAll(".reveal-left, .reveal-right").forEach(el => el.classList.add("active"));
        }
      });
    });
  }

  // Auto-hide fixed "Scroll to RSVP" badge on scroll
  const fixedScrollRsvp = document.querySelector('div.fixed.inset-x-0.bottom-32');
  if (fixedScrollRsvp) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 80) {
        fixedScrollRsvp.style.opacity = "0";
        fixedScrollRsvp.style.pointerEvents = "none";
        fixedScrollRsvp.style.transition = "opacity 0.4s ease";
      } else {
        fixedScrollRsvp.style.opacity = "1";
        fixedScrollRsvp.style.pointerEvents = "none";
      }
    }, { passive: true });
  }

  // 8. Photo Gallery Carousel Slider (Previous / Next / Touch Swipe)
  const track = document.getElementById("gallery-track") || document.querySelector('[aria-roledescription="carousel"] .flex');
  const prevBtn = document.getElementById("gallery-btn-prev") || document.querySelector('button[aria-label="Previous slide"]');
  const nextBtn = document.getElementById("gallery-btn-next") || document.querySelector('button[aria-label="Next slide"]');
  const slides = document.querySelectorAll('[aria-roledescription="slide"]');

  let curSlide = 0;
  const maxSlide = Math.max(0, slides.length - 1);

  function updateGallerySlide(index) {
    curSlide = (index + slides.length) % slides.length;
    if (track) {
      track.style.transform = `translate3d(-${curSlide * 100}%, 0px, 0px)`;
      track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updateGallerySlide(curSlide - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updateGallerySlide(curSlide + 1);
    });
  }

  // Touch Swipe for Gallery
  if (track) {
    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
      const diffX = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) updateGallerySlide(curSlide + 1);
        else updateGallerySlide(curSlide - 1);
      }
    }, { passive: true });
  }

  // 9. FAQ Accordions
  const faqBlock = document.querySelector('[data-demo-block="faq"]');
  if (faqBlock) {
    const accordions = faqBlock.querySelectorAll('button[aria-controls]');
    accordions.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("aria-controls");
        const panel = document.getElementById(id);
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", !isOpen);
        btn.setAttribute("data-state", isOpen ? "closed" : "open");
        const svg = btn.querySelector("svg");
        if (svg) svg.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
        if (panel) {
          if (isOpen) {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.overflow = "hidden";
            panel.style.transition = "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease";
            void panel.offsetHeight;
            panel.style.maxHeight = "0px";
            panel.style.opacity = "0";
            setTimeout(() => {
              panel.style.display = "none";
            }, 350);
          } else {
            panel.style.display = "block";
            panel.style.overflow = "hidden";
            panel.style.maxHeight = "0px";
            panel.style.opacity = "0";
            panel.style.transition = "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease";
            void panel.offsetHeight;
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.opacity = "1";
            setTimeout(() => {
              panel.style.maxHeight = "none";
              panel.style.overflow = "visible";
            }, 350);
          }
          panel.setAttribute("data-state", isOpen ? "closed" : "open");
        }
      });
    });
  }

  // 10. Gift List Accordion
  const giftBlock = document.querySelector('[data-demo-block="gift-list"]');
  if (giftBlock) {
    const accordionBtn = giftBlock.querySelector('button[aria-controls]');
    if (accordionBtn) {
      accordionBtn.addEventListener("click", () => {
        const id = accordionBtn.getAttribute("aria-controls");
        const panel = document.getElementById(id);
        const isOpen = accordionBtn.getAttribute("aria-expanded") === "true";
        accordionBtn.setAttribute("aria-expanded", !isOpen);
        accordionBtn.setAttribute("data-state", isOpen ? "closed" : "open");
        const svg = accordionBtn.querySelector("svg");
        if (svg) svg.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
        if (panel) {
          if (isOpen) {
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.overflow = "hidden";
            panel.style.transition = "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease";
            void panel.offsetHeight;
            panel.style.maxHeight = "0px";
            panel.style.opacity = "0";
            setTimeout(() => {
              panel.style.display = "none";
            }, 350);
          } else {
            panel.style.display = "block";
            panel.style.overflow = "hidden";
            panel.style.maxHeight = "0px";
            panel.style.opacity = "0";
            panel.style.transition = "max-height 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease";
            void panel.offsetHeight;
            panel.style.maxHeight = panel.scrollHeight + "px";
            panel.style.opacity = "1";
            setTimeout(() => {
              panel.style.maxHeight = "none";
              panel.style.overflow = "visible";
            }, 350);
          }
          panel.setAttribute("data-state", isOpen ? "closed" : "open");
        }
      });
    }
  }

  // 11. RSVP Form Interactivity
  const rsvpBlock = document.querySelector('[data-demo-block="rsvp"]');
  if (rsvpBlock) {
    const form = rsvpBlock.querySelector("form");
    if (form) {
      const counterContainer = form.querySelector(".border.rounded-md") || form.querySelector("[class*='counter']");
      if (counterContainer) {
        const btns = counterContainer.querySelectorAll("button");
        const numSpan = counterContainer.querySelector("span.text-base") || counterContainer.querySelector("span");
        let count = 1;
        if (btns.length >= 2) {
          btns[0].type = "button";
          btns[1].type = "button";
          btns[0].addEventListener("click", () => {
            if (count > 1) {
              count--;
              if (numSpan) numSpan.textContent = count;
            }
          });
          btns[1].addEventListener("click", () => {
            if (count < 10) {
              count++;
              if (numSpan) numSpan.textContent = count;
            }
          });
        }
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.textContent = "Sending RSVP...";
          setTimeout(() => {
            form.innerHTML = `
              <div class="text-center py-10 px-6 bg-card border border-border rounded-2xl shadow-lg space-y-4">
                <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">✓</div>
                <h3 class="font-display text-2xl font-normal text-foreground">हार्दिक धन्यवाद!</h3>
                <p class="text-muted-foreground text-sm max-w-sm mx-auto">आपकी उपस्थिति की पुष्टि सहर्ष प्राप्त हुई। हमें आपके साथ इस पावन उत्सव को मनाने की प्रतीक्षा रहेगी!</p>
                <div class="pt-2 text-xs text-muted-foreground">विप्लव एवं नम्रता ❤</div>
              </div>
            `;
          }, 1000);
        }
      });
    }
  }

  // Directions to Royal Palace Rajnandgaon
  const dirButtons = document.querySelectorAll('[data-demo-directions]');
  dirButtons.forEach(btn => {
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('https://www.google.com/maps/search/rajnandgaon+royal+palace/@21.1005625,81.0641406,14z?entry=s&sa=X&ved=1t%3A199789', '_blank');
    });
  });

});
