type RoleTypeI = "ADMIN" | "USER";
interface CategoryTypeI {
  id: number;
  name: string;
}

interface UserTypeI {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleTypeI;
  enabled: boolean;
  authorities: {
    authority: RoleTypeI;
  }[],
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

interface OrderDetailTypeI {
  id: number;
  quantity: number;
  unitPrice: number;
}

interface ReviewTypeI {
  id: number;
  user: UserTypeI;
  orderDetail: OrderDetailTypeI; 
  menuItem: MenuItemTypeI;
}

interface MenuItemTypeI {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  preparation_time_in_min: number;
  created_at: string;
  is_active: boolean;
  categories: CategoryTypeI[];
  reviews: ReviewTypeI[];
  reviewsStat: {
    rating: number;
    reviewersNo: number;
  }
}


interface ReviewsStat {
  rating: number;
  reviewersNo: number;
}

interface ReviewsStatTypeI {
  rating: number;
  reviewersNo: number;
}
