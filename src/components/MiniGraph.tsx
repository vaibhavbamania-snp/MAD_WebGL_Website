/** Small inline SVG "background data" charts — static paths, no per-frame cost.
 * Opacity is driven externally by DataOverlay's rAF loop via a ref. */
export function ScatterFitGraph({ color = "#7fd7ff" }: { color?: string }) {
  const points = [
    [4, 46], [10, 40], [16, 44], [22, 34], [27, 30], [33, 32],
    [39, 24], [45, 20], [51, 22], [57, 14], [63, 12], [70, 6],
  ];
  return (
    <svg viewBox="0 0 76 52" width="130" height="88">
      <line x1="2" y1="50" x2="74" y2="50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.6" />
      <line x1="2" y1="2" x2="2" y2="50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.6" />
      <polyline points="2,48 74,4" fill="none" stroke={color} strokeWidth="1" opacity="0.9" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.3" fill={color} opacity="0.7" />
      ))}
    </svg>
  );
}

export function SparklineGraph({ color = "#ffcf3f" }: { color?: string }) {
  const d =
    "M2,30 L8,28 L14,32 L20,22 L26,26 L32,16 L38,20 L44,10 L50,14 L56,8 L62,12 L68,6 L74,9";
  return (
    <svg viewBox="0 0 76 40" width="130" height="68">
      <line x1="2" y1="36" x2="74" y2="36" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.6" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.1" opacity="0.9" />
      <circle cx="74" cy="9" r="1.6" fill={color} />
    </svg>
  );
}
