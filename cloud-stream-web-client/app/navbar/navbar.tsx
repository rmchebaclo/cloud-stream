// need to make this a client side component for onClick interactivity
// all components are by default server side in Next.js 13
'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./navbar.module.css";
import SignIn from "./sign-in";

import {onAuthStateChangedHelper} from "../utilities/firebase/firebase"
import { useEffect, useState } from "react";
import { User } from 'firebase/auth';

export default function Navbar() {
    // init user state
    // first param maintains state, second param updates state

    const [user, setUser] = useState<User | null>(null)
    useEffect(() => {
        const unsubscribe = onAuthStateChangedHelper((user) => {
            setUser(user);
        })
        // cleanup subscription on unmount
        return unsubscribe();
    })

    return (
        <nav className= {styles.nav}>
            <Link href="/">
                <Image width={90} height={20}
                    src="/navbar-pic.svg" alt="CloudStream Logo"/>
            </Link>
            <SignIn user={user}/>
        </nav>
    );
  }