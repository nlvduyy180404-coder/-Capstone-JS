import { getListAPI, getProductAPI, postAPI, putAPI, deleteAPI } from "../../../api.js";

getListAPI().then((res) => {
    console.log(res.data);
}).catch((error) => console.log(error));