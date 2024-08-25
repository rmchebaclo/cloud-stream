import { Fragment } from "react";
import {onAuthStateChangedHelper, signInWithGoogle, signOutWithGoogle} from "../utilities/firebase/firebase"
import { User } from 'firebase/auth';
import styles from './sign-in.module.css'

interface SignInProps {
    user: User | null;
}

export default function SignIn({user}: SignInProps) {
    return (
        // using a fragment because we don't need to render an element (div)
        // ternary operator choosing which button to render based on sign-in status
        <Fragment>
            {user ? (
                <button className={styles.origin} onClick={signOutWithGoogle}>
                Sign hello
            </button>
            ): (
                <button className={styles.origin} onClick={signInWithGoogle}>
                Sign In
            </button>
            )}

        </Fragment>

    );
}
