import {
  getListAPI,
  getProductAPI,
  postAPI,
  putAPI,
  deleteAPI,
} from "../../../api.js";
import Product from "../modal/products.js";

renderListProduct();

function getID(id) {
  return document.getElementById(id);
}

function getInfoProduct() {
  let name = getID("name").value;
  let price = getID("price").value;
  let screen = getID("screen").value;
  let backCamera = getID("backCamera").value;
  let frontCamera = getID("frontCamera").value;
  let img = getID("image").value;
  let desc = getID("description").value;
  let type = getID("category").value;
  let product = new Product(
    name,
    price,
    screen,
    backCamera,
    frontCamera,
    img,
    desc,
    type,
  );
  return product;
}
window.getInfoProduct = getInfoProduct;

let allProducts = [];

function renderListProduct() {
  getListAPI()
    .then((res) => {
      allProducts = res.data;
      applyFiltersAndRender();
    })
    .catch((error) => console.log(error));
}

function applyFiltersAndRender() {
  let sortedAndFiltered = [...allProducts];

  // Search
  const searchInput = getID("searchInput");
  if (searchInput && searchInput.value) {
    const keyword = searchInput.value.toLowerCase().trim();
    sortedAndFiltered = sortedAndFiltered.filter((p) =>
      p.name.toLowerCase().includes(keyword),
    );
  }

  // Sort
  const sortSelect = getID("sortSelect");
  if (sortSelect && sortSelect.value) {
    if (sortSelect.value === "asc") {
      sortedAndFiltered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortSelect.value === "desc") {
      sortedAndFiltered.sort((a, b) => Number(b.price) - Number(a.price));
    }
  }

  renderData(sortedAndFiltered);
}

function renderData(data) {
  let content = "";
  data.forEach((product) => {
    const isSamsung = product.type.toLowerCase().includes("samsung");
    const fallbackImage = isSamsung
      ? "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop";

    content += `<tr  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="px-4 py-3">${product.id}</td>
            <td class="px-4 py-3">
              <img
                src="${product.img}"
                onerror="this.onerror=null;this.src='${fallbackImage}';"
                class="w-10 h-10 object-cover rounded"
                alt="product"
              />
            </td>
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[160px] truncate" title="${product.name}">
              ${product.name}
            </td>
            <td class="px-4 py-3 whitespace-nowrap">${product.price}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
                >${product.type}</span
              >
            </td>
            <td class="px-4 py-3 font-medium text-gray-900 dark:text-white max-w-[240px] truncate" title="${product.desc}">
              ${product.desc}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-2">
                <button
                id="edit${product.id}"
                  type="button"
                  title="Sửa"
                  onclick="editProduct('${product.id}')"
                  class="inline-flex items-center justify-center w-8 h-8 text-yellow-600 bg-yellow-100 rounded-lg hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button
                id="delete${product.id}"
                  type="button"
                  title="Xoá"
                  onclick="deleteProduct('${product.id}')"
                  class="inline-flex items-center justify-center w-8 h-8 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
  });
  document.getElementById("tbodyProduct").innerHTML = content;
}

// Add event listeners for Search and Sort
const searchInput = getID("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", applyFiltersAndRender);
}
const sortSelect = getID("sortSelect");
if (sortSelect) {
  sortSelect.addEventListener("change", applyFiltersAndRender);
}

function validateForm(product) {
  let missingFields = Object.entries(product).filter(
    ([key, value]) => !value || value === "Select category",
  );
  if (missingFields.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Lỗi Validation",
      text: "Vui lòng nhập đầy đủ thông tin sản phẩm!",
    });
    return false;
  }

  if (Number(product.price) <= 0) {
    Swal.fire({
      icon: "error",
      title: "Lỗi Validation",
      text: "Giá tiền phải lớn hơn 0!",
    });
    return false;
  }

  return true;
}

function closeModal() {
  const btnClose = document.querySelector(
    '#crud-modal button[data-modal-toggle="crud-modal"]',
  );
  if (btnClose) btnClose.click();
}

function addProduct() {
  let product = getInfoProduct();

  if (!validateForm(product)) return;

  postAPI(product)
    .then((res) => {
      renderListProduct();
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã thêm sản phẩm mới!",
        timer: 1500,
        showConfirmButton: false,
      });
    })
    .catch((error) => console.log(error));
}

const addProductBtn = getID("addProduct");
if (addProductBtn) {
  addProductBtn.onclick = addProduct;
}

window.addProduct = addProduct;

function deleteProduct(id) {
  deleteAPI(id)
    .then((res) => {
      renderListProduct();
    })
    .catch((error) => console.log(error));
}
window.deleteProduct = deleteProduct;

let editId = null;

window.editProduct = (id) => {
  editId = id;
  getProductAPI(id)
    .then((res) => {
      let product = res.data;

      // Mở modal
      const btnOpen = document.querySelector(
        '[data-modal-target="crud-modal"]',
      );
      if (btnOpen) btnOpen.click();

      setTimeout(() => {
        getID("name").value = product.name;
        getID("price").value = product.price;
        getID("screen").value = product.screen;
        getID("backCamera").value = product.backCamera;
        getID("frontCamera").value = product.frontCamera;
        getID("image").value = product.img;
        getID("description").value = product.desc;
        getID("category").value = product.type;

        getID("addProduct").style.display = "none";
        getID("updateProduct").style.display = "inline-flex";
      }, 100);
    })
    .catch((err) => console.log(err));
};

function updateProduct() {
  let product = getInfoProduct();
  if (!validateForm(product)) return;

  putAPI(editId, product)
    .then((res) => {
      renderListProduct();
      closeModal();

      getID("addProduct").style.display = "inline-flex";
      getID("updateProduct").style.display = "none";
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Đã cập nhật sản phẩm!",
        timer: 1500,
        showConfirmButton: false,
      });
    })
    .catch((error) => console.log(error));
}

const updateProductBtn = getID("updateProduct");
if (updateProductBtn) {
  updateProductBtn.onclick = updateProduct;
}

const btnOpenAdd = document.querySelector('[data-modal-target="crud-modal"]');
if (btnOpenAdd) {
  btnOpenAdd.addEventListener("click", () => {
    if (event && event.isTrusted) {
      getID("name").value = "";
      getID("price").value = "";
      getID("screen").value = "";
      getID("backCamera").value = "";
      getID("frontCamera").value = "";
      getID("image").value = "";
      getID("description").value = "";
      getID("category").value = "Select category";
      getID("addProduct").style.display = "inline-flex";
      getID("updateProduct").style.display = "none";
    }
  });
}
