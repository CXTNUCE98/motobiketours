import Thapco from '../public/photos/thapco.jpg'
import Myson from '../public/photos/myson.jpg'
import Cuchi from '../public/photos/cuchi.jpg'
import Cuoivoi from '../public/photos/cuoivoi.jpg'
import Dithuyen from '../public/photos/dithuyen.jpg'
import Lehoi from '../public/photos/lehoi.jpg'
import Suoivoi from '../public/photos/suoivoi.jpg'
import Cungdinhhue from '../public/photos/cungdinhhue.jpg'
import Kyniemduonghochiminh from '../public/photos/kyniemduonghochiminh.jpg'
import Baotang from '../public/photos/baotang.jpg'
import Taynguyen from '../public/photos/taynguyen.jpg'
import Nhasan from '../public/photos/nhasan.jpg'
import Rungsu1 from '../public/photos/rungsu1.jpg'
import Rungsu2 from '../public/photos/rungsu2.jpg'
import Rungsu3 from '../public/photos/rungsu3.jpg'
import Mytho1 from '../public/photos/mytho1.jpg'
import Mytho2 from '../public/photos/mytho2.jpg'
import Mytho3 from '../public/photos/mytho3.jpg'
import Hotel1 from '../public/photos/hotel1.jpg'
import Hotel2 from '../public/photos/hotel2.jpg'
import Hotel3 from '../public/photos/hotel3.jpg'

export const photos = [
    { id: 'thapco', title: 'Tháp cổ', src: Thapco },
    { id: 'myson', title: 'Mỹ Sơn', src: Myson },
    { id: 'cuchi', title: 'Địa đạo Củ Chi', src: Cuchi },
    { id: 'cuoivoi', title: 'Cưỡi Voi', src: Cuoivoi },
    { id: 'ditruyen', title: 'Đi thuyền', src: Dithuyen },
    { id: 'lehoi', title: 'Lễ hội', src: Lehoi },
    { id: 'suoivoi', title: 'Suối voi', src: Suoivoi },
    { id: 'cungdinhhue', title: 'Cung Đình Huế', src: Cungdinhhue },
    { id: 'kyniemduonghochiminh', title: 'Kỷ Niệm Đường Hồ Chí Minh', src: Kyniemduonghochiminh },
    { id: 'baotang', title: 'Bảo tàng', src: Baotang },
    { id: 'taynguyen', title: 'Tây nguyên', src: Taynguyen },
    { id: 'nhasan', title: 'Nhà sàn', src: Nhasan },
    { id: 'rungsu', title: 'Rừng su', src: [Rungsu1, Rungsu2, Rungsu3] },
    { id: 'mytho', title: 'Mỹ Tho', src: [Mytho1, Mytho2, Mytho3] },
    { id: 'hotel', title: 'Hotel', src: [Hotel1, Hotel2, Hotel3] },
]

// Simple mock videos list. Thumbnails re-use existing photos assets
export const videos = [
    {
        id: 'riding-hue-night',
        title: 'Riding through Huế at Night',
        thumbnail: Hotel1,
        date: '07.07.2015 10:00',
        excerpt: 'Nightlife in Huế is dazzling – hop on and enjoy the cool breeze.',
        youtubeId: 'jq2pn8b6q-A',
    },
    {
        id: 'phu-quoc-island',
        title: "Phú Quốc Island - Việt Nam's Largest Island",
        thumbnail: Mytho1,
        date: '07.07.2015 10:05',
        excerpt: 'Crystal beaches, pepper farms, and sun-kissed rides along the coast.',
        youtubeId: 'YQ8DNkV4PBo',
    },
    {
        id: 'cu-chi-tunnels',
        title: 'Explore Củ Chi Tunnels by Moto',
        thumbnail: Cuchi,
        date: '27.07.2015 03:35',
        excerpt: 'A historic route into the countryside and the famous tunnel system.',
        youtubeId: 'U1usrHw-GvI',
    },
    {
        id: 'my-son-sanctuary',
        title: 'My Sơn Sanctuary Morning Ride',
        thumbnail: Myson,
        date: '27.07.2015 03:47',
        excerpt: 'Ancient towers, green hills, and a peaceful sunrise ride.',
        youtubeId: '9zCLK3u9V70',
    },
]