import { Reveal } from "./Reveal";

export function HeroSection() {
  return (
    <section className="story-section story-section--hero">
      <Reveal className="hero-block">
        <span className="eyebrow">Underground Delhi Metro Corridor / Prediction Core</span>
        <h1 className="hero-title">MAD</h1>
        <p className="hero-sub">Metro Assist — Delhi</p>
        <p className="hero-tag">
          MAD keeps predicting where you are on the network — even when the
          tunnel takes GPS away.
        </p>
        <span className="scroll-cue">Scroll to descend ↓</span>
      </Reveal>
    </section>
  );
}

export function FinalSection() {
  return (
    <section className="story-section story-section--final">
      <Reveal className="hero-block">
        <span className="eyebrow">Delhi Metro · Underground Positioning</span>
        <h2 className="hero-title hero-title--small">MAD never loses the thread</h2>
        <p className="hero-tag">
          A continuous, predicted journey — above ground and below it — built
          for the way Delhi actually moves.
        </p>
      </Reveal>
    </section>
  );
}

export function StorySections() {
  return (
    <>
      <section className="story-section" data-align="left">
        <Reveal className="story-block">
          <span className="story-tag">01 · Surface</span>
          <h2>Every journey starts with a clean fix</h2>
          <p>
            On elevated and at-grade sections, a commuter's phone has a clear
            satellite lock. Position, speed and heading are all exact —
            nothing to predict yet.
          </p>
        </Reveal>
      </section>

      <section className="story-section" data-align="right">
        <Reveal className="story-block">
          <span className="story-tag">02 · Descent</span>
          <h2>Then the line drops below the street</h2>
          <p>
            As the train approaches the underground core, satellite signal
            starts to degrade before it disappears entirely — the last clean
            fix becomes the starting point for everything that follows.
          </p>
        </Reveal>
      </section>

      <section className="story-section" data-align="left">
        <Reveal className="story-block">
          <span className="story-tag">03 · No signal</span>
          <h2>Underground, GPS goes dark</h2>
          <p>
            Reinforced concrete and depth block satellite signal completely.
            Most apps go blind here. MAD doesn't — it was built for exactly
            this gap.
          </p>
        </Reveal>
      </section>

      <section className="story-section" data-align="right">
        <Reveal className="story-block">
          <span className="story-tag">04 · Prediction</span>
          <h2>MAD predicts the journey instead</h2>
          <p>
            Using the last known fix, the train's velocity, dwell patterns at
            each station and the fixed topology of the network graph, MAD
            continuously predicts where the commuter is — and where they're
            headed next.
          </p>
        </Reveal>
      </section>

      <section className="story-section" data-align="left">
        <Reveal className="story-block">
          <span className="story-tag">05 · Topology</span>
          <h2>Every junction, every dwell — modeled</h2>
          <p>
            Interchanges, curves, platform stops: the whole network is a
            graph MAD already knows. The predicted position moves through it
            the same way the real train does.
          </p>
        </Reveal>
      </section>

      <section className="story-section" data-align="right">
        <Reveal className="story-block">
          <span className="story-tag">06 · Resurfacing</span>
          <h2>Signal reacquired</h2>
          <p>
            When the train resurfaces, GPS locks on again — and the predicted
            position is already waiting there to confirm it. No gap in the
            journey, no gap in the story.
          </p>
        </Reveal>
      </section>
    </>
  );
}

export function NarrativeSections() {
  return (
    <div className="scroll-track">
      <HeroSection />
      <StorySections />
      <FinalSection />
    </div>
  );
}
