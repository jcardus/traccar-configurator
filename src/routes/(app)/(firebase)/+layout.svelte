<script lang="ts">
    import { FirebaseApp } from 'sveltefire';
    import { initializeApp } from 'firebase/app';
    import { getFirestore } from 'firebase/firestore';
    import { getAuth } from 'firebase/auth';

    // Initialize Firebase
    const app = initializeApp({
        apiKey: "AIzaSyDa1YBWhyPflUUulwYto4JHjl8wet7Wh_4",
        authDomain: "rastreosat-sms-gateway.firebaseapp.com",
        projectId: "rastreosat-sms-gateway",
        storageBucket: "rastreosat-sms-gateway.appspot.com",
        messagingSenderId: "703486080194",
        appId: "1:703486080194:web:e01859ef4443fe5f4bf75b",
        measurementId: "G-Y5RHHJJLGM"
    });
    const firestore = getFirestore(app);
    const auth = getAuth(app);
</script>

<FirebaseApp {auth} {firestore}>
    <slot />
</FirebaseApp>