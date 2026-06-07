import { getListAPI, getProductAPI, postAPI, putAPI, deleteAPI } from "../../../api.js";
import Product from "../modal/products.js";

renderListProduct();

function getID(id) {
    return document.getElementById(id)
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
    let product= new Product(name, price, screen, backCamera, frontCamera, img, desc, type);
    return product
}
window.getInfoProduct = getInfoProduct

function renderListProduct() {
    getListAPI().then((res) => {
        let content = "";

        res.data.forEach((product) => {
            content += `<tr  class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td class="px-4 py-3">${product.id}</td>
                <td class="px-4 py-3">
                  <img
                    src="${product.img}"
                    class="w-10 h-10 object-cover rounded"
                    alt="product"
                  />
                </td>
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  ${product.name}
                </td>
                <td class="px-4 py-3">${product.price}</td>
                <td class="px-4 py-3">
                  <span
                    class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300"
                    >${product.type}</span
                  >
                </td>
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">
                  ${product.desc}
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center justify-end gap-2">
                    <button
                    id="edit${product.id}"
                      type="button"
                      title="Sửa"
                      class="inline-flex items-center justify-center w-8 h-8 text-yellow-600 bg-yellow-100 rounded-lg hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800"
                    >
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button
                    id="delete${product.id}"
                      type="button"
                      title="Xoá"
                      class="inline-flex items-center justify-center w-8 h-8 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>`
        });

        document.getElementById("tbodyProduct").innerHTML = content;
    }).catch((error) => console.log(error));
}


function addProduct() {
    let product = getInfoProduct();

    // kiểm tra dữ liệu trước khi gửi lên API, tránh tạo record rỗng
    let missingFields = Object.entries(product).filter(([key, value]) => !value || value === "Select category");
    if (missingFields.length > 0) {
        alert("Vui lòng nhập đầy đủ thông tin sản phẩm trước khi thêm!");
        return;
    }

    postAPI(product).then((res) => {
        console.log(res.data);
        renderListProduct();
    }).catch((error) => console.log(error));
}

const addProductBtn = getID("addProduct");
if (addProductBtn) {
    addProductBtn.onclick = addProduct;
}

window.addProduct = addProduct