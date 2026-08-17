
(function () {
  var form = document.getElementById("quote-form");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var ok = form.querySelector(".form-ok");
    var btn = form.querySelector("button");
    if (ok) ok.hidden = false;
    if (btn) btn.textContent = "Quote saved locally";
  });
})();
