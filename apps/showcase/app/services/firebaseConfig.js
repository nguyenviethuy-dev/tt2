import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDD6L0l5geonZMu29G7JZ4tP1I6PxH9ABw",
  authDomain: "famvibbe-app.firebaseapp.com",
  projectId: "famvibbe-app",
  storageBucket: "famvibbe-app.appspot.com", // Sửa lỗi storageBucket
  messagingSenderId: "820698238105",
  appId: "1:820698238105:web:df1ea9706df9e3e81e3c08",
  measurementId: "G-TW079GV8PJ",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các module cần dùng
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore (Database)
const storage = getStorage(app); // Storage (Lưu file)

export { app, auth, db, storage };
