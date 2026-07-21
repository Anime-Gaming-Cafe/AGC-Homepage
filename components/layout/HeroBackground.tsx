interface HeroBackgroundProps {
  bannerUrl: string;
  opacity: number;
}

export function HeroBackground({ bannerUrl, opacity }: HeroBackgroundProps) {
  return (
    <div className="background-image-div">
      <img
        alt=""
        style={{
          maxHeight: "100vh",
          minHeight: "90vh",
          width: "100%",
          opacity,
          objectPosition: "center",
          objectFit: "cover",
          WebkitMaskImage:
            "linear-gradient(to top, transparent 0%, var(--bs-body-bg) 100%)",
        }}
        src={bannerUrl}
      />
    </div>
  );
}
