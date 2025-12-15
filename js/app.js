document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------
     * 1) Accordion (course__col)
     * --------------------------- */
    document.querySelectorAll(".course__col").forEach((col) => {
      const info = col.querySelector(".course__info");
      const header = col.querySelector(".course__item");
      if (!info || !header) return;
  
      info.style.height = "0px";
  
      header.addEventListener("click", () => {
        const isOpen = col.classList.contains("is-open");
  
        document.querySelectorAll(".course__col.is-open").forEach((openCol) => {
          if (openCol !== col) {
            const openInfo = openCol.querySelector(".course__info");
            openCol.classList.remove("is-open");
            if (openInfo) openInfo.style.height = "0px";
          }
        });
  
        if (isOpen) {
          col.classList.remove("is-open");
          info.style.height = "0px";
        } else {
          col.classList.add("is-open");
          info.style.height = info.scrollHeight + "px";
        }
      });
  
      window.addEventListener("resize", () => {
        if (col.classList.contains("is-open")) {
          info.style.height = info.scrollHeight + "px";
        }
      });
    });
  
    /* ---------------------------
     * 2) Swiper (if exists)
     * --------------------------- */
    if (document.querySelector(".mySwiper") && window.Swiper) {
      new Swiper(".mySwiper", {
        navigation: {
          nextEl: ".swiper-button-next3",
          prevEl: ".swiper-button-prev3",
        },
        spaceBetween: 5,
        centeredSlides: true,
        autoplay: { delay: 2500, disableOnInteraction: false },
        slidesPerView: "auto",
        autoHeight: true,
      });
    }
  
    /* ---------------------------
     * 3) 24h Timer
     * --------------------------- */
    const timerEl = document.querySelector(".bottom_timer");
    if (timerEl) {
      let totalSeconds = 24 * 60 * 60;
  
      const tick = () => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
  
        timerEl.textContent =
          String(h).padStart(2, "0") +
          ":" +
          String(m).padStart(2, "0") +
          ":" +
          String(s).padStart(2, "0");
  
        if (totalSeconds <= 0) {
          clearInterval(intv);
          timerEl.textContent = "00:00:00";
        }
        totalSeconds--;
      };
  
      tick();
      const intv = setInterval(tick, 1000);
    }
  
    /* ---------------------------
     * 4) Custom Select (ank-select)
     * --------------------------- */
    const selects = document.querySelectorAll(".ank-select");
  
    const closeSelect = (sel) => {
      sel.classList.remove("is-open");
      const btn = sel.querySelector(".ank-select__btn");
      if (btn) btn.setAttribute("aria-expanded", "false");
    };
  
    const closeAll = (except) => {
      selects.forEach((s) => {
        if (s !== except) closeSelect(s);
      });
    };
  
    selects.forEach((sel) => {
      const btn = sel.querySelector(".ank-select__btn");
      const valueEl = sel.querySelector(".ank-select__value");
      const hidden = sel.querySelector('input[type="hidden"]');
      const items = sel.querySelectorAll(".ank-select__item");
  
      if (!btn || !valueEl || !hidden) return;
  
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const willOpen = !sel.classList.contains("is-open");
        closeAll(sel);
        if (willOpen) {
          sel.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        } else {
          closeSelect(sel);
        }
      });
  
      items.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
  
          items.forEach((i) => i.classList.remove("is-active"));
          item.classList.add("is-active");
  
          const text = item.textContent.trim();
          const val = item.getAttribute("data-value") || text;
  
          valueEl.textContent = text;
          hidden.value = val;
  
          // error style remove
          btn.classList.remove("input-error");
          const form = document.getElementById("leadForm");
          if (form && hidden.name) {
            const err = form.querySelector(`.ank-error[data-error-for="${hidden.name}"]`);
            if (err) err.textContent = "";
          }
  
          closeSelect(sel); // ✅ tanlaganda yopiladi
        });
      });
    });
  
    document.addEventListener("click", () => closeAll());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
    });
  
    /* ---------------------------
     * 5) Form validation + redirect
     * --------------------------- */
    const form = document.getElementById("leadForm");
    if (!form) return;
  
    const setError = (inputEl, errorEl, msg) => {
      if (errorEl) errorEl.textContent = msg;
      if (inputEl) inputEl.classList.add("input-error");
    };
    const clearError = (inputEl, errorEl) => {
      if (errorEl) errorEl.textContent = "";
      if (inputEl) inputEl.classList.remove("input-error");
    };
  
    form.addEventListener("submit", (e) => {
      let ok = true;
  
      // name
      const nameInput = form.querySelector("#name");
      const nameErr = form.querySelector("#nameError");
      if (!nameInput || !nameInput.value.trim()) {
        ok = false;
        setError(nameInput, nameErr, "Ismni kiriting");
      } else {
        clearError(nameInput, nameErr);
      }
  
      // phone (>= 9 digits)
      const phoneInput = form.querySelector("#phone");
      const phoneErr = form.querySelector("#phoneError");
      const digits = (phoneInput?.value || "").replace(/\D/g, "");
      if (digits.length < 9) {
        ok = false;
        setError(phoneInput, phoneErr, "Telefon raqamni to‘liq kiriting");
      } else {
        clearError(phoneInput, phoneErr);
      }
  
      // required hidden selects
      form.querySelectorAll('.ank-select input[type="hidden"][required]').forEach((hidden) => {
        const v = (hidden.value || "").trim();
        const btn = hidden.closest(".ank-select")?.querySelector(".ank-select__btn");
        const err = form.querySelector(`.ank-error[data-error-for="${hidden.name}"]`);
  
        if (!v) {
          ok = false;
          if (err) err.textContent = "Variantni tanlang";
          if (btn) btn.classList.add("input-error");
        } else {
          if (err) err.textContent = "";
          if (btn) btn.classList.remove("input-error");
        }
      });
  
      if (!ok) {
        e.preventDefault();
        const first = form.querySelector(".input-error");
        if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  
    form.querySelector("#name")?.addEventListener("input", () => {
      clearError(form.querySelector("#name"), form.querySelector("#nameError"));
    });
    form.querySelector("#phone")?.addEventListener("input", () => {
      clearError(form.querySelector("#phone"), form.querySelector("#phoneError"));
    });
  });
  