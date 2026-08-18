import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export default function Tip({ label, kicker, shortcut, side = "top", children }) {
  const id = useId();
  const wrapRef = useRef(null);
  const bubbleRef = useRef(null);
  const timer = useRef(null);
  const [on, setOn] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, place: side, ready: false });

  function show() {
    if (!label) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(true), 160);
  }

  function hide() {
    clearTimeout(timer.current);
    setOn(false);
  }

  function place() {
    const el = wrapRef.current;
    const bubble = bubbleRef.current;
    if (!el || !bubble) return;
    const r = el.getBoundingClientRect();
    const tw = bubble.offsetWidth;
    const th = bubble.offsetHeight;
    const gap = 10;
    let placeSide = side;
    let top = side === "bottom" ? r.bottom + gap : r.top - th - gap;
    if (top < 8) {
      placeSide = "bottom";
      top = r.bottom + gap;
    }
    if (top + th > window.innerHeight - 8) {
      placeSide = "top";
      top = Math.max(8, r.top - th - gap);
    }
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    setPos({ top, left, place: placeSide, ready: true });
  }

  useLayoutEffect(() => {
    if (!on) {
      setPos((p) => ({ ...p, ready: false }));
      return;
    }
    place();
    const frame = requestAnimationFrame(place);
    const onMove = () => place();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onMove, true);
      window.removeEventListener("resize", onMove);
    };
  }, [on, label, kicker, shortcut, side]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") hide();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer.current);
    };
  }, []);

  if (!label) return children;

  const child = Children.count(children) === 1 ? Children.only(children) : null;
  const wired = isValidElement(child)
    ? cloneElement(child, { "aria-describedby": on ? id : undefined })
    : children;

  return (
    <span
      ref={wrapRef}
      className={`tip-wrap tip-${side}${on ? " is-on" : ""}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onPointerDown={hide}
    >
      {wired}
      {on &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            ref={bubbleRef}
            className={`tip-bubble tip-fixed tip-${pos.place}`}
            role="tooltip"
            id={id}
            style={{ top: pos.top, left: pos.left, visibility: pos.ready ? "visible" : "hidden" }}
          >
            {kicker ? <em className="tip-kicker">{kicker}</em> : null}
            <span className="tip-label">{label}</span>
            {shortcut ? <kbd className="tip-kbd">{shortcut}</kbd> : null}
          </span>,
          document.body
        )}
    </span>
  );
}
