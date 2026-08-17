export function stripPetPrefix(text) {
  return String(text || "").replace(/^\[pet:[^\]]+\]\s*/i, "");
}

export function petPortraitSrc(pet) {
  if (!pet) return "";
  const id = pet.id || pet.name || pet;
  return pet.portrait || pet.portrait_svg || `/assets/pets/${id}-neon.jpg`;
}

export function onPetPortraitError(event, pet) {
  const id = pet?.id || pet?.name || pet || "";
  const img = event.currentTarget;
  const svg = `/assets/pets/${id}.svg`;
  if (!img.src.endsWith(".svg")) img.src = svg;
  else img.style.display = "none";
}

export function lastSpeechLine(text, limit = 120) {
  const lines = stripPetPrefix(text)
    .split(/\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const last = lines[lines.length - 1] || "";
  return last.length > limit ? `${last.slice(0, limit)}…` : last;
}

export default function CompanionPet({ pet, line, speaking, onOpen }) {
  if (!pet) return null;
  const id = pet.id || pet.name || pet;
  const name = pet.name || id;
  const role = pet.role || pet.blurb || "Companion";
  const speech = lastSpeechLine(line);
  return (
    <div className={`companion-wrap${speaking ? " is-speaking" : ""}`}>
      {speech && (
        <p className="companion-speech" aria-live="polite">
          {speech}
        </p>
      )}
      <button
        type="button"
        className="companion"
        onClick={onOpen}
        title={`${name} — engaged · ${role}`}
      >
        <img src={petPortraitSrc(pet)} alt="" onError={(e) => onPetPortraitError(e, pet)} />
        <span>
          <b>{name}</b>
          <small>{speaking ? "speaking…" : `engaged · ${role}`}</small>
        </span>
      </button>
    </div>
  );
}
