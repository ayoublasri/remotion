import { AbsoluteFill, Sequence } from "remotion";
import { LogoBadge } from "../components/Logo";
import { Flash, Grain, Vignette } from "../components/Overlays";
import { Photo } from "../components/Photo";

// Bars 13-14: the climax. Eight photos, one beat (14 frames) each, while the
// snare roll builds under them.
export const MontageScene: React.FC<{
  readonly images: string[];
  readonly logo: string;
}> = ({ images, logo }) => (
  <AbsoluteFill name="Montage scene" style={{ backgroundColor: "#12100e" }}>
    {images.map((image, i) => (
      <Sequence
        key={`${image}-${i}`}
        from={i * 14}
        durationInFrames={14}
        name={`Beat ${i + 1}`}
      >
        <AbsoluteFill>
          <Photo
            image={image}
            focusX={50}
            focusY={45}
            zoomFrom={1.22}
            zoomTo={1.14}
            driftX={i % 2 === 0 ? 24 : -24}
            driftY={i % 3 === 0 ? 18 : -18}
            rotation={i % 2 === 0 ? -3 : 3}
            punch
            pulse={false}
          />
          <Vignette />
          <Flash at={0} peak={0.45} />
        </AbsoluteFill>
      </Sequence>
    ))}
    <div style={{ position: "absolute", top: 140, right: 80 }}>
      <LogoBadge image={logo} size={104} ring={false} />
    </div>
    <Grain />
  </AbsoluteFill>
);
