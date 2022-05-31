import { ref, onUnmounted, computed } from 'vue';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6psz5KVNIbRBcYAab5GgQrI40CRYwiLE",
  authDomain: "chat-app-4f24e.firebaseapp.com",
  projectId: "chat-app-4f24e",
  storageBucket: "chat-app-4f24e.appspot.com",
  messagingSenderId: "994436761260",
  appId: "1:994436761260:web:4240955017f1f8e8668109"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export function useAuth() {
    const user = ref(null);
    const unsubscribe = auth.onAuthStateChanged(_user => (user.value =  _user));
    onUnmounted(unsubscribe);
    const isLogin = computed(() => user.value !== null);

    const sign_in = async () => {
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(auth, googleProvider);
    }
    const sign_out = () => signOut(auth);

    return { user, isLogin, sign_in, sign_out };
}

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const messagesCollection = collection(db, 'messages');
const messagesQuery = query(messagesCollection, orderBy('createdAt', 'desc'), limit(100));

export function useChat() {
    const messages = ref(null);
    const querySnapshot = await getDocs(messagesQuery);
    
    const unsubscribe = () => {
        messages.value = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .reverse();
    };
    onUnmounted(unsubscribe);

    const { user, isLogin } = useAuth();
    const sendMessage = text => {
        if (!isLogin.value) return ;
        const { photoURL, uid, displayName } = user.value;
        await setDoc(doc(db, 'messages'), {
            userName: displayName,
            userId: uid,
            userPhotoURL: photoURL,
            text: text,
            createdAt: serverTimestamp()
        })
    }

    return { messages, sendMessage };
}