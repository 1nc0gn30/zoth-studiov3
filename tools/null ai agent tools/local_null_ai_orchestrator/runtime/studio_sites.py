"""Scaffold a previewable site and run a local static server."""

from __future__ import annotations

import html
import json
import os
import re
import signal
import socket
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

_LOCK = threading.Lock()
_PREVIEWS: dict[str, dict[str, Any]] = {}

_PHONE_RE = re.compile(
    r"(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}"
)
_META_BRIEF_RE = re.compile(
    r"^\s*(build|create|make|generate|scaffold|write|design|spin up)\b",
    re.I,
)

_HAMPTON_CITIES = (
    "Virginia Beach",
    "Norfolk",
    "Chesapeake",
    "Portsmouth",
    "Suffolk",
    "Hampton",
    "Newport News",
)

_AREA_HINTS = {
    "hampton roads": ("Hampton Roads", list(_HAMPTON_CITIES)),
    "757": ("Hampton Roads", list(_HAMPTON_CITIES)),
    "virginia beach": ("Virginia Beach", ["Virginia Beach", "Oceana", "Kempsville", "Pungo"]),
    "norfolk": ("Norfolk", ["Norfolk", "Ghent", "Ocean View", "East Beach"]),
    "chesapeake": ("Chesapeake", ["Chesapeake", "Great Bridge", "Greenbrier", "Deep Creek"]),
    "newport news": ("Newport News", ["Newport News", "Denbigh", "Hilton Village"]),
    "portsmouth": ("Portsmouth", ["Portsmouth", "Olde Towne", "Churchland"]),
    "suffolk": ("Suffolk", ["Suffolk", "North Suffolk"]),
    "hampton": ("Hampton", ["Hampton", "Phoebus", "Buckroe"]),
    "richmond": ("Richmond", ["Richmond", "Short Pump", "Midlothian"]),
}


def orch_dir() -> Path:
    return Path(__file__).resolve().parents[1]


def projects_dir() -> Path:
    d = orch_dir() / "projects"
    d.mkdir(parents=True, exist_ok=True)
    return d


def safe_name(name: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", (name or "").lower()).strip("-")
    return slug[:48] or "new-site"


def project_dir(name: str) -> Path:
    return projects_dir() / safe_name(name)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _used_ports() -> set[int]:
    ports = set()
    with _LOCK:
        for rec in _PREVIEWS.values():
            port = rec.get("port")
            if isinstance(port, int):
                ports.add(port)
    return ports


def _free_port(start: int = 4545) -> int:
    reserved = _used_ports()
    for port in range(start, start + 80):
        if port in reserved:
            continue
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(0.15)
        try:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
        finally:
            s.close()
    raise RuntimeError("no free preview port")


def _port_open(port: int) -> bool:
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(0.2)
    try:
        return s.connect_ex(("127.0.0.1", port)) == 0
    finally:
        s.close()


def load_manifest(name: str) -> dict[str, Any]:
    path = project_dir(name) / "project.json"
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def save_manifest(name: str, data: dict[str, Any]) -> dict[str, Any]:
    root = project_dir(name)
    root.mkdir(parents=True, exist_ok=True)
    path = root / "project.json"
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return data


def list_projects() -> list[dict[str, Any]]:
    out = []
    for d in sorted(projects_dir().iterdir()):
        if not d.is_dir():
            continue
        man = load_manifest(d.name)
        if not man:
            man = {"id": d.name, "name": d.name, "status": "unknown", "dir": str(d)}
        man.setdefault("id", d.name)
        man.setdefault("dir", str(d))
        out.append(man)
    return out


def _esc(text: Any) -> str:
    return html.escape(str(text or ""), quote=True)


def _display_name(raw: str) -> str:
    text = (raw or "").strip()
    if not text:
        return "Neighborhood Crew"
    if re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)+", text.lower()):
        return " ".join(part.capitalize() for part in text.lower().split("-"))
    return text


def _is_meta_brief(text: str) -> bool:
    first = (text or "").strip().split("\n", 1)[0]
    if not first:
        return True
    if _META_BRIEF_RE.match(first):
        return True
    return bool(re.search(r"\b(landing page|website|web site|scaffold|quote form)\b", first, re.I) and re.search(r"\b(build|create|make|for)\b", first, re.I))


def _extract_phone(text: str) -> str:
    match = _PHONE_RE.search(text or "")
    return match.group(0).strip() if match else ""


def _extract_area(blob: str) -> tuple[str, list[str]]:
    low = blob.lower()
    for key, (label, cities) in _AREA_HINTS.items():
        if key in low:
            return label, cities
    return "", []


def _vertical(blob: str, site_type: str) -> str:
    if any(w in blob for w in ("lawn", "landscap", "mulch", "mow", "yard", "turf", "brush")):
        return "lawn"
    if any(w in blob for w in ("paint", "painter", "cabinet")):
        return "paint"
    if any(w in blob for w in ("fence", "fencing")):
        return "fence"
    if any(w in blob for w in ("hvac", "furnace", "ac repair", "air condition")):
        return "hvac"
    if any(w in blob for w in ("clean", "maid", "janitor")):
        return "clean"
    if site_type == "saas":
        return "saas"
    if site_type in {"portfolio", "agency"}:
        return "studio"
    return "service"


def _pages(config: dict[str, Any], vertical: str) -> list[str]:
    raw = config.get("pages") or "home, about, contact"
    if isinstance(raw, list):
        items = [str(p).strip().lower() for p in raw]
    else:
        items = [p.strip().lower() for p in str(raw).split(",")]
    pages = [p for p in items if p]
    if "home" not in pages:
        pages.insert(0, "home")
    if vertical in {"lawn", "paint", "fence", "hvac", "clean", "service"} and "services" not in pages:
        pages.insert(1, "services")
    if "about" not in pages:
        pages.append("about")
    if "contact" not in pages:
        pages.append("contact")
    seen: list[str] = []
    for p in pages:
        if p not in seen:
            seen.append(p)
    return seen[:8]


