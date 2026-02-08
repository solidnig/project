// scripts.js
import { auth, db, googleProvider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Đăng nhập Google
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Logged in:", result.user);
    updateUIAfterLogin();
  } catch (error) {
    console.error("Login error:", error);
  }
}

// Đăng xuất
export async function logout() {
  await signOut(auth);
  updateUIAfterLogin();
}

// Cập nhật UI sau đăng nhập/đăng xuất
function updateUIAfterLogin() {
  const user = auth.currentUser;
  const loginBtn = document.getElementById("login-btn");
  if (user) {
    loginBtn.textContent = "Đăng xuất";
    loginBtn.onclick = logout;
    if (window.location.pathname.includes("admin.html")) loadProductsForAdmin();
  } else {
    loginBtn.textContent = "Đăng nhập Google";
    loginBtn.onclick = loginWithGoogle;
  }
}

// Render sản phẩm (cho home và admin)
export async function renderProducts(containerId, isAdmin = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  querySnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    const discountedPrice = data.price * (1 - data.discount / 100);
    const card = `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${data.image}" class="card-img-top" alt="${data.name}">
          <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <p class="card-text">Giá: ${data.price} VND (Giảm ${data.discount}%: ${discountedPrice} VND)</p>
            <p class="card-text">${data.description.substring(0, 100)}...</p>
            <p class="card-text"><small>Ghi chú: ${data.note}</small></p>
            ${
              isAdmin
                ? `
              <button class="btn btn-warning" onclick="editProduct('${docSnapshot.id}')">Sửa</button>
              <button class="btn btn-danger" onclick="deleteProduct('${docSnapshot.id}')">Xóa</button>
            `
                : `
              <a href="detail.html?id=${docSnapshot.id}" class="btn btn-primary">Chi tiết</a>
            `
            }
          </div>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

// Thêm sản phẩm (admin)
export async function addProduct(form) {
  const data = {
    name: form.name.value,
    price: parseFloat(form.price.value),
    description: form.description.value,
    image: form.image.value,
    discount: parseFloat(form.discount.value),
    note: form.note.value,
  };
  await addDoc(collection(db, "products"), data);
  renderProducts("product-list", true); // Reload admin
}

// Sửa sản phẩm (admin)
export async function editProduct(id) {
  const newName = prompt("Tên mới:");
  // Tương tự cho các field khác...
  await updateDoc(doc(db, "products", id), { name: newName });
  renderProducts("product-list", true);
}

// Xóa sản phẩm (admin)
export async function deleteProduct(id) {
  if (confirm("Xóa?")) {
    await deleteDoc(doc(db, "products", id));
    renderProducts("product-list", true);
  }
}

// Load chi tiết sản phẩm (detail.html)
export async function loadProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (id) {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const discountedPrice = data.price * (1 - data.discount / 100);
      document.getElementById("product-detail").innerHTML = `
        <img src="${data.image}" class="img-fluid" alt="${data.name}">
        <h2>${data.name}</h2>
        <p>Giá: ${data.price} VND (Giảm ${data.discount}%: ${discountedPrice} VND)</p>
        <p>Mô tả: ${data.description}</p>
        <p>Ghi chú: ${data.note}</p>
      `;
    }
  }
}

// Kiểm tra quyền admin (ví dụ: chỉ email cụ thể)
auth.onAuthStateChanged((user) => {
  if (window.location.pathname.includes("admin.html")) {
    if (!user || user.email !== "your-admin-email@example.com") {
      // Thay bằng email admin thật
      window.location.href = "index.html";
    } else {
      loadProductsForAdmin();
    }
  }
  updateUIAfterLogin();
});

function loadProductsForAdmin() {
  renderProducts("product-list", true);
}
