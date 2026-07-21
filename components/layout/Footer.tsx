interface FooterProps {
  vanityCode: string;
}

export function Footer({ vanityCode }: FooterProps) {
  return (
    <footer className="text-center" id="footer">
      <div className="container text-white py-4 py-lg-5">
        <ul className="list-inline">
          <li className="list-inline-item me-4">
            <a href="https://animegamingcafe.de/">Home</a>
          </li>
          <li className="list-inline-item me-4">
            <a href={`https://discord.gg/${vanityCode}`} target="_blank">
              Einladung
            </a>
          </li>
          <li className="list-inline-item">
            <a href="https://unban.animegamingcafe.de/">Entbannung</a>
          </li>
        </ul>
        <ul className="list-inline">
          <li className="list-inline-item me-4">
            <a
              href={`https://discord.gg/${vanityCode}`}
              target="_blank"
              rel="noopener"
              aria-label="Discord"
            >
              <i
                className="fab fa-discord"
                aria-hidden="true"
                style={{ fontSize: "21px" }}
              ></i>
            </a>
          </li>
          <li className="list-inline-item me-4">
            <a
              href="https://www.instagram.com/animegamingcafe/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <i
                className="fab fa-instagram"
                aria-hidden="true"
                style={{ fontSize: "20px" }}
              ></i>
            </a>
          </li>
          <li className="list-inline-item me-4">
            <a href="mailto:info@animegamingcafe.de" aria-label="Kontakt">
              <i
                className="fas fa-envelope-open-text"
                aria-hidden="true"
                style={{ fontSize: "20px" }}
              ></i>
            </a>
          </li>
          <li className="list-inline-item">
            <a href="https://animegamingcafe.de/impressum" aria-label="Impressum">
              <i
                className="fas fa-book"
                aria-hidden="true"
                style={{ fontSize: "20px" }}
              ></i>
            </a>
          </li>
        </ul>
        <p className="text-muted mb-0">
          {`Copyright © ${new Date().getFullYear()} Anime & Gaming Café`}
        </p>
      </div>
    </footer>
  );
}
