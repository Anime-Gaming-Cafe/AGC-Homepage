import { FALLBACK_BANNER_URL, FALLBACK_INVITE_URL } from "@/lib/constants";

export interface UnavailableOptions {
  headline?: string;
  detail?: string;
  retryAfterSeconds?: number;
}

const DEFAULT_HEADLINE = "Die Seite ist gerade nicht erreichbar.";
const DEFAULT_DETAIL =
  "Wir arbeiten daran. Diese Seite lädt sich automatisch neu.";

const HTML_STYLE = [
  "--bs-dark:#090B19",
  "--bs-dark-rgb:54,57,63",
  "--bs-primary:rgb(153,128,250)",
  "--bs-primary-rgb:212,39,91",
  "--bs-secondary:#ffffff",
  "--bs-highlight-bg:rgba(153,128,250,0.2)",
  "--bs-secondary-rgb:122,197,242",
  "--bs-body-bg:#202225",
  "font-family:'Whitney Medium'",
  "--bs-font-sans-serif:\"Whitney Book\", \"Inter\", \"Helvetica Neue\", Helvetica, Arial, sans-serif",
].join(";");

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function unavailableResponse(options: UnavailableOptions = {}): Response {
  const {
    headline = DEFAULT_HEADLINE,
    detail = DEFAULT_DETAIL,
    retryAfterSeconds = 15,
  } = options;

  const html = `<!doctype html>
<html data-bs-theme="light" lang="de" style="${escapeHtml(HTML_STYLE)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="refresh" content="${retryAfterSeconds}">
<title>Anime &amp; Gaming Café</title>
<link rel="stylesheet" href="/assets/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="/assets/css/styles.min.css">
<link rel="stylesheet" href="/assets/css/custom.css">
</head>
<body id="page-top">
<div class="background-image-div">
<img alt="" src="${escapeHtml(FALLBACK_BANNER_URL)}" style="max-height:100vh;min-height:90vh;width:100%;opacity:0.5;object-position:center;object-fit:cover;-webkit-mask-image:linear-gradient(to top, transparent 0%, var(--bs-body-bg) 100%)">
</div>
<header class="m-auto main-header" id="home" style="min-height:100vh;text-align:center">
<div class="container">
<div class="row" style="padding-top:30%">
<div class="col-xl-12 offset-xl-0 col-lg-8 col-xl-9 col-main">
<h1 class="text-white" style="font-family:Wandertucker;font-size:80px;text-align:center">Anime und Gaming Cafe</h1>
<hr>
<p class="text-muted" style="font-size:18px;max-width:600px;text-align:center;margin-right:auto;margin-left:auto;margin-top:20px">${escapeHtml(headline)}</p>
<p class="text-muted" style="font-size:15px;max-width:600px;text-align:center;margin-right:auto;margin-left:auto;margin-top:10px">${escapeHtml(detail)}</p>
<a class="btn btn-primary shadow button-animation glas" role="button" href="${escapeHtml(FALLBACK_INVITE_URL)}" target="_blank" rel="noopener" style="line-height:24px;font-size:18px;border-radius:16px;margin-top:20px">Join uns!</a>
</div>
</div>
</div>
</header>
</body>
</html>`;

  return new Response(html, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": String(retryAfterSeconds),
      "cache-control": "no-store",
    },
  });
}
