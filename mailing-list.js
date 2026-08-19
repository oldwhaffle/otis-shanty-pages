(() => {
  const renderMailingList = () => {
    const main = document.querySelector("#main-content");
    if (!main || document.querySelector("#mailing-list")) return;

    const style = document.createElement("style");
    style.id = "mailing-list-styles";
    style.textContent = `
      .mailing-list{background:#3b292f;color:#f3e8df;display:grid;grid-template-columns:minmax(0,.8fr) minmax(320px,1.2fr);gap:clamp(2.5rem,7vw,7rem);align-items:start;border-top:1px solid rgba(243,232,223,.16);padding:clamp(3rem,5vw,5rem) 6vw}
      .mailing-list-copy h2{font-size:clamp(3rem,5.5vw,5.6rem);font-weight:500;line-height:.84;letter-spacing:-.06em;margin:.55rem 0 1.35rem;text-transform:uppercase}
      .mailing-list-copy>p:last-child{max-width:28rem;font-size:1rem;line-height:1.6}
      .mailing-list-form{display:grid;gap:1.15rem;max-width:42rem;width:100%}
      .mailing-list-form label{display:grid;gap:.55rem;font-size:.72rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase}
      .mailing-list-form label span{display:flex;justify-content:space-between;align-items:baseline}
      .mailing-list-form label b{color:#e98252;font-weight:700}
      .mailing-list-form label em{font-size:.62rem;font-style:normal;font-weight:400;opacity:.62}
      .mailing-list-form input,.mailing-list-form textarea{width:100%;border:0;border-bottom:1px solid rgba(243,232,223,.72);border-radius:0;background:transparent;color:#f3e8df;font:inherit;font-size:1rem;letter-spacing:0;line-height:1.45;padding:.65rem 0;text-transform:none;outline:none;resize:vertical}
      .mailing-list-form input::placeholder,.mailing-list-form textarea::placeholder{color:rgba(243,232,223,.42)}
      .mailing-list-form input:focus,.mailing-list-form textarea:focus{border-bottom-width:2px}
      .mailing-list-form button{justify-self:start;border:1px solid #f3e8df;border-radius:999px;background:#f3e8df;color:#3b292f;cursor:pointer;font:inherit;font-size:.72rem;font-weight:700;letter-spacing:.12em;padding:.85rem 1.3rem;text-transform:uppercase;transition:background .2s,color .2s}
      .mailing-list-form button:hover,.mailing-list-form button:focus-visible{background:transparent;color:#f3e8df}
      .mailing-list-form button:disabled{cursor:wait;opacity:.72}
      .mailing-list-form button span{display:inline-block;margin-left:.5rem}
      .mailing-list-form .form-note,.mailing-list-form .form-success{font-size:.72rem;line-height:1.5;margin:0;opacity:.68}
      .mailing-list-form .form-success{font-weight:700;opacity:1}
      .mailing-list-trap{position:absolute!important;left:-10000px!important;width:1px!important;height:1px!important;overflow:hidden!important}
      @media(max-width:800px){.mailing-list{grid-template-columns:1fr;gap:2.25rem;padding:3.5rem 6vw}.mailing-list-copy h2{font-size:clamp(3rem,13vw,5rem)}.mailing-list-form{max-width:none}}
    `;
    if (!document.querySelector("#mailing-list-styles")) document.head.append(style);

    const section = document.createElement("section");
    section.id = "mailing-list";
    section.className = "mailing-list section-pad";
    section.innerHTML = `
      <div class="mailing-list-copy">
        <p class="eyebrow">Keep in touch</p>
        <h2>Join our<br>mailing list</h2>
        <p>Hear about new music, shows, and whatever else is growing.</p>
      </div>
      <form class="mailing-list-form" action="https://formspree.io/f/xwleaqzv" method="POST">
        <input type="hidden" name="subject" value="New Otis Shanty mailing list signup">
        <label>
          <span>Email address <b aria-hidden="true">*</b></span>
          <input type="email" name="email" autocomplete="email" inputmode="email" required placeholder="you@example.com">
        </label>
        <label>
          <span>Message <em>(optional)</em></span>
          <textarea name="message" rows="4" placeholder="Say hello, tell us where to play, or leave this blank."></textarea>
        </label>
        <label class="mailing-list-trap" aria-hidden="true">
          Leave this empty
          <input type="text" name="_honey" tabindex="-1" autocomplete="off">
        </label>
        <button type="submit">Sign me up <span aria-hidden="true">→</span></button>
        <p class="form-note">Occasional updates from Otis Shanty. No spam.</p>
        <p class="form-success" role="status" hidden>Thanks — you're on the list.</p>
      </form>`;

    main.append(section);

    const form = section.querySelector("form");
    const success = section.querySelector(".form-success");
    const button = form.querySelector("button");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      button.disabled = true;
      button.textContent = "Sending…";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Submission failed");

        form.reset();
        success.hidden = false;
        button.textContent = "You're on the list ✓";
      } catch {
        button.disabled = false;
        button.textContent = "Try again →";
        success.hidden = false;
        success.textContent = "Something went wrong. Please try again.";
      }
    });
  };

  const renderAfterHydration = () => {
    let attempts = 0;
    const timer = window.setInterval(() => {
      renderMailingList();
      attempts += 1;
      if (attempts === 12) window.clearInterval(timer);
    }, 250);
  };

  if (document.readyState === "complete") renderAfterHydration();
  else window.addEventListener("load", renderAfterHydration, { once: true });
})();
