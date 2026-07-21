import type { Metadata, Viewport } from "next";
import { getSnapshot } from "@/lib/discord/cache";
import { CANONICAL_URL } from "@/lib/constants";
import { DrawerProvider } from "@/components/layout/DrawerProvider";
import { OffCanvasNav } from "@/components/layout/OffCanvasNav";
import { Navbar } from "@/components/layout/Navbar";
import { Preloader } from "@/components/layout/Preloader";
import { HeroBackground } from "@/components/layout/HeroBackground";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

const PAGE_TITLE = "Anime & Gaming Café - Impressum";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2596be",
};

export async function generateMetadata(): Promise<Metadata> {
  const { guild, cache } = getSnapshot();
  const description = cache.db.pageDescription;
  const iconUrl = guild?.iconUrl;

  return {
    title: PAGE_TITLE,
    description,
    openGraph: {
      type: "website",
      title: PAGE_TITLE,
      description,
      url: CANONICAL_URL,
      ...(iconUrl ? { images: [{ url: iconUrl }] } : {}),
    },
    ...(iconUrl ? { icons: { icon: iconUrl } } : {}),
    other: { "apple-mobile-web-app-status-bar-style": "css-color" },
  };
}

export default async function ImpressumPage() {
  const { guild } = getSnapshot();

  if (!guild) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "40vh",
          fontSize: "24px",
        }}
      >
        Bot verbindet sich... bitte in ein paar Sekunden neu laden.
      </div>
    );
  }

  return (
    <DrawerProvider>
      <OffCanvasNav vanityCode={guild.vanityCode} variant="impressum" />
      <Navbar
        iconUrl={guild.iconUrl}
        vanityCode={guild.vanityCode}
        variant="impressum"
      />
      <Preloader />
      <HeroBackground bannerUrl={guild.bannerUrl} opacity={0.2} />
      <section id="info" style={{ paddingBottom: "100px", paddingTop: "100px" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h1 style={{ fontFamily: "Wandertucker", fontSize: "60px" }}>
                <span style={{ fontWeight: "normal" }}>Impressum</span>
              </h1>
              <br />
              <p>Angaben gemäß § 5 TMG</p>
              <p>
                Fabian Thomys <br />
                c/o COCENTER Koppoldstr. 1
                <br />
                86551 Aichach <br />
              </p>
              <p>
                <strong>Vertreten durch: </strong>
                <br />
                Fabian Thomys
                <br />
              </p>
              <p>
                <strong>Kontakt:</strong>
                <br />
                E-Mail:{" "}
                <a href="mailto:info@animegamingcafe.de">
                  info@animegamingcafe.de
                </a>
                <br />
              </p>
              <p>
                <strong>Haftungsausschluss: </strong>
                <br />
                <br />
                <strong>Haftung für Inhalte</strong>
                <br />
                <br />
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt.
                Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte
                können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter
                sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen
                Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8
                bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die
                auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
                Entfernung oder Sperrung der Nutzung von Informationen nach den
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine
                diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
                Kenntnis einer konkreten Rechtsverletzung möglich. Bei
                Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                diese Inhalte umgehend entfernen.
                <br />
                <br />
                <strong>Haftung für Links</strong>
                <br />
                <br />
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                Verlinkung nicht erkennbar. Eine permanente inhaltliche
                Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                Bekanntwerden von Rechtsverletzungen werden wir derartige Links
                umgehend entfernen.
                <br />
                <br />
                <strong>Urheberrecht</strong>
                <br />
                <br />
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                Downloads und Kopien dieser Seite sind nur für den privaten,
                nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf
                dieser Seite nicht vom Betreiber erstellt wurden, werden die
                Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
                Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine
                Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
                entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Inhalte umgehend
                entfernen.
                <br />
                <br />
                <strong>Datenschutz</strong>
                <br />
                <br />
                Die Nutzung unserer Webseite ist in der Regel ohne Angabe
                personenbezogener Daten möglich. Soweit auf unseren Seiten
                personenbezogene Daten (beispielsweise Name, Anschrift oder
                eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich,
                stets auf freiwilliger Basis. Diese Daten werden ohne Ihre
                ausdrückliche Zustimmung nicht an Dritte weitergegeben. <br />
                Wir weisen darauf hin, dass die Datenübertragung im Internet
                (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken
                aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff
                durch Dritte ist nicht möglich. <br />
                Der Nutzung von im Rahmen der Impressumspflicht
                veröffentlichten Kontaktdaten durch Dritte zur Übersendung von
                nicht ausdrücklich angeforderter Werbung und
                Informationsmaterialien wird hiermit ausdrücklich
                widersprochen. Die Betreiber der Seiten behalten sich
                ausdrücklich rechtliche Schritte im Falle der unverlangten
                Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.
                <br />
                <br />
                <strong>Webanalyse (Umami)</strong>
                <br />
                <br />
                Auf dieser Website wird Umami zur Analyse des Website-Traffics
                eingesetzt. Umami ist ein datenschutzfreundliches
                Open-Source-Analysetool, das ohne Cookies auskommt und keine
                personenbezogenen Daten erhebt oder speichert. Es werden
                ausschließlich anonymisierte, aggregierte Statistiken erfasst
                (z. B. Seitenaufrufe und allgemeine Nutzungsmuster). Eine
                Identifizierung einzelner Personen ist damit nicht möglich. Die
                erhobenen Daten werden nicht an Dritte weitergegeben.
                <br />
                <br />
                Die Umami-Instanz wird von Diamondforge (
                <em>analytics.diamondforge.me</em>) betrieben, dem technischen
                Dachprojekt hinter dieser Website. Es findet keine Weitergabe an
                externe Dritte statt.
                <br />
                <br />
                Zusätzlich wird auf einem Teil der Seitenbesuche eine
                anonymisierte Session-Aufzeichnung erstellt. Dabei werden
                Mausbewegungen, Klicks und Scrollverhalten erfasst, um die
                Benutzerfreundlichkeit zu verbessern. Sensible Inhalte (z. B.
                Formularfelder) werden automatisch maskiert und sind in den
                Aufzeichnungen nicht sichtbar.
                <br />
              </p>
              <br />
              Website Impressum erstellt durch{" "}
              <a href="https://www.impressum-generator.de">
                impressum-generator.de
              </a>{" "}
              von der{" "}
              <a href="https://www.kanzlei-hasselbach.de/" rel="nofollow">
                Kanzlei Hasselbach
              </a>
              <hr />
            </div>
          </div>
        </div>
      </section>
      <Footer vanityCode={guild.vanityCode} />
    </DrawerProvider>
  );
}
