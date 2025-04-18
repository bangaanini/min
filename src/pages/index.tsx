import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Hero from './HeroSection';
import Header from './Header';
import Wallet from './Wallet';
import Slider from './Slider';
import FAQ from './FAQ'
import Footer from './Footer'
import Link from 'next/link';
import EVN from './EVN';
import { useState, useEffect } from 'react';




const Home: NextPage = () => {
  return (
    <div className={styles.container} bg-gray-900>
      <Head>
        <title>Chisachon Cloud Mining</title>
        <meta
          content="Chisachon Cloud Mining"
          name="Join Cloud Mining Now and Earn Big"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
      <Header />  
      <Hero />
      <EVN />
      <Wallet /> 
      <Slider />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;
