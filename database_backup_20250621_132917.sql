--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_name text NOT NULL,
    record_id text NOT NULL,
    operation text NOT NULL,
    operation_type text NOT NULL,
    old_values text,
    new_values text,
    user_id text NOT NULL,
    username text NOT NULL,
    ip_address text NOT NULL,
    user_agent text,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO neondb_owner;

--
-- Name: documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.documents (
    id text NOT NULL,
    name text NOT NULL,
    path text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0
);


ALTER TABLE public.documents OWNER TO neondb_owner;

--
-- Name: master_data_records; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.master_data_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_id uuid NOT NULL,
    record_data text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.master_data_records OWNER TO neondb_owner;

--
-- Name: master_table_configs; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.master_table_configs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    table_name text NOT NULL,
    display_name text NOT NULL,
    description text,
    columns text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.master_table_configs OWNER TO neondb_owner;

--
-- Name: module_documents; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.module_documents (
    id text NOT NULL,
    module_id text NOT NULL,
    document_id text NOT NULL
);


ALTER TABLE public.module_documents OWNER TO neondb_owner;

--
-- Name: modules; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.modules (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL,
    display_order integer DEFAULT 0
);


ALTER TABLE public.modules OWNER TO neondb_owner;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.permissions (
    id text NOT NULL,
    user_id text,
    role_id text,
    document_id text NOT NULL,
    can_add boolean DEFAULT false NOT NULL,
    can_modify boolean DEFAULT false NOT NULL,
    can_delete boolean DEFAULT false NOT NULL,
    can_query boolean DEFAULT false NOT NULL
);


ALTER TABLE public.permissions OWNER TO neondb_owner;