def _copy_pack(config: dict[str, Any]) -> dict[str, Any]:
    raw_name = (config.get("name") or "Studio Site").strip()
    brief = (config.get("instructions") or "").strip()
    site_type = (config.get("site_type") or "landing").strip()
    tone = (config.get("tone") or "professional").strip()
    keywords = (config.get("keywords") or "").strip()
    blob = f"{raw_name} {brief} {site_type} {keywords}".lower()
    vertical = _vertical(blob, site_type)
    name = _display_name(raw_name)
    phone = _extract_phone(f"{brief} {keywords}")
    area, cities = _extract_area(blob)
    customer_brief = "" if _is_meta_brief(brief) else brief

    if vertical == "lawn":
        area = area or "Hampton Roads"
        cities = cities or list(_HAMPTON_CITIES)
        kicker = f"{area} lawn care"
        headline = "The yard stays sharp. The crew actually shows up."
        lede = customer_brief or (
            f"Weekly mowing, bed work, and lot cleanup for homes and small commercial lots around {area}. "
            "Same crew, clean edges, no disappearing mid-season."
        )
        cta = "Get a free quote"
        services = [
            ("Weekly mow & edge", "Cut, edge, and blow. Clean lines, not a rushed pass.", "From $40"),
            ("Beds & mulch", "Redefine the edge, pull the weeds, put the beds back in order.", "From $175"),
            ("Brush & lot clear", "Overgrown corners, fence lines, and small-lot haul-off.", "By quote"),
            ("Seasonal reset", "Spring open, summer hold, fall leaf-out — one number all year.", "From $220"),
        ]
        extras = [
            ("Aeration & overseed", "Open compacted 757 clay and thicken the thin spots."),
            ("Shrub trim", "Keep hedges off the walk and windows without boxing them to death."),
            ("Leaf & storm clean", "Off the beds, out of the gutters' way, stacked or hauled."),
        ]
        steps = [
            ("Walk the lot", "Send a photo or we swing by. You get a number, not a maybe."),
            ("Lock a window", "Same-week slots when we can. Recurring routes stay on a weekday."),
            ("Leave it cleaner", "Edges, clippings blown, gate shut. If something is off, we come back."),
        ]
        reviews = [
            ("Marcus · Kempsville", "They edged the walk the first visit. Previous guy never did."),
            ("Elena · Ghent", "Texted when they were 10 minutes out. Yard looked finished, not just cut."),
            ("Drew · Great Bridge", "Cleared the back fence line in one afternoon. Fair price, no extra trip."),
        ]
        faqs = [
            ("Do I have to be home?", "No. Gate code or side latch in the quote notes is enough."),
            ("What if it rains?", "We slide the visit. Recurring customers stay on their weekday when we can."),
            ("Do you haul debris?", "Yes on clear-outs and bed resets. Regular mows stay on-site unless you ask."),
            ("Commercial lots?", "Small offices, churches, and duplexes — yes. Big HOA bids are a different conversation."),
        ]
        about = (
            f"{name} is a local crew, not a call center with a mower. We take on the yards around {area} "
            "that need to look kept every week — and the ones that got away over a wet spring."
        )
        promise = "If a pass looks rushed, we come back on us. That is the whole policy."
        hours = "Mon–Sat · 7:30a–6:00p"
        visit_includes = [
            "Mow at a height that fits the season, not a scalped shortcut",
            "String-edge walks, drives, and beds",
            "Blow hard surfaces so the house does not eat clippings",
            "A photo if something looks off — leaning fence, wet low spot, wasp nest",
        ]
    elif vertical == "saas":
        area = area or "local-first"
        cities = cities or ["Workspace", "Preview", "Deploy"]
        kicker = "Local-first product"
        headline = name
        lede = customer_brief or "A focused tool that ships without a cloud tax."
        cta = "Start a project"
        services = [
            ("Workspace", "Keep every brief, model, and deploy in one place.", "Included"),
            ("Agents", "Hand work to the model that is actually running.", "Optional"),
            ("Preview", "See the site before anyone else does.", "Local"),
            ("Connectors", "Netlify, GitHub, vault — when you are ready.", "Later"),
        ]
        extras = []
        steps = [
            ("Write the brief", "Say who it is for and what has to work on day one."),
            ("Generate pages", "Local HTML you can open, not a blank starter."),
            ("Preview locally", "A real URL on your machine. Deploy when you want."),
        ]
        reviews = [
            ("Ava · studio", "I could send the preview link the same afternoon."),
            ("Jon · ops", "No waiting on a remote agent just to see a homepage."),
        ]
        faqs = [
            ("Does this need a deploy?", "No. Preview runs on localhost."),
            ("Can I hand this to an agent later?", "Yes. The folder is the whole project."),
        ]
        about = customer_brief or f"{name} keeps the build on your machine."
        promise = "Preview first. Cloud later, if ever."
        hours = "Whenever you are building"
        visit_includes = []
    else:
        area = area or "your area"
        cities = cities or ["Nearby neighborhoods"]
        kicker = f"{area} · {site_type.replace('-', ' ')}"
        headline = name
        lede = customer_brief or f"Straightforward {site_type.replace('-', ' ')} work with a number you can actually reach."
        cta = "Request a visit"
        services = [
            ("Consult", "We look at the job and price the work, not a package you do not need.", "Free"),
            ("The work", "A crew that finishes the scope you approved.", "By quote"),
            ("Follow-up", "If something is off after the visit, we come back.", "Included"),
            ("Recurring", "Keep a slot if the job repeats.", "Optional"),
        ]
        extras = []
        steps = [
            ("Tell us the job", "Address, photos, and the outcome you want."),
            ("Get a number", "Written scope. No surprise add-ons at the door."),
            ("We do the work", "Show up in the window we booked."),
        ]
        reviews = [
            ("Sam · local", "Quoted the same day and finished when they said."),
            ("Priya · nearby", "Cleaned up after themselves. That is rarer than it should be."),
        ]
        faqs = [
            ("How fast can you come out?", "Often this week. Same-day only if the route allows."),
            ("Do you take cards?", "Yes — card, cash, or invoice for commercial."),
        ]
        about = customer_brief or f"{name} is a small crew doing {site_type.replace('-', ' ')} work around {area}."
        promise = "Clear scope, show up, finish."
        hours = "Mon–Fri · 8:00a–5:00p"
        visit_includes = []

    return {
        "name": name,
        "slug_name": raw_name,
        "kicker": kicker,
        "headline": headline,
        "lede": lede,
        "cta": cta,
        "brief": customer_brief,
        "raw_brief": brief,
        "tone": tone,
        "site_type": site_type,
        "vertical": vertical,
        "services": services,
        "extras": extras,
        "steps": steps,
        "reviews": reviews,
        "faqs": faqs,
        "about": about,
        "promise": promise,
        "area": area,
        "cities": cities,
        "phone": phone,
        "hours": hours,
        "visit_includes": visit_includes,
        "email": "quotes@" + re.sub(r"[^a-z0-9]+", "", name.lower())[:18] + ".local",
    }


