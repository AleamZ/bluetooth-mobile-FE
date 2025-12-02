
// //-------------Category interface-------------//
//getall

// types/main.interface.ts

// Interface cho một danh mục đơn lẻ
export interface Category {
    _id: string; // ID của danh mục
    imageLogo: string; // URL hình ảnh logo
    order: number; // Thứ tự sắp xếp
    name: string; // Tên danh mục
    isDeleted: boolean; // Trạng thái đã bị xóa hay chưa
    subCategories: Category[];
    parentId: string | null;
    url: string;
    createdAt: string; // Thời gian tạo
    updatedAt: string; // Thời gian cập nhật


}
//------------------------------//
// Interface for DeleteCategoryRequest
export interface DeleteCategoryRequest {
    categoryId: string; // ID của danh mục cần xóa
}
//--------------------------------------------------------------------//

//-------------Product overview-------------//
export interface ProductOverview {
    totalOrders: string;
    totalCart: string;
    totalPending: string;
    totalApproved: string;
    totalDelivered: string;
    totalCanceled: string;
}


//--------------------------------------------------------------------//

