import { MetroMap2D } from "./MetroMap2D";
import { StorySections, FinalSection } from "./NarrativeSections";

export function Experience2D() {
  return (
    <div className="fallback-page">
      <section className="fallback-hero">
        <span className="eyebrow">Underground Delhi Metro Corridor / Prediction Core</span>
        <h1 className="hero-title">MAD</h1>
        <p className="hero-sub">Metro Assist — Delhi</p>
        <div className="fallback-map-frame">
          <MetroMap2D />
        </div>
        <p className="hero-tag">
          MAD keeps predicting where you are on the network — even when the
          tunnel takes GPS away. Dashed lines mark the underground sections;
          the amber dot traces the predicted route.
        </p>
      </section>
      <StorySections />
      <FinalSection />
    </div>
  );
}
