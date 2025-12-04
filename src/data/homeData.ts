export const locations = [
  { value: '', label: 'Địa điểm của bạn' },
  { value: 'danang', label: 'Đà Nẵng' },
  { value: 'hue', label: 'Huế' },
  { value: 'hoian', label: 'Hội An' },
  { value: 'quangnam', label: 'Quảng Nam' },
];

export const brands = [{ value: '', label: 'Số ngày' }];

export const testimonials = [
  {
    id: 1,
    name: 'Samuel Kaisinger',
    image: '/photos/hotel1.jpg',
    text: 'Tôi và đội ngũ nhân viên chuyên nghiệp nhiệt tình, sự thân thiện, vui vẻ của nhân viên ở Tripo giúp có cảm giác thoải mái, tự nhiên và sẵn sàng quay lại với công ty du lịch trong những chuyến đi tiếp theo.',
  },
  {
    id: 2,
    name: 'Maurice Nygaard',
    image: '/photos/hotel2.jpg',
    text: 'Cảm ơn ANDAGO đã mang đến cho tôi một kỳ nghỉ du lịch hoàn hảo về trải nghiệm văn hóa chân thực và điều mà chúng tôi đánh giá cao là dịch vụ của công ty cho các chuyến đi tiếp theo và giới thiệu quảng bá đến bạn bè của tôi.',
  },
  {
    id: 3,
    name: 'John Smith',
    image: '/photos/hotel3.jpg',
    text: 'Dịch vụ tuyệt vời! Đội ngũ hướng dẫn viên rất chuyên nghiệp và nhiệt tình. Tôi sẽ chắc chắn quay lại và giới thiệu cho bạn bè.',
  },
];

export const latestNews = [
  {
    id: 'dong-nai-destinations',
    image: '/carousel/1.jpg',
    title: 'Những Điểm Đến Đẹp Lạ Không Nhiều Người Biết Ở Đồng Nai',
    date: '04/05/2024',
    views: 103,
    description:
      'Ngoài khu du lịch Bửu Long, Vườn Quốc gia Nam Cát Tiên đã quá quen thuộc, Đồng Nai còn nhiều điểm tham quan độc đáo, thích hợp cho những ai yêu thích khám phá và trải nghiệm.',
    to: '/news/dong-nai-destinations',
  },
  {
    id: 'bac-giang-village',
    image: '/carousel/2.jpg',
    title: 'Làng Cổ Thuần Việt Ở Bắc Giang',
    date: '04/05/2024',
    views: 46,
    description:
      'Nhịp sống chậm rãi, yên bình trên đường quê rợp bóng tre, hòa cùng khói lam chiều trên ruộng tại làng Sấu thuộc huyện Tân Yên.',
    to: '/news/bac-giang-village',
  },
  {
    id: 'thanh-hoa-tourism',
    image: '/carousel/3.jpg',
    title: 'Thanh Hóa Đón Gần 500.000 Khách Du Lịch, Gấp 9 Lần Đà Lạt',
    date: '04/05/2024',
    views: 50,
    description:
      'Trong 3 ngày của kỳ nghỉ lễ Giỗ tổ Hùng Vương, các điểm du lịch của tỉnh Thanh Hóa đã đón hơn 460.000 lượt khách; doanh thu đạt 520 tỉ đồng.',
    to: '/news/thanh-hoa-tourism',
  },
];

export const getSlides = (t: (key: string) => string) => [
  {
    title: t('home.findYourPerfectTour'),
    subtitle: t('home.discoverTheWorld'),
    description: t('home.uniqueLocations'),
    image: '/carousel/1.jpg',
    videoThumb: '/carousel/2.jpg',
  },
  {
    title: t('home.discoverVietnam'),
    subtitle: t('home.completeTravel'),
    description: t('home.completeTravelDescription'),
    image: '/carousel/3.jpg',
    videoThumb: '/carousel/4.jpg',
  },
  {
    title: t('home.memorableJourney'),
    subtitle: t('home.unforgettableMemories'),
    description: t('home.unforgettableMemoriesDescription'),
    image: '/carousel/5.jpg',
    videoThumb: '/carousel/6.jpg',
  },
];
