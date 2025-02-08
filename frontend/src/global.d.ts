interface RoleTypeI {
  id: number;
  name: string;
}
interface CategoryTypeI {
  id: number;
  name: string;
}

interface UserTypeI {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: RoleTypeI[];
  enabled: boolean;
  authorities: {
    authority: RoleTypeI.name;
  }[],
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export type OrderStatus = "RECEIVED" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export type PaymentMethod = "CARD" | "CASH" | "ONLINE";

interface OrderDetailTypeI {
  id: number;
  quantity: number;
  unitPrice: number;
  menuItem: MenuItemTypeI;
}

interface OrderTypeI {
  id: number;
  uuid: string;
  user: UserTypeI;
  orderStatus: OrderStatus;
  orderDetails: OrderDetailTypeI[];
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

interface ReviewTypeI {
  id: number;
  user: UserTypeI;
  orderDetail: OrderDetailTypeI; 
  menuItem: MenuItemTypeI;
  rating: number;
  comment: string;
  type: string;
  createdAt: string;
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

interface MenuTypeI {
  id: number;
  name: string;
  status: string;
  created_at: string;
  is_active: boolean;
  items: MenuItemTypeI[];
}

interface CanteenTypeI {
  id: number;
  name: string;
  image_url: string;
  address: string;
  phone_no: string;
  about: string;
  email: string;
  created_at: string;
  is_active: boolean;
  opening_hours: string;
  closing_hours: string;
  user: UserTypeI;
  reviewsStats: ReviewsStat;
}

interface LedgerTypeI {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  created_at: string;
  canteen: CanteenTypeI;
  menus: MenuTypeI[];
}


interface ReviewsStat {
  rating: number;
  reviewersNo: number;
}

interface ReviewsStatTypeI {
  rating: number;
  reviewersNo: number;
}
