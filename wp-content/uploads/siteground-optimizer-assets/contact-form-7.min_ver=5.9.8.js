(() => {
  "use strict";
  const k = window.wp.i18n,
    d = (a) => Math.abs(parseInt(a, 10)),
    b = (a, b, c) => {
      const d = new CustomEvent(`wpcf7${b}`, { bubbles: !0, detail: c });
      "string" == typeof a && (a = document.querySelector(a)),
        a.dispatchEvent(d);
    },
    a = (c, a) => {
      const e = new Map([
        ["init", "init"],
        ["validation_failed", "invalid"],
        ["acceptance_missing", "unaccepted"],
        ["spam", "spam"],
        ["aborted", "aborted"],
        ["mail_sent", "sent"],
        ["mail_failed", "failed"],
        ["submitting", "submitting"],
        ["resetting", "resetting"],
        ["validating", "validating"],
        ["payment_required", "payment-required"],
      ]);
      e.has(a) && (a = e.get(a)),
        Array.from(e.values()).includes(a) ||
          (a = `custom-${(a = (a = a
            .replace(/[^0-9a-z]+/i, " ")
            .trim()).replace(/\s+/, "-"))}`);
      const d = c.getAttribute("data-status");
      if (
        ((c.wpcf7.status = a),
        c.setAttribute("data-status", a),
        c.classList.add(a),
        d && d !== a)
      ) {
        c.classList.remove(d);
        const a = {
          contactFormId: c.wpcf7.id,
          pluginVersion: c.wpcf7.pluginVersion,
          contactFormLocale: c.wpcf7.locale,
          unitTag: c.wpcf7.unitTag,
          containerPostId: c.wpcf7.containerPost,
          status: c.wpcf7.status,
          prevStatus: d,
        };
        b(c, "statuschanged", a);
      }
      return a;
    },
    c = (b) => {
      const { root: a, namespace: c = "contact-form-7/v1" } = wpcf7.api;
      return f.reduceRight(
        (a, b) => (c) => b(c, a),
        (l) => {
          let e,
            f,
            {
              url: g,
              path: b,
              endpoint: h,
              headers: d,
              body: i,
              data: j,
              ...m
            } = l;
          "string" == typeof h &&
            ((e = c.replace(/^\/|\/$/g, "")),
            (f = h.replace(/^\//, "")),
            (b = f ? e + "/" + f : e)),
            "string" == typeof b &&
              (-1 !== a.indexOf("?") && (b = b.replace("?", "&")),
              (b = b.replace(/^\//, "")),
              (g = a + b)),
            (d = { Accept: "application/json, */*;q=0.1", ...d }),
            delete d["X-WP-Nonce"],
            j &&
              ((i = JSON.stringify(j)),
              (d["Content-Type"] = "application/json"));
          const n = {
              code: "fetch_error",
              message: "You are probably offline.",
            },
            k = {
              code: "invalid_json",
              message: "The response is not a valid JSON response.",
            };
          return window
            .fetch(g || b || window.location.href, {
              ...m,
              headers: d,
              body: i,
            })
            .then(
              (a) =>
                Promise.resolve(a)
                  .then((a) => {
                    if (a.status >= 200 && a.status < 300) return a;
                    throw a;
                  })
                  .then((a) => {
                    if (204 === a.status) return null;
                    if (a && a.json)
                      return a.json().catch(() => {
                        throw k;
                      });
                    throw k;
                  }),
              () => {
                throw n;
              }
            );
        }
      )(b);
    },
    f = [];
  function o(b, d = {}) {
    const { target: c, scope: e = b, ...l } = d;
    if (void 0 === b.wpcf7?.schema) return;
    const g = { ...b.wpcf7.schema };
    if (void 0 !== c) {
      if (!b.contains(c)) return;
      if (!c.closest(".wpcf7-form-control-wrap[data-name]")) return;
      if (c.closest(".novalidate")) return;
    }
    const f = e.querySelectorAll(".wpcf7-form-control-wrap"),
      j = Array.from(f).reduce(
        (a, b) => (
          b.closest(".novalidate") ||
            b
              .querySelectorAll(":where( input, textarea, select ):enabled")
              .forEach((b) => {
                if (b.name)
                  switch (b.type) {
                    case "button":
                    case "image":
                    case "reset":
                    case "submit":
                      break;
                    case "checkbox":
                    case "radio":
                      b.checked && a.append(b.name, b.value);
                      break;
                    case "select-multiple":
                      for (const c of b.selectedOptions)
                        a.append(b.name, c.value);
                      break;
                    case "file":
                      for (const c of b.files) a.append(b.name, c);
                      break;
                    default:
                      a.append(b.name, b.value);
                  }
              }),
          a
        ),
        new FormData()
      ),
      k = b.getAttribute("data-status");
    Promise.resolve(a(b, "validating"))
      .then((a) => {
        if (void 0 !== swv) {
          const a = swv.validate(g, j, d);
          for (const g of f) {
            if (void 0 === g.dataset.name) continue;
            const d = g.dataset.name;
            if (a.has(d)) {
              const { error: c, validInputs: f } = a.get(d);
              i(b, d),
                void 0 !== c && h(b, d, c, { scope: e }),
                n(b, d, null != f ? f : []);
            }
            if (g.contains(c)) break;
          }
        }
      })
      .finally(() => {
        a(b, k);
      });
  }
  c.use = (a) => {
    f.unshift(a);
  };
  const h = (a, c, b, e) => {
      const { scope: g = a, ...h } = null != e ? e : {},
        f = `${a.wpcf7?.unitTag}-ve-${c}`.replaceAll(/[^0-9a-z_-]+/gi, ""),
        d = a.querySelector(
          `.wpcf7-form-control-wrap[data-name="${c}"] .wpcf7-form-control`
        );
      (() => {
        const c = document.createElement("li");
        c.setAttribute("id", f),
          d && d.id
            ? c.insertAdjacentHTML("beforeend", `<a href="#${d.id}">${b}</a>`)
            : c.insertAdjacentText("beforeend", b),
          a.wpcf7.parent
            .querySelector(".screen-reader-response ul")
            .appendChild(c);
      })(),
        g
          .querySelectorAll(`.wpcf7-form-control-wrap[data-name="${c}"]`)
          .forEach((c) => {
            const a = document.createElement("span");
            a.classList.add("wpcf7-not-valid-tip"),
              a.setAttribute("aria-hidden", "true"),
              a.insertAdjacentText("beforeend", b),
              c.appendChild(a),
              c.querySelectorAll("[aria-invalid]").forEach((a) => {
                a.setAttribute("aria-invalid", "true");
              }),
              c.querySelectorAll(".wpcf7-form-control").forEach((c) => {
                c.classList.add("wpcf7-not-valid"),
                  c.setAttribute("aria-describedby", f),
                  "function" == typeof c.setCustomValidity &&
                    c.setCustomValidity(b),
                  c.closest(".use-floating-validation-tip") &&
                    (c.addEventListener("focus", (b) => {
                      a.setAttribute("style", "display: none");
                    }),
                    a.addEventListener("click", (b) => {
                      a.setAttribute("style", "display: none");
                    }));
              });
          });
    },
    i = (a, b) => {
      const c = `${a.wpcf7?.unitTag}-ve-${b}`.replaceAll(/[^0-9a-z_-]+/gi, "");
      a.wpcf7.parent
        .querySelector(`.screen-reader-response ul li#${c}`)
        ?.remove(),
        a
          .querySelectorAll(`.wpcf7-form-control-wrap[data-name="${b}"]`)
          .forEach((a) => {
            a.querySelector(".wpcf7-not-valid-tip")?.remove(),
              a.querySelectorAll("[aria-invalid]").forEach((a) => {
                a.setAttribute("aria-invalid", "false");
              }),
              a.querySelectorAll(".wpcf7-form-control").forEach((a) => {
                a.removeAttribute("aria-describedby"),
                  a.classList.remove("wpcf7-not-valid"),
                  "function" == typeof a.setCustomValidity &&
                    a.setCustomValidity("");
              });
          });
    },
    n = (c, b, a) => {
      c.querySelectorAll(`[data-reflection-of="${b}"]`).forEach((c) => {
        if ("output" === c.tagName.toLowerCase()) {
          const b = c;
          0 === a.length && a.push(b.dataset.default),
            a.slice(0, 1).forEach((a) => {
              a instanceof File && (a = a.name), (b.textContent = a);
            });
        } else
          c.querySelectorAll("output").forEach((b) => {
            b.hasAttribute("data-default")
              ? 0 === a.length
                ? b.removeAttribute("hidden")
                : b.setAttribute("hidden", "hidden")
              : b.remove();
          }),
            a.forEach((a) => {
              a instanceof File && (a = a.name);
              const d = document.createElement("output");
              d.setAttribute("name", b), (d.textContent = a), c.appendChild(d);
            });
      });
    };
  function l(d, g = {}) {
    if (wpcf7.blocked) return e(d), void a(d, "submitting");
    const i = new FormData(d);
    g.submitter &&
      g.submitter.name &&
      i.append(g.submitter.name, g.submitter.value);
    const f = {
      contactFormId: d.wpcf7.id,
      pluginVersion: d.wpcf7.pluginVersion,
      contactFormLocale: d.wpcf7.locale,
      unitTag: d.wpcf7.unitTag,
      containerPostId: d.wpcf7.containerPost,
      status: d.wpcf7.status,
      inputs: Array.from(i, (a) => {
        const b = a[0],
          c = a[1];
        return !b.match(/^_/) && { name: b, value: c };
      }).filter((a) => !1 !== a),
      formData: i,
    };
    c({
      endpoint: `contact-forms/${d.wpcf7.id}/feedback`,
      method: "POST",
      body: i,
      wpcf7: { endpoint: "feedback", form: d, detail: f },
    })
      .then((c) => {
        const e = a(d, c.status);
        return (
          (f.status = c.status),
          (f.apiResponse = c),
          ["invalid", "unaccepted", "spam", "aborted"].includes(e)
            ? b(d, e, f)
            : ["sent", "failed"].includes(e) && b(d, `mail${e}`, f),
          b(d, "submit", f),
          c
        );
      })
      .then((a) => {
        a.posted_data_hash &&
          (d.querySelector('input[name="_wpcf7_posted_data_hash"]').value =
            a.posted_data_hash),
          "mail_sent" === a.status &&
            (d.reset(), (d.wpcf7.resetOnMailSent = !0)),
          a.invalid_fields &&
            a.invalid_fields.forEach((a) => {
              h(d, a.field, a.message);
            }),
          d.wpcf7.parent
            .querySelector('.screen-reader-response [role="status"]')
            .insertAdjacentText("beforeend", a.message),
          d.querySelectorAll(".wpcf7-response-output").forEach((b) => {
            b.innerText = a.message;
          });
      })
      .catch((a) => console.error(a));
  }
  c.use((c, d) => {
    if (c.wpcf7 && "feedback" === c.wpcf7.endpoint) {
      const { form: d, detail: f } = c.wpcf7;
      e(d), b(d, "beforesubmit", f), a(d, "submitting");
    }
    return d(c);
  });
  const e = (a) => {
    a.querySelectorAll(".wpcf7-form-control-wrap").forEach((b) => {
      b.dataset.name && i(a, b.dataset.name);
    }),
      (a.wpcf7.parent.querySelector(
        '.screen-reader-response [role="status"]'
      ).innerText = ""),
      a.querySelectorAll(".wpcf7-response-output").forEach((a) => {
        a.innerText = "";
      });
  };
  function m(d) {
    const f = new FormData(d),
      e = {
        contactFormId: d.wpcf7.id,
        pluginVersion: d.wpcf7.pluginVersion,
        contactFormLocale: d.wpcf7.locale,
        unitTag: d.wpcf7.unitTag,
        containerPostId: d.wpcf7.containerPost,
        status: d.wpcf7.status,
        inputs: Array.from(f, (a) => {
          const b = a[0],
            c = a[1];
          return !b.match(/^_/) && { name: b, value: c };
        }).filter((a) => !1 !== a),
        formData: f,
      };
    c({
      endpoint: `contact-forms/${d.wpcf7.id}/refill`,
      method: "GET",
      wpcf7: { endpoint: "refill", form: d, detail: e },
    })
      .then((c) => {
        d.wpcf7.resetOnMailSent
          ? (delete d.wpcf7.resetOnMailSent, a(d, "mail_sent"))
          : a(d, "init"),
          (e.apiResponse = c),
          b(d, "reset", e);
      })
      .catch((a) => console.error(a));
  }
  c.use((b, c) => {
    if (b.wpcf7 && "refill" === b.wpcf7.endpoint) {
      const { form: c, detail: d } = b.wpcf7;
      e(c), a(c, "resetting");
    }
    return c(b);
  });
  const j = (a, b) => {
      for (const c in b) {
        const d = b[c];
        a.querySelectorAll(`input[name="${c}"]`).forEach((a) => {
          a.value = "";
        }),
          a
            .querySelectorAll(`img.wpcf7-captcha-${c.replaceAll(":", "")}`)
            .forEach((a) => {
              a.setAttribute("src", d);
            });
        const e = /([0-9]+)\.(png|gif|jpeg)$/.exec(d);
        e &&
          a
            .querySelectorAll(`input[name="_wpcf7_captcha_challenge_${c}"]`)
            .forEach((a) => {
              a.value = e[1];
            });
      }
    },
    g = (b, a) => {
      for (const c in a) {
        const d = a[c][0],
          e = a[c][1];
        b.querySelectorAll(
          `.wpcf7-form-control-wrap[data-name="${c}"]`
        ).forEach((a) => {
          (a.querySelector(`input[name="${c}"]`).value = ""),
            (a.querySelector(".wpcf7-quiz-label").textContent = d),
            (a.querySelector(`input[name="_wpcf7_quiz_answer_${c}"]`).value =
              e);
        });
      }
    };
  function p(a) {
    const b = new FormData(a);
    (a.wpcf7 = {
      id: d(b.get("_wpcf7")),
      status: a.getAttribute("data-status"),
      pluginVersion: b.get("_wpcf7_version"),
      locale: b.get("_wpcf7_locale"),
      unitTag: b.get("_wpcf7_unit_tag"),
      containerPost: d(b.get("_wpcf7_container_post")),
      parent: a.closest(".wpcf7"),
      get schema() {
        return wpcf7.schemas.get(this.id);
      },
    }),
      wpcf7.schemas.set(a.wpcf7.id, void 0),
      a.querySelectorAll(".has-spinner").forEach((a) => {
        a.insertAdjacentHTML("afterend", '<span class="wpcf7-spinner"></span>');
      }),
      ((a) => {
        a.querySelectorAll(".wpcf7-exclusive-checkbox").forEach((b) => {
          b.addEventListener("change", (b) => {
            const c = b.target.getAttribute("name");
            a.querySelectorAll(`input[type="checkbox"][name="${c}"]`).forEach(
              (a) => {
                a !== b.target && (a.checked = !1);
              }
            );
          });
        });
      })(a),
      ((a) => {
        a.querySelectorAll(".has-free-text").forEach((d) => {
          const c = d.querySelector("input.wpcf7-free-text"),
            b = d.querySelector('input[type="checkbox"], input[type="radio"]');
          (c.disabled = !b.checked),
            a.addEventListener("change", (a) => {
              (c.disabled = !b.checked),
                a.target === b && b.checked && c.focus();
            });
        });
      })(a),
      ((a) => {
        a.querySelectorAll(".wpcf7-validates-as-url").forEach((a) => {
          a.addEventListener("change", (c) => {
            let b = a.value.trim();
            b &&
              !b.match(/^[a-z][a-z0-9.+-]*:/i) &&
              -1 !== b.indexOf(".") &&
              ((b = b.replace(/^\/+/, "")), (b = "http://" + b)),
              (a.value = b);
          });
        });
      })(a),
      ((a) => {
        if (
          !a.querySelector(".wpcf7-acceptance") ||
          a.classList.contains("wpcf7-acceptance-as-validation")
        )
          return;
        const b = () => {
          let b = !0;
          a.querySelectorAll(".wpcf7-acceptance").forEach((a) => {
            if (!b || a.classList.contains("optional")) return;
            const c = a.querySelector('input[type="checkbox"]');
            ((a.classList.contains("invert") && c.checked) ||
              (!a.classList.contains("invert") && !c.checked)) &&
              (b = !1);
          }),
            a.querySelectorAll(".wpcf7-submit").forEach((a) => {
              a.disabled = !b;
            });
        };
        b(),
          a.addEventListener("change", (a) => {
            b();
          }),
          a.addEventListener("wpcf7reset", (a) => {
            b();
          });
      })(a),
      ((a) => {
        const b = (a, b) => {
            const g = d(a.getAttribute("data-starting-value")),
              c = d(a.getAttribute("data-maximum-value")),
              e = d(a.getAttribute("data-minimum-value")),
              f = a.classList.contains("down")
                ? g - b.value.length
                : b.value.length;
            a.setAttribute("data-current-value", f),
              (a.innerText = f),
              c && c < b.value.length
                ? a.classList.add("too-long")
                : a.classList.remove("too-long"),
              e && b.value.length < e
                ? a.classList.add("too-short")
                : a.classList.remove("too-short");
          },
          c = (c) => {
            (c = { init: !1, ...c }),
              a.querySelectorAll(".wpcf7-character-count").forEach((e) => {
                const f = e.getAttribute("data-target-name"),
                  d = a.querySelector(`[name="${f}"]`);
                d &&
                  ((d.value = d.defaultValue),
                  b(e, d),
                  c.init &&
                    d.addEventListener("keyup", (a) => {
                      b(e, d);
                    }));
              });
          };
        c({ init: !0 }),
          a.addEventListener("wpcf7reset", (a) => {
            c();
          });
      })(a),
      window.addEventListener("load", (b) => {
        wpcf7.cached && a.reset();
      }),
      a.addEventListener("reset", (b) => {
        wpcf7.reset(a);
      }),
      a.addEventListener("submit", (b) => {
        wpcf7.submit(a, { submitter: b.submitter }), b.preventDefault();
      }),
      a.addEventListener("wpcf7submit", (b) => {
        b.detail.apiResponse.captcha && j(a, b.detail.apiResponse.captcha),
          b.detail.apiResponse.quiz && g(a, b.detail.apiResponse.quiz);
      }),
      a.addEventListener("wpcf7reset", (b) => {
        b.detail.apiResponse.captcha && j(a, b.detail.apiResponse.captcha),
          b.detail.apiResponse.quiz && g(a, b.detail.apiResponse.quiz);
      }),
      a.addEventListener("change", (b) => {
        b.target.closest(".wpcf7-form-control") &&
          wpcf7.validate(a, { target: b.target });
      }),
      a.addEventListener("wpcf7statuschanged", (b) => {
        const c = b.detail.status;
        a.querySelectorAll(".active-on-any").forEach((a) => {
          a.removeAttribute("inert"), a.classList.remove("active-on-any");
        }),
          a.querySelectorAll(`.inert-on-${c}`).forEach((a) => {
            a.setAttribute("inert", "inert"), a.classList.add("active-on-any");
          });
      });
  }
  document.addEventListener("DOMContentLoaded", (b) => {
    var a;
    if ("undefined" != typeof wpcf7)
      if (void 0 !== wpcf7.api)
        if ("function" == typeof window.fetch)
          if ("function" == typeof window.FormData)
            if ("function" == typeof NodeList.prototype.forEach)
              if ("function" == typeof String.prototype.replaceAll) {
                (wpcf7 = {
                  init: p,
                  submit: l,
                  reset: m,
                  validate: o,
                  schemas: new Map(),
                  ...(null !== (a = wpcf7) && void 0 !== a ? a : {}),
                }),
                  document.querySelectorAll("form .wpcf7").forEach((c) => {
                    const a = document.createElement("p");
                    a.setAttribute("class", "wpcf7-form-in-wrong-place");
                    const b = document.createElement("strong");
                    b.append((0, k.__)("Error:", "contact-form-7"));
                    const d = (0, k.__)(
                      "This contact form is placed in the wrong place.",
                      "contact-form-7"
                    );
                    a.append(b, " ", d), c.replaceWith(a);
                  }),
                  document.querySelectorAll(".wpcf7 > form").forEach((a) => {
                    wpcf7.init(a),
                      a.closest(".wpcf7").classList.replace("no-js", "js");
                  });
                for (const a of wpcf7.schemas.keys())
                  c({
                    endpoint: `contact-forms/${a}/feedback/schema`,
                    method: "GET",
                  }).then((b) => {
                    wpcf7.schemas.set(a, b);
                  });
              } else
                console.error(
                  "Your browser does not support String.replaceAll()."
                );
            else
              console.error(
                "Your browser does not support NodeList.forEach()."
              );
          else
            console.error("Your browser does not support window.FormData().");
        else console.error("Your browser does not support window.fetch().");
      else console.error("wpcf7.api is not defined.");
    else console.error("wpcf7 is not defined.");
  });
})();
