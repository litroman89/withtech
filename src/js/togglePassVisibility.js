document.addEventListener("DOMContentLoaded", function () {
  const eyeBtns = document.querySelectorAll(".openEye, .closedEye");
  const passInput = document.querySelector(".password-wrapper input");

  eyeBtns.forEach((eyeBtn) => {
    eyeBtn.addEventListener("click", function () {
      console.log(eyeBtn);
      eyeBtns.forEach((eyeBtn) => {
        eyeBtn.classList.toggle("hidden");
      });
      if (passInput.type === "password") {
        passInput.type = "text";
      } else {
        passInput.type = "password";
      }
    });
  });
});
