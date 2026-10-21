/**
 * Bắt đầu đặt tour. Chưa đăng nhập thì mở popup đăng nhập, đăng nhập xong đi tiếp tới bước đặt tour.
 * Dùng chung cho thẻ đặt tour và thanh đặt tour trên điện thoại.
 */
export const useBookTour = () => {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();
  const { isLoginPopupVisible, openLoginPopup } = useLoginPopup();
  const router = useRouter();
  const localePath = useLocalePath();

  return (tourId: string) => {
    const bookingPath = localePath(`/booking/${tourId}`);

    if (isAuthenticated.value) {
      router.push(bookingPath);
      return;
    }

    ElMessage.warning(t('booking.loginRequired'));
    openLoginPopup();

    // Đóng popup mà chưa đăng nhập thì thôi
    const stop = watch([isAuthenticated, isLoginPopupVisible], ([loggedIn, visible]) => {
      if (loggedIn) router.push(bookingPath);
      if (loggedIn || !visible) stop();
    });
  };
};
