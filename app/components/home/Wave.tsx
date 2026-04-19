export function Wave({ fill, flip = false, invert = false }: { fill: string; flip?: boolean; invert?: boolean }) {
  const transforms = [flip && "scaleX(-1)", invert && "scaleY(-1)"].filter(Boolean).join(" ")
  return (
    <div style={{ lineHeight: 0, transform: transforms || "none" }}>
      <svg
        viewBox="0 0 1440 72"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ display: "block", width: "100%", height: 72 }}
        aria-hidden="true"
      >
        <path
          d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
