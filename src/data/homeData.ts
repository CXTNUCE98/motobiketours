import type { News } from '@/types';

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
