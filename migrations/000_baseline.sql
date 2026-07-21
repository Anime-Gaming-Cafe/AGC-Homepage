CREATE TABLE IF NOT EXISTS pagedescription (
  description character varying
);

CREATE TABLE IF NOT EXISTS pageinformation (
  information character varying
);

CREATE TABLE IF NOT EXISTS teamprofile (
  userid bigint NOT NULL,
  frontdesc character varying(50),
  backdesc character varying(500)
);

CREATE TABLE IF NOT EXISTS msgs (
  count bigint
);

CREATE TABLE IF NOT EXISTS todaymsgs (
  count bigint
);

CREATE TABLE IF NOT EXISTS todayjoins (
  count bigint
);