def _nav(pages: list[str], current: str) -> str:
    bits = []
    for p in pages:
        href = "index.html" if p in ("home", "index") else f"{p}.html"
        cls = " on" if p == current else ""
        label = "Home" if p in ("home", "index") else p.replace("-", " ").title()
        bits.append(f'<a class="nav{cls}" href="{href}">{_esc(label)}</a>')
    return "".join(bits)


def _phone_block(pack: dict[str, Any], cls: str = "phone") -> str:
    phone = pack.get("phone") or ""
    if not phone:
        return f'<a class="{cls}" href="contact.html">Request a quote</a>'
    href = "tel:" + re.sub(r"[^\d+]", "", phone)
    return f'<a class="{cls}" href="{href}">{_esc(phone)}</a>'


def _footer(pack: dict[str, Any], pages: list[str]) -> str:
    links = []
    for p in pages:
        href = "index.html" if p in ("home", "index") else f"{p}.html"
        label = "Home" if p in ("home", "index") else p.replace("-", " ").title()
        links.append(f'<a href="{href}">{_esc(label)}</a>')
    cities = " · ".join(pack.get("cities") or [])
    phone = _phone_block(pack, "foot-phone")
    return f"""
  <footer>
    <div class="foot-grid">
      <div>
        <p class="foot-mark">{_esc(pack['name'])}</p>
        <p>{_esc(pack['area'])}</p>
        <p>{_esc(pack['hours'])}</p>
        {phone}
      </div>
      <div>
        <p class="foot-label">On this site</p>
        <p class="foot-links">{''.join(links)}</p>
      </div>
      <div>
        <p class="foot-label">Where we work</p>
        <p>{_esc(cities)}</p>
      </div>
    </div>
    <p class="fine">{_esc(pack['name'])} · local preview · form stays on this machine</p>
  </footer>
"""


def _shell(pack: dict[str, Any], pages: list[str], current: str, main: str) -> str:
    title = pack["name"] if current in ("home", "index") else f"{current.replace('-', ' ').title()} · {pack['name']}"
    desc = pack["lede"][:180]
    slug = safe_name(str(pack.get("slug_name") or pack["name"]))
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{_esc(title)}</title>
  <meta name="description" content="{_esc(desc)}" />
  <meta name="theme-color" content="#0b100d" />
  <meta property="og:title" content="{_esc(title)}" />
  <meta property="og:description" content="{_esc(desc)}" />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="assets/site.css" />
</head>
<body data-site="{_esc(slug)}" data-preview="zoth-preview:{_esc(slug)}">
  <!-- zoth-preview:{_esc(slug)} -->
  <a class="skip" href="#main">Skip to content</a>
  <div class="topbar">
    <span>{_esc(pack['area'])}</span>
    <span>{_esc(pack['hours'])}</span>
    {_phone_block(pack, "top-phone")}
  </div>
  <header class="top">
    <a class="mark" href="index.html">
      <span class="mark-dot" aria-hidden="true"></span>
      {_esc(pack['name'])}
    </a>
    <nav>{_nav(pages, current)}</nav>
    <a class="cta cta-sm" href="contact.html">{_esc(pack['cta'])}</a>
  </header>
  <main id="main">{main}</main>
  {_footer(pack, pages)}
  <script src="assets/site.js"></script>
