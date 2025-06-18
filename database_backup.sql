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
400a1692-70af-4b39-831f-cec95975eac7	Appointment History	/appointments/history	2025-06-02 10:38:14.491621	t	0
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
a89fd2c1-38fb-44d4-9da9-bd2c751b315b	a0bef193-150c-49a7-b8e4-b6dcac6237ba	{"Gender Name":"F","Gender Description":"Female"}	t	2025-06-17 13:03:28.735616	2025-06-17 13:03:28.735616
85a1ff40-ec92-4a5b-a2fa-2e2760938773	a0bef193-150c-49a7-b8e4-b6dcac6237ba	{"Gender Name":"U","Gender Description":"Unspecified"}	t	2025-06-17 13:03:39.281013	2025-06-17 13:03:39.281013
2ccb16f9-a3d4-44cc-925d-1f91c8a49acd	a0bef193-150c-49a7-b8e4-b6dcac6237ba	{"Gender Name":"M","Gender Description":"Male"}	t	2025-06-17 13:03:17.480448	2025-06-17 13:03:59.966
\.


--
-- Data for Name: master_table_configs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.master_table_configs (id, table_name, display_name, description, columns, is_active, created_at, updated_at) FROM stdin;
e4f51699-0c06-4bc3-845a-f851b09dd239	service_group_master	Service Group1	Service Group	[{"name":"Service Group Name","type":"text","required":true,"maxLength":100},{"name":"Service Group Description","type":"text","required":true},{"name":"test","type":"text","required":false}]	t	2025-06-17 10:31:00.487537	2025-06-17 12:30:59.104
f58ce541-b765-4cff-9ed2-93446f32d27e	department	Department Master - Test Audit	Testing comprehensive audit logging with user tracking and IP addresses	[{"name":"name","type":"text","required":true,"maxLength":100},{"name":"code","type":"text","required":true,"maxLength":10},{"name":"description","type":"text","required":false,"maxLength":500},{"name":"head_of_department","type":"text","required":false,"maxLength":100},{"name":"phone","type":"text","required":false,"maxLength":20},{"name":"email","type":"email","required":false},{"name":"is_active","type":"boolean","required":true}]	t	2025-06-17 10:24:00.020469	2025-06-17 12:43:03.915
a0bef193-150c-49a7-b8e4-b6dcac6237ba	gender_master	Gender Master	Gender Master	[{"name":"Gender Name","type":"text","required":true,"maxLength":100},{"name":"Gender Description","type":"text","required":true}]	t	2025-06-17 13:02:45.760391	2025-06-17 13:02:45.760391
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
\.


--
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.modules (id, name, description, created_at, is_active, display_order) FROM stdin;
3739d0da-5229-4ed8-b022-ccf0aa3d08e3	Medical Records	\N	2025-06-02 10:37:48.867731	t	20
02206d4e-509d-4809-9705-cbd772b8da6d	Pharmacy	\N	2025-06-02 10:37:48.867731	t	40
b504b3fd-7646-44d1-8803-0ae3373a8204	Appointments	\N	2025-06-02 10:37:48.867731	t	30
a75a4c20-ef8a-4b2c-bd71-dcf4c61362ae	Laboratory	Laboratory Module	2025-06-02 10:37:48.867731	t	50
f74a9cc7-b06d-49c4-b9f2-b416775c0fcb	Dashboard	Main dashboard and overview screens	2025-06-02 12:34:54.442986	t	1
6980658a-9176-4503-b983-792e29db3ab2	Administration	\N	2025-06-02 10:37:48.867731	t	2
5698d4ba-91d4-435e-9a50-4341ca5b4716	Security	\N	2025-06-02 10:37:48.867731	t	3
926861c1-cf39-4783-82d0-9a4bad5c6f95	Patient Management	\N	2025-06-02 10:37:48.867731	t	10
fe565666-1e64-4c1c-96d9-3911e1afe624	Masters	Master Data Management	2025-06-17 10:22:23.565059	t	6
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.permissions (id, user_id, role_id, document_id, can_add, can_modify, can_delete, can_query) FROM stdin;
80309731-8649-4c2c-9313-28a6182ce87f	\N	bafef031-d469-4d17-8442-f55d4a78be2a	a06431a2-293e-416a-bbbc-1b87ad413e57	t	t	t	t
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
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.roles (id, name, description, created_at, is_active) FROM stdin;
46540dad-37a4-4a13-a7d8-a9a2d2239385	Nurse	\N	2025-06-02 10:15:13.125858	t
3de8a992-425d-4b72-9b5d-d60c46cb44a8	Super Admin	\N	2025-06-02 10:15:13.125858	t
4eeb2c2b-b6c4-4118-a880-156c66d9a4a9	Reception	\N	2025-06-02 10:15:13.125858	t
11a6bac6-f248-49fb-abab-34511c7b294a	Doctor	\N	2025-06-02 10:15:13.125858	t
bafef031-d469-4d17-8442-f55d4a78be2a	Admin	Admin Role	2025-06-02 10:15:13.125858	t
46041a30-4e90-417b-ab8b-0cce59f9e6a1	Administrator	\N	2025-06-17 10:22:05.939667	t
47ece5f3-92ee-408e-9b55-3a2aa2ad0624	Staff	Staff	2025-06-02 10:15:13.125858	t
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (sid, sess, expire) FROM stdin;
pHP-fbz8xKc7JLiRTIXg0y3qkn7Dx2CR	{"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":"7c463141-7c6e-4feb-9391-77f46f799bcc"}}	2025-06-19 10:07:19
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
2c98bc5e-f825-4214-a808-87e585e8acbb	nurse.jane	nurse.jane@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.762
90845683-5d68-4862-b783-7bf01d6c84b8	dr.smith	dr.smith@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.761
9e71a6db-4f2a-4ef7-a035-46ba386c8147	admin	admin@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.761
e0b44a6e-54cf-4e09-9eaf-cd7e4376c081	staff.john	staff.john@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.762
9e9efd7c-8d62-431b-8024-9de37313ca4e	reception.mary	reception.mary@hospital.com	$2b$10$Ol/sfjGg7a7SR0cKtekWAuZTGb.BW/5dxGC0QskPXyFEHkRDlizQ2	t	2025-05-28 14:28:57.762
7c463141-7c6e-4feb-9391-77f46f799bcc	superadmin	superadmin@hospital.com	$2b$12$qFSKHJFQBIxv0Cl9nxZ0i.QhQbFWALOUGliAmr1T1pqzt37eO0rDe	t	2025-05-28 14:36:03.029
system	system	system@hospital.com	system	t	2025-06-17 12:42:51.977
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

