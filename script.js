/* =========================================================
   RAHUL CYBERSECURITY PORTFOLIO
   MOBILE-FIRST SCRIPT.JS
========================================================= */

"use strict";


/* =========================================================
   HELPERS
========================================================= */

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const finePointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
).matches;



/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");


function closeNavigation() {

  if (!nav || !menuButton) return;

  nav.classList.remove("open");

  menuButton.setAttribute(
    "aria-expanded",
    "false"
  );

}


if (menuButton && nav) {

  menuButton.addEventListener("click", event => {

    event.stopPropagation();

    const open = nav.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );

  });


  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener(
      "click",
      closeNavigation
    );

  });


  document.addEventListener("click", event => {

    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {

      closeNavigation();

    }

  });

}



/* =========================================================
   CURRENT YEAR
========================================================= */

const year =
  document.getElementById("year");

if (year) {

  year.textContent =
    new Date().getFullYear();

}



/* =========================================================
   HEADER SCROLL STATE
========================================================= */

const header =
  document.querySelector(".site-header");


function updateHeader() {

  if (!header) return;

  header.classList.toggle(
    "scrolled",
    window.scrollY > 25
  );

}


updateHeader();


window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);



/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if (prefersReducedMotion) {

  revealElements.forEach(element => {

    element.classList.add("visible");

  });

} else {

  const revealObserver =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting)
            return;


          entry.target.classList.add(
            "visible"
          );


          revealObserver.unobserve(
            entry.target
          );

        });

      },

      {
        threshold: 0.08,

        rootMargin:
          "0px 0px -30px 0px"
      }

    );


  revealElements.forEach(element => {

    revealObserver.observe(element);

  });

}



/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
  document.querySelectorAll(
    "main section[id]"
  );

const navLinks =
  document.querySelectorAll(
    ".site-nav a"
  );


if (
  sections.length &&
  navLinks.length
) {

  const activeObserver =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting)
            return;


          const currentId =
            entry.target.id;


          navLinks.forEach(link => {

            const isActive =
              link.getAttribute("href") ===
              `#${currentId}`;


            link.classList.toggle(
              "active",
              isActive
            );

          });

        });

      },

      {
        rootMargin:
          "-32% 0px -58% 0px",

        threshold: 0
      }

    );


  sections.forEach(section => {

    activeObserver.observe(section);

  });

}



/* =========================================================
   GREEN MATRIX
========================================================= */

const canvas =
  document.getElementById(
    "matrixCanvas"
  );


