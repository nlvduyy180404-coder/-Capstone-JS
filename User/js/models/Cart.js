export default class Cart {
    constructor() {
        this.mangGioHang = [];
    }

    themGH(sp) {
        let viTri = this.timViTri(sp.product.id);
        if (viTri !== -1) {
            this.mangGioHang[viTri].quantity += 1;
        } else {
            this.mangGioHang.push(sp);
        }
    }

    timViTri(id) {
        return this.mangGioHang.findIndex(item => item.product.id === id);
    }

    xoaGH(id) {
        let viTri = this.timViTri(id);
        if (viTri !== -1) {
            this.mangGioHang.splice(viTri, 1);
        }
    }

    capNhatSoLuong(id, sl) {
        let viTri = this.timViTri(id);
        if (viTri !== -1) {
            this.mangGioHang[viTri].quantity += sl;
            if (this.mangGioHang[viTri].quantity <= 0) {
                this.xoaGH(id);
            }
        }
    }
}