</body>
</html>
"""


def _yard_art() -> str:
    return """
    <div class="yard" aria-hidden="true">
      <svg viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#17301f"/>
            <stop offset="1" stop-color="#0c1610"/>
          </linearGradient>
        </defs>
        <rect width="420" height="320" fill="url(#sky)"/>
        <circle cx="330" cy="70" r="28" fill="#c5f24a" opacity=".85"/>
        <path d="M0 210 C80 170 140 230 210 190 C280 150 330 210 420 168 L420 320 L0 320 Z" fill="#1b3a24"/>
        <path d="M0 248 C70 220 150 268 230 236 C310 204 360 250 420 228 L420 320 L0 320 Z" fill="#14281a"/>
        <rect x="58" y="148" width="78" height="72" fill="#1e2a20"/>
        <polygon points="50,148 97,112 144,148" fill="#2a4030"/>
        <rect x="88" y="168" width="18" height="52" fill="#0e1610"/>
        <rect x="68" y="162" width="16" height="14" fill="#c5f24a" opacity=".35"/>
        <path d="M300 210 L308 150 L316 210" stroke="#8fb36a" stroke-width="4" fill="none"/>
        <path d="M340 206 L350 128 L360 206" stroke="#6f9454" stroke-width="5" fill="none"/>
        <path d="M372 214 L378 160 L386 214" stroke="#8fb36a" stroke-width="3" fill="none"/>
        <circle cx="308" cy="146" r="16" fill="#2f5a34"/>
        <circle cx="350" cy="122" r="22" fill="#3a6b3c"/>
        <circle cx="378" cy="156" r="12" fill="#2f5a34"/>
      </svg>
      <div class="yard-card">
        <strong>Same-week slots</strong>
        <span>Photo the lot. We price the work.</span>
      </div>
    </div>
    """


def _services_grid(pack: dict[str, Any]) -> str:
    cards = []
    for title, body, price in pack["services"]:
        cards.append(
            f'<article class="card"><p class="price">{_esc(price)}</p>'
            f"<h2>{_esc(title)}</h2><p>{_esc(body)}</p></article>"
        )
    return f'<section class="band"><div class="wrap"><p class="kicker">The work</p><h2 class="sec">What we actually do</h2><div class="grid">{"".join(cards)}</div></div></section>'


def _home_main(pack: dict[str, Any]) -> str:
    chips = "".join(
        f"<li>{_esc(item)}</li>"
        for item in (pack["cities"][:5] or [pack["area"]])
    )
    steps = "".join(
        f'<li><span class="num">{i}</span><div><h3>{_esc(title)}</h3><p>{_esc(body)}</p></div></li>'
        for i, (title, body) in enumerate(pack["steps"], 1)
    )
    reviews = "".join(
        f"<figure class=\"quote\"><blockquote>{_esc(body)}</blockquote><figcaption>{_esc(who)}</figcaption></figure>"
        for who, body in pack["reviews"]
    )
    faqs = "".join(
        f"<details><summary>{_esc(q)}</summary><p>{_esc(a)}</p></details>"
        for q, a in pack["faqs"]
    )
    phone = _phone_block(pack, "cta ghost")
    return f"""
    <section class="hero">
      <div class="hero-copy">
        <p class="kicker">{_esc(pack['kicker'])}</p>
        <h1>{_esc(pack['headline'])}</h1>
        <p class="lede">{_esc(pack['lede'])}</p>
        <div class="cta-row">
          <a class="cta" href="contact.html">{_esc(pack['cta'])}</a>
          {phone}
        </div>
        <ul class="trust">
          <li>Local crew</li>
          <li>Insured</li>
          <li>Photo quotes</li>
        </ul>
      </div>
      {_yard_art()}
    </section>
    {_services_grid(pack)}
    <section class="band alt">
      <div class="wrap split">
        <div>
          <p class="kicker">How a job goes</p>
          <h2 class="sec">No mystery week. No disappearing after the deposit.</h2>
          <p class="lede">{_esc(pack['promise'])}</p>
        </div>
        <ol class="steps">{steps}</ol>
      </div>
    </section>
    <section class="band">
      <div class="wrap">
        <p class="kicker">Service area</p>
        <h2 class="sec">We stay close so the route stays honest.</h2>
        <ul class="cities">{chips}</ul>
      </div>
    </section>
    <section class="band alt">
      <div class="wrap">
        <p class="kicker">Neighbors</p>
        <h2 class="sec">What people say after the first cut</h2>
        <div class="quotes">{reviews}</div>
      </div>
    </section>
    <section class="band">
      <div class="wrap split">
        <div>
          <p class="kicker">Questions</p>
          <h2 class="sec">The usual ones before we book</h2>
        </div>
        <div class="faq">{faqs}</div>
      </div>
    </section>
    <section class="closer">
      <div class="wrap">
        <p class="kicker">Ready</p>
        <h2 class="sec">Send the address. We will tell you what the yard needs.</h2>
        <a class="cta" href="contact.html">{_esc(pack['cta'])}</a>
      </div>
    </section>
    """


def _services_main(pack: dict[str, Any]) -> str:
    extra = "".join(
        f'<article class="card"><h2>{_esc(title)}</h2><p>{_esc(body)}</p></article>'
        for title, body in pack.get("extras") or []
    )
    extras_block = f'<div class="grid extra">{extra}</div>' if extra else ""
    includes = "".join(f"<li>{_esc(item)}</li>" for item in pack.get("visit_includes") or [])
    include_block = (
        f'<div class="include"><h2>A regular visit includes</h2><ul>{includes}</ul></div>'
        if includes
        else ""
    )
    return f"""
    <section class="page">
      <p class="kicker">Services</p>
      <h1>Work we take, and work we turn down.</h1>
      <p class="lede">{_esc(pack['lede'])}</p>
      {_services_grid(pack).replace('<section class="band">', '<div class="tight">').replace("</section>", "</div>")}
      {extras_block}
      {include_block}
      <p class="note">Big HOA contracts and tree-felling over the house line are not this crew. We will say so.</p>
      <a class="cta" href="contact.html">{_esc(pack['cta'])}</a>
    </section>
    """


def _about_main(pack: dict[str, Any]) -> str:
    cities = " · ".join(pack.get("cities") or [])
    return f"""
    <section class="page">
      <p class="kicker">About</p>
      <h1>A small crew. Routes we can actually keep.</h1>
      <p class="lede">{_esc(pack['about'])}</p>
      <p>{_esc(pack['promise'])}</p>
      <div class="grid values">
        <article class="card"><h2>Local</h2><p>We work {_esc(pack['area'])} — {_esc(cities)}.</p></article>
        <article class="card"><h2>Insured</h2><p>Property stays covered. We do not send a random weekend helper.</p></article>
        <article class="card"><h2>Same weekday</h2><p>Recurring stops stay on a route. You should not have to chase a no-show.</p></article>
      </div>
      <a class="cta" href="contact.html">{_esc(pack['cta'])}</a>
    </section>
    """


def _contact_main(pack: dict[str, Any]) -> str:
    options = "".join(
        f'<option value="{_esc(title)}">{_esc(title)}</option>'
        for title, _body, _price in pack["services"]
    )
    cities = "".join(f"<option>{_esc(c)}</option>" for c in pack.get("cities") or [])
    phone = _phone_block(pack, "plain")
    return f"""
    <section class="page contact">
      <div>
        <p class="kicker">Quote</p>
        <h1>Tell us about the property.</h1>
        <p class="lede">This form stays on your machine. Use it to walk through what a real request looks like, then call or text if you have a number on file.</p>
        <dl class="facts">
          <div><dt>Hours</dt><dd>{_esc(pack['hours'])}</dd></div>
          <div><dt>Area</dt><dd>{_esc(pack['area'])}</dd></div>
          <div><dt>Reach us</dt><dd>{phone}</dd></div>
        </dl>
      </div>
      <form id="quote-form" class="quote-form" novalidate>
        <div class="two">
          <label>Name<input name="name" autocomplete="name" required /></label>
          <label>Phone<input name="phone" type="tel" autocomplete="tel" required /></label>
        </div>
        <label>Email<input name="email" type="email" autocomplete="email" required /></label>
        <label>Street<input name="street" autocomplete="street-address" required /></label>
        <div class="two">
          <label>City
            <select name="city">
              <option value="">Choose one</option>
              {cities}
              <option>Other</option>
            </select>
          </label>
          <label>Lot
            <select name="lot">
              <option>Typical suburban</option>
              <option>Small / townhome</option>
              <option>Half acre+</option>
              <option>Commercial pad</option>
            </select>
          </label>
        </div>
        <label>What do you need?
          <select name="service" required>
            <option value="">Pick a service</option>
            {options}
            <option>Not sure — walk the lot</option>
          </select>
        </label>
        <label>Preferred window
          <select name="when">
            <option>First opening this week</option>
            <option>Saturday</option>
            <option>Recurring weekday</option>
            <option>Just pricing for now</option>
          </select>
        </label>
        <label>Notes<textarea name="notes" rows="4" placeholder="Gate code, dog, wet back corner, photos coming..."></textarea></label>
        <button type="submit">Request a quote</button>
        <p class="form-ok" hidden>Saved on this preview. No email left the machine.</p>
      </form>
    </section>
    """


def _generic_main(pack: dict[str, Any], page: str) -> str:
    title = page.replace("-", " ").title()
    if page in {"faq", "faqs"}:
        faqs = "".join(
            f"<details open><summary>{_esc(q)}</summary><p>{_esc(a)}</p></details>"
            for q, a in pack["faqs"]
        )
        return f'<section class="page"><p class="kicker">FAQ</p><h1>Before you book</h1><div class="faq">{faqs}</div></section>'
    if page in {"areas", "service-areas", "locations"}:
        items = "".join(f"<li>{_esc(c)}</li>" for c in pack["cities"])
        return f'<section class="page"><p class="kicker">Areas</p><h1>Where the truck goes</h1><p class="lede">{_esc(pack["area"])}</p><ul class="cities">{items}</ul></section>'
    if page in {"pricing", "prices"}:
        rows = "".join(
            f"<tr><th>{_esc(t)}</th><td>{_esc(p)}</td><td>{_esc(b)}</td></tr>"
            for t, b, p in pack["services"]
        )
        return f'<section class="page"><p class="kicker">Pricing</p><h1>Starting numbers, not a bait list</h1><table class="price-table"><thead><tr><th>Service</th><th>From</th><th>What you get</th></tr></thead><tbody>{rows}</tbody></table><p class="note">Final price follows a photo or a walk. Tight lots and dump fees change the number.</p></section>'
    return f"""
    <section class="page">
      <p class="kicker">{_esc(page)}</p>
      <h1>{_esc(title)}</h1>
      <p class="lede">{_esc(pack['lede'])}</p>
      <p>{_esc(pack['about'])}</p>
      <a class="cta" href="contact.html">{_esc(pack['cta'])}</a>
    </section>
    """


def _css() -> str:
    return """
