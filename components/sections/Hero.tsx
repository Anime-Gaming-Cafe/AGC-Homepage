interface HeroProps {
  description: string;
  vanityCode: string;
}

export function Hero({ description, vanityCode }: HeroProps) {
  return (
    <header
      className="m-auto main-header"
      id="home"
      style={{ minHeight: "100vh", textAlign: "center" }}
    >
      <div className="container">
        <div className="row" style={{ paddingTop: "30%", transform: "rotate(0deg)" }}>
          <div className="col-xl-12 offset-xl-0 col-lg-8 col-xl-9 col-main">
            <h1
              className="text-white"
              style={{
                fontFamily: "Wandertucker",
                fontSize: "80px",
                textAlign: "center",
              }}
            >
              Anime und Gaming Cafe
            </h1>
            <hr />
            <p
              className="text-muted"
              style={{
                fontSize: "18px",
                maxWidth: "600px",
                textAlign: "center",
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "20px",
              }}
            >
              {description}
            </p>
            <a
              className="btn btn-primary shadow button-animation glas"
              role="button"
              href={`https://discord.gg/${vanityCode}`}
              style={{
                lineHeight: "24px",
                fontSize: "18px",
                borderRadius: "16px",
              }}
              target="_blank"
            >
              Join uns!
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
