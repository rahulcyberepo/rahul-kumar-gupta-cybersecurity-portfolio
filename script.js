/* =========================================================
   RAHUL CYBERSECURITY PORTFOLIO
   script.js
========================================================= */

"use strict";


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

if (menuButton && nav) {

  menuButton.addEventListener("click", () => {

    const isOpen = nav.classList.toggle("open");

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  nav.querySelectorAll("a").forEach(link => {

    link.addEventListener("click", () => {

      nav.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    });

  });


  document.addEventListener("click", event => {

    const clickedInsideNav = nav.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (
      nav.classList.contains("open") &&
      !clickedInsideNav &&
      !clickedMenuButton
    ) {

      nav.classList.remove("open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

    }

  });

}



/* =========================================================
   CURRENT YEAR
========================================================= */

const yearElement = document.getElementById("year");

if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}



/* =========================================================
   REDUCED MOTION
========================================================= */

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;



/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if (reducedMotion) {

  revealElements.forEach(element => {

    element.classList.add("visible");

  });

} else {

  const revealObserver =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) return;


          entry.target.classList.add(
            "visible"
          );


          revealObserver.unobserve(
            entry.target
          );

        });

      },

      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }

    );


  revealElements.forEach(element => {

    revealObserver.observe(element);

  });

}



/* =========================================================
   HEADER SCROLL STATE
========================================================= */

const header =
  document.querySelector(".site-header");


const updateHeader = () => {

  if (!header) return;


  if (window.scrollY > 40) {

    header.classList.add("scrolled");

  } else {

    header.classList.remove("scrolled");

  }

};


updateHeader();


window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);



/* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

const sections =
  document.querySelectorAll(
    "main section[id]"
  );

const navLinks =
  document.querySelectorAll(
    ".site-nav a"
  );


if (sections.length && navLinks.length) {

  const sectionObserver =
    new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting)
            return;


          const id =
            entry.target.id;


          navLinks.forEach(link => {

            link.classList.remove(
              "active"
            );


            if (
              link.getAttribute("href") ===
              `#${id}`
            ) {

              link.classList.add(
                "active"
              );

            }

          });

        });

      },

      {
        rootMargin:
          "-35% 0px -55% 0px",

        threshold: 0
      }

    );


  sections.forEach(section => {

    sectionObserver.observe(section);

  });

}



/* =========================================================
   GREEN MATRIX HERO ANIMATION
========================================================= */

const canvas =
  document.getElementById(
    "matrixCanvas"
  );


