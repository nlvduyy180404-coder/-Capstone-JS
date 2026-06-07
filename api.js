function getListAPI() {
    const url="https://6a1a8feebc2f944754925dd6.mockapi.io/Products";
    const promise = axios({
        url: url,
        method: "GET"
    })
    return promise
}


function getProductAPI(id) {
    const url=`https://6a1a8feebc2f944754925dd6.mockapi.io/Products/${id}`;
    const promise = axios({
        url: url,
        method: "GET"
    })
    return promise
}

function postAPI(data) {
    const url="https://6a1a8feebc2f944754925dd6.mockapi.io/Products";
    const promise = axios({
        url: url,
        method: "POST",
        data: data
    })
    return promise
}

function putAPI(id, data) {
    let url = `https://6a1a8feebc2f944754925dd6.mockapi.io/Products/${id}`
    const promise = axios({
        url: url,
        method: "PUT",
        data: data
    })
    return promise
}

function deleteAPI(id) {
    let url = `https://6a1a8feebc2f944754925dd6.mockapi.io/Products/${id}`
    const promise = axios({
        url: url,
        method: "DELETE"
    })
    return promise
}

export { getListAPI, getProductAPI, postAPI, putAPI, deleteAPI }