:root {
  --bg: #0b100d;
  --bg2: #101710;
  --ink: #e8efe6;
  --mute: #93a090;
  --line: #243028;
  --accent: #c5f24a;
  --panel: #121a14;
  --panel2: #182218;
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.55 "Iowan Old Style", "Palatino Linotype", Palatino, "Times New Roman", serif; }
img, svg { max-width: 100%; display: block; }
.skip { position: absolute; left: 12px; top: -40px; background: var(--accent); color: #111; padding: 6px 10px; }
.skip:focus { top: 12px; z-index: 20; }
.topbar {
  display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  padding: 8px 7vw; background: #070b08; color: var(--mute); font-size: 0.82rem;
  letter-spacing: 0.04em;
}
.top-phone, .foot-phone, .plain { color: var(--accent); text-decoration: none; }
.top {
  display: flex; justify-content: space-between; gap: 16px; align-items: center;
  padding: 16px 7vw; border-bottom: 1px solid var(--line); background: rgba(11,16,13,.92);
  position: sticky; top: 0; z-index: 5;
}
.mark { color: var(--ink); text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.82rem; display: flex; align-items: center; gap: 8px; }
.mark-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px #c5f24a22; }
nav { display: flex; flex-wrap: wrap; gap: 14px; }
.nav { color: var(--mute); text-decoration: none; font-size: 0.92rem; }
.nav.on, .nav:hover { color: var(--accent); }
.cta {
  display: inline-block; padding: 12px 18px;
  background: var(--accent); color: #111; text-decoration: none; font-weight: 700;
}
.cta-sm { padding: 8px 12px; font-size: 0.85rem; }
.cta.ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
.hero {
  display: grid; grid-template-columns: 1.1fr .9fr; gap: 36px; align-items: center;
  padding: 8vh 7vw 7vh;
}
.hero-copy { max-width: 36rem; }
.kicker { letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); font-size: 0.72rem; margin: 0 0 8px; }
h1 { font-size: clamp(2.1rem, 5vw, 3.6rem); line-height: 1.05; margin: 0 0 16px; }
.sec { font-size: clamp(1.6rem, 3vw, 2.3rem); line-height: 1.15; margin: 0 0 14px; }
.lede { color: var(--mute); font-size: 1.08rem; max-width: 38rem; }
.cta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
.trust { display: flex; gap: 16px; padding: 0; margin: 22px 0 0; list-style: none; color: var(--mute); font-size: 0.88rem; }
.trust li::before { content: "▸ "; color: var(--accent); }
.yard { position: relative; }
.yard svg { width: 100%; border: 1px solid var(--line); background: var(--panel); }
.yard-card {
  position: absolute; left: 16px; bottom: 16px; background: #0e160f; border: 1px solid var(--line);
  padding: 10px 12px; font-size: 0.88rem;
}
.yard-card strong { display: block; }
.band { padding: 7vh 0; }
.band.alt { background: var(--bg2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.wrap { padding: 0 7vw; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin-top: 22px; }
.card { background: var(--panel); border: 1px solid var(--line); padding: 18px; }
.card h2 { margin: 0 0 8px; font-size: 1.12rem; }
.card p { margin: 0; color: var(--mute); }
.price { color: var(--accent); font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px; }
.split { display: grid; grid-template-columns: .85fr 1.15fr; gap: 28px; align-items: start; }
.steps { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
.steps li { display: grid; grid-template-columns: auto 1fr; gap: 12px; }
.num { width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: #111; display: grid; place-items: center; font-weight: 700; font-size: 0.85rem; }
.steps h3 { margin: 0 0 4px; font-size: 1.05rem; }
.steps p { margin: 0; color: var(--mute); }
.cities { display: flex; flex-wrap: wrap; gap: 8px; padding: 0; margin: 18px 0 0; list-style: none; }
.cities li { border: 1px solid var(--line); padding: 8px 12px; background: var(--panel); }
.quotes { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; }
.quote { margin: 0; background: var(--panel); border: 1px solid var(--line); padding: 18px; }
.quote blockquote { margin: 0 0 10px; }
.quote figcaption { color: var(--mute); font-size: 0.88rem; }
.faq details { border-top: 1px solid var(--line); padding: 12px 0; }
.faq summary { cursor: pointer; font-weight: 700; }
.faq p { color: var(--mute); margin: 8px 0 0; }
.closer { padding: 8vh 0 10vh; background: linear-gradient(180deg, var(--bg), #152016); }
.page { padding: 8vh 7vw; max-width: 980px; }
.page .cta { margin-top: 22px; }
.contact { display: grid; grid-template-columns: .9fr 1.1fr; gap: 32px; max-width: 1100px; }
.facts { display: grid; gap: 10px; margin-top: 22px; }
.facts div { border-top: 1px solid var(--line); padding-top: 8px; }
dt { color: var(--mute); font-size: 0.78rem; letter-spacing: 0.08em; text-transform: uppercase; }
dd { margin: 2px 0 0; }
.quote-form { display: grid; gap: 10px; background: var(--panel); border: 1px solid var(--line); padding: 18px; }
.two { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
label { display: grid; gap: 6px; font-size: 0.92rem; }
input, textarea, select {
  width: 100%; background: #0e140f; color: var(--ink);
  border: 1px solid var(--line); padding: 10px 12px; font: inherit;
}
button {
  justify-self: start; border: 0; background: var(--accent); color: #111;
  padding: 10px 16px; font: inherit; font-weight: 700; cursor: pointer;
}
.form-ok { color: var(--accent); margin: 0; }
.include { margin: 28px 0; }
.include ul { color: var(--mute); }
.note { color: var(--mute); }
.price-table { width: 100%; border-collapse: collapse; }
.price-table th, .price-table td { border-bottom: 1px solid var(--line); text-align: left; padding: 10px 8px; vertical-align: top; }
.tight .wrap { padding: 0; }
footer { padding: 28px 7vw 40px; color: var(--mute); border-top: 1px solid var(--line); font-size: 0.9rem; }
.foot-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; margin-bottom: 18px; }
.foot-mark { color: var(--ink); letter-spacing: 0.08em; text-transform: uppercase; font-size: 0.82rem; }
.foot-label { color: var(--ink); margin: 0 0 6px; }
.foot-links { display: flex; flex-wrap: wrap; gap: 10px; }
.foot-links a { color: var(--mute); }
.fine { font-size: 0.78rem; }
@media (max-width: 860px) {
  .hero, .split, .contact, .two { grid-template-columns: 1fr; }
  .top .cta-sm { display: none; }
}
"""


def _js() -> str:
    return """
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
"""


def _favicon() -> str:
    return """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0b100d"/>
  <path d="M4 24c6-8 10-2 14-8s6 2 10-4v12H4z" fill="#c5f24a"/>
</svg>
"""


def _write_agent_complete(root: Path, message: str) -> None:
    task = root / "agent-task"
    task.mkdir(exist_ok=True)
    (task / "status.json").write_text(
        json.dumps(
            {
                "running": False,
                "stage": "complete",
                "message": message[:240],
                "finished_at": _now(),
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    (task / "last-message.txt").write_text(message, encoding="utf-8")


def scaffold(config: dict[str, Any]) -> dict[str, Any]:
    name = config.get("name") or "new-site"
    slug = safe_name(name)
    root = project_dir(slug)
    root.mkdir(parents=True, exist_ok=True)
    (root / "assets").mkdir(exist_ok=True)
    pack = _copy_pack(config)
    pages = _pages(config, pack["vertical"])

    instructions = config.get("instructions") or ""
    (root / "INSTRUCTIONS.md").write_text(
        f"# {pack['name']}\n\n{instructions}\n",
        encoding="utf-8",
    )
    (root / "assets" / "site.css").write_text(_css(), encoding="utf-8")
    (root / "assets" / "site.js").write_text(_js(), encoding="utf-8")
    (root / "assets" / "favicon.svg").write_text(_favicon(), encoding="utf-8")

    (root / "index.html").write_text(_shell(pack, pages, "home", _home_main(pack)), encoding="utf-8")

    files = ["index.html", "assets/site.css", "assets/site.js"]
    for page in pages:
        if page in ("home", "index"):
            continue
        if page == "contact":
            main = _contact_main(pack)
        elif page == "about":
            main = _about_main(pack)
        elif page == "services":
            main = _services_main(pack)
        else:
            main = _generic_main(pack, page)
        filename = f"{page}.html"
        (root / filename).write_text(_shell(pack, pages, page, main), encoding="utf-8")
        files.append(filename)

    (root / "robots.txt").write_text("User-agent: *\nAllow: /\n", encoding="utf-8")
    sitemap = "\n".join(
        f"  <url><loc>/{'index.html' if p in ('home', 'index') else p + '.html'}</loc></url>"
        for p in pages
    )
    (root / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{sitemap}\n</urlset>\n',
        encoding="utf-8",
    )

    message = (
        f"Local scaffold ready for {pack['name']}. "
        f"Pages: {', '.join(pages)}. Preview serves generated HTML — no remote agent is attached."
    )
    _write_agent_complete(root, message)

    manifest = {
        "id": slug,
        "name": pack["name"],
        "instructions": instructions,
        "site_type": pack["site_type"],
        "tone": pack["tone"],
        "vertical": pack["vertical"],
        "frameworks": config.get("frameworks") or ["html"],
        "pages": ", ".join(pages),
        "status": "scaffolded",
        "agent_mode": "scaffold",
        "dir": str(root),
        "updated": _now(),
    }
    save_manifest(slug, manifest)
    return {
        "status": "ok",
        "site": slug,
        "dir": str(root),
        "project": manifest,
        "files": files,
        "agent_mode": "scaffold",
        "output": message,
    }


def _http_ok(url: str, needle: str = "") -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "zoth-preview"})
        with urllib.request.urlopen(req, timeout=0.7) as resp:
            body = resp.read(8000).decode("utf-8", "replace")
            if needle and needle not in body:
                return False
            return 200 <= getattr(resp, "status", 200) < 400
    except (urllib.error.URLError, TimeoutError, OSError):
        return False


def _pid_is_preview(pid: int, port: int | None = None) -> bool:
    try:
        raw = Path(f"/proc/{int(pid)}/cmdline").read_bytes().replace(b"\x00", b" ")
        cmd = raw.decode("utf-8", "replace")
    except Exception:
        return False
    if "http.server" not in cmd:
        return False
    if port is not None and str(port) not in cmd:
        return False
    return True


def _kill_pid(pid: int | None, port: int | None = None) -> None:
    if not pid:
        return
    if not _pid_is_preview(int(pid), port):
        return
    try:
        os.killpg(int(pid), signal.SIGTERM)
    except Exception:
        try:
            os.kill(int(pid), signal.SIGTERM)
        except Exception:
            return
    deadline = time.time() + 1.2
    while time.time() < deadline:
        try:
            os.kill(int(pid), 0)
        except OSError:
            return
        time.sleep(0.05)
    try:
        os.killpg(int(pid), signal.SIGKILL)
    except Exception:
        try:
            os.kill(int(pid), signal.SIGKILL)
        except Exception:
            pass


def _kill_rec(rec: dict[str, Any] | None) -> None:
    if not rec:
        return
    proc = rec.get("proc")
    pid = rec.get("pid")
    port = rec.get("port")
    if proc is not None:
        pid = pid or getattr(proc, "pid", None)
        try:
            if proc.poll() is None:
                _kill_pid(pid, port)
                proc.wait(timeout=1.2)
        except Exception:
            _kill_pid(pid, port)
    else:
        _kill_pid(pid, port)


def _record_preview(slug: str, rec: dict[str, Any]) -> None:
    man = load_manifest(slug)
    man["status"] = "preview"
    man["preview_url"] = rec["url"]
    man["preview_port"] = rec["port"]
    man["preview_pid"] = rec["pid"]
    save_manifest(slug, man)
    try:
        Path(rec["dir"]).joinpath("preview.json").write_text(
            json.dumps(
                {"url": rec["url"], "port": rec["port"], "pid": rec["pid"], "site": slug},
                indent=2,
            ),
            encoding="utf-8",
        )
    except Exception:
        pass


def _existing_live(slug: str, root: Path) -> dict[str, Any] | None:
    needle = f"zoth-preview:{slug}"
    with _LOCK:
        existing = dict(_PREVIEWS.get(slug) or {})
        proc = existing.get("proc")
        stale = bool(existing) and proc is not None and proc.poll() is not None
        if stale:
            _PREVIEWS.pop(slug, None)
            existing = {}
            proc = None
    if existing.get("port"):
        url = existing.get("url") or f"http://127.0.0.1:{existing['port']}/"
        if (proc is None or proc.poll() is None) and _http_ok(url, needle):
            return {"url": url, "port": existing["port"], "site": slug, "pid": existing.get("pid"), "dir": str(root), "reused": True}
        if proc is not None:
            _kill_rec(existing)
            with _LOCK:
                _PREVIEWS.pop(slug, None)

    man = load_manifest(slug)
    port = man.get("preview_port")
    pid = man.get("preview_pid")
    url = man.get("preview_url")
    if isinstance(port, int) and _port_open(port):
        url = url or f"http://127.0.0.1:{port}/"
        if _http_ok(url, needle):
            rec = {"name": slug, "port": port, "url": url, "pid": pid, "proc": None, "dir": str(root)}
            with _LOCK:
                _PREVIEWS[slug] = rec
            return {"url": url, "port": port, "site": slug, "pid": pid, "dir": str(root), "reused": True}
    return None


def start_preview(name: str) -> dict[str, Any]:
    slug = safe_name(name)
    root = project_dir(slug)
    if not (root / "index.html").exists():
        man = load_manifest(slug)
        man.setdefault("name", name)
        scaffold(man or {"name": name})

    live = _existing_live(slug, root)
    if live:
        return live

    last_err = "preview failed"
    for _attempt in range(3):
        port = _free_port()
        proc = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1", "--directory", str(root)],
            cwd=str(root),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        url = f"http://127.0.0.1:{port}/"
        ready = False
        for _ in range(20):
            if proc.poll() is not None:
                last_err = f"preview exited on :{port}"
                break
            if _http_ok(url, f"zoth-preview:{slug}"):
                ready = True
                break
            time.sleep(0.08)
        if not ready:
            _kill_pid(proc.pid, port)
            continue
        rec = {
            "name": slug,
            "port": port,
            "url": url,
            "pid": proc.pid,
            "proc": proc,
            "dir": str(root),
        }
        with _LOCK:
            _PREVIEWS[slug] = rec
        _record_preview(slug, rec)
        return {"url": rec["url"], "port": rec["port"], "site": slug, "pid": rec["pid"], "dir": str(root), "reused": False}

    raise RuntimeError(last_err)


def stop_preview(name: str) -> dict[str, Any]:
    slug = safe_name(name)
    with _LOCK:
        rec = _PREVIEWS.pop(slug, None)
    if rec:
        _kill_rec(rec)
    else:
        man = load_manifest(slug)
        _kill_pid(man.get("preview_pid"), man.get("preview_port"))
    man = load_manifest(slug)
    if man:
        man.pop("preview_url", None)
        man.pop("preview_port", None)
        man.pop("preview_pid", None)
        if man.get("status") == "preview":
            man["status"] = "built"
        save_manifest(slug, man)
    preview_path = project_dir(slug) / "preview.json"
    if preview_path.exists():
        try:
            preview_path.unlink()
        except Exception:
            pass
    return {"status": "stopped", "site": slug}


def preview_status() -> dict[str, Any]:
    running = []
    with _LOCK:
        dead = []
        for slug, rec in _PREVIEWS.items():
            proc = rec.get("proc")
            url = rec.get("url") or f"http://127.0.0.1:{rec.get('port')}/"
            alive = (proc is None or proc.poll() is None) and _port_open(int(rec["port"]))
            if not alive:
                dead.append(slug)
                continue
            running.append({"name": slug, "url": url, "port": rec["port"], "pid": rec.get("pid")})
        for slug in dead:
            _PREVIEWS.pop(slug, None)
    return {"running": running}


def agent_status(name: str) -> dict[str, Any]:
    slug = safe_name(name)
    root = project_dir(slug)
    task = root / "agent-task"
    logs = ""
    last = ""
    running = False
    stage = "complete"
    for fname in ("codex-stdout.log", "ollama-stdout.log", "stdout.log"):
        p = task / fname
        if p.exists():
            logs = p.read_text(encoding="utf-8", errors="replace")[-8000:]
            break
    last_path = task / "last-message.txt"
    if last_path.exists():
        last = last_path.read_text(encoding="utf-8", errors="replace")[-4000:]
    status_path = task / "status.json"
    if status_path.exists():
        try:
            st = json.loads(status_path.read_text(encoding="utf-8"))
            stage = st.get("stage") or stage
            running = bool(st.get("running")) and stage not in {"complete", "completed", "scaffold"}
        except Exception:
            running = False
    if not last:
        last = "Local scaffold is ready. Preview serves the generated HTML — no remote agent is attached."
        stage = "complete"
        running = False
    preview = None
    with _LOCK:
        rec = _PREVIEWS.get(slug)
        if rec:
            preview = rec.get("url")
    return {
        "status": {"running": running, "stage": stage, "message": last[:240]},
        "process_alive": running,
        "logs": logs,
        "stdout": logs,
        "stderr": "",
        "last_message": last,
        "preview_url": preview,
        "site": slug,
        "dir": str(root),
        "agent_mode": "scaffold",
    }


def build(name: str, extra: dict[str, Any] | None = None) -> dict[str, Any]:
    man = load_manifest(name)
    if extra:
        man.update({k: v for k, v in extra.items() if v not in (None, "", [])})
    man.setdefault("name", name)
    sc = scaffold(man)
    preview = start_preview(sc["site"])
    man = load_manifest(sc["site"])
    man["status"] = "built"
    man["preview_url"] = preview["url"]
    man["agent_mode"] = "scaffold"
    save_manifest(sc["site"], man)
    return {
        "status": "ok",
        "site": sc["site"],
        "dir": sc["dir"],
        "agent_mode": "scaffold",
        "results": [{"framework": "html", "status": "ok"}],
        "preview_url": preview["url"],
        "output": "Local scaffold written and preview server started.",
    }