if (canvas && !reducedMotion) {

  const ctx =
    canvas.getContext("2d");


  const matrixCharacters =

    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
    "$#@%&+-<>[]{}" +
    "アイウエオカキクケコ" +
    "サシスセソタチツテト";


  let fontSize = 15;

  let drops = [];

  let animationId = null;

  let canvasWidth = 0;

  let canvasHeight = 0;



  /* -------------------------
     RESIZE MATRIX
  ------------------------- */

  const resizeMatrix = () => {

    const rect =
      canvas.getBoundingClientRect();


    const dpr =
      Math.min(
        window.devicePixelRatio || 1,
        2
      );


    canvasWidth = rect.width;

    canvasHeight = rect.height;


    canvas.width =
      Math.floor(
        rect.width * dpr
      );


    canvas.height =
      Math.floor(
        rect.height * dpr
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
        canvasWidth / fontSize
      );


    drops =
      Array.from(

        {
          length: columns
        },

        () =>
          Math.random() * -80

      );

  };



  /* -------------------------
     MATRIX DRAW
  ------------------------- */

  const drawMatrix = () => {

    /*
      White transparent fade instead
      of black.

      This produces green Matrix rain
      suitable for the white theme.
    */

    ctx.fillStyle =
      "rgba(248, 253, 249, 0.13)";


    ctx.fillRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );


    ctx.font =
      `${fontSize}px ui-monospace, ` +
      `SFMono-Regular, Menlo, Consolas, monospace`;


    ctx.textBaseline = "top";


    for (
      let i = 0;
      i < drops.length;
      i++
    ) {

      const character =
        matrixCharacters[
          Math.floor(
            Math.random() *
            matrixCharacters.length
          )
        ];


      const x =
        i * fontSize;


      const y =
        drops[i] * fontSize;



      /*
        Mostly soft green characters,
        with occasional darker characters.
      */

      const bright =
        Math.random() > 0.92;


      if (bright) {

        ctx.fillStyle =
          "rgba(0, 185, 82, 0.78)";

      } else {

        const opacity =
          0.16 +
          Math.random() * 0.30;


        ctx.fillStyle =
          `rgba(0, 150, 70, ${opacity})`;

      }


      ctx.fillText(
        character,
        x,
        y
      );



      /*
        Restart individual stream
      */

      if (
        y > canvasHeight &&
        Math.random() > 0.976
      ) {

        drops[i] =
          Math.random() * -30;

      }


      /*
        Rain speed
      */

      drops[i] +=
        0.42 +
        Math.random() * 0.16;

    }


    animationId =
      requestAnimationFrame(
        drawMatrix
      );

  };



  resizeMatrix();

  drawMatrix();



  /* -------------------------
     RESPONSIVE MATRIX
  ------------------------- */

  let resizeTimer;


  window.addEventListener(
    "resize",

    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          resizeMatrix,
          120
        );

    },

    {
      passive: true
    }

  );



  /* -------------------------
     STOP MATRIX WHEN TAB
     IS NOT ACTIVE
  ------------------------- */

  document.addEventListener(
    "visibilitychange",

    () => {

      if (
        document.hidden &&
        animationId
      ) {

        cancelAnimationFrame(
          animationId
        );


        animationId = null;

      }

      else if (
        !document.hidden &&
        !animationId
      ) {

        drawMatrix();

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
      "An isolated cybersecurity lab designed to understand how systems communicate and how discovery and enumeration techniques work in practice.",

    objective:
      "Build an isolated Kali Linux, Ubuntu and Windows environment. Discover hosts, observe ARP communication, identify open ports, enumerate services, capture traffic and create a basic network map.",

    evidence:
      "Network architecture diagram, terminal screenshots, Nmap results, Wireshark captures, PCAP files, technical notes, GitHub README and a short research write-up.",

    skills:
      "Virtual networking, IP addressing, MAC addressing, ARP, TCP/IP, ports, services, Nmap, Wireshark and technical documentation.",

    relevance:
      "Creates the networking and enumeration foundation required for penetration testing, vulnerability assessment and technical troubleshooting."

  },


  linux: {

    title:
      "Linux Security + Hardening",

    summary:
      "A practical Linux security assessment focused on identifying weak configurations, improving the machine and verifying that the changes actually work.",

    objective:
      "Review users, groups, file permissions, running processes, services, SSH configuration and firewall rules. Identify weaknesses, harden the system and perform a structured retest.",

    evidence:
      "Before-and-after security checklist, terminal evidence, screenshots, configuration changes, remediation notes and a short Linux hardening report.",

    skills:
      "Linux administration, permissions, users and groups, SSH security, service management, firewall configuration, least privilege and system hardening.",

    relevance:
      "Useful for penetration testing, infrastructure reviews, Linux server assessments and remediation verification."

  },


  pcap: {

    title:
      "Network Traffic Investigation",

    summary:
      "A packet analysis project focused on understanding communication between systems and reconstructing network activity from captured traffic.",

    objective:
      "Inspect packet captures, identify communicating hosts, analyze protocols, reconstruct DNS and TCP activity and determine what happened during the captured session.",

    evidence:
      "Annotated PCAP files, Wireshark screenshots, filters used during analysis, packet-flow diagram, timeline and a short investigation report.",

    skills:
      "Wireshark, packet analysis, DNS, TCP, HTTP, network troubleshooting, traffic filtering and timeline reconstruction.",

    relevance:
      "Useful across penetration testing, network troubleshooting, incident investigation and security analysis."

  },


  va: {

    title:
      "Vulnerability Assessment + Manual Validation",

    summary:
      "A vulnerability assessment project designed to demonstrate that scanner results must be investigated and manually validated before being reported.",

    objective:
      "Run vulnerability discovery tools, review their findings and manually determine whether each issue is a confirmed vulnerability, false positive, misconfiguration or informational finding.",

    evidence:
      "Scanner output, screenshots, validation methodology, proof of findings, false-positive notes, executive summary, technical report and retest documentation.",

    skills:
      "Vulnerability assessment, Nmap, Nessus, Nikto, manual validation, evidence collection, risk analysis, CVSS concepts and technical reporting.",

    relevance:
      "Directly reflects real VAPT work where security professionals must validate automated findings before reporting them to clients."

  },


  web: {

    title:
      "Web Application VAPT",

    summary:
      "A controlled web application security assessment performed against an intentionally vulnerable application.",

    objective:
      "Test authentication, authorization, access control, sessions, input handling and selected business-logic weaknesses while documenting root cause, impact and remediation.",

    evidence:
      "Sanitized HTTP requests and responses, Burp Suite captures, screenshots, vulnerability findings, remediation recommendations and retest results.",

    skills:
      "HTTP, Burp Suite, authentication testing, authorization testing, access control, OWASP concepts, manual validation and security reporting.",

    relevance:
      "Direct preparation for junior VAPT, penetration testing, web security and application security responsibilities."

  },


  automation: {

    title:
      "VAPT Workflow Automation",

    summary:
      "A Python automation project built around a real security assessment workflow instead of creating another generic scanner.",

    objective:
      "Automate a repetitive penetration-testing task such as parsing Nmap XML, organizing evidence, tracking findings or generating structured assessment data.",

    evidence:
      "GitHub repository, source code, README documentation, sample inputs, sample outputs, screenshots, test cases and documented limitations.",

    skills:
      "Python, XML, JSON, CSV, regex, file handling, error handling, automation logic, Git and technical documentation.",

    relevance:
      "Demonstrates the ability to use programming to improve real cybersecurity workflows and reduce repetitive manual work."

  }

};



/* =========================================================
   PROJECT MODAL
========================================================= */

const modal =
  document.getElementById(
    "projectModal"
  );


const closeButton =
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



/* -------------------------
   OPEN PROJECT
------------------------- */

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


        const projectKey =
          button.dataset.project;


        const data =
          projects[projectKey];


        if (!data)
          return;



        Object
          .keys(modalFields)
          .forEach(key => {

            if (
              modalFields[key] &&
              data[key]
            ) {

              modalFields[key]
                .textContent =
                data[key];

            }

          });



        modal.showModal();


        document.body.classList.add(
          "modal-open"
        );

      }

    );

  });



