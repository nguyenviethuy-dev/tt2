import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "",
  authDomain: "fapp.firebaseapp.com",
  projectId: "faapp",
  storageBucket: "famvibbe.at.com", // Sửa lỗi storageBucket
  messagingSenderId: "82238105",
  appId: "1:82069829e3c08",
  measurementId: "G9GV8PJ",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các module cần dùng
const auth = getAuth(app); // Authentication
const db = getFirestore(app); // Firestore (Database)
const storage = getStorage(app); // Storage (Lưu file)

export { app, auth, db, storage };
