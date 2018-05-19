--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: FourDTable; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FourDTable" (
    id integer NOT NULL,
    date timestamp without time zone,
    draw_number integer,
    top_three integer[],
    starter_number integer[],
    consolation_number integer[],
    region text,
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
    date timestamp without time zone,
    draw_number integer,
    winning_number integer[],
    additional_number integer,
    region text,
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

SELECT pg_catalog.setval('public."FourDTable_id_seq"', 17, true);


--
-- Name: TotoTable_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."TotoTable_id_seq"', 6, true);


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

