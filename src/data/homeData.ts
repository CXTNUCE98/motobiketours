import type { Testimonial, News, Slide } from '@/types';

export const locations = [
  { value: 'all', label: 'Tất cả' },
  { value: 'Sài Gòn', label: 'Sài Gòn' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Huế', label: 'Huế' },
  { value: 'Hội An', label: 'Hội An' },
  { value: 'Đà Lạt', label: 'Đà Lạt' },
  { value: 'Nha Trang', label: 'Nha Trang' },
  { value: 'Mũi Né', label: 'Mũi Né' },
  { value: 'Hà Giang', label: 'Hà Giang' },
  { value: 'Sapa', label: 'Sapa' },
  { value: 'Phú Quốc', label: 'Phú Quốc' },
];

export const brands = [{ value: '', label: 'Số ngày' }];

export const testimonials: Testimonial[] = [
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

export const latestNews: News[] = [
  {
    id: 'dong-nai-destinations',
    image: 'https://tourdanangcity.vn/wp-content/uploads/2024/05/tour-da-nang-city.jpg',
    title: 'Những Điểm Đến Đẹp Lạ Không Nhiều Người Biết Ở Đồng Nai',
    date: '04/05/2024',
    views: 103,
    description:
      'Ngoài khu du lịch Bửu Long, Vườn Quốc gia Nam Cát Tiên đã quá quen thuộc, Đồng Nai còn nhiều điểm tham quan độc đáo, thích hợp cho những ai yêu thích khám phá và trải nghiệm.',
    to: '/news/dong-nai-destinations',
  },
  {
    id: 'bac-giang-village',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSageMzVtqoGflxKJv12ChBYYkfhJLfETCWhw&s',
    title: 'Làng Cổ Thuần Việt Ở Bắc Giang',
    date: '04/05/2024',
    views: 46,
    description:
      'Nhịp sống chậm rãi, yên bình trên đường quê rợp bóng tre, hòa cùng khói lam chiều trên ruộng tại làng Sấu thuộc huyện Tân Yên.',
    to: '/news/bac-giang-village',
  },
  {
    id: 'thanh-hoa-tourism',
    image: 'https://daivietourist.vn/wp-content/uploads/2024/08/tour-phu-quoc-5-ngay-4-dem-6.jpg',
    title: 'Thanh Hóa Đón Gần 500.000 Khách Du Lịch, Gấp 9 Lần Đà Lạt',
    date: '04/05/2024',
    views: 50,
    description:
      'Trong 3 ngày của kỳ nghỉ lễ Giỗ tổ Hùng Vương, các điểm du lịch của tỉnh Thanh Hóa đã đón hơn 460.000 lượt khách; doanh thu đạt 520 tỉ đồng.',
    to: '/news/thanh-hoa-tourism',
  },
];

export const getSlides = (t: (key: string) => string): Slide[] => [
  {
    title: t('home.findYourPerfectTour'),
    subtitle: t('home.discoverTheWorld'),
    description: t('home.uniqueLocations'),
    image:
      'https://danangfantasticity.com/wp-content/uploads/2023/05/da-nang-trong-top-nhung-diem-den-co-phong-canh-nui-non-dep-nhat-chau-a.jpg',
    videoThumb: 'https://vivuvietnam.org/wp-content/uploads/2024/08/canh-dep-da-nang-9-jpg.webp',
  },
  {
    title: t('home.discoverVietnam'),
    subtitle: t('home.completeTravel'),
    description: t('home.completeTravelDescription'),
    image:
      'https://s3-ap-southeast-1.amazonaws.com/cntatr-assets-ap-southeast-1-250226768838-55a62c9399d4d8a6/2025/06/canh-dep-da-nang.jpg?tr=q-70,c-at_max,w-1000,h-600',
    videoThumb:
      'https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1741699433.jpg&w=3840&q=75',
  },
  {
    title: t('home.memorableJourney'),
    subtitle: t('home.unforgettableMemories'),
    description: t('home.unforgettableMemoriesDescription'),
    image: 'https://cdn-media.sforum.vn/storage/app/media/danh-lam-thang-canh-da-nang-7.jpg',
    videoThumb: 'https://drt.danang.vn/content/images/size/w1024/2024/01/bai-bien-da-nang-1-1.jpg',
  },
];
