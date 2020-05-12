CREATE TABLE public.account (
	user_id serial NOT NULL,
	username varchar(50) NOT NULL,
	"password" varchar(200) NOT NULL,
	email varchar(355) NOT NULL,
	created_on timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	last_login timestamp NULL,
	profile_id int4 NULL,
	CONSTRAINT account_pkey PRIMARY KEY (user_id),
	CONSTRAINT account_username_key UNIQUE (username)
);

-- public.contacts definition

-- Drop table

-- DROP TABLE public.contacts;

CREATE TABLE public.contacts (
	user_id int4 NULL,
	contact_id int4 NULL,
	CONSTRAINT contacts_user_id_contact_id_key UNIQUE (user_id, contact_id)
);


-- public.contacts foreign keys

ALTER TABLE public.contacts ADD CONSTRAINT contacts_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES account(user_id);
ALTER TABLE public.contacts ADD CONSTRAINT contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES account(user_id);

-- public.messages definition

-- Drop table

-- DROP TABLE public.messages;

CREATE TABLE public.messages (
	message_id serial NOT NULL,
	user_id int4 NOT NULL,
	contact_id int4 NULL,
	message text NULL,
	send_date timestamp NULL,
	receivement_date timestamp NULL,
	CONSTRAINT messages_pkey PRIMARY KEY (message_id)
);


-- public.messages foreign keys

ALTER TABLE public.messages ADD CONSTRAINT messages_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES account(user_id);
ALTER TABLE public.messages ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES account(user_id);

-- public.profile definition

-- Drop table

-- DROP TABLE public.profile;

CREATE TABLE public.profile (
	profile_id serial NOT NULL,
	full_name varchar(100) NULL,
	phone varchar(15) NULL,
	description varchar(100) NULL,
	image varchar(600) NULL,
	CONSTRAINT profile_pkey PRIMARY KEY (profile_id)
);


-- public.talks definition

-- Drop table

-- DROP TABLE public.talks;

CREATE TABLE public.talks (
	user_id int4 NOT NULL,
	contact_id int4 NULL,
	CONSTRAINT talks_pkey PRIMARY KEY (user_id)
);


-- public.talks foreign keys

ALTER TABLE public.talks ADD CONSTRAINT talks_contact_id_fkey FOREIGN KEY (contact_id) REFERENCES account(user_id);


