# MySalon.ma reels for salon owners

Two Instagram reels (1080 × 1920, 30 fps) built with Remotion for the Moroccan
booking platform [MySalon.ma](https://mysalon.ma):

| composition | file | length | what it is |
| --- | --- | --- | --- |
| `QuaranteSept` | `out/mysalon-47.mp4` | 28.8 s | **"47"**, the current reel: one take, made with the onetake method (below) |
| `InvitationReel` | `out/mysalon-invitation-reel.mp4` | 47.8 s | the earlier story reel (Sara and Nada, drawn screens over the ad footage) |

```bash
npm ci
npm run dev            # Remotion Studio
npm run music          # synthesise public/music/47-theme.mp3 and 47-sfx.mp3 (needs ffmpeg for the mp3 step)
npm run render         # out/mysalon-47.mp4, with music and effects
npm run render:silent  # out/mysalon-47-silent.mp4, to post with a trending sound
npm run cover          # out/cover-hook.png, frame 250: "Et toi, combien ce soir ?"
npm run cover:end      # out/cover-end.png, frame 850: the call to action
npm run render:story   # the earlier story reel (needs `npm run prep` first, see below)
```

## "47" — the film

A number counts the DMs a nail artist gets on a Tuesday night, asks the
viewer theirs, and a tap turns it into a link, a booking, a full week and one
last DM to send. No footage, no caption pills: typography, a drawn booking
page and a drawn week, one keyed camera, one continuous take.

### 1 · The previous cut, in numbers

The story reel was the reference to beat. Measured: 47.8 s, ten scenes of
2.4 to 8.0 s (coefficient of variation of shot length 0.34), a caption on
every scene, the frame always in motion (slowed footage under popping pills),
and nine boundaries that were all cross-fades through a blurred still:
nothing survived a single one of them. Clear, but a slideshow with motion.

### 2 · Three concepts (one picture idea each)

- **A · Le fil.** One teal line is the whole film: the typing caret's
  underline becomes the thread of the DMs, tangles into a knot of 47, the hand
  pulls it straight into the link in the bio, it draws the week's grid and ends
  as the underline of mysalon.ma. Hook: a line drawing itself. Carry: the line.
  Rules out cards and cuts. Look: paper and one ink.
- **B · Le chiffre (chosen).** One number is the whole film: it counts the
  DMs, fills the frame, takes the tap, collapses into the link, and comes back
  as the claim (0 DM, 12 RDV) before folding into the brand mark. Hook: a bare
  count climbing with no explanation. Carry: the number, then what it becomes.
  Rules out footage, pills and any scene the number is not in. Look: a night
  (deep teal, one mint) that flips to the brand's day (beige, teal ink) at
  the tap.
- **C · Le comptoir.** A top-down tabletop: Sara's phone face up on her
  counter, buzzing itself across the wood with every DM; the hand puts down
  the QR stand; the camera pulls up until the counter top is the week's grid.
  Hook: a phone buzzing on wood. Carry: the camera and the phone. Rules out
  type-led storytelling. Look: tabletop, warm wood, hard light.

B was picked because a number is the most legible object at Instagram size,
it asks a question by itself ("47 what?"), it becomes the claim without a
sentence, and it keeps the brand off screen until the solution: curiosity
first, then clarity, then one call to action.

### 3 · Beat sheet

100 BPM, one bar = 2.4 s, twelve bars. `t` in seconds.

| t | beat | what moves | what is still | what carries |
| --- | --- | --- | --- | --- |
| 0.0–2.4 | four DMs arrive on the beat, the number counts 1 → 4 | bubbles from the right, the digits squash on each landing | the ground, the eyebrow | the number |
| 2.4–4.8 | the torrent: 43 more DMs, 4 → 47, the camera pushes in | the stack, the digits, the camera | the eyebrow | the number |
| 4.8 | the hit: 47 lands, the camera snaps back and shakes | | | |
| 4.8–6.0 | dead still on 47 over the pile | nothing | everything | the number (anchored) |
| 6.0–7.2 | the pile sinks; « DM, un mardi soir. » rises | the stack, one line | the number | the number |
| 7.2–9.6 | « Et toi, combien ce soir ? » then 2.4 s of nothing | two words rise | the number, the lines | the number |
| 9.0–9.6 | the fingertip comes in and taps the 47 | the hand | the rest | the hand |
| 9.6–10.5 | the tap: a beige iris opens the day from the fingertip; the digits collapse into a line that widens into the link chip | the iris, the digits, the chip | | the number → the chip, the hand |
| 10.5–11.7 | the link types on; Sara's bio pops above it; « Un seul lien. » | type, the bio, a caption | the chip | the chip, the hand |
| 11.7–12.3 | tap on the link: the chip grows into the page, the bio moves into its header, the link shrinks into the address | the morph | | the chip → the page, the hand |
| 12.3–15.4 | Nada books: service, day, hour, confirm; the camera chases the hand; « Nada réserve seule. » | the hand, rows, pills, the camera | the page | the hand |
| 15.4–16.8 | « C'est réservé. » the check pops; 1.2 s still | the check | the page | the check |
| 16.8–17.4 | the check hops into Saturday 11:00 while the page becomes the week | the check, the grid fading in | the page frame | the check, the page |
| 17.4–18.0 | the landing: Nada's block, « 1 RDV » | one block | the grid | the check (becomes the tick) |
| 18.0–19.4 | the burst: eleven blocks on sixteenth notes, « 12 RDV » | blocks, the badge | the grid | the badge |
| 19.4–21.6 | dead still on the full week; « Sara n'a rien tapé. » | one caption | the week | the badge |
| 21.6–22.4 | the result: the badge grows into 12, 47 rolls down to 0, the week shrinks to a ghost | the numbers, the page | | the badge → 12, the page |
| 22.4–24.0 | still: « 0 DM ce soir · 12 RDV cette semaine » | nothing | everything | |
| 24.0–24.6 | the two numbers and the ghost gather into one point; the lockup pops from it | the gather, the logo | | the cast → the logo |
| 24.6–27.0 | « Tes DM se vident. Ton agenda se remplit. » · « Un dernier DM : » · INVITATION · mysalon.ma | type rising | the logo | |
| 27.0–28.8 | dead still on the call to action | nothing | everything | |

Rhythm: the shortest event is a landing 40 ms after the last one, the longest
hold is 2.4 s (more than 4× apart); about 10.4 s of the 28.8 are dead still
(36 %), in six rests; two bursts (the torrent, the week). Carry: every
boundary is crossed by something that survives it and visibly moves or
scales (the number, the hand, the chip, the check, the badge); there is no
bare cut. The one iris is opened by the tap that causes it.

### 4 · How it is built

- `src/film/beats.json` is the beat table, in seconds: the 47 landing times,
  every tap, every rest. The composition and the sound script read the same
  file, so a retimed beat takes its sound with it.
- `src/film/motion.ts`: every move is a pure function of film time that
  returns numbers (`spring`, `impact`, `press`, `popIn`, `wordRise`,
  `maskRise`, `liftOut`, `typeOn`, `morphRect`, `iris`, `hop`, `gather`,
  `shake`, `camera`, `path`). Snaps use `expoOut`, settles use springs; no
  single smootherstep everywhere.
- `src/film/stage.ts`: the layout in world pixels, the hand's path and
  presses, the camera keys (push into the torrent on `sineIn`, snap back on
  the hit, a kick on the tap, a chase through the booking, a follow on the
  hop), the shakes, and where the operator's hand floats (never in a rest).
- `src/film/Night.tsx` (ground, bubbles, the big number, two lines),
  `src/film/Day.tsx` (the iris, the chip, the page, the week, the result, the
  lockup), `src/film/Hand.tsx` (the fingertip), `src/film/Screen.tsx` (the
  eyebrow and three captions, outside the camera).
- `src/film/Shutter.tsx`: a 180° shutter. Moving frames are drawn six times
  across the half frame before them and summed, so the torrent, the iris and
  the hop smear instead of stepping. Dead-still holds render once.
- Everything is deterministic: `frame → picture`, no randomness on the render
  path, so a fractional shutter sample is as valid as an integer frame.

### 5 · Sound

`scripts/make-sound.mjs` synthesises both tracks from scratch (royalty-free):

- **47-theme.mp3**: Afrobeats at 100 BPM, twelve bars. A low A-minor pad and
  the clave while the number counts; the torrent (kick four to the floor,
  riser, snare roll) into the hit at 4.8 s; one breath then near silence for
  the hold; a heartbeat under the question; the drop in C major on the tap;
  the full groove through the booking and the week; a build under the result;
  the final chord under the lockup; a 1.4 s fade. The music ducks under every
  tap and hit.
- **47-sfx.mp3**: five materials in the same room as the music (air, glass,
  wood, bubble, and the music's own sub hits): pops for the first DMs, a
  whoosh for the iris, two wood hits per tap, a glass chord for the
  confirmation, eleven glass ticks up a scale for the week, a knock for the
  logo and the pill. Fewer events than beats; nothing within 40 ms of
  another sound.

Both files are `public/music/*.mp3`; the WAVs are ignored by git. Render with
`--muted` to post with a trending sound instead.

### 6 · Safe area

`src/layout.ts` holds the Instagram safe area (x 110–970, y 290–1450, and
x ≤ 870 in the action-icon band from y 950). The day world is laid out on the
centre of that column (x = 490); the night number sits on the frame's axis
above the icon band. Verified frame by frame with guides drawn over stills.

## The onetake method

This film follows the [onetake](https://github.com/berg-1/onetake-motion)
skill, installed in this repository at `.claude/skills/onetake` (the real
directory is `.agents/skills/onetake`; the case videos and gifs were left out,
see `OMITTED-MEDIA.md` there). Its protocol: deconstruct the reference in
numbers, write three concepts that differ in their central picture idea,
storyboard as rhythm and carry, build the UI rather than record it, compose
everything as a pure function of time with an operated camera, render with a
real shutter, score with one palette in one room, verify before showing.

The skill is licensed PolyForm Noncommercial 1.0.0, which does not permit
commercial use of its software. This reel is a commercial advertisement, so
none of the skill's code (`lib/motion.js`, its scripts) is used or copied
here: the method is applied in Remotion with the project's own move library,
shutter and sound, and the skill's hard rules are followed by hand (no
template story, no metronome, no replaced beat, rests, small elements on a
big ground, visible cause, no particles, deterministic frames).

## The story reel (earlier version)

`InvitationReel` is the 47.8 s story cut kept for comparison: Sara's Monday
night, the DMs, the link in her bio, Nada booking, the notification, the
week, the WhatsApp reminder, the check-in, the end card. It plays the slowed
ad footage (`assets/source.mp4`) under drawn screens. It needs the prepared
footage:

```bash
npm run prep           # ffmpeg: 60 fps interpolation + stills into public/video (about 6 minutes)
npm run music:story    # public/music/afro-theme.wav (convert to mp3 with ffmpeg)
npm run render:story
```

Its scenes are data in `src/Root.tsx` (`defaultProps.scenes`), with nine scene
kinds (`shot`, `messages`, `profile`, `booking`, `notification`, `agenda`,
`chat`, `arrival`, `end`) defined in `src/schema.ts`.
