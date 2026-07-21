import { FALLBACK_BANNER_URL, FALLBACK_INVITE_URL } from "@/lib/constants";
import { HeroBackground } from "@/components/layout/HeroBackground";

interface UnavailableNoticeProps {
  headline?: string;
  detail?: string;
}

export function UnavailableNotice({
  headline = "Die Seite verbindet sich gerade mit unserem Discord.",
  detail = "Das dauert normalerweise nur ein paar Sekunden. Bitte lade die Seite gleich noch einmal.",
}: UnavailableNoticeProps) {
  return (
    <>
      <HeroBackground bannerUrl={FALLBACK_BANNER_URL} opacity={0.5} />
      <header
        className="m-auto main-header"
        id="home"
        style={{ minHeight: "100vh", textAlign: "center" }}
      >
        <div className="container">
          <div className="row" style={{ paddingTop: "30%" }}>
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
                {headline}
              </p>
              <p
                className="text-muted"
                style={{
                  fontSize: "15px",
                  maxWidth: "600px",
                  textAlign: "center",
                  marginRight: "auto",
                  marginLeft: "auto",
                  marginTop: "10px",
                }}
              >
                {detail}
              </p>
              <a
                className="btn btn-primary shadow button-animation glas"
                role="button"
                href={FALLBACK_INVITE_URL}
                target="_blank"
                rel="noopener"
                style={{
                  lineHeight: "24px",
                  fontSize: "18px",
                  borderRadius: "16px",
                  marginTop: "20px",
                }}
              >
                Join uns!
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