if (
  canvas &&
  !prefersReducedMotion
) {

  const ctx =
    canvas.getContext("2d");


  const characters =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "$#@%&+-<>[]{}" +
    "アイウエオカキクケコ" +
    "サシスセソ";


  let fontSize = 14;

  let drops = [];

  let width = 0;

  let height = 0;

  let animationId = null;

  let lastFrame = 0;



  function resizeMatrix() {

    const rect =
      canvas.getBoundingClientRect();


    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    width =
      rect.width;


    height =
      rect.height;


    /*
      Reduce Matrix density on phones.
    */

    fontSize =
      window.innerWidth < 600
        ? 17
        : 14;


    canvas.width =
      Math.max(
        1,
        Math.floor(
          width * dpr
        )
      );


    canvas.height =
      Math.max(
        1,
        Math.floor(
          height * dpr
        )
      );


    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );


    const columns =
      Math.ceil(
        width / fontSize
      );


    drops =
      Array.from(
        { length: columns },

        () =>
          Math.random() * -60
      );

  }



  function drawMatrix(timestamp = 0) {

    /*
      Slight FPS limitation improves mobile
      performance and battery usage.
    */

    if (
      timestamp - lastFrame < 34
    ) {

      animationId =
        requestAnimationFrame(
          drawMatrix
        );

      return;

    }


    lastFrame = timestamp;


    ctx.fillStyle =
      "rgba(248, 253, 249, 0.18)";


    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    ctx.font =
      `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;


    ctx.textBaseline =
      "top";


    for (
      let i = 0;
      i < drops.length;
      i++
    ) {

      const character =
        characters[
          Math.floor(
            Math.random() *
            characters.length
          )
        ];


      const x =
        i * fontSize;


      const y =
        drops[i] * fontSize;


      const bright =
        Math.random() > 0.93;


      if (bright) {

        ctx.fillStyle =
          "rgba(0, 170, 82, 0.62)";

      } else {

        const opacity =
          0.10 +
          Math.random() * 0.24;


        ctx.fillStyle =
          `rgba(0, 145, 68, ${opacity})`;

      }


      ctx.fillText(
        character,
        x,
        y
      );


      if (
        y > height &&
        Math.random() > 0.977
      ) {

        drops[i] =
          Math.random() * -25;

      }


      drops[i] +=
        window.innerWidth < 600
          ? 0.34
          : 0.45;

    }


    animationId =
      requestAnimationFrame(
        drawMatrix
      );

  }



  resizeMatrix();

  drawMatrix();



  let matrixResizeTimer;


  window.addEventListener(
    "resize",

    () => {

      clearTimeout(
        matrixResizeTimer
      );


      matrixResizeTimer =
        setTimeout(
          resizeMatrix,
          150
        );

    },

    {
      passive: true
    }

  );



  document.addEventListener(
    "visibilitychange",

    () => {

      if (document.hidden) {

        if (animationId) {

          cancelAnimationFrame(
            animationId
          );

          animationId = null;

        }

      } else {

        if (!animationId) {

          drawMatrix();

        }

      }

    }

  );

}



/* =========================================================
   PROJECT DATA
========================================================= */

const projects = {


  lab: {

    title:
      "Cybersecurity Home Lab + Network Discovery",

    summary:
      "An isolated cybersecurity lab designed to understand how systems communicate and how discovery and enumeration work in practice.",

    objective:
      "Build an isolated Kali Linux, Ubuntu and Windows environment. Discover hosts, observe ARP communication, identify open ports, enumerate services, capture traffic and create a basic network map.",

    evidence:
      "Network architecture diagram, terminal screenshots, Nmap results, Wireshark captures, PCAP files, technical notes and a GitHub README.",

    skills:
      "Virtual networking, IP addressing, MAC addressing, ARP, TCP/IP, Nmap, Wireshark and documentation.",

    relevance:
      "Builds the networking and enumeration foundation needed for penetration testing, vulnerability assessment and troubleshooting."

  },


  linux: {

    title:
      "Linux Security + Hardening",

    summary:
      "Assess a Linux system, identify weak configurations and demonstrate measurable improvements after hardening.",

    objective:
      "Review users, groups, permissions, processes, exposed services, SSH and firewall configuration, then harden the system and retest it.",

    evidence:
      "Before and after checklist, terminal evidence, configuration changes, screenshots and a short hardening report.",

    skills:
      "Linux permissions, SSH, services, firewall configuration, least privilege and system hardening.",

    relevance:
      "Useful for penetration testing, infrastructure assessments and remediation verification."

  },


  pcap: {

    title:
      "Network Traffic Investigation",

    summary:
      "Analyze packet captures to understand communication between systems and reconstruct network activity.",

    objective:
      "Identify communicating hosts, protocols, DNS requests, TCP sessions and HTTP traffic and explain the sequence of events.",

    evidence:
      "Annotated PCAP, Wireshark screenshots, filters, timeline and a short investigation report.",

    skills:
      "Wireshark, packet analysis, DNS, TCP, HTTP and network investigation.",

    relevance:
      "Useful for penetration testing, troubleshooting, incident investigation and network analysis."

  },


  va: {

    title:
      "Vulnerability Assessment + Manual Validation",

    summary:
      "Use vulnerability scanners as starting points and manually verify whether reported issues are real.",

    objective:
      "Run vulnerability discovery tools and classify findings as confirmed vulnerabilities, false positives, misconfigurations or informational issues.",

    evidence:
      "Scanner output, screenshots, manual validation notes, findings, executive summary and retest documentation.",

    skills:
      "Nmap, Nessus, Nikto, vulnerability validation, risk analysis, evidence collection and reporting.",

    relevance:
      "Reflects real VAPT work where automated scanner results must be manually verified before reporting."

  },


  web: {

    title:
      "Web Application VAPT",

    summary:
      "Perform a controlled assessment against an intentionally vulnerable web application.",

    objective:
      "Test authentication, authorization, access control, sessions, input handling and selected business logic weaknesses.",

    evidence:
      "Sanitized HTTP requests and responses, Burp captures, screenshots, findings, remediation recommendations and retest results.",

    skills:
      "HTTP, Burp Suite, authentication, authorization, access control, OWASP concepts and manual validation.",

    relevance:
      "Direct preparation for junior VAPT, penetration testing and application security roles."

  },


  automation: {

    title:
      "VAPT Workflow Automation",

    summary:
      "Build a Python utility that removes repetitive work from a practical security assessment workflow.",

    objective:
      "Automate tasks such as parsing Nmap XML, organizing evidence, tracking findings or preparing structured assessment data.",

    evidence:
      "GitHub repository, source code, README, sample input and output, screenshots, test cases and limitations.",

    skills:
      "Python, XML, JSON, file handling, error handling, automation and Git.",

    relevance:
      "Demonstrates how programming can improve practical cybersecurity workflows."

  }

};



/* =========================================================
   PROJECT MODAL
========================================================= */

const modal =
  document.getElementById(
    "projectModal"
  );


const closeModalButton =
  document.getElementById(
    "modalClose"
  );


const modalFields = {

  title:
    document.getElementById(
      "modalTitle"
    ),

  summary:
    document.getElementById(
      "modalSummary"
    ),

  objective:
    document.getElementById(
      "modalObjective"
    ),

  evidence:
    document.getElementById(
      "modalEvidence"
    ),

  skills:
    document.getElementById(
      "modalSkills"
    ),

  relevance:
    document.getElementById(
      "modalRelevance"
    )

};



function closeProjectModal() {

  if (!modal)
    return;


  if (modal.open) {

    modal.close();

  }


  document.body.classList.remove(
    "modal-open"
  );

}



document
  .querySelectorAll(
    ".project-detail"
  )
  .forEach(button => {

    button.addEventListener(
      "click",

      () => {

        if (!modal)
          return;


        const key =
          button.dataset.project;


        const project =
          projects[key];


        if (!project)
          return;


        Object
          .entries(modalFields)
          .forEach(
            ([field, element]) => {

              if (
                element &&
                project[field]
              ) {

                element.textContent =
                  project[field];

              }

            }
          );


        modal.showModal();


        document.body.classList.add(
          "modal-open"
        );

      }

    );

  });



if (
  closeModalButton &&
  modal
) {

  closeModalButton.addEventListener(
    "click",
    closeProjectModal
  );

}



if (modal) {

  modal.addEventListener(
    "click",

    event => {

      const rect =
        modal.getBoundingClientRect();


      const outside =

        event.clientX <
          rect.left ||

        event.clientX >
          rect.right ||

        event.clientY <
          rect.top ||

        event.clientY >
          rect.bottom;


      if (outside) {

        closeProjectModal();

      }

    }

  );


  modal.addEventListener(
    "close",

    () => {

      document.body.classList.remove(
        "modal-open"
      );

    }

  );

}



/* =========================================================
   CHIBI ANIMATION SYSTEM
========================================================= */

const interactiveChibis =
  document.querySelectorAll(
    ".interactive-chibi"
  );


const chibiTimeouts =
  new WeakMap();



function restartChibiAnimation(
  element
) {

  if (
    !element ||
    prefersReducedMotion
  ) {

    return;

  }


  const oldTimeout =
    chibiTimeouts.get(element);


  if (oldTimeout) {

    clearTimeout(oldTimeout);

  }


  element.classList.remove(
    "chibi-playing"
  );


  /*
    Force reflow so tapping the same mascot
    repeatedly restarts its animation.
  */

  void element.offsetWidth;


  element.classList.add(
    "chibi-playing"
  );


  const timeout =
    setTimeout(
      () => {

        element.classList.remove(
          "chibi-playing"
        );

      },

      1100
    );


  chibiTimeouts.set(
    element,
    timeout
  );

}



/* =========================================================
   DESKTOP: HOVER + FOCUS
========================================================= */

interactiveChibis.forEach(chibi => {


  if (finePointer) {

    chibi.addEventListener(
      "pointerenter",

      () => {

        chibi.classList.add(
          "chibi-hover"
        );


        restartChibiAnimation(
          chibi
        );

      }

    );


    chibi.addEventListener(
      "pointerleave",

      () => {

        chibi.classList.remove(
          "chibi-hover"
        );

      }

    );

  }



  chibi.addEventListener(
    "focus",

    () => {

      chibi.classList.add(
        "chibi-hover"
      );


      restartChibiAnimation(
        chibi
      );

    }

  );


  chibi.addEventListener(
    "blur",

    () => {

      chibi.classList.remove(
        "chibi-hover"
      );

    }

  );



  /* =======================================================
     MOBILE: TAP
  ======================================================= */

  chibi.addEventListener(
    "click",

    event => {

      /*
        Chibis don't navigate anywhere,
        so their tap can purely animate.
      */

      event.stopPropagation();


      restartChibiAnimation(
        chibi
      );


      if (!finePointer) {

        chibi.classList.add(
          "chibi-touch"
        );


        setTimeout(
          () => {

            chibi.classList.remove(
              "chibi-touch"
            );

          },

          900
        );

      }

    }

  );



  /* =======================================================
     KEYBOARD
  ======================================================= */

  chibi.addEventListener(
    "keydown",

    event => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();


        restartChibiAnimation(
          chibi
        );

      }

    }

  );

});



/* =========================================================
   ACTION-SPECIFIC CHIBI ANIMATION
========================================================= */

interactiveChibis.forEach(chibi => {

  const action =
    chibi.dataset.chibiAction;


  if (!action)
    return;


  chibi.classList.add(
    `chibi-action-${action}`
  );

});



/* =========================================================
   HERO CHIBI FOLLOW EFFECT
   DESKTOP ONLY
========================================================= */

const heroVisual =
  document.querySelector(
    ".hero-visual"
  );


const heroChibi =
  document.querySelector(
    ".hero-character-zone .chibi"
  );


if (
  heroVisual &&
  heroChibi &&
  finePointer &&
  !prefersReducedMotion
) {

  heroVisual.addEventListener(
    "pointermove",

    event => {

      /*
        Don't move the mascot while its
        dedicated animation is playing.
      */

      if (
        heroChibi.classList.contains(
          "chibi-playing"
        )
      ) {

        return;

      }


      const rect =
        heroVisual
          .getBoundingClientRect();


      const x =
        (
          event.clientX -
          rect.left
        ) / rect.width - .5;


      const y =
        (
          event.clientY -
          rect.top
        ) / rect.height - .5;


      heroChibi.style.setProperty(
        "--chibi-x",
        `${x * 8}px`
      );


      heroChibi.style.setProperty(
        "--chibi-y",
        `${y * 6}px`
      );


      heroChibi.style.setProperty(
        "--chibi-rotate",
        `${x * 2.5}deg`
      );

    }

  );


  heroVisual.addEventListener(
    "pointerleave",

    () => {

      heroChibi.style.removeProperty(
        "--chibi-x"
      );


      heroChibi.style.removeProperty(
        "--chibi-y"
      );


      heroChibi.style.removeProperty(
        "--chibi-rotate"
      );

    }

  );

}



/* =========================================================
   PROJECT CARD POINTER GLOW
   DESKTOP ONLY
========================================================= */

const projectCards =
  document.querySelectorAll(
    ".project-card"
  );


if (
  finePointer &&
  !prefersReducedMotion
) {

  projectCards.forEach(card => {

    card.addEventListener(
      "pointermove",

      event => {

        const rect =
          card.getBoundingClientRect();


        card.style.setProperty(
          "--mouse-x",
          `${event.clientX - rect.left}px`
        );


        card.style.setProperty(
          "--mouse-y",
          `${event.clientY - rect.top}px`
        );

      }

    );


    card.addEventListener(
      "pointerleave",

      () => {

        card.style.removeProperty(
          "--mouse-x"
        );


        card.style.removeProperty(
          "--mouse-y"
        );

      }

    );

  });

}



/* =========================================================
   ARROW INTERACTIONS
========================================================= */

const arrows =
  document.querySelectorAll(
    ".section-arrow, .project-detail, .icon-btn, .footer-top"
  );


arrows.forEach(element => {

  element.addEventListener(
    "pointerenter",

    () => {

      element.classList.add(
        "arrow-active"
      );

    }

  );


  element.addEventListener(
    "pointerleave",

    () => {

      element.classList.remove(
        "arrow-active"
      );

    }

  );

});



/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(link => {

    link.addEventListener(
      "click",

      event => {

        const href =
          link.getAttribute("href");


        if (
          !href ||
          href === "#"
        ) {

          return;

        }


        let target;

        try {

          target =
            document.querySelector(
              href
            );

        } catch {

          return;

        }


        if (!target)
          return;


        event.preventDefault();


        closeNavigation();


        target.scrollIntoView({

          behavior:
            prefersReducedMotion
              ? "auto"
              : "smooth",

          block:
            "start"

        });

      }

    );

  });



/* =========================================================
   FINAL ANGEL / DEVIL INTERACTION
========================================================= */

const finalScene =
  document.querySelector(
    ".final-scene"
  );


const angelSide =
  document.querySelector(
    ".angel-side"
  );


const devilSide =
  document.querySelector(
    ".devil-side"
  );


if (
  finalScene &&
  angelSide &&
  devilSide
) {

  function setFinalState(
    state
  ) {

    finalScene.classList.remove(
      "angel-focus",
      "devil-focus"
    );


    if (state) {

      finalScene.classList.add(
        state
      );

    }

  }


  if (finePointer) {

    angelSide.addEventListener(
      "pointerenter",

      () => {

        setFinalState(
          "angel-focus"
        );

      }

    );


    devilSide.addEventListener(
      "pointerenter",

      () => {

        setFinalState(
          "devil-focus"
        );

      }

    );


    finalScene.addEventListener(
      "pointerleave",

      () => {

        setFinalState(null);

      }

    );

  }



  /*
    Mobile tap switching.
  */

  angelSide.addEventListener(
    "click",

    () => {

      if (!finePointer) {

        setFinalState(
          "angel-focus"
        );

      }

    }

  );


  devilSide.addEventListener(
    "click",

    () => {

      if (!finePointer) {

        setFinalState(
          "devil-focus"
        );

      }

    }

  );

}



/* =========================================================
   PHONE PERFORMANCE
========================================================= */

let scrollTicking = false;


window.addEventListener(
  "scroll",

  () => {

    if (scrollTicking)
      return;


    scrollTicking = true;


    requestAnimationFrame(
      () => {

        /*
          Expose scroll position for optional
          CSS effects without running heavy JS.
        */

        document.documentElement.style
          .setProperty(
            "--scroll-y",
            `${window.scrollY}px`
          );


        scrollTicking = false;

      }
    );

  },

  {
    passive: true
  }

);



/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",

  event => {

    if (
      event.key !== "Escape"
    ) {

      return;

    }


    closeNavigation();


    if (
      modal &&
      modal.open
    ) {

      closeProjectModal();

    }

  }

);



/* =========================================================
   RESIZE CLEANUP
========================================================= */

window.addEventListener(
  "resize",

  () => {

    /*
      Prevent desktop/mobile menu state
      conflicts after screen rotation
      or resizing.
    */

    if (
      window.innerWidth > 900
    ) {

      closeNavigation();

    }

  },

  {
    passive: true
  }

);



/* =========================================================
   TOUCH FEEDBACK
========================================================= */

if (!finePointer) {

  const tappableItems =
    document.querySelectorAll(
      ".btn, .project-detail, .section-arrow, .topics span, .role-list span"
    );


  tappableItems.forEach(item => {

    item.addEventListener(
      "touchstart",

      () => {

        item.classList.add(
          "touch-active"
        );

      },

      {
        passive: true
      }

    );


    item.addEventListener(
      "touchend",

      () => {

        setTimeout(
          () => {

            item.classList.remove(
              "touch-active"
            );

          },

          180
        );

      },

      {
        passive: true
      }

    );

  });

}