--
-- Name: roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.roles (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.roles OWNER TO neondb_owner;

--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.user_roles (
    user_id text NOT NULL,
    role_id text NOT NULL
);


ALTER TABLE public.user_roles OWNER TO neondb_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.audit_logs (id, table_name, record_id, operation, operation_type, old_values, new_values, user_id, username, ip_address, user_agent, "timestamp") FROM stdin;
1c1b1947-e0bb-4f4e-adc7-52b9767bf67f	master_table_configs	f58ce541-b765-4cff-9ed2-93446f32d27e	UPDATE	MASTER_TABLE_CONFIG	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master Updated","description":"Updated description for testing audit logs","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-17T12:42:37.977Z"}	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master - Test Audit","description":"Testing comprehensive audit logging with user tracking and IP addresses","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-17T12:43:03.915Z"}	system	system	127.0.0.1	curl/8.11.1	2025-06-17 12:43:03.982015
ca1bab50-4e0d-4cf2-9b23-88b9f7f5a7e6	master_table_configs	a0bef193-150c-49a7-b8e4-b6dcac6237ba	CREATE	MASTER_TABLE_CONFIG	\N	{"id":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","tableName":"gender_master","displayName":"Gender Master","description":"Gender Master","columns":"[{\\"name\\":\\"Gender Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100},{\\"name\\":\\"Gender Description\\",\\"type\\":\\"text\\",\\"required\\":true}]","isActive":true,"createdAt":"2025-06-17T13:02:45.760Z","updatedAt":"2025-06-17T13:02:45.760Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.9.35	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-17 13:02:45.818911
cacabb5c-4ce4-41f7-b07d-9a64e45c4932	roles	47ece5f3-92ee-408e-9b55-3a2aa2ad0624	UPDATE	ROLE	{"id":"47ece5f3-92ee-408e-9b55-3a2aa2ad0624","name":"Staff","description":null,"createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	{"id":"47ece5f3-92ee-408e-9b55-3a2aa2ad0624","name":"Staff","description":"Staff","createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.73	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-17 13:22:06.233037
539e3236-c153-4a21-9274-62c85300d933	users	316c438f-51a5-41eb-a4ba-6b41dbaef1f9	CREATE	USER	\N	{"id":"316c438f-51a5-41eb-a4ba-6b41dbaef1f9","username":"test_audit_user","email":"test@audit.com","password":"$2b$10$9mrYVp0TNAHaAYEbG21.G.tF/3cfQSf7C3eXj.vVBqx5Snb8fyXjm","isActive":true,"createdAt":"2025-06-18T11:15:12.569Z"}	system	system	127.0.0.1	curl/8.11.1	2025-06-18 11:15:12.626943
88c0edad-0f49-45b0-99d4-1a20424fcabe	roles	46540dad-37a4-4a13-a7d8-a9a2d2239385	UPDATE	ROLE	{"id":"46540dad-37a4-4a13-a7d8-a9a2d2239385","name":"Nurse","description":null,"createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	{"id":"46540dad-37a4-4a13-a7d8-a9a2d2239385","name":"Nurse","description":"Nurse ROle","createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 11:43:00.711011
d4d5765b-1df4-49d4-9521-a49d2a48e184	roles	076de07e-94a2-4d02-8ec3-136b111e392d	CREATE	ROLE	\N	{"id":"076de07e-94a2-4d02-8ec3-136b111e392d","name":"My Role","description":"My Role","createdAt":"2025-06-18T11:43:11.718Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 11:43:11.776888
65696f5c-0cff-453d-ae18-1d9d31061911	roles	076de07e-94a2-4d02-8ec3-136b111e392d	DELETE	ROLE	{"id":"076de07e-94a2-4d02-8ec3-136b111e392d","name":"My Role","description":"My Role","createdAt":"2025-06-18T11:43:11.718Z","isActive":true}	\N	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 11:43:18.050432
c031b5ad-4734-4524-a40d-c5d8694d56ad	users	6f0c6ad3-3edf-4e3f-86e9-073d14f4c4cd	CREATE	USER	\N	{"id":"6f0c6ad3-3edf-4e3f-86e9-073d14f4c4cd","username":"myuser","email":"kmlnrao@suvarna.co.in","password":"$2b$10$P5VIi4MJSSCYQPjOf8iKy..zRXft9IE12oebnCcQa7x6qZZUbqQO2","isActive":true,"createdAt":"2025-06-18T11:43:39.592Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 11:43:39.64567
c43d800a-a007-49b3-8b5f-b14cbff39055	users	6f0c6ad3-3edf-4e3f-86e9-073d14f4c4cd	DELETE	USER	{"id":"6f0c6ad3-3edf-4e3f-86e9-073d14f4c4cd","username":"myuser","email":"kmlnrao@suvarna.co.in","password":"$2b$10$P5VIi4MJSSCYQPjOf8iKy..zRXft9IE12oebnCcQa7x6qZZUbqQO2","isActive":true,"createdAt":"2025-06-18T11:43:39.592Z"}	\N	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 11:43:47.863594
bcc95ea2-2d20-4f01-8baa-28cd5d567dce	users	2c98bc5e-f825-4214-a808-87e585e8acbb	UPDATE	USER	{"id":"2c98bc5e-f825-4214-a808-87e585e8acbb","username":"nurse.jane","email":"nurse.jane@hospital.com","password":"$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2","isActive":true,"createdAt":"2025-05-28T14:28:57.762Z"}	{"id":"2c98bc5e-f825-4214-a808-87e585e8acbb","username":"nurse.jane123","email":"nurse.jane@hospital.com","password":"$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2","isActive":true,"createdAt":"2025-05-28T14:28:57.762Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.9.35	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 11:57:13.028346
289f2678-c442-4da3-b5bf-7d336a72ad38	users	90845683-5d68-4862-b783-7bf01d6c84b8	UPDATE	USER	{"id":"90845683-5d68-4862-b783-7bf01d6c84b8","username":"dr.smith","email":"dr.smith@hospital.com","password":"$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2","isActive":true,"createdAt":"2025-05-28T14:28:57.761Z"}	{"id":"90845683-5d68-4862-b783-7bf01d6c84b8","username":"dr.smith123","email":"dr.smith@hospital.com","password":"$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2","isActive":true,"createdAt":"2025-05-28T14:28:57.761Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.73	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 11:57:51.724224
1e91156d-21ab-48e5-b017-a8838c29d46e	roles	a6532422-15ce-457d-89f0-a716bd9d1560	CREATE	ROLE	\N	{"id":"a6532422-15ce-457d-89f0-a716bd9d1560","name":"test role","description":"test role","createdAt":"2025-06-18T12:19:19.154Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.24	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:19:19.229868
e57b5cc0-3956-42bd-bc59-5d2094be09f8	roles	a6532422-15ce-457d-89f0-a716bd9d1560	UPDATE	ROLE	{"id":"a6532422-15ce-457d-89f0-a716bd9d1560","name":"test role","description":"test role","createdAt":"2025-06-18T12:19:19.154Z","isActive":true}	{"id":"a6532422-15ce-457d-89f0-a716bd9d1560","name":"test role 344","description":"test role","createdAt":"2025-06-18T12:19:19.154Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.24	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:19:30.386023
d45385fc-c203-4fd3-96bb-ed284b624ddb	modules	f74a9cc7-b06d-49c4-b9f2-b416775c0fcb	UPDATE	MODULE	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard 1","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.8.40	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:24:51.869528
2f76671f-f96a-4aa0-8348-0aaa5788556e	modules	f74a9cc7-b06d-49c4-b9f2-b416775c0fcb	UPDATE	MODULE	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard 1","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.8.40	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:25:09.794868
75530c08-2736-4dcc-ad56-eed59ea9f329	roles	3de8a992-425d-4b72-9b5d-d60c46cb44a8	UPDATE	ROLE	{"id":"3de8a992-425d-4b72-9b5d-d60c46cb44a8","name":"Super Admin","description":null,"createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	{"id":"3de8a992-425d-4b72-9b5d-d60c46cb44a8","name":"Super Admin1","description":"","createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.8.40	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:25:24.064866
ac5355d0-e05c-4e21-b7be-0a1edacaf9e3	roles	3de8a992-425d-4b72-9b5d-d60c46cb44a8	UPDATE	ROLE	{"id":"3de8a992-425d-4b72-9b5d-d60c46cb44a8","name":"Super Admin1","description":"","createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	{"id":"3de8a992-425d-4b72-9b5d-d60c46cb44a8","name":"Super Admin","description":"","createdAt":"2025-06-02T10:15:13.125Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.8.40	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:25:38.40198
5eb96f9c-1cea-499f-ab41-b061417b5ea5	modules	f74a9cc7-b06d-49c4-b9f2-b416775c0fcb	UPDATE	MODULE	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard 2","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:29:44.357877
06cd4443-7e07-471d-8d11-ad7c961e58bd	modules	f74a9cc7-b06d-49c4-b9f2-b416775c0fcb	UPDATE	MODULE	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard 2","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	{"id":"f74a9cc7-b06d-49c4-b9f2-b416775c0fcb","name":"Dashboard","description":"Main dashboard and overview screens","displayOrder":1,"createdAt":"2025-06-02T12:34:54.442Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:30:19.474737
536b333c-19ae-40cb-829b-44065791c809	documents	400a1692-70af-4b39-831f-cec95975eac7	UPDATE	DOCUMENT	{"id":"400a1692-70af-4b39-831f-cec95975eac7","name":"Appointment History","path":"/appointments/history","displayOrder":0,"createdAt":"2025-06-02T10:38:14.491Z","isActive":true}	{"id":"400a1692-70af-4b39-831f-cec95975eac7","name":"Appointment History","path":"/appointments/history/","displayOrder":0,"createdAt":"2025-06-02T10:38:14.491Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:30:54.875863
66f0e43d-da94-45e1-bb52-b47c9cba75af	documents	400a1692-70af-4b39-831f-cec95975eac7	UPDATE	DOCUMENT	{"id":"400a1692-70af-4b39-831f-cec95975eac7","name":"Appointment History","path":"/appointments/history/","displayOrder":0,"createdAt":"2025-06-02T10:38:14.491Z","isActive":true}	{"id":"400a1692-70af-4b39-831f-cec95975eac7","name":"Appointment History","path":"/appointments/history","displayOrder":0,"createdAt":"2025-06-02T10:38:14.491Z","isActive":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.29	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:31:12.869759
d91290b0-3c6c-49aa-bb97-09e11fa04ea3	permissions	80309731-8649-4c2c-9313-28a6182ce87f	UPDATE	PERMISSION	{"id":"80309731-8649-4c2c-9313-28a6182ce87f","userId":null,"roleId":"bafef031-d469-4d17-8442-f55d4a78be2a","documentId":"a06431a2-293e-416a-bbbc-1b87ad413e57","canAdd":true,"canModify":true,"canDelete":true,"canQuery":true}	{"id":"80309731-8649-4c2c-9313-28a6182ce87f","userId":null,"roleId":"bafef031-d469-4d17-8442-f55d4a78be2a","documentId":"a06431a2-293e-416a-bbbc-1b87ad413e57","canAdd":true,"canModify":true,"canDelete":true,"canQuery":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.73	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-18 12:43:41.502635
468bb27b-adf1-4d96-af0a-aea377612bb6	users	39664956-adbb-41f2-9e1a-8caf7c4505ca	CREATE	USER	\N	{"id":"39664956-adbb-41f2-9e1a-8caf7c4505ca","username":"testuser","email":"testuser@hospital.com","password":"$2b$10$GfSqwCArvtEFnRlgaGlP6uhXGknFFYyLdWPBSz0UpzXSUabd8RSrm","isActive":true,"createdAt":"2025-06-18T13:36:32.348Z"}	system	system	127.0.0.1	curl/8.11.1	2025-06-18 13:36:32.407513
ed75810c-56c1-4a01-b252-59c5de081e7a	permissions	1b1560d6-8e6d-439e-bea3-560fcefdaf25	CREATE	PERMISSION	\N	{"id":"1b1560d6-8e6d-439e-bea3-560fcefdaf25","userId":"39664956-adbb-41f2-9e1a-8caf7c4505ca","roleId":null,"documentId":"77e32b32-a816-4e29-afd2-9d9c2d6038d0","canAdd":false,"canModify":false,"canDelete":false,"canQuery":true}	system	system	127.0.0.1	curl/8.11.1	2025-06-18 13:37:13.676634
0df7e2c0-f85c-4536-b6d3-03f23f69bd5e	permissions	c8d883c3-a3c9-4ccf-b7d9-69838551874d	CREATE	PERMISSION	\N	{"id":"c8d883c3-a3c9-4ccf-b7d9-69838551874d","userId":"39664956-adbb-41f2-9e1a-8caf7c4505ca","roleId":null,"documentId":"10e85778-764a-40df-97dd-f11f6b4b599c","canAdd":true,"canModify":false,"canDelete":false,"canQuery":false}	system	system	127.0.0.1	curl/8.11.1	2025-06-18 13:38:42.112396
172ebeb4-34fb-46bc-9703-625ca53e9731	permissions	fa25587e-6ab7-4cf8-a885-f19ed7fcee2a	CREATE	PERMISSION	\N	{"id":"fa25587e-6ab7-4cf8-a885-f19ed7fcee2a","userId":null,"roleId":"4eeb2c2b-b6c4-4118-a880-156c66d9a4a9","documentId":"bb6884d9-7f08-449e-ac6c-27ebdbd80291","canAdd":false,"canModify":true,"canDelete":false,"canQuery":false}	system	system	127.0.0.1	curl/8.11.1	2025-06-18 13:38:59.730811
d2700e55-1d77-4c19-a865-442d49173605	users	39664956-adbb-41f2-9e1a-8caf7c4505ca	DELETE	USER	{"id":"39664956-adbb-41f2-9e1a-8caf7c4505ca","username":"testuser","email":"testuser@hospital.com","password":"$2b$10$GfSqwCArvtEFnRlgaGlP6uhXGknFFYyLdWPBSz0UpzXSUabd8RSrm","isActive":true,"createdAt":"2025-06-18T13:36:32.348Z"}	\N	system	system	127.0.0.1	curl/8.11.1	2025-06-18 13:39:05.452641
3b9f18be-1489-454d-b0af-1c705628716d	permissions	cd240d4d-2a70-4b6b-a382-71d18bc795d3	CREATE	PERMISSION	\N	{"id":"cd240d4d-2a70-4b6b-a382-71d18bc795d3","userId":null,"roleId":"3de8a992-425d-4b72-9b5d-d60c46cb44a8","documentId":"dd1d938f-8736-4349-9cb4-fa93fd197581","canAdd":true,"canModify":true,"canDelete":true,"canQuery":true}	system	system	127.0.0.1	curl/8.11.1	2025-06-20 06:18:28.178386
48ef1f5b-7473-4da4-84af-f0b9d5ba2c68	permissions	fd5910b6-efa4-4afa-9fc5-29128798c4cf	CREATE	PERMISSION	\N	{"id":"fd5910b6-efa4-4afa-9fc5-29128798c4cf","userId":"9e71a6db-4f2a-4ef7-a035-46ba386c8147","roleId":null,"documentId":"dd1d938f-8736-4349-9cb4-fa93fd197581","canAdd":true,"canModify":true,"canDelete":true,"canQuery":true}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.9.177	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-20 06:21:21.684543
0c325c28-5cfa-4afa-b23e-e08334fbb441	master_table_configs	e4f51699-0c06-4bc3-845a-f851b09dd239	UPDATE	MASTER_TABLE_CONFIG	{"id":"e4f51699-0c06-4bc3-845a-f851b09dd239","tableName":"service_group_master","displayName":"Service Group1","description":"Service Group","columns":"[{\\"name\\":\\"Service Group Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100},{\\"name\\":\\"Service Group Description\\",\\"type\\":\\"text\\",\\"required\\":true},{\\"name\\":\\"test\\",\\"type\\":\\"text\\",\\"required\\":false}]","isActive":true,"createdAt":"2025-06-17T10:31:00.487Z","updatedAt":"2025-06-17T12:30:59.104Z"}	{"id":"e4f51699-0c06-4bc3-845a-f851b09dd239","tableName":"service_group_master","displayName":"Service Group1","description":"Service Group","columns":"[{\\"name\\":\\"Service Group Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Service Group Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"test\\",\\"type\\":\\"text\\",\\"required\\":false,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:31:00.487Z","updatedAt":"2025-06-20T06:57:15.989Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.151	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-20 06:57:16.059287
e64110a8-3c23-4422-9fba-639c7a4d5d26	master_table_configs	f58ce541-b765-4cff-9ed2-93446f32d27e	UPDATE	MASTER_TABLE_CONFIG	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master - Test Audit","description":"Testing comprehensive audit logging with user tracking and IP addresses","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-17T12:43:03.915Z"}	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master - Test Audit","description":"Testing comprehensive audit logging with user tracking and IP addresses","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10,\\"displayInFrontend\\":true},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500,\\"displayInFrontend\\":true},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100,\\"displayInFrontend\\":false},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20,\\"displayInFrontend\\":true},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false,\\"displayInFrontend\\":true},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-20T06:57:37.028Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.151	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-20 06:57:37.088602
96edf8bf-e54a-466a-81a0-804658308959	master_table_configs	f58ce541-b765-4cff-9ed2-93446f32d27e	UPDATE	MASTER_TABLE_CONFIG	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master - Test Audit","description":"Testing comprehensive audit logging with user tracking and IP addresses","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10,\\"displayInFrontend\\":true},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500,\\"displayInFrontend\\":true},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100,\\"displayInFrontend\\":false},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20,\\"displayInFrontend\\":true},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false,\\"displayInFrontend\\":true},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-20T06:57:37.028Z"}	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master - Test Audit","description":"Testing comprehensive audit logging with user tracking and IP addresses","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10,\\"displayInFrontend\\":true},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500,\\"displayInFrontend\\":true},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100,\\"displayInFrontend\\":false},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20,\\"displayInFrontend\\":false},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false,\\"displayInFrontend\\":true},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-20T06:58:29.243Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.4.151	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-20 06:58:29.3093
73bfe726-d13c-4dbb-a520-de4e4f6efa11	master_table_configs	a0bef193-150c-49a7-b8e4-b6dcac6237ba	UPDATE	MASTER_TABLE_CONFIG	{"id":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","tableName":"gender_master","displayName":"Gender Master","description":"Gender Master","columns":"[{\\"name\\":\\"Gender Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100},{\\"name\\":\\"Gender Description\\",\\"type\\":\\"text\\",\\"required\\":true}]","isActive":true,"createdAt":"2025-06-17T13:02:45.760Z","updatedAt":"2025-06-17T13:02:45.760Z"}	{"id":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","tableName":"gender_master","displayName":"Gender Master","description":"Gender Master","columns":"[{\\"name\\":\\"Gender Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Gender Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T13:02:45.760Z","updatedAt":"2025-06-21T05:08:08.608Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.3.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:08:08.67856
bf6678ab-e4ed-4f9c-b00f-77fe2e514680	master_table_configs	f58ce541-b765-4cff-9ed2-93446f32d27e	UPDATE	MASTER_TABLE_CONFIG	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master - Test Audit","description":"Testing comprehensive audit logging with user tracking and IP addresses","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10,\\"displayInFrontend\\":true},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500,\\"displayInFrontend\\":true},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100,\\"displayInFrontend\\":false},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20,\\"displayInFrontend\\":false},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false,\\"displayInFrontend\\":true},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-20T06:58:29.243Z"}	{"id":"f58ce541-b765-4cff-9ed2-93446f32d27e","tableName":"department","displayName":"Department Master","description":"Testing comprehensive audit logging with user tracking and IP addresses","columns":"[{\\"name\\":\\"name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":10,\\"displayInFrontend\\":true},{\\"name\\":\\"description\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":500,\\"displayInFrontend\\":true},{\\"name\\":\\"head_of_department\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":100,\\"displayInFrontend\\":false},{\\"name\\":\\"phone\\",\\"type\\":\\"text\\",\\"required\\":false,\\"maxLength\\":20,\\"displayInFrontend\\":false},{\\"name\\":\\"email\\",\\"type\\":\\"email\\",\\"required\\":false,\\"displayInFrontend\\":true},{\\"name\\":\\"is_active\\",\\"type\\":\\"boolean\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:24:00.020Z","updatedAt":"2025-06-21T05:35:19.089Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:35:19.130049
d6e05115-4a21-46fd-a072-9f1641cb62e3	master_table_configs	e4f51699-0c06-4bc3-845a-f851b09dd239	UPDATE	MASTER_TABLE_CONFIG	{"id":"e4f51699-0c06-4bc3-845a-f851b09dd239","tableName":"service_group_master","displayName":"Service Group1","description":"Service Group","columns":"[{\\"name\\":\\"Service Group Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Service Group Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"test\\",\\"type\\":\\"text\\",\\"required\\":false,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:31:00.487Z","updatedAt":"2025-06-20T06:57:15.989Z"}	{"id":"e4f51699-0c06-4bc3-845a-f851b09dd239","tableName":"service_group_master","displayName":"Service Group","description":"Service Group","columns":"[{\\"name\\":\\"Service Group Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Service Group Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"test\\",\\"type\\":\\"text\\",\\"required\\":false,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T10:31:00.487Z","updatedAt":"2025-06-21T05:35:41.898Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:35:41.965318
6ab8f782-57b6-4731-8250-4563f2b517d9	master_table_configs	a0bef193-150c-49a7-b8e4-b6dcac6237ba	UPDATE	MASTER_TABLE_CONFIG	{"id":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","tableName":"gender_master","displayName":"Gender Master","description":"Gender Master","columns":"[{\\"name\\":\\"Gender Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Gender Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T13:02:45.760Z","updatedAt":"2025-06-21T05:08:08.608Z"}	{"id":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","tableName":"gender_master","displayName":"Gender Master","description":"Gender Master","columns":"[{\\"name\\":\\"Gender Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Gender Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"Geder Test\\",\\"type\\":\\"text\\",\\"required\\":false,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T13:02:45.760Z","updatedAt":"2025-06-21T05:37:09.562Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.3.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:37:09.62705
ae0441d0-8140-4c6d-a9fc-c20049f400ee	master_data_gender_master	a89fd2c1-38fb-44d4-9da9-bd2c751b315b	UPDATE	MASTER_DATA_RECORD	{"id":"a89fd2c1-38fb-44d4-9da9-bd2c751b315b","tableId":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","recordData":{"Gender Name":"F","Gender Description":"Female"},"tableName":"gender_master"}	{"id":"a89fd2c1-38fb-44d4-9da9-bd2c751b315b","tableId":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","recordData":{"Gender Name":"F","Gender Description":"Female"},"tableName":"gender_master"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.3.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:37:26.121312
8259e64c-f1d2-4cbf-ba81-af6e712ac53e	master_data_gender_master	85a1ff40-ec92-4a5b-a2fa-2e2760938773	UPDATE	MASTER_DATA_RECORD	{"id":"85a1ff40-ec92-4a5b-a2fa-2e2760938773","tableId":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","recordData":{"Gender Name":"U","Gender Description":"Unspecified"},"tableName":"gender_master"}	{"id":"85a1ff40-ec92-4a5b-a2fa-2e2760938773","tableId":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","recordData":{"Gender Name":"U","Gender Description":"Unspecified","Geder Test":"sffdsfdsfdsf"},"tableName":"gender_master"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.3.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:38:17.707009
52e7908e-9fc2-486b-b454-703198c9b114	master_table_configs	a0bef193-150c-49a7-b8e4-b6dcac6237ba	UPDATE	MASTER_TABLE_CONFIG	{"id":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","tableName":"gender_master","displayName":"Gender Master","description":"Gender Master","columns":"[{\\"name\\":\\"Gender Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Gender Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"Geder Test\\",\\"type\\":\\"text\\",\\"required\\":false,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-17T13:02:45.760Z","updatedAt":"2025-06-21T05:37:09.562Z"}	{"id":"a0bef193-150c-49a7-b8e4-b6dcac6237ba","tableName":"gender_master","displayName":"Gender Master","description":"Gender Master","columns":"[{\\"name\\":\\"Gender Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"maxLength\\":100,\\"displayInFrontend\\":true},{\\"name\\":\\"Gender Description\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"Geder Test\\",\\"type\\":\\"text\\",\\"required\\":false,\\"displayInFrontend\\":false}]","isActive":true,"createdAt":"2025-06-17T13:02:45.760Z","updatedAt":"2025-06-21T05:38:46.856Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.3.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:38:46.920259
40389a9c-f404-456a-8bd7-c0a029ddc801	master_table_configs	5a855317-9470-448d-ae1e-71776f5f8030	CREATE	MASTER_TABLE_CONFIG	\N	{"id":"5a855317-9470-448d-ae1e-71776f5f8030","tableName":"country","displayName":"Country","description":"Country","columns":"[{\\"name\\":\\"Country Code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true,\\"maxLength\\":100},{\\"name\\":\\"Country Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true}]","isActive":true,"createdAt":"2025-06-21T05:40:41.917Z","updatedAt":"2025-06-21T05:40:41.917Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:40:41.973483
7e4e2ec6-5e63-450f-a179-313f340e7501	master_data_country	38557c39-cf96-4796-a3ad-660e0728fe9f	CREATE	MASTER_DATA_RECORD	\N	{"id":"38557c39-cf96-4796-a3ad-660e0728fe9f","tableId":"5a855317-9470-448d-ae1e-71776f5f8030","recordData":{"Country Code":"01","Country Name":"India"},"tableName":"country"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.196	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:49:33.714239
83e2f586-922a-4fe2-80ce-a2668231b183	master_data_country	30b289ba-d6b2-4af6-9288-45bb033183d8	CREATE	MASTER_DATA_RECORD	\N	{"id":"30b289ba-d6b2-4af6-9288-45bb033183d8","tableId":"5a855317-9470-448d-ae1e-71776f5f8030","recordData":{"Country Code":"02","Country Name":"USA"},"tableName":"country"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.196	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:49:42.270378
e40fb242-e618-4d65-b5e9-317f19512105	master_data_country	93c37de7-d50a-458c-b12b-8c3d3c41890c	CREATE	MASTER_DATA_RECORD	\N	{"id":"93c37de7-d50a-458c-b12b-8c3d3c41890c","tableId":"5a855317-9470-448d-ae1e-71776f5f8030","recordData":{"Country Code":"03","Country Name":"England"},"tableName":"country"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.196	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 05:49:55.303717
da8cdc20-574d-4b8e-b32b-d7c86a87c7cc	master_table_configs	2ffbf0c1-8ecb-4432-b41e-688adc99bfd9	CREATE	MASTER_TABLE_CONFIG	\N	{"id":"2ffbf0c1-8ecb-4432-b41e-688adc99bfd9","tableName":"state_master","displayName":"State Master","description":"State Master","columns":"[{\\"name\\":\\"State Code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true,\\"maxLength\\":100}]","isActive":true,"createdAt":"2025-06-21T06:45:45.042Z","updatedAt":"2025-06-21T06:45:45.042Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.3.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 06:45:45.118382
6ae2caa4-76a1-4778-8ecd-08563d493b84	master_table_configs	2ffbf0c1-8ecb-4432-b41e-688adc99bfd9	DELETE	MASTER_TABLE_CONFIG	{"id":"2ffbf0c1-8ecb-4432-b41e-688adc99bfd9","tableName":"state_master","displayName":"State Master","description":"State Master","columns":"[{\\"name\\":\\"State Code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true,\\"maxLength\\":100}]","isActive":true,"createdAt":"2025-06-21T06:45:45.042Z","updatedAt":"2025-06-21T06:45:45.042Z"}	\N	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.3.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 06:45:53.249247
b19eb63b-e127-4a9b-943e-29a611171588	master_table_configs	a44e55c8-6a0e-4a11-8a2c-2049c3b0454e	CREATE	MASTER_TABLE_CONFIG	\N	{"id":"a44e55c8-6a0e-4a11-8a2c-2049c3b0454e","tableName":"state_table","displayName":"State Table","description":"State Table","columns":"[{\\"name\\":\\"State Code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true,\\"maxLength\\":100,\\"referenceTable\\":\\"5a855317-9470-448d-ae1e-71776f5f8030\\",\\"referenceDisplayField\\":\\"Country Name\\",\\"referenceValueField\\":\\"Country Code\\"},{\\"name\\":\\"State Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"Country\\",\\"type\\":\\"reference\\",\\"required\\":false,\\"displayInFrontend\\":true,\\"referenceTable\\":\\"5a855317-9470-448d-ae1e-71776f5f8030\\",\\"referenceDisplayField\\":\\"Country Name\\",\\"referenceValueField\\":\\"Country Code\\"}]","isActive":true,"createdAt":"2025-06-21T13:22:00.076Z","updatedAt":"2025-06-21T13:22:00.076Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.196	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 13:22:00.136373
6fa6eb72-9692-4bf7-b216-f9ed7224e47d	master_data_state_table	d15cd01a-d4ea-4151-9e80-827524a272c4	CREATE	MASTER_DATA_RECORD	\N	{"id":"d15cd01a-d4ea-4151-9e80-827524a272c4","tableId":"a44e55c8-6a0e-4a11-8a2c-2049c3b0454e","recordData":{"State Code":"0001","State Name":"Andhra Pradesh","Country":"38557c39-cf96-4796-a3ad-660e0728fe9f"},"tableName":"state_table"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.11.196	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 13:22:30.819365
1e503191-d640-41b7-81fb-4242578127e6	master_table_configs	702a6d9f-4052-4679-ba9b-4f0d91ce0e2c	CREATE	MASTER_TABLE_CONFIG	\N	{"id":"702a6d9f-4052-4679-ba9b-4f0d91ce0e2c","tableName":"city_master","displayName":"City Master","description":"City Master","columns":"[{\\"name\\":\\"City Code\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true,\\"maxLength\\":100},{\\"name\\":\\"City Name\\",\\"type\\":\\"text\\",\\"required\\":true,\\"displayInFrontend\\":true},{\\"name\\":\\"State\\",\\"type\\":\\"reference\\",\\"required\\":false,\\"displayInFrontend\\":true,\\"referenceTable\\":\\"a44e55c8-6a0e-4a11-8a2c-2049c3b0454e\\",\\"referenceDisplayField\\":\\"State Name\\",\\"referenceValueField\\":\\"State Code\\"}]","isActive":true,"createdAt":"2025-06-21T13:26:36.717Z","updatedAt":"2025-06-21T13:26:36.717Z"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 13:26:36.76911
3f600d49-94c0-4c9c-b6ca-87ffe12c74a9	master_data_city_master	8996920d-84e4-44ad-a627-ff3ae9b49840	CREATE	MASTER_DATA_RECORD	\N	{"id":"8996920d-84e4-44ad-a627-ff3ae9b49840","tableId":"702a6d9f-4052-4679-ba9b-4f0d91ce0e2c","recordData":{"City Code":"0001","City Name":"Hyderabad","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"},"tableName":"city_master"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 13:27:04.720279
a4352879-5911-4841-86a6-05c71f126493	master_data_city_master	62e42c2e-8f80-4268-acd4-2ae29c2e6e1d	CREATE	MASTER_DATA_RECORD	\N	{"id":"62e42c2e-8f80-4268-acd4-2ae29c2e6e1d","tableId":"702a6d9f-4052-4679-ba9b-4f0d91ce0e2c","recordData":{"City Code":"0002","City Name":"Vizag","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"},"tableName":"city_master"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.2.202	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 13:27:22.461401
ff1c131f-f885-454a-bead-377d609bf550	master_data_city_master	f3376a9f-bf7b-4b1e-95e7-ef9188cfb137	CREATE	MASTER_DATA_RECORD	\N	{"id":"f3376a9f-bf7b-4b1e-95e7-ef9188cfb137","tableId":"702a6d9f-4052-4679-ba9b-4f0d91ce0e2c","recordData":{"City Code":"003","City Name":"Tirupathi","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"},"tableName":"city_master"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.10.166	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 13:27:41.035005
5689bdc1-9125-44ff-a87d-d73180a926ae	master_data_city_master	f3376a9f-bf7b-4b1e-95e7-ef9188cfb137	UPDATE	MASTER_DATA_RECORD	{"id":"f3376a9f-bf7b-4b1e-95e7-ef9188cfb137","tableId":"702a6d9f-4052-4679-ba9b-4f0d91ce0e2c","recordData":{"City Code":"003","City Name":"Tirupathi","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"},"tableName":"city_master"}	{"id":"f3376a9f-bf7b-4b1e-95e7-ef9188cfb137","tableId":"702a6d9f-4052-4679-ba9b-4f0d91ce0e2c","recordData":{"City Code":"0003","City Name":"Tirupathi","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"},"tableName":"city_master"}	7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	10.81.2.202	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36	2025-06-21 13:27:52.115769
\.


--
-- Data for Name: documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.documents (id, name, path, created_at, is_active, display_order) FROM stdin;
adcd507d-b8f4-4abb-874a-54f952e4d5c4	Patient Registration	/patients/register	2025-06-02 10:38:14.491621	t	0
a06431a2-293e-416a-bbbc-1b87ad413e57	Medical History	/records/history	2025-06-02 10:38:14.491621	t	0
2bc7e162-a381-406b-a118-47e83259bb35	Schedule Appointment	/appointments/schedule	2025-06-02 10:38:14.491621	t	0
d2ca1a22-27c2-43ff-a14d-3e5f56239ed4	Prescriptions	/records/prescriptions	2025-06-02 10:38:14.491621	t	0
bc5b214d-5a18-42eb-83f2-dc3c9e3ca966	Patient List	/patients/list	2025-06-02 10:38:14.491621	t	0
c43ee18d-c8c6-475a-9aa4-33daf82f41e6	Patient Details	/patients/details	2025-06-02 10:38:14.491621	t	0
6d7c5ea3-eaf7-45da-a5fd-9e49be9c45cb	Lab Reports	/lab/reports	2025-06-02 10:38:14.491621	t	0
fc671b54-e586-4ec8-9342-d4ba259c2ce8	Test Results	/records/tests	2025-06-02 10:38:14.491621	t	0
f3c5cdf8-98af-48b5-9527-506303961230	Lab Tests	/lab/tests	2025-06-02 10:38:14.491621	t	0
40f5d520-e19c-4adb-8036-994fa5fb2f99	Role Management	/admin/roles	2025-06-02 10:38:14.491621	t	0
06c5cfe1-00fc-44eb-835e-7af849c5760e	System Settings	/admin/settings	2025-06-02 10:38:14.491621	t	0
0c81f971-4a34-4fb6-9a14-f32ff8cc1f29	Medicine Inventory	/pharmacy/inventory	2025-06-02 10:38:14.491621	t	0
782f5ba9-88a0-4e38-85bd-b2097aff25d9	View Appointments	/appointments/view	2025-06-02 10:38:14.491621	t	0
10e85778-764a-40df-97dd-f11f6b4b599c	User Management	/admin/users	2025-06-02 10:38:14.491621	t	0
85ec13e5-1119-4ea8-81c6-f20b4b2c2917	Dispense Medicine	/pharmacy/dispense	2025-06-02 10:38:14.491621	t	0
bb6884d9-7f08-449e-ac6c-27ebdbd80291	Module Management	/modules	2025-06-02 10:38:14.491621	t	0
dc3e00b1-dbbd-42d4-b403-7b6fc58cf0fa	Document Management	/documents	2025-06-02 10:38:14.491621	t	0
dd1d938f-8736-4349-9cb4-fa93fd197581	Permission Management	/permissions	2025-06-02 10:38:14.491621	t	0
628425e6-3e89-4615-8670-d1ade686a0a7	Test Documnet	/admin/TestDoc	2025-06-02 10:55:03.80654	t	0
77e32b32-a816-4e29-afd2-9d9c2d6038d0	Dashboard	/dashboard	2025-06-02 12:33:18.498432	t	0
f8139851-b190-4ea8-befd-5376f4a09541	Module-Document Management	/module-documents	2025-06-02 12:57:54.371769	t	5
02210cbe-5173-48b2-a077-19e472cead35	t doc	t doc	2025-06-02 13:17:01.932025	t	0
2cb56674-ade9-4780-9930-d114129444a5	Master Tables	/masters	2025-06-17 10:22:29.315388	t	1
400a1692-70af-4b39-831f-cec95975eac7	Appointment History	/appointments/history	2025-06-02 10:38:14.491621	t	0
\.


--
-- Data for Name: master_data_records; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.master_data_records (id, table_id, record_data, is_active, created_at, updated_at) FROM stdin;
b2de2047-9f03-449f-a8f7-91374e875bbd	f58ce541-b765-4cff-9ed2-93446f32d27e	{"name":"Cardiology","code":"CARD","description":"Heart and cardiovascular system treatment","head_of_department":"Dr. Sarah Johnson","phone":"555-0101","email":"cardiology@hospital.com","is_active":true}	t	2025-06-17 10:24:09.289204	2025-06-17 10:24:09.289204
10050057-b797-46fd-9141-21b64b4507fb	f58ce541-b765-4cff-9ed2-93446f32d27e	{"name":"Neurology","code":"NEURO","description":"Brain and nervous system treatment","head_of_department":"Dr. Michael Chen","phone":"555-0102","email":"neurology@hospital.com","is_active":true}	t	2025-06-17 10:24:16.242468	2025-06-17 10:24:16.242468
ce732770-65e7-4655-8246-686045186153	f58ce541-b765-4cff-9ed2-93446f32d27e	{"name":"Pediatrics","code":"PEDS","description":"Children healthcare services","head_of_department":"Dr. Emily Davis","phone":"555-0103","email":"pediatrics@hospital.com","is_active":true}	t	2025-06-17 10:24:37.46193	2025-06-17 10:24:37.46193
8d1e00f9-a41d-4ad6-8083-618bfa63991d	e4f51699-0c06-4bc3-845a-f851b09dd239	{"Service Group Name":"Bio Chemistry6666","Service Group Description":"Bio Chemistry 123","test":"889"}	t	2025-06-17 10:31:45.043801	2025-06-17 13:01:17.926
583cf14a-f9f5-4006-8447-6de63a3b1a67	e4f51699-0c06-4bc3-845a-f851b09dd239	{"Service Group Name":"Microbiology","Service Group Description":"Microbiology","test":"889"}	t	2025-06-17 13:01:43.281171	2025-06-17 13:01:43.281171
2ccb16f9-a3d4-44cc-925d-1f91c8a49acd	a0bef193-150c-49a7-b8e4-b6dcac6237ba	{"Gender Name":"M","Gender Description":"Male"}	t	2025-06-17 13:03:17.480448	2025-06-17 13:03:59.966
a89fd2c1-38fb-44d4-9da9-bd2c751b315b	a0bef193-150c-49a7-b8e4-b6dcac6237ba	{"Gender Name":"F","Gender Description":"Female"}	t	2025-06-17 13:03:28.735616	2025-06-21 05:37:26.056
85a1ff40-ec92-4a5b-a2fa-2e2760938773	a0bef193-150c-49a7-b8e4-b6dcac6237ba	{"Gender Name":"U","Gender Description":"Unspecified","Geder Test":"sffdsfdsfdsf"}	t	2025-06-17 13:03:39.281013	2025-06-21 05:38:17.64
38557c39-cf96-4796-a3ad-660e0728fe9f	5a855317-9470-448d-ae1e-71776f5f8030	{"Country Code":"01","Country Name":"India"}	t	2025-06-21 05:49:33.661246	2025-06-21 05:49:33.661246
30b289ba-d6b2-4af6-9288-45bb033183d8	5a855317-9470-448d-ae1e-71776f5f8030	{"Country Code":"02","Country Name":"USA"}	t	2025-06-21 05:49:42.224542	2025-06-21 05:49:42.224542
93c37de7-d50a-458c-b12b-8c3d3c41890c	5a855317-9470-448d-ae1e-71776f5f8030	{"Country Code":"03","Country Name":"England"}	t	2025-06-21 05:49:55.251354	2025-06-21 05:49:55.251354
d15cd01a-d4ea-4151-9e80-827524a272c4	a44e55c8-6a0e-4a11-8a2c-2049c3b0454e	{"State Code":"0001","State Name":"Andhra Pradesh","Country":"38557c39-cf96-4796-a3ad-660e0728fe9f"}	t	2025-06-21 13:22:30.767204	2025-06-21 13:22:30.767204
8996920d-84e4-44ad-a627-ff3ae9b49840	702a6d9f-4052-4679-ba9b-4f0d91ce0e2c	{"City Code":"0001","City Name":"Hyderabad","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"}	t	2025-06-21 13:27:04.670631	2025-06-21 13:27:04.670631
62e42c2e-8f80-4268-acd4-2ae29c2e6e1d	702a6d9f-4052-4679-ba9b-4f0d91ce0e2c	{"City Code":"0002","City Name":"Vizag","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"}	t	2025-06-21 13:27:22.40647	2025-06-21 13:27:22.40647
f3376a9f-bf7b-4b1e-95e7-ef9188cfb137	702a6d9f-4052-4679-ba9b-4f0d91ce0e2c	{"City Code":"0003","City Name":"Tirupathi","State":"d15cd01a-d4ea-4151-9e80-827524a272c4"}	t	2025-06-21 13:27:40.989509	2025-06-21 13:27:52.052
\.


--
-- Data for Name: master_table_configs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.master_table_configs (id, table_name, display_name, description, columns, is_active, created_at, updated_at) FROM stdin;
a44e55c8-6a0e-4a11-8a2c-2049c3b0454e	state_table	State Table	State Table	[{"name":"State Code","type":"text","required":true,"displayInFrontend":true,"maxLength":100,"referenceTable":"5a855317-9470-448d-ae1e-71776f5f8030","referenceDisplayField":"Country Name","referenceValueField":"Country Code"},{"name":"State Name","type":"text","required":true,"displayInFrontend":true},{"name":"Country","type":"reference","required":false,"displayInFrontend":true,"referenceTable":"5a855317-9470-448d-ae1e-71776f5f8030","referenceDisplayField":"Country Name","referenceValueField":"Country Code"}]	t	2025-06-21 13:22:00.076801	2025-06-21 13:22:00.076801
702a6d9f-4052-4679-ba9b-4f0d91ce0e2c	city_master	City Master	City Master	[{"name":"City Code","type":"text","required":true,"displayInFrontend":true,"maxLength":100},{"name":"City Name","type":"text","required":true,"displayInFrontend":true},{"name":"State","type":"reference","required":false,"displayInFrontend":true,"referenceTable":"a44e55c8-6a0e-4a11-8a2c-2049c3b0454e","referenceDisplayField":"State Name","referenceValueField":"State Code"}]	t	2025-06-21 13:26:36.717746	2025-06-21 13:26:36.717746
f58ce541-b765-4cff-9ed2-93446f32d27e	department	Department Master	Testing comprehensive audit logging with user tracking and IP addresses	[{"name":"name","type":"text","required":true,"maxLength":100,"displayInFrontend":true},{"name":"code","type":"text","required":true,"maxLength":10,"displayInFrontend":true},{"name":"description","type":"text","required":false,"maxLength":500,"displayInFrontend":true},{"name":"head_of_department","type":"text","required":false,"maxLength":100,"displayInFrontend":false},{"name":"phone","type":"text","required":false,"maxLength":20,"displayInFrontend":false},{"name":"email","type":"email","required":false,"displayInFrontend":true},{"name":"is_active","type":"boolean","required":true,"displayInFrontend":true}]	t	2025-06-17 10:24:00.020469	2025-06-21 05:35:19.089
e4f51699-0c06-4bc3-845a-f851b09dd239	service_group_master	Service Group	Service Group	[{"name":"Service Group Name","type":"text","required":true,"maxLength":100,"displayInFrontend":true},{"name":"Service Group Description","type":"text","required":true,"displayInFrontend":true},{"name":"test","type":"text","required":false,"displayInFrontend":true}]	t	2025-06-17 10:31:00.487537	2025-06-21 05:35:41.898
a0bef193-150c-49a7-b8e4-b6dcac6237ba	gender_master	Gender Master	Gender Master	[{"name":"Gender Name","type":"text","required":true,"maxLength":100,"displayInFrontend":true},{"name":"Gender Description","type":"text","required":true,"displayInFrontend":true},{"name":"Geder Test","type":"text","required":false,"displayInFrontend":false}]	t	2025-06-17 13:02:45.760391	2025-06-21 05:38:46.856
5a855317-9470-448d-ae1e-71776f5f8030	country	Country	Country	[{"name":"Country Code","type":"text","required":true,"displayInFrontend":true,"maxLength":100},{"name":"Country Name","type":"text","required":true,"displayInFrontend":true}]	t	2025-06-21 05:40:41.917675	2025-06-21 05:40:41.917675
\.


--
-- Data for Name: module_documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.module_documents (id, module_id, document_id) FROM stdin;
ad85f55c-be4b-4e11-9609-10936a246752	926861c1-cf39-4783-82d0-9a4bad5c6f95	adcd507d-b8f4-4abb-874a-54f952e4d5c4
23767b99-4486-4c54-8955-0108fe402da9	b504b3fd-7646-44d1-8803-0ae3373a8204	400a1692-70af-4b39-831f-cec95975eac7
8e603e93-83dd-47e2-87d7-77953dc22cf0	926861c1-cf39-4783-82d0-9a4bad5c6f95	bc5b214d-5a18-42eb-83f2-dc3c9e3ca966
20b69200-380f-4396-85db-fc7f138a4bf4	3739d0da-5229-4ed8-b022-ccf0aa3d08e3	fc671b54-e586-4ec8-9342-d4ba259c2ce8
02fd29c7-81f2-4c60-8d8c-b0e380e56a73	02206d4e-509d-4809-9705-cbd772b8da6d	0c81f971-4a34-4fb6-9a14-f32ff8cc1f29
455ab9f6-c002-4404-9acb-306bd0750cc4	6980658a-9176-4503-b983-792e29db3ab2	40f5d520-e19c-4adb-8036-994fa5fb2f99
6a2367ef-5499-46d3-8fb8-e76c5416bd9c	6980658a-9176-4503-b983-792e29db3ab2	10e85778-764a-40df-97dd-f11f6b4b599c
31455665-c074-4572-997e-4cd4a8bed9bf	a75a4c20-ef8a-4b2c-bd71-dcf4c61362ae	f3c5cdf8-98af-48b5-9527-506303961230
3a2c6b46-566b-4219-81b4-52e9613e2e57	3739d0da-5229-4ed8-b022-ccf0aa3d08e3	d2ca1a22-27c2-43ff-a14d-3e5f56239ed4
0b5a35e0-21f3-4269-a0f6-b635d78bd782	926861c1-cf39-4783-82d0-9a4bad5c6f95	c43ee18d-c8c6-475a-9aa4-33daf82f41e6
034c91de-f540-4e3e-a3a0-8ddf659be8d7	6980658a-9176-4503-b983-792e29db3ab2	06c5cfe1-00fc-44eb-835e-7af849c5760e
5bf98b67-898b-449e-9d90-cc85ec8397e9	a75a4c20-ef8a-4b2c-bd71-dcf4c61362ae	6d7c5ea3-eaf7-45da-a5fd-9e49be9c45cb
8dc69c85-0b3d-4f9a-acb0-7946a0d012e7	3739d0da-5229-4ed8-b022-ccf0aa3d08e3	a06431a2-293e-416a-bbbc-1b87ad413e57
2836b122-4de3-43d0-8e8b-7224dba8e4c4	b504b3fd-7646-44d1-8803-0ae3373a8204	2bc7e162-a381-406b-a118-47e83259bb35
093b2155-9de9-4679-b511-26f201a07ec7	02206d4e-509d-4809-9705-cbd772b8da6d	85ec13e5-1119-4ea8-81c6-f20b4b2c2917
eed0b7fb-3177-4296-be1f-56f5ee24de4a	b504b3fd-7646-44d1-8803-0ae3373a8204	782f5ba9-88a0-4e38-85bd-b2097aff25d9
fce1a0b6-47ae-4ca4-9ac6-08f057bbd9a1	5698d4ba-91d4-435e-9a50-4341ca5b4716	40f5d520-e19c-4adb-8036-994fa5fb2f99
e623e888-a4f9-4f48-aeb0-d7018450a7ff	5698d4ba-91d4-435e-9a50-4341ca5b4716	10e85778-764a-40df-97dd-f11f6b4b599c
f2ad7fd5-c929-48c3-bb17-2f9039abdb58	5698d4ba-91d4-435e-9a50-4341ca5b4716	bb6884d9-7f08-449e-ac6c-27ebdbd80291
37dba2aa-4ed6-47bf-acc1-432f086e0702	5698d4ba-91d4-435e-9a50-4341ca5b4716	dc3e00b1-dbbd-42d4-b403-7b6fc58cf0fa
943f80b1-85d5-46b1-b04e-c52a5fa687a3	5698d4ba-91d4-435e-9a50-4341ca5b4716	dd1d938f-8736-4349-9cb4-fa93fd197581
d6b6b672-924a-4ab0-a5b5-31a8764ab9ab	6980658a-9176-4503-b983-792e29db3ab2	628425e6-3e89-4615-8670-d1ade686a0a7
b31b3671-a72d-4d64-a8f6-c2cdc241bea6	f74a9cc7-b06d-49c4-b9f2-b416775c0fcb	77e32b32-a816-4e29-afd2-9d9c2d6038d0
0ecf5460-9b18-4a30-a773-f7465abb3bf2	5698d4ba-91d4-435e-9a50-4341ca5b4716	f8139851-b190-4ea8-befd-5376f4a09541
58d00525-d3ca-4846-8527-2e03322a3c8c	fe565666-1e64-4c1c-96d9-3911e1afe624	2cb56674-ade9-4780-9930-d114129444a5
d756fb8c-7548-4092-bad6-320dc4b41338	6980658a-9176-4503-b983-792e29db3ab2	02210cbe-5173-48b2-a077-19e472cead35
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.modules (id, name, description, created_at, is_active, display_order) FROM stdin;
3739d0da-5229-4ed8-b022-ccf0aa3d08e3	Medical Records	\N	2025-06-02 10:37:48.867731	t	20
02206d4e-509d-4809-9705-cbd772b8da6d	Pharmacy	\N	2025-06-02 10:37:48.867731	t	40
b504b3fd-7646-44d1-8803-0ae3373a8204	Appointments	\N	2025-06-02 10:37:48.867731	t	30
a75a4c20-ef8a-4b2c-bd71-dcf4c61362ae	Laboratory	Laboratory Module	2025-06-02 10:37:48.867731	t	50
6980658a-9176-4503-b983-792e29db3ab2	Administration	\N	2025-06-02 10:37:48.867731	t	2
5698d4ba-91d4-435e-9a50-4341ca5b4716	Security	\N	2025-06-02 10:37:48.867731	t	3
926861c1-cf39-4783-82d0-9a4bad5c6f95	Patient Management	\N	2025-06-02 10:37:48.867731	t	10
fe565666-1e64-4c1c-96d9-3911e1afe624	Masters	Master Data Management	2025-06-17 10:22:23.565059	t	6
f74a9cc7-b06d-49c4-b9f2-b416775c0fcb	Dashboard	Main dashboard and overview screens	2025-06-02 12:34:54.442986	t	1
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.permissions (id, user_id, role_id, document_id, can_add, can_modify, can_delete, can_query) FROM stdin;
3e681e3d-5824-4c8e-a537-99438afee591	\N	bafef031-d469-4d17-8442-f55d4a78be2a	bc5b214d-5a18-42eb-83f2-dc3c9e3ca966	t	t	t	t
ccd57182-5ea6-44b8-ad0c-2b57e6397026	\N	bafef031-d469-4d17-8442-f55d4a78be2a	10e85778-764a-40df-97dd-f11f6b4b599c	t	t	t	t
b7535322-3688-4bdc-9cf0-5b82d89039bb	\N	bafef031-d469-4d17-8442-f55d4a78be2a	40f5d520-e19c-4adb-8036-994fa5fb2f99	t	t	t	t
b01931a6-3321-4e7f-abd9-e1eca88c1e41	\N	bafef031-d469-4d17-8442-f55d4a78be2a	6d7c5ea3-eaf7-45da-a5fd-9e49be9c45cb	t	t	t	t
82a71334-093b-4784-bb66-916727cc495e	\N	bafef031-d469-4d17-8442-f55d4a78be2a	400a1692-70af-4b39-831f-cec95975eac7	t	t	t	t
3ea4e251-1c99-4646-b5c9-6277a4cc0fa5	\N	bafef031-d469-4d17-8442-f55d4a78be2a	adcd507d-b8f4-4abb-874a-54f952e4d5c4	t	t	t	t
8c813686-9ac3-4bf2-8907-8c42c55bf829	\N	bafef031-d469-4d17-8442-f55d4a78be2a	d2ca1a22-27c2-43ff-a14d-3e5f56239ed4	t	t	t	t
fa6502ab-7364-4cd2-bcba-aefa2d621b52	\N	bafef031-d469-4d17-8442-f55d4a78be2a	06c5cfe1-00fc-44eb-835e-7af849c5760e	t	t	t	t
24f40c62-d47a-4244-8c87-3b690a686e42	\N	11a6bac6-f248-49fb-abab-34511c7b294a	2bc7e162-a381-406b-a118-47e83259bb35	t	t	t	t
e99d5811-42bf-4736-af79-fbd66b8680f2	\N	bafef031-d469-4d17-8442-f55d4a78be2a	c43ee18d-c8c6-475a-9aa4-33daf82f41e6	t	t	t	t
6ea0c822-0400-415c-8f5e-da6d36c68a76	\N	11a6bac6-f248-49fb-abab-34511c7b294a	f3c5cdf8-98af-48b5-9527-506303961230	t	f	f	t
78633c82-5557-45ef-a358-c66ad6a56a7c	\N	11a6bac6-f248-49fb-abab-34511c7b294a	6d7c5ea3-eaf7-45da-a5fd-9e49be9c45cb	f	f	f	t
7972d24a-59e4-4eb9-9c2f-be2e751fe5c8	\N	46540dad-37a4-4a13-a7d8-a9a2d2239385	782f5ba9-88a0-4e38-85bd-b2097aff25d9	f	f	f	t
45f1f535-f2e8-4920-a3fe-e493e9198445	\N	11a6bac6-f248-49fb-abab-34511c7b294a	bc5b214d-5a18-42eb-83f2-dc3c9e3ca966	f	f	f	t
c2e7bb3e-8211-483c-b0fa-51c6514a641b	\N	11a6bac6-f248-49fb-abab-34511c7b294a	adcd507d-b8f4-4abb-874a-54f952e4d5c4	t	t	f	t
0e321ea9-d723-433f-a499-cabfda087128	\N	11a6bac6-f248-49fb-abab-34511c7b294a	782f5ba9-88a0-4e38-85bd-b2097aff25d9	f	t	f	t
ca238dbc-a3a3-472c-9d2a-30dfb406930b	\N	47ece5f3-92ee-408e-9b55-3a2aa2ad0624	0c81f971-4a34-4fb6-9a14-f32ff8cc1f29	t	t	f	t
6065235f-3941-4d30-ba98-7507c12a51a7	\N	46540dad-37a4-4a13-a7d8-a9a2d2239385	85ec13e5-1119-4ea8-81c6-f20b4b2c2917	f	f	f	t
9aba1cb9-9f8c-4f0a-b17c-9f589942456a	\N	bafef031-d469-4d17-8442-f55d4a78be2a	fc671b54-e586-4ec8-9342-d4ba259c2ce8	t	t	t	t
e81855b4-4fc9-4bb0-9630-74aad5a2ce5d	\N	46540dad-37a4-4a13-a7d8-a9a2d2239385	bc5b214d-5a18-42eb-83f2-dc3c9e3ca966	f	f	f	t
53bfd457-e07b-4ba9-9a26-7b7d2eb8d5aa	\N	47ece5f3-92ee-408e-9b55-3a2aa2ad0624	bc5b214d-5a18-42eb-83f2-dc3c9e3ca966	f	f	f	t
4dbac023-55ef-4ded-bcfb-bb1c4c9fc88b	\N	47ece5f3-92ee-408e-9b55-3a2aa2ad0624	f3c5cdf8-98af-48b5-9527-506303961230	t	f	f	t
a6a42a8e-8e61-40ee-a335-119353b4ef62	\N	47ece5f3-92ee-408e-9b55-3a2aa2ad0624	85ec13e5-1119-4ea8-81c6-f20b4b2c2917	t	f	f	t
fad436c1-f0e5-4805-8de9-1d87dc2f5e88	\N	bafef031-d469-4d17-8442-f55d4a78be2a	0c81f971-4a34-4fb6-9a14-f32ff8cc1f29	t	t	t	t
d1e2cc47-95ec-41b0-ad18-0b7a094bc030	\N	11a6bac6-f248-49fb-abab-34511c7b294a	c43ee18d-c8c6-475a-9aa4-33daf82f41e6	f	t	f	t
5e494877-c0d8-4a87-8362-ccee959f6c8b	\N	bafef031-d469-4d17-8442-f55d4a78be2a	2bc7e162-a381-406b-a118-47e83259bb35	t	t	t	t
6845fde9-7e29-4a97-9ec2-eda5827e5137	\N	46540dad-37a4-4a13-a7d8-a9a2d2239385	c43ee18d-c8c6-475a-9aa4-33daf82f41e6	f	t	f	t
64165d82-bf83-4aed-b2ad-76edf2e359d0	\N	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	adcd507d-b8f4-4abb-874a-54f952e4d5c4	t	t	f	t
50fdd35a-6a04-4835-88df-7f6b25b07b78	\N	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	bc5b214d-5a18-42eb-83f2-dc3c9e3ca966	f	f	f	t
ae93737f-7a27-4e4d-8db9-f00d3b6978e5	\N	47ece5f3-92ee-408e-9b55-3a2aa2ad0624	6d7c5ea3-eaf7-45da-a5fd-9e49be9c45cb	t	f	f	t
7d0f5ba4-7bf5-4cf4-bcde-412a30ffba0e	\N	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	2bc7e162-a381-406b-a118-47e83259bb35	t	t	t	t
78f0fb9d-5d68-4f5d-ad62-4b9166b6e788	\N	11a6bac6-f248-49fb-abab-34511c7b294a	a06431a2-293e-416a-bbbc-1b87ad413e57	t	t	f	t
c22d3365-ef1a-41e3-a396-a4ac3a6512d4	\N	bafef031-d469-4d17-8442-f55d4a78be2a	782f5ba9-88a0-4e38-85bd-b2097aff25d9	t	t	t	t
ba0f64e6-b993-4daf-9c9e-1a8c14dd18bf	\N	46540dad-37a4-4a13-a7d8-a9a2d2239385	a06431a2-293e-416a-bbbc-1b87ad413e57	t	f	f	t
95ad1989-455f-4473-8f6e-91a2fe2cff75	\N	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	400a1692-70af-4b39-831f-cec95975eac7	f	f	f	t
192e4c98-30f4-4b20-9805-654b66443556	\N	11a6bac6-f248-49fb-abab-34511c7b294a	d2ca1a22-27c2-43ff-a14d-3e5f56239ed4	t	t	f	t
78e9fff5-0e6c-4ceb-b727-ca19c85fbaaf	\N	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	782f5ba9-88a0-4e38-85bd-b2097aff25d9	f	t	f	t
5d75a2cc-bb68-40e2-931d-014c2f3aa53e	\N	bafef031-d469-4d17-8442-f55d4a78be2a	f3c5cdf8-98af-48b5-9527-506303961230	t	t	t	t
478bdb74-904e-4e7d-b2b4-f76088389e0a	\N	11a6bac6-f248-49fb-abab-34511c7b294a	fc671b54-e586-4ec8-9342-d4ba259c2ce8	f	f	f	t
793d0064-07ac-4a20-9b19-0bd9e98941c8	\N	bafef031-d469-4d17-8442-f55d4a78be2a	85ec13e5-1119-4ea8-81c6-f20b4b2c2917	t	t	t	t
1897badb-6db1-4922-b6a0-77341008d230	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	400a1692-70af-4b39-831f-cec95975eac7	t	t	t	t
5217164e-b542-4d91-95a7-1dbc470f031a	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	85ec13e5-1119-4ea8-81c6-f20b4b2c2917	t	t	t	t
406a7e6f-c50a-4795-88ab-b28595f843bd	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	6d7c5ea3-eaf7-45da-a5fd-9e49be9c45cb	t	t	t	t
1009d558-d5aa-4cb5-bafd-5cd295b72ce9	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	f3c5cdf8-98af-48b5-9527-506303961230	t	t	t	t
646e80df-0960-4bda-97e4-92fd33f6f431	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	a06431a2-293e-416a-bbbc-1b87ad413e57	t	t	t	t
66e9a05a-a260-403f-810c-5f2c54337ea5	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	0c81f971-4a34-4fb6-9a14-f32ff8cc1f29	t	t	t	t
e3a3b7bd-3087-4bcd-884c-e1234ecfbb96	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	c43ee18d-c8c6-475a-9aa4-33daf82f41e6	t	t	t	t
af37eb70-8b63-4711-9926-54f30af0acc6	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	bc5b214d-5a18-42eb-83f2-dc3c9e3ca966	t	t	t	t
c28e38e1-6a73-4157-96cc-3da068a3d84c	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	adcd507d-b8f4-4abb-874a-54f952e4d5c4	t	t	t	t
975179ef-1d6e-42c3-bcec-704d0e03cf25	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	d2ca1a22-27c2-43ff-a14d-3e5f56239ed4	t	t	t	t
cfa20693-2261-4447-95e8-e549cc33bcb2	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	40f5d520-e19c-4adb-8036-994fa5fb2f99	t	t	t	t
5ddbb843-b6f7-4474-934e-dadcc69166bc	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	2bc7e162-a381-406b-a118-47e83259bb35	t	t	t	t
405cb6d2-0b03-435e-8a54-c1757ff977f0	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	06c5cfe1-00fc-44eb-835e-7af849c5760e	t	t	t	t
52907816-4f93-4a95-9adf-05e9276ddcc0	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	fc671b54-e586-4ec8-9342-d4ba259c2ce8	t	t	t	t
21aaf77b-1ffa-4807-acb4-ac9a73e309b1	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	10e85778-764a-40df-97dd-f11f6b4b599c	t	t	t	t
7eda1ab4-9a76-4a83-8b3f-5098355e2f85	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	782f5ba9-88a0-4e38-85bd-b2097aff25d9	t	t	t	t
e2ee868c-2623-4057-b0ca-5f87c1bd3d89	7c463141-7c6e-4feb-9391-77f46f799bcc	\N	628425e6-3e89-4615-8670-d1ade686a0a7	t	t	t	t
b3b35f38-2b06-4a02-b8d6-a26ac5a928f3	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	77e32b32-a816-4e29-afd2-9d9c2d6038d0	t	t	t	t
962fbe01-ab39-4c6d-aa4a-478ba493f5cf	\N	bafef031-d469-4d17-8442-f55d4a78be2a	77e32b32-a816-4e29-afd2-9d9c2d6038d0	t	t	t	t
f9f4b1f0-68d9-4f7c-a540-cd8062e7f59a	\N	11a6bac6-f248-49fb-abab-34511c7b294a	77e32b32-a816-4e29-afd2-9d9c2d6038d0	f	f	f	t
af7295e0-4ff3-4779-bb80-c1f6205846ea	\N	46540dad-37a4-4a13-a7d8-a9a2d2239385	77e32b32-a816-4e29-afd2-9d9c2d6038d0	f	f	f	t
1af3acd8-a125-4b4b-ba1a-d31cd1e4152f	\N	47ece5f3-92ee-408e-9b55-3a2aa2ad0624	77e32b32-a816-4e29-afd2-9d9c2d6038d0	f	f	f	t
faed7a04-319a-4264-8b4c-a1b3bec5ad0f	\N	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	77e32b32-a816-4e29-afd2-9d9c2d6038d0	f	f	f	t
47663a74-f3e6-44ea-bcea-c9cf44aee714	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	f8139851-b190-4ea8-befd-5376f4a09541	t	t	t	t
ae67538a-0c6e-4289-aad9-54d76ca907b9	\N	bafef031-d469-4d17-8442-f55d4a78be2a	f8139851-b190-4ea8-befd-5376f4a09541	t	t	t	t
cf26d835-0c95-4231-8074-a7b59a4f3c20	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	2cb56674-ade9-4780-9930-d114129444a5	t	t	t	t
80309731-8649-4c2c-9313-28a6182ce87f	\N	bafef031-d469-4d17-8442-f55d4a78be2a	a06431a2-293e-416a-bbbc-1b87ad413e57	t	t	t	t
fa25587e-6ab7-4cf8-a885-f19ed7fcee2a	\N	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	bb6884d9-7f08-449e-ac6c-27ebdbd80291	f	t	f	f
cd240d4d-2a70-4b6b-a382-71d18bc795d3	\N	3de8a992-425d-4b72-9b5d-d60c46cb44a8	dd1d938f-8736-4349-9cb4-fa93fd197581	t	t	t	t
fd5910b6-efa4-4afa-9fc5-29128798c4cf	9e71a6db-4f2a-4ef7-a035-46ba386c8147	\N	dd1d938f-8736-4349-9cb4-fa93fd197581	t	t	t	t
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id, name, description, created_at, is_active) FROM stdin;
4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	Reception	\N	2025-06-02 10:15:13.125858	t
11a6bac6-f248-49fb-abab-34511c7b294a	Doctor	\N	2025-06-02 10:15:13.125858	t
bafef031-d469-4d17-8442-f55d4a78be2a	Admin	Admin Role	2025-06-02 10:15:13.125858	t
46041a30-4e90-417b-ab8b-0cce59f9e6a1	Administrator	\N	2025-06-17 10:22:05.939667	t
47ece5f3-92ee-408e-9b55-3a2aa2ad0624	Staff	Staff	2025-06-02 10:15:13.125858	t
46540dad-37a4-4a13-a7d8-a9a2d2239385	Nurse	Nurse ROle	2025-06-02 10:15:13.125858	t
a6532422-15ce-457d-89f0-a716bd9d1560	test role 344	test role	2025-06-18 12:19:19.154655	t
3de8a992-425d-4b72-9b5d-d60c46cb44a8	Super Admin		2025-06-02 10:15:13.125858	t
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (sid, sess, expire) FROM stdin;
_BVZdVJO_pqLc6kLhEeu7heb2PFfsPdH	{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":"7c463141-7c6e-4feb-9391-77f46f799bcc"}}	2025-06-22 08:20:19
YLPaUHidVuDApa20TuW1ikFDmAZX_Ukb	{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":"7c463141-7c6e-4feb-9391-77f46f799bcc"}}	2025-06-22 13:28:27
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.user_roles (user_id, role_id) FROM stdin;
90845683-5d68-4862-b783-7bf01d6c84b8	11a6bac6-f248-49fb-abab-34511c7b294a
2c98bc5e-f825-4214-a808-87e585e8acbb	46540dad-37a4-4a13-a7d8-a9a2d2239385
9e71a6db-4f2a-4ef7-a035-46ba386c8147	bafef031-d469-4d17-8442-f55d4a78be2a
9e9efd7c-8d62-431b-8024-9de37313ca4e	4eeb2c2b-b6c4-4118-a880-156c66d9a4a9
e0b44a6e-54cf-4e09-9eaf-cd7e4376c081	47ece5f3-92ee-408e-9b55-3a2aa2ad0624
7c463141-7c6e-4feb-9391-77f46f799bcc	3de8a992-425d-4b72-9b5d-d60c46cb44a8
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, email, password, is_active, created_at) FROM stdin;
9e71a6db-4f2a-4ef7-a035-46ba386c8147	admin	admin@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.761
e0b44a6e-54cf-4e09-9eaf-cd7e4376c081	staff.john	staff.john@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.762
9e9efd7c-8d62-431b-8024-9de37313ca4e	reception.mary	reception.mary@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.762
7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	superadmin@hospital.com	$2b$12$qFSKHJFQBIxv0Cl9nxZ0i.QhQbFWALOUGliAmr1T1pqzt37eO0rDe	t	2025-05-28 14:36:03.029
system	system	system@hospital.com	system	t	2025-06-17 12:42:51.977
316c438f-51a5-41eb-a4ba-6b41dbaef1f9	test_audit_user	test@audit.com	$2b$10$9mrYVp0TNAHaAYEbG21.G.tF/3cfQSf7C3eXj.vVBqx5Snb8fyXjm	t	2025-06-18 11:15:12.569
2c98bc5e-f825-4214-a808-87e585e8acbb	nurse.jane123	nurse.jane@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.762
90845683-5d68-4862-b783-7bf01d6c84b8	dr.smith123	dr.smith@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.761
\.


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: master_data_records master_data_records_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.master_data_records
    ADD CONSTRAINT master_data_records_pkey PRIMARY KEY (id);


--
-- Name: master_table_configs master_table_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.master_table_configs
    ADD CONSTRAINT master_table_configs_pkey PRIMARY KEY (id);


--
-- Name: master_table_configs master_table_configs_table_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.master_table_configs
    ADD CONSTRAINT master_table_configs_table_name_key UNIQUE (table_name);


--
-- Name: module_documents module_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_documents
    ADD CONSTRAINT module_documents_pkey PRIMARY KEY (id);


--
-- Name: modules modules_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_name_key UNIQUE (name);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (user_id, role_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: module_documents_module_id_document_id_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX module_documents_module_id_document_id_key ON public.module_documents USING btree (module_id, document_id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: master_data_records master_data_records_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.master_data_records
    ADD CONSTRAINT master_data_records_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.master_table_configs(id);


--
-- Name: module_documents module_documents_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_documents
    ADD CONSTRAINT module_documents_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: module_documents module_documents_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.module_documents
    ADD CONSTRAINT module_documents_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permissions permissions_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permissions permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: permissions permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

