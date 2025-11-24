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

export const topDestinationsTours = [
  {
    id: 'nam-cat-tien',
    image: '/carousel/1.jpg',
    title: 'Tour Nam Cát Tiên 2N1D: Thiên Nhiên Hoang Sơ Rừng',
    price: 4500000,
    originalPrice: 4972000,
    discount: 9,
    rating: 5,
    duration: '3 ngày 2 đêm',
    people: '3 người',
    to: '/tour/nam-cat-tien',
  },
  {
    id: 'mien-tay',
    image: '/carousel/2.jpg',
    title: 'Tour Miền Tây 4N3D: Cái Bè - Sóc Trăng - Bạc Liêu - Cà',
    price: 3490000,
    rating: 5,
    duration: '4 ngày 3 đêm',
    people: '5 người',
    to: '/tour/mien-tay',
  },
  {
    id: 'mien-bac-hcm',
    image: '/carousel/3.jpg',
    title: 'Tour Miền Bắc 4N3D: HCM - Hạ Long - Ninh Bình - Sapa',
    price: 16780000,
    rating: 5,
    duration: '4 ngày 3 đêm',
    people: '7 người',
    to: '/tour/mien-bac-hcm',
  },
  {
    id: 'mien-bac-ha-noi',
    image: '/carousel/4.jpg',
    title: 'Tour Miền Bắc 5N4D: Hà Nội - Ninh Bình - Vịnh Hạ Long',
    price: 9100000,
    rating: 5,
    duration: '5 ngày 4 đêm',
    people: '7 người',
    to: '/tour/mien-bac-ha-noi',
  },
];

export const tourDaNangTours = [
  {
    id: 'hue',
    image: '/photos/cungdinhhue.jpg',
    title: 'TOUR HUẾ 1 NGÀY TỪ ĐÀ NẴNG',
    price: 750000,
    rating: 5,
    duration: '1 ngày',
    people: '2-4 người',
    badge: 'Khám phá lịch sử',
    showPeulisLabel: false,
    to: '/tour/hue',
  },
  {
    id: 'bana',
    image: '/carousel/2.jpg',
    title: 'ĐÀ NẴNG – BÀ NÀ HILLS',
    price: 1250000,
    rating: 5,
    duration: '1 ngày',
    people: '2-4 người',
    badge: 'Tour Bà Nà',
    showPeulisLabel: false,
    to: '/tour/bana',
  },
  {
    id: 'hoian',
    image: '/carousel/4.jpg',
    title: 'ĐÀ NẴNG – NGŨ HÀNH SƠN – HỘI AN',
    price: 400000,
    rating: 5,
    duration: '1 ngày',
    people: '2-4 người',
    badge: 'Tour ghép',
    showPeulisLabel: false,
    to: '/tour/hoian',
  },
];

export const tourHotTours = [
  {
    id: 'hue-hot',
    image: '/photos/cungdinhhue.jpg',
    title: 'TOUR HUẾ 1 NGÀY TỪ ĐÀ NẴNG',
    price: 750000,
    rating: 5,
    duration: '1 ngày',
    people: '2-4 người',
    badge: 'Khám phá lịch sử',
    showPeulisLabel: false,
    to: '/tour/hue',
  },
  {
    id: 'bana-hot',
    image: '/carousel/2.jpg',
    title: 'ĐÀ NẴNG – BÀ NÀ HILLS',
    price: 1250000,
    rating: 5,
    duration: '1 ngày',
    people: '2-4 người',
    badge: 'Tour Bà Nà',
    showPeulisLabel: false,
    to: '/tour/bana',
  },
  {
    id: 'hoian-hot',
    image: '/carousel/4.jpg',
    title: 'ĐÀ NẴNG – NGŨ HÀNH SƠN – HỘI AN',
    price: 400000,
    rating: 5,
    duration: '1 ngày',
    people: '2-4 người',
    badge: 'Tour ghép',
    showPeulisLabel: false,
    to: '/tour/hoian',
  },
  {
    id: 'sontra-hot',
    image: '/carousel/5.jpg',
    title: 'SƠN TRÀ – NGŨ HÀNH SƠN – HỘI AN',
    price: 450000,
    rating: 5,
    duration: '1 ngày',
    people: '2-4 người',
    badge: 'Tour Hội An',
    showPeulisLabel: false,
    to: '/tour/sontra',
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

export const slides = [
  {
    title: 'Tìm Chuyến Tham Quan Hoàn Hảo Của Bạn Tại ANDAGO',
    subtitle: 'Khám Phá Thế Giới',
    description:
      'Địa điểm độc đáo cả trong và ngoài nước. Mạng đến sự đa dạng để khách hàng thoải mái lựa chọn chuyến đi cho riêng mình.',
    image: '/carousel/1.jpg',
    videoThumb: '/carousel/2.jpg',
  },
  {
    title: 'Khám Phá Vẻ Đẹp Việt Nam',
    subtitle: 'Du Lịch Trọn Vẹn',
    description: 'Trải nghiệm những điểm đến tuyệt vời nhất tại Việt Nam cùng đội ngũ hướng dẫn viên chuyên nghiệp.',
    image: '/carousel/3.jpg',
    videoThumb: '/carousel/4.jpg',
  },
  {
    title: 'Hành Trình Đáng Nhớ',
    subtitle: 'Kỷ Niệm Khó Quên',
    description: 'Tạo nên những kỷ niệm đẹp cùng gia đình và bạn bè trong những chuyến đi khó quên.',
    image: '/carousel/5.jpg',
    videoThumb: '/carousel/6.jpg',
  },
];
