import Image from "next/image";

interface HeroBackgroundProps {
  bannerUrl: string;
  opacity: number;
}

export function HeroBackground({ bannerUrl, opacity }: HeroBackgroundProps) {
  if (!bannerUrl) return null;

  return (
    <div
      className="background-image-div"
      style={{ minHeight: "90vh", maxHeight: "100vh" }}
    >
      <Image
        alt=""
        src={bannerUrl}
        fill
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        style={{
          opacity,
          objectPosition: "center",
          objectFit: "cover",
          WebkitMaskImage:
            "linear-gradient(to top, transparent 0%, var(--bs-body-bg) 100%)",
        }}
      />
    </div>
  );
}
