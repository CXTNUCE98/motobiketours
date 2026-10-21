/**
 * Popup đăng nhập dùng chung: Header hiển thị popup, trang khác mở nó qua composable này
 * (site không có trang /login riêng).
 */
export const useLoginPopup = () => {
  const isLoginPopupVisible = useState('login-popup-visible', () => false);

  const openLoginPopup = () => {
    isLoginPopupVisible.value = true;
  };

  return {
    isLoginPopupVisible,
    openLoginPopup,
  };
};
