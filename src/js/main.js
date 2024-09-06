document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".steps__wrapper__item", {
    y: "120%",
    ease: "back.out(1.7)",
    duration: 0.5,
    stagger: 0.1,
    scrollTrigger: {
      trigger: ".steps__wrapper__item",
    },
  });

  gsap.from(".points__wrapper__item", {
    opacity: 0,
    ease: "power2.out",
    duration: 1,
    stagger: 0.15,
    scrollTrigger: {
      trigger: ".points__wrapper__item",
      start: "50% bottom",
    },
  });
});
