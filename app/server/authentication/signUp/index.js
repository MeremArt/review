import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
const jsonwebtoken = require('jsonwebtoken');


export async function signUp(email, password) {
    
const auth = getAuth();
const db = getFirestore();

  // Validate the email and password fields.
  if (!email || !email.includes('@') || !email.includes('.')) {
    throw new Error('Invalid email address.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  const userSnapshot = await auth.fetchSignInMethodsForEmail(email);
  if (userSnapshot.length > 0) {
    throw new Error('User already exists.');
  }

  var jwt = generate_jwt_token({email,password});

  localStorage.setItem("jwt", jwt);
  localStorage.setItem("email", email)

  // Create a new user account.
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  let uid = userCredential.user.uid;
  // Store the user's data in Firestore.
  const userDocRef = doc(db, 'users', email);
  await setDoc(userDocRef, {
    uid,
    email,
    password,
    jwt
  });

  window.location.replace('/');
    
}

function generate_jwt_token(user){
    const secretKey = 'jkdfoi349hf398bf34c843o2bsfuyof7dhr7o2384gf3ubf34hrb4f34of34jq93eb3ubr43ufrxjvf';

    const token = jsonwebtoken.sign(user, secretKey);
    return token;
}