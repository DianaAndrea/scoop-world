# Sugarcloud World — Roadmap / Ideas

Running notes on where the game is headed. Not a spec — a memory so ideas
don't get lost between sessions.

## Now (in the build)

- 5 worlds: Sugarcloud World, Minty Meadow, Neon Nightclub, Sherbet Shores, The Cove
- Real produced music on the first 3 worlds (7 stems each: drums + 6 flavors),
  synth engine as the groove for worlds without recorded stems yet
- DJ deck mixer: per-flavor mute (keys 1–6), volume faders, live waveforms, beat LEDs
- Minimap, world map with per-world unlock (mix all 6 to open the next)
- The Cove: ocean, palm trees, sea-creature friends (crab / seahorse / mermaid),
  a bumpable beach ball with physics, a volleyball rally
- **Mix-speed score (middle-top card):** times how fast you build the full
  6-flavor mix; tracks a best time per world and a running total `save.score`.
  Points = 1000 + speed bonus (faster = more).

## Next / future focus

- **Scores unlock new music items.** Spend / gate on `save.score` (already
  tracked and persisted) to unlock things like:
  - new flavor layers / alternate stems per world
  - extra songs or remix variants
  - cosmetic deck skins, character outfits, new sea-creature friends
  Design the unlock shop UI + which items cost what. This is the main
  planned direction for the scoring system.
- Tropical-house track for The Cove (128 BPM) to replace its synth groove
- Make the sea creatures interactive (claw high-five, tap the mermaid for a
  tune, a volleyball you can actually join)
- Character design pass (cuter/rounder, accessories like headphones, more variety)
- Candy-trail styling for the world map