/* -------------------------
   CLOSE MODAL
------------------------- */

const closeModal = () => {

  if (!modal)
    return;


  modal.close();


  document.body.classList.remove(
    "modal-open"
  );

};



if (
  closeButton &&
  modal
) {

  closeButton.addEventListener(
    "click",
    closeModal
  );

}



/* -------------------------
   CLICK OUTSIDE MODAL
------------------------- */

if (modal) {

  modal.addEventListener(
    "click",

    event => {

      const rect =
        modal.getBoundingClientRect();


      const clickedOutside =

        event.clientX <
          rect.left ||

        event.clientX >
          rect.right ||

        event.clientY <
          rect.top ||

        event.clientY >
          rect.bottom;


      if (clickedOutside) {

        closeModal();

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
   PROJECT CARD POINTER EFFECT
========================================================= */

const projectCards =
  document.querySelectorAll(
    ".project-card"
  );


if (
  !reducedMotion &&
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  projectCards.forEach(card => {

    card.addEventListener(
      "pointermove",

      event => {

        const rect =
          card.getBoundingClientRect();


        const x =
          event.clientX -
          rect.left;


        const y =
          event.clientY -
          rect.top;


        card.style.setProperty(
          "--mouse-x",
          `${x}px`
        );


        card.style.setProperty(
          "--mouse-y",
          `${y}px`
        );

      }

    );

  });

}



/* =========================================================
   CHIBI INTERACTION
========================================================= */

const chibis =
  document.querySelectorAll(
    ".chibi, .chibi-mini"
  );


if (!reducedMotion) {

  chibis.forEach(chibi => {

    chibi.addEventListener(
      "pointerenter",

      () => {

        chibi.classList.add(
          "chibi-active"
        );

      }

    );


    chibi.addEventListener(
      "pointerleave",

      () => {

        chibi.classList.remove(
          "chibi-active"
        );

      }

    );

  });

}



/* =========================================================
   HERO CHIBI MOUSE REACTION
========================================================= */

const heroVisual =
  document.querySelector(
    ".hero-visual"
  );


const heroChibi =
  document.querySelector(
    ".hero-chibi .chibi"
  );


if (
  heroVisual &&
  heroChibi &&
  !reducedMotion &&
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  heroVisual.addEventListener(
    "pointermove",

    event => {

      const rect =
        heroVisual
          .getBoundingClientRect();


      const centerX =
        rect.left +
        rect.width / 2;


      const centerY =
        rect.top +
        rect.height / 2;


      const relativeX =
        (
          event.clientX -
          centerX
        ) / rect.width;


      const relativeY =
        (
          event.clientY -
          centerY
        ) / rect.height;


      const moveX =
        relativeX * 12;


      const moveY =
        relativeY * 8;


      const rotate =
        relativeX * 3;


      heroChibi.style.transform =
        `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;

    }

  );


  heroVisual.addEventListener(
    "pointerleave",

    () => {

      heroChibi.style.transform = "";

    }

  );

}



/* =========================================================
   HERO FLOATING SYMBOL PARALLAX
========================================================= */

const hero =
  document.querySelector(
    ".hero"
  );


const floatingSymbols =
  document.querySelectorAll(
    ".floating-symbol"
  );


if (
  hero &&
  floatingSymbols.length &&
  !reducedMotion &&
  window.matchMedia(
    "(pointer: fine)"
  ).matches
) {

  hero.addEventListener(
    "pointermove",

    event => {

      const rect =
        hero.getBoundingClientRect();


      const x =
        (
          event.clientX -
          rect.left
        ) / rect.width - 0.5;


      const y =
        (
          event.clientY -
          rect.top
        ) / rect.height - 0.5;



      floatingSymbols.forEach(
        (symbol, index) => {

          const strength =
            (index + 1) * 7;


          symbol.style.transform =
            `translate(
              ${x * strength}px,
              ${y * strength}px
            )`;

        }

      );

    }

  );


  hero.addEventListener(
    "pointerleave",

    () => {

      floatingSymbols.forEach(
        symbol => {

          symbol.style.transform = "";

        }

      );

    }

  );

}



/* =========================================================
   ANGEL / DEVIL FINAL SECTION INTERACTION
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
  devilSide &&
  !reducedMotion
) {

  angelSide.addEventListener(
    "pointerenter",

    () => {

      finalScene.classList.add(
        "angel-focus"
      );


      finalScene.classList.remove(
        "devil-focus"
      );

    }

  );


  devilSide.addEventListener(
    "pointerenter",

    () => {

      finalScene.classList.add(
        "devil-focus"
      );


      finalScene.classList.remove(
        "angel-focus"
      );

    }

  );


  finalScene.addEventListener(
    "pointerleave",

    () => {

      finalScene.classList.remove(
        "angel-focus",
        "devil-focus"
      );

    }

  );

}



/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach(anchor => {

    anchor.addEventListener(
      "click",

      event => {

        const href =
          anchor.getAttribute("href");


        if (
          !href ||
          href === "#"
        ) {

          return;

        }


        const target =
          document.querySelector(href);


        if (!target)
          return;


        event.preventDefault();


        target.scrollIntoView({

          behavior:
            reducedMotion
              ? "auto"
              : "smooth",

          block: "start"

        });

      }

    );

  });



/* =========================================================
   KEYBOARD ACCESSIBILITY
========================================================= */

document.addEventListener(
  "keydown",

  event => {

    /*
      Close mobile menu with Escape
    */

    if (
      event.key === "Escape" &&
      nav &&
      nav.classList.contains("open")
    ) {

      nav.classList.remove(
        "open"
      );


      if (menuButton) {

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }

  }

);
