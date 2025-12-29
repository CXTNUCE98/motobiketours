import { ref } from 'vue';

const isWishlistDrawerVisible = ref(false);

/**
 * Composable quản lý trạng thái hiển thị của Wishlist Drawer
 */
export const useWishlistDrawer = () => {
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
