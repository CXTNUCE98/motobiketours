/**
 * Composable quản lý trạng thái hiển thị của Wishlist Drawer
 * Dùng useState để tránh SSR state leakage giữa các users
 */
export const useWishlistDrawer = () => {
  const isWishlistDrawerVisible = useState('wishlist-drawer-visible', () => false);

  const toggleDrawer = () => {
    isWishlistDrawerVisible.value = !isWishlistDrawerVisible.value;
  };

  const openDrawer = () => {
    isWishlistDrawerVisible.value = true;
  };

  const closeDrawer = () => {
    isWishlistDrawerVisible.value = false;
  };

  return {
    isWishlistDrawerVisible,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  };
};
