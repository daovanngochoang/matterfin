

-- this enum holds the status of an AR 
CREATE TYPE payment_status AS ENUM ('ACTIVE', 'OVERDUE', 'PAID');
CREATE TYPE payment_request_type AS ENUM ('PAYMENT_REQUEST', 'GENERAL');
CREATE TYPE payment_schedule AS ENUM ('NOW', 'LATER');

-- this table stores contacts belong to user or organization 
-- at least user_id || org_id is not null.
CREATE TABLE IF NOT EXISTS contact (
  id            SERIAL PRIMARY KEY,
  firstname     VARCHAR(100) NOT NULL,
  lastname      VARCHAR(100) NOT NULL,
  company_name  VARCHAR(200) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(20) NOT NULL UNIQUE,
	org_id        VARCHAR(500) NOT NULL,
	created_at    TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at    TIMESTAMP
);

-- account receivable is the payment request that a company 
-- creates and send to their clients those are imported from 
-- contact table.
CREATE TABLE IF NOT EXISTS payment_request (
	id                  SERIAL PRIMARY KEY,
	org_id              VARCHAR(500) NOT NULL,
	contact_id          INTEGER,
	payment_method_id   INTEGER,
	expired_date        TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	notes               TEXT DEFAULT '',
	is_acknowledged     BOOLEAN DEFAULT FALSE,
	status              payment_status DEFAULT 'ACTIVE',
	amount              money NOT NULL,
	pr_type             payment_request_type,
	created_at          TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at          TIMESTAMP
);

-- this will record user activity when they modify any data.
-- use to audit (who do what actions on which table and when )
CREATE TABLE IF NOT EXISTS activity_log (
	id          SERIAL PRIMARY KEY,
	created_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	user_id     VARCHAR(500) NOT NULL,
  org_id      VARCHAR(500),
	activity    TEXT
);



-- payment method and information of that payment method 
CREATE TABLE IF NOT EXISTS payment_method (
	id          SERIAL PRIMARY KEY,
	method_name VARCHAR(300), 
	org_id      VARCHAR(500) NOT NULL,
	is_active   BOOLEAN DEFAULT false,
	information TEXT,
  schedule    payment_schedule DEFAULT 'NOW',
	created_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at  TIMESTAMP
);

-- this table stores the attachment files 
CREATE TABLE IF NOT EXISTS attachment (
	id          SERIAL  PRIMARY KEY,
	url         TEXT NOT NULL,
	name        TEXT NOT NULL,
	pr_id       INTEGER NOT NULL,
	created_at  TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at  TIMESTAMP,
	CONSTRAINT fk_pr_id_of_payment_request_on_attachment 
		FOREIGN KEY (pr_id)
		REFERENCES payment_request(id)
		ON DELETE CASCADE
);


