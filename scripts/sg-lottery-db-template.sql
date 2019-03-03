--
-- PostgreSQL database dump
--

-- Dumped from database version 10.7
-- Dumped by pg_dump version 10.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;
SET default_tablespace = '';
SET default_with_oids = false;

--
-- Name: FourDTable; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FourDTable" (
    id integer NOT NULL,
    date_drawn timestamp without time zone,
    draw_number integer,
    top_three integer[],
    starter_number integer[],
    consolation_number integer[],
    operator text,
    date_modified timestamp without time zone
);


--
-- Name: FourDTable_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."FourDTable_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: FourDTable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."FourDTable_id_seq" OWNED BY public."FourDTable".id;


--
-- Name: TotoTable; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TotoTable" (
    id integer NOT NULL,
    date_drawn timestamp without time zone,
    draw_number integer,
    winning_number integer[],
    additional_number integer[],
    operator text,
    date_modified timestamp without time zone
);


--
-- Name: TotoTable_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."TotoTable_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: TotoTable_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."TotoTable_id_seq" OWNED BY public."TotoTable".id;


--
-- Name: SweepTable; Type: TABLE; Schema: public; Owner: -
--

CREATE SEQUENCE public."SweepTable_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE public."SweepTable" (
    id integer DEFAULT nextval('public."SweepTable_id_seq"'::regclass) NOT NULL,
    date_drawn timestamp without time zone,
    draw_number integer,
    top_three integer[],
    jackpot_prize integer[],
    lucky_prize integer[],
    gift_prize integer[],
    consolation_prize integer[],
    part_prize integer[],
    twod_prize integer[],
    operator text,
    date_modified timestamp without time zone
);


--
-- Name: FourDTable id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FourDTable" ALTER COLUMN id SET DEFAULT nextval('public."FourDTable_id_seq"'::regclass);


--
-- Name: TotoTable id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TotoTable" ALTER COLUMN id SET DEFAULT nextval('public."TotoTable_id_seq"'::regclass);


--
-- Name: FourDTable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."FourDTable_id_seq"', 1, true);


--
-- Name: SweepTable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."SweepTable_id_seq"', 1, false);


--
-- Name: TotoTable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."TotoTable_id_seq"', 1, true);


--
-- Name: FourDTable FourDTable_drawNumber_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FourDTable"
    ADD CONSTRAINT "FourDTable_drawNumber_key" UNIQUE (draw_number);


--
-- Name: FourDTable FourDTable_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FourDTable"
    ADD CONSTRAINT "FourDTable_pkey" PRIMARY KEY (id);


--
-- Name: SweepTable SweepTable_draw_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SweepTable"
    ADD CONSTRAINT "SweepTable_draw_number_key" UNIQUE (draw_number);


--
-- Name: SweepTable SweepTable_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SweepTable"
    ADD CONSTRAINT "SweepTable_pkey" PRIMARY KEY (id);


--
-- Name: TotoTable TotoTable_draw_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TotoTable"
    ADD CONSTRAINT "TotoTable_draw_number_key" UNIQUE (draw_number);


--
-- Name: TotoTable TotoTable_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TotoTable"
    ADD CONSTRAINT "TotoTable_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

