// @ts-nocheck
import Thapco from '../public/photos/thapco.jpg';
import Myson from '../public/photos/myson.jpg';
import Cuchi from '../public/photos/cuchi.jpg';
import Cuoivoi from '../public/photos/cuoivoi.jpg';
import Dithuyen from '../public/photos/dithuyen.jpg';
import Lehoi from '../public/photos/lehoi.jpg';
import Suoivoi from '../public/photos/suoivoi.jpg';
import Cungdinhhue from '../public/photos/cungdinhhue.jpg';
import Kyniemduonghochiminh from '../public/photos/kyniemduonghochiminh.jpg';
import Baotang from '../public/photos/baotang.jpg';
import Taynguyen from '../public/photos/taynguyen.jpg';
import Nhasan from '../public/photos/nhasan.jpg';
import Rungsu1 from '../public/photos/rungsu1.jpg';
import Rungsu2 from '../public/photos/rungsu2.jpg';
import Rungsu3 from '../public/photos/rungsu3.jpg';
import Mytho1 from '../public/photos/mytho1.jpg';
import Mytho2 from '../public/photos/mytho2.jpg';
import Mytho3 from '../public/photos/mytho3.jpg';
import Hotel1 from '../public/photos/hotel1.jpg';
import Hotel2 from '../public/photos/hotel2.jpg';
import Hotel3 from '../public/photos/hotel3.jpg';

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
];

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
];

// Simple mock news list used by the News pages
export const news = [
  {
    id: 'these-attractions-da-nang',
    title: 'These attractions, tourism in Da Nang',
    thumbnail: Hotel2,
    date: '21.07.2015 03:31',
    excerpt:
      'Referring to tourism can not forget to Da Nang since it not only natural but also by imposing the typical architecture, unique and hospitable spirit of the people of the coastal city.',
    content: [
      'Da Nang is known for its clean and modern cityscape, sandy beaches, and welcoming locals. Riders love the coastal roads and mountain passes that surround the city.',
      'From the Marble Mountains to the Dragon Bridge and Son Tra Peninsula, Da Nang offers a perfect blend of nature and urban experiences for travelers.',
    ],
    contentHtml: `<div class="TinDetailC" bis_skin_checked="1">
    <h1 style="padding-bottom: 10px;">These attractions, tourism in Da Nang</h1>
    <div class="DetailC" bis_skin_checked="1"><div style="text-align: justify;" bis_skin_checked="1">Referring to tourism can not forget to Da Nang since it not only natural but also by imposing the typical architecture, unique and hospitable spirit of the people of the coastal city. With its sunny climate characteristic wind central with a long coastline and abundant vegetation, Danang deserved as one of the tourist paradise with many entertainment and pleasure.<br>
    <br>
    Sapa is like the central, Bana annually welcomes thousands of foreign and domestic tourists visit. With the cable car to reach the international record, visitors will be coming to the scene domain of immense space, misty mountain peaks or the flowers blooming between clouds thousand.<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/tourbana.jpg" style="height:398px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>The stop at Bana</strong></em><br>
    <br>
    Located about 30km from the city center to the west with altitude of 1.487m compared to sea level, the ideal temperature is 18 degrees C, Ba Na is evaluated by one of the best resorts of our country's ideals . Needless to roaming arc winding road up the mountain, nowadays with modern cable system was built in accordance with standards of Austria consists of 94 cabins along the velocity of 6m / sec so convenient and fast. Is compared to the scene line up, sit in the cabin cable car, visitors can admire the abundant forests, crystal-clear waterfalls up as page rendering or lãng covered in haze.<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/tourbana2.jpg" style="height:413px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>Ba Na cable car reaches 4 world records</strong></em><br>
    <br>
    But perhaps the difference to make up the uniqueness of Bana as visitors can go through the experience four seasons in one day. The constant change between the fresh spring weather in the morning, the warmth of the noonday summer, add the cold of autumn when evening came and the night of the sinking in the air was freezing cold bring Enjoy new sensory.<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/bana.jpg" style="height:171px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>Chuong- peach logo Bana</strong></em><br>
    <br>
    Not only famous for pristine space stunning, cool climate, Bana still attracts tourists visited also by system resorts, amusement parks are equipped with modern, high-end suitable for all ages. As luxury resort from the French colonial period to present some French villas, the Buddhist culture, wineries and a variety of hotels, bars, tennis courts, badminton ... being restored and religion created.<br>
    &nbsp;<br>
    For those who love adventure, perhaps the Hai Van Pass is a not to be missed. Dubbed "People are most important heroes" winding Hai Van Pass with chillingly crook but quite exciting for adventurous young people. Not only known for providing long distance perched on the mountainside, majestic natural landscape but also equally romantic attraction for those who arrive here. From above the pass, visitors can hear vu woods, rustling leaves, or panoramic space far side, the vast blue sea with waves whispering want the same beckons. Further below are the lagoons with immense space waves, harmonic landscapes such as respect for the scenery lovely touches but equally graceful to be wild here.<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/haivan.jpg" style="height:415px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>Hai Van Pass with winding curves but no less majestic, romantic</strong></em><br>
    <br>
    Just shopping for a motorcycle, a camera with a companion who is able to have free access to favorite sites here. Stepping up the stone steps to release the soul in the wind, standing in front of checkpoints back north with the words "Hai Van Quan" or southbound along with six Chinese characters "Quan Hung Thien Ha De Nhat" will be the image impressive image can not forget those who ever set foot in this place.<br>
    &nbsp;<br>
    Considered a symbol of Danang, look away from the Marble Mountains cluster look like bonsai emerging among blue color of sky and sea. Marble with 5 mountains as 5 elements of the universe, the earth and sky. Seem to want the same further in the mountains, space fanciful, poetic, with countless caves with special shapes, temple bell resounded with the sound of waves pounding the shore as bringing tourists lost in celestial realms pregnant. Places you can not miss while in Marble as big mountains Thuy Son, Tam Thai Pagoda, Huyen Khong dynamic, real Van Thong Guan Yin activity, cave infernal ...<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/nguhanhson.jpg" style="height:450px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>Marble horns between earth and sky</strong></em><br>
    <br>
    Located next to the Marble is a Non Nuoc stone village that highlight the Non Nuoc. This is the birthplace of the stone sculptures with innumerable idols, creation is the local artisan labor with hands and his creativity. With source material was marble, guests can enjoy their choice of a gift to give relatives as Buddha, the holy, the people, like the animal or the round stone engraved crystal bracelet craftsmanship, meticulous.<br>
    ​</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/nguhanhson2.jpg" style="height:375px; width:500px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>Non Nuoc stone carving village</strong></em><br>
    &nbsp;<br>
    Located downtown about 10km northeast, Son Tra Peninsula convergence of both the forest and sea beauty. As nature reserve should National nature here remained the wild character with abundant vegetation, a variety of rare wildlife. Away covered with green forests, Son Tra Peninsula as a privilege but endowed for Danang. Not only green feature of the forest trees, it also attracts tourists by the coastline as a winding stretch of road at the foot of the mountain to emerge as Tien Sa sea, beach Stone Black, Bai But, Bai Ratings, Most beaches, South Beach, North Beach, The beach, beach Trem ...<br>
    <br>
    ​</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/baibut.jpg" style="height:450px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <strong><em>The wild beauty of beaches to awe But</em></strong><br>
    <br>
    Not only brings natural beauty of Son Tra also gives guests the warmth, purity site Linh Ung Pagoda. Considered the largest temple with Buddha Ba Da Nang's largest country. Temples modern style combined with traditional looks inherent Vietnam temples like curved roof with dragons, but the pillars are covered with sinuous dragon. Located in a large space, that leaned against the mountain, facing the sea with kind eyes, Buddha Ba as arms embrace, protect the city before the wrath of the vast ocean. With the inherent purity, as this gas flexible convergence of heaven and earth human heart, making one stop back here and see my heart gently, peacefully.</div>

    <div style="text-align: justify;" bis_skin_checked="1">​</div>

    <div style="text-align: justify;" bis_skin_checked="1"><strong><em>Buddha Ba Linh Ung Pagoda</em></strong><br>
    &nbsp;<br>
    Surely someone had to Danang can not ignore the beauty of marine tourism. Reviewed by one of the planet's most beautiful beach, My Khe coast attract tourists by the long, fine sand and clear blue water. Coast gentle, peaceful sea, the mild sea and towering coconut trees surrounding Khe make for a romantic setting but equally peaceful.<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/mykhe.jpg" style="height:400px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>My Khe beach with white sand stretches and towering coconut trees</strong></em><br>
    &nbsp;<br>
    Danang in the cross du eye not just friendly young love, but also by the striking architecture, typical representative of the intellectual and the people here. Han river surrounded as embrace the city where there are many people mention is the Han River Bridge. The bridge was built on the main axis of Le Duan Street, Hai Chau district connection with Son Tra district.<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/songhan.jpg" style="height:401px; width:600px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>Han River Bridge - the symbol of the city of Da Nang</strong></em><br>
    <br>
    It would be interesting if you walk on the bridge at night, when the lights are turned on, scenic waterfront sparkling colors appear. With visiting here, it is worth trying once staying up late, at around 0h30 every day, the bridge will be folded 90 degrees pave the way for large ships to pass through. Try once staying up late, suspense and cheered when slowly rotating globe moment, sure to be unforgettable memories of every traveler.<br>
    &nbsp;<br>
    Along with Han River Bridge, Dragon Bridge has been inaugurated as the new face added to the city, the greater the beauty of Da Nang - liveable cities.<br>
    &nbsp;</div>

    <div class="flex justify-center pb-2" style="text-align: center;" bis_skin_checked="1">​<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/caurong.jpg" style="height:266px; width:591px"></div>

    <div style="text-align: justify;" bis_skin_checked="1"><br>
    <em><strong>Dragon bridge beauty of the shimmering lights</strong></em><br>
    <br>
    With its convenient location, Da Nang visitors can come to Hoi An ancient town to admire the lantern festival or reverse the north to the ancient capital of Hue to learn about an area of ​​a nation dozen. Following the tour itinerary and explore, each area with a different beauty but always remains the unforgettable imprint in the palm of every traveler.<br>
    <br>
    <strong><span style="color:rgb(51, 51, 53); font-family:times new roman,arial,verdana,sans-serif; font-size:17px">Welcome to Danang</span></strong><br>
    <span style="color:rgb(51, 51, 53); font-family:times new roman,arial,verdana,sans-serif; font-size:17px">Youth tourism &amp; Service center</span><br>
    <span style="color:rgb(51, 51, 53); font-family:times new roman,arial,verdana,sans-serif; font-size:17px">NGUYỄN VĂN QUANG'S TOUR</span><br>
    <span style="color:rgb(51, 51, 53); font-family:times new roman,arial,verdana,sans-serif; font-size:17px"><strong>Add:</strong> 53 Phạm Ngọc Mậu, Thanh Khê, Đà Nẵng</span><br>
    <span style="color:rgb(51, 51, 53); font-family:times new roman,arial,verdana,sans-serif; font-size:17px"><strong>Hand phone:</strong> 0854.242.357</span><br>
    <span style="color:rgb(51, 51, 53); font-family:times new roman,arial,verdana,sans-serif; font-size:17px"><strong>Email:</strong>&nbsp;contact.andago@gmail.com</span><br>
    <span style="color:rgb(51, 51, 53); font-family:times new roman,arial,verdana,sans-serif; font-size:17px">For further informations please call direct to me! Always at your service.</span></div>
    </div>
        <script type="text/javascript">
    window.fbAsyncInit = function() {
        FB.init({
        appId      : '377657819060938',
        xfbml      : true,
        version    : 'v2.2'
        });
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/vi_VN/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
    </script>

    <!-- Place this tag after the last +1 button tag. -->
    <script type="text/javascript">
    (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/platform.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
    </script>
    <div class="detailspmxh" bis_skin_checked="1">    
        <div id="fb-root" bis_skin_checked="1"></div>
        <div class="fb-like fb_iframe_widget" data-href="https://www.danangmotorbiketours.com:443/news/these-attractions-tourism-in-da-nang-105.html" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true" bis_skin_checked="1" fb-xfbml-state="rendered" fb-iframe-plugin-query="action=like&amp;app_id=377657819060938&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fthese-attractions-tourism-in-da-nang-105.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false"><span style="vertical-align: bottom; width: 150px; height: 28px;"><iframe name="f4d828498c3245557" width="1000px" height="1000px" data-testid="fb:like Facebook Social Plugin" title="fb:like Facebook Social Plugin" frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no" allow="encrypted-media" src="https://www.facebook.com/v2.2/plugins/like.php?action=like&amp;app_id=377657819060938&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df6af7d05570e5a815%26domain%3Dwww.danangmotorbiketours.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fwww.danangmotorbiketours.com%252Ff9e01fd5ca29c5bb9%26relation%3Dparent.parent&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fthese-attractions-tourism-in-da-nang-105.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false" style="border: none; visibility: visible; width: 150px; height: 28px;" class=""></iframe></span></div>
        <div id="___plusone_0" bis_skin_checked="1" style="position: absolute; width: 450px; left: -10000px;"><iframe ng-non-bindable="" frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position:absolute;top:-10000px;width:450px;margin:0px;border-style:none" tabindex="0" vspace="0" width="100%" id="I0_1762343232000" name="I0_1762343232000" src="https://apis.google.com/u/0/se/0/_/+1/fastbutton?usegapi=1&amp;size=medium&amp;origin=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;url=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fthese-attractions-tourism-in-da-nang-105.html&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fabc-static%2F_%2Fjs%2Fk%3Dgapi.lb.vi.dfUoPKVtW8k.O%2Fd%3D1%2Frs%3DAHpOoo-EelOTsT5jA9beOCHKm2TW7kNNcQ%2Fm%3D__features__#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1762343232000&amp;_gfid=I0_1762343232000&amp;parent=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;pfname=&amp;rpctoken=36233584" data-gapiattached="true"></iframe></div><div class="g-plusone" data-size="medium" data-gapiscan="true" data-onload="true" data-gapistub="true" bis_skin_checked="1"></div>
    </div>    </div>`,
  },
  {
    id: 'kawasaki-estrella-250cc',
    title: 'Motorbike Rental KAWASAKI Estrella 250cc',
    thumbnail: Myson,
    date: '14.07.2015 09:24',
    excerpt:
      'In Germany, the Estrella was available in two versions – and three variants – from 1994 to 1999. A charming classic with simple lines.',
    content: [
      'The Estrella is a light, approachable motorcycle ideal for city cruising and scenic coastal rides.',
      'Its retro styling and gentle power delivery make it a favorite for relaxed tours.',
    ],
    contentHtml: `<div class="TinDetailC" bis_skin_checked="1">
    <h1 style="padding-bottom: 10px;"> Motorbike Rental KAWASAKI Estrella 250cc</h1>
    <div class="DetailC" bis_skin_checked="1"><div style="text-align: justify;" bis_skin_checked="1">In Germany, the Estrella was available in two versions - and three variants - from 1994 to 1999. It is said that selling the Estrella in Germany and some other european countries happened more or less by mistake by Kawasaki!<br>
<br>
The total amount of Estrellas ever sold in the whole of Central Europe may be less than 5,000! There were less than 1,500 Estrellas in Germany in 2005.<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
In Japan, the Estrella has been available in eight versions and numerous variants from 1992 until today. In contrast to Central Europe (with less obstacles to get the driving licence for big bikes) the Estrella has been a big success in Japan. More than 75,000 Estrellas have been produced so far.<br>
&nbsp;&nbsp;&nbsp;&nbsp;<br>
On these sites I have tried to reconstruct the prehistory of the Estrella, find out all versions, colours and variations ever available.<br>
&nbsp;
<div style="text-align: center; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px;" bis_skin_checked="1"><img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/prd_57_IMG_0208.jpg" style="height:375px; width:500px"><br>
<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/IMG_0849.JPG" style="height:375px; width:500px"><br>
&nbsp;</div>

<table border="0" cellpadding="0" cellspacing="2" style="width:100%; margin-top: 10px;">
	<tbody>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">TECHNICAL SPECIFICATION</th>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Model ID</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Manufacturer (Make)</strong></td>
			<td style="background-color:#efefef">Kawasaki</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Model Name</strong></td>
			<td style="background-color:#efefef">Estrella</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Year</strong></td>
			<td style="background-color:#efefef">2003</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Category(class)</strong></td>
			<td style="background-color:#efefef">Classic</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Engine</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Capacity (Displacement)</strong></td>
			<td style="background-color:#efefef">249 ccm (15.19 cubic inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Type</strong></td>
			<td style="background-color:#efefef">1 cylinder</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Bore x Stroke</strong></td>
			<td style="background-color:#efefef">Ø66.0 mm x 73.0 mm (Ø2.6 inches x 2.87 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Bore/Stroke Ratio</strong></td>
			<td style="background-color:#efefef">0.9</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Stroke</strong></td>
			<td style="background-color:#efefef">4</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Valves per Cylinder</strong></td>
			<td style="background-color:#efefef">2</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Starter System</strong></td>
			<td style="background-color:#efefef">Electronic</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Cooling System</strong></td>
			<td style="background-color:#efefef">Air</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Powertrain</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Gearbox</strong></td>
			<td style="background-color:#efefef">5 speed</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Chassis/Suspension/Brakes</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Suspension Travel</strong></td>
			<td style="background-color:#efefef">120 mm (4.72 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Suspension Travel</strong></td>
			<td style="background-color:#efefef">75 mm (2.95 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Brakes</strong></td>
			<td style="background-color:#efefef">Single disc</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Brakes Diameter</strong></td>
			<td style="background-color:#efefef">Ø300 mm (Ø11.81 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Tire</strong></td>
			<td style="background-color:#efefef">90/90-18</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Tire</strong></td>
			<td style="background-color:#efefef">110/90-17</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Dimensions</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Seat Height</strong></td>
			<td style="background-color:#efefef">745 mm (29.33 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Wheelbase</strong></td>
			<td style="background-color:#efefef">1400 mm (55.12 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Curb Weight</strong></td>
			<td style="background-color:#efefef">159 kg (351 lb)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Weight Distribution (front - rear)</strong></td>
			<td style="background-color:#efefef">46% - 54%</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Fuel Capacity</strong></td>
			<td style="background-color:#efefef">14 litres (3.7 gallons)</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Performance</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Power</strong></td>
			<td style="background-color:#efefef">17.00 HP (12.4 kW) at 6500 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Torque</strong></td>
			<td style="background-color:#efefef">21.00 Nm (15.44 ft*lbs) at 6000 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Power/Weight Ratio</strong></td>
			<td style="background-color:#efefef">0.11 Hp/Kg</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Top Speed</strong></td>
			<td style="background-color:#efefef">121 km/h (75mph)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Acceleration (dart, speedup) time</strong></td>
			<td style="background-color:#efefef">&nbsp;</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-100 km/h</strong></td>
			<td style="background-color:#efefef">13.9 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-60 mph</strong></td>
			<td style="background-color:#efefef">13.2 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>1/4 mile</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>60 to 140 km/h, highest gear</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Fuel Consumption</strong></td>
			<td style="background-color:#efefef">3 litres/100km (78.36 mpg)</td>
		</tr>
	</tbody>
</table>
</div>
</div>    
<div class="detailspmxh" bis_skin_checked="1">    
    <div id="fb-root" bis_skin_checked="1"></div>
    <div class="fb-like fb_iframe_widget" data-href="https://www.danangmotorbiketours.com:443/news/motorbike-rental-kawasaki-estrella-250cc-102.html" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true" fb-xfbml-state="rendered" fb-iframe-plugin-query="action=like&amp;app_id=377657819060938&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fmotorbike-rental-kawasaki-estrella-250cc-102.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false" bis_skin_checked="1"><span style="vertical-align: bottom; width: 150px; height: 28px;"><iframe name="f9b547d1d7d241476" width="1000px" height="1000px" data-testid="fb:like Facebook Social Plugin" title="fb:like Facebook Social Plugin" frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no" allow="encrypted-media" src="https://www.facebook.com/v2.2/plugins/like.php?action=like&amp;app_id=377657819060938&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfdc3796863ba79681%26domain%3Dwww.danangmotorbiketours.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fwww.danangmotorbiketours.com%252Ff8cbe1a3f10d644c3%26relation%3Dparent.parent&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fmotorbike-rental-kawasaki-estrella-250cc-102.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false" style="border: none; visibility: visible; width: 150px; height: 28px;" class=""></iframe></span></div>
    <div id="___plusone_0" bis_skin_checked="1" style="position: absolute; width: 450px; left: -10000px;"><iframe ng-non-bindable="" frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position:absolute;top:-10000px;width:450px;margin:0px;border-style:none" tabindex="0" vspace="0" width="100%" id="I0_1762344048272" name="I0_1762344048272" src="https://apis.google.com/u/0/se/0/_/+1/fastbutton?usegapi=1&amp;size=medium&amp;origin=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;url=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fmotorbike-rental-kawasaki-estrella-250cc-102.html&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fabc-static%2F_%2Fjs%2Fk%3Dgapi.lb.vi.dfUoPKVtW8k.O%2Fd%3D1%2Frs%3DAHpOoo-EelOTsT5jA9beOCHKm2TW7kNNcQ%2Fm%3D__features__#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1762344048272&amp;_gfid=I0_1762344048272&amp;parent=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;pfname=&amp;rpctoken=40824323" data-gapiattached="true"></iframe></div><div class="g-plusone" data-size="medium" data-gapiscan="true" data-onload="true" data-gapistub="true" bis_skin_checked="1"></div>
</div>    </div>`,
  },
  {
    id: 'honda-steed-400',
    title: 'Motorbike Rental HONDA STEED 400',
    thumbnail: Cuoivoi,
    date: '14.07.2015 09:11',
    excerpt:
      'The Honda Steed VLS 400 is a motorcycle produced in 1997 which integrated multiple advanced features such as the water cooled 4‑stroke engine and the chain final drive.',
    content: ['Comfortable ergonomics and a torquey engine make the Steed 400 a solid companion for long rides.'],
    contentHtml: `<div class="DetailC" bis_skin_checked="1"><p style="text-align:justify"><strong>Motorbike Rental HONDA STEED 400</strong><br>
<br>
HONDA Steed VLX 400 (1997 - Present) Description &amp; History:</p>

<p style="text-align:justify">The Honda Steed VLS 400 is a motorcycle produced in 1997 which integrated multiple advanced features such as the water cooled 4-stroke engine and the chain final drive.</p>

<p class="flex justify-center items-center flex-wrap gap-2 pb-2"  style="text-align:center"><img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/prd_40_7028616545_fb244863d6_c.jpg" style="height:334px; width:500px"><br>
<img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/IMG_0848.JPG" style="height:375px; width:500px"></p>

<table border="0" cellpadding="0" cellspacing="2" style="width:100%">
	<tbody>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">TECHNICAL SPECIFICATION</th>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Model ID</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Manufacturer (Make)</strong></td>
			<td style="background-color:#efefef">Honda</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Model Name</strong></td>
			<td style="background-color:#efefef">Steed 400</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Year</strong></td>
			<td style="background-color:#efefef">2002</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Category(class)</strong></td>
			<td style="background-color:#efefef">Cruiser / Chopper / Custom</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Engine</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Capacity (Displacement)</strong></td>
			<td style="background-color:#efefef">398 ccm (24.29 cubic inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Type</strong></td>
			<td style="background-color:#efefef">V-type, 2 cylinders</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Bore x Stroke</strong></td>
			<td style="background-color:#efefef">Ø64.0 mm x 62.0 mm (Ø2.52 inches x 2.44 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Bore/Stroke Ratio</strong></td>
			<td style="background-color:#efefef">1.03</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Stroke</strong></td>
			<td style="background-color:#efefef">4</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Valves per Cylinder</strong></td>
			<td style="background-color:#efefef">3</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Timing System</strong></td>
			<td style="background-color:#efefef">OHC</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Fuel System(Carburetion)</strong></td>
			<td style="background-color:#efefef">Carburettor</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Cooling System</strong></td>
			<td style="background-color:#efefef">Liquid</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Powertrain</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Gearbox</strong></td>
			<td style="background-color:#efefef">5 speed</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Chassis/Suspension/Brakes</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Brakes</strong></td>
			<td style="background-color:#efefef">Single disc</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Brakes</strong></td>
			<td style="background-color:#efefef">Drum</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Tire</strong></td>
			<td style="background-color:#efefef">100/90-19 57s</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Tire</strong></td>
			<td style="background-color:#efefef">170/80-15 m/c 77s</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Dimensions</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Overall Length</strong></td>
			<td style="background-color:#efefef">2310 mm (90.94 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Overall Width</strong></td>
			<td style="background-color:#efefef">890 mm (35.04 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Seat Height</strong></td>
			<td style="background-color:#efefef">670 mm (26.38 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Wheelbase</strong></td>
			<td style="background-color:#efefef">1600 mm (62.99 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Ground Clearance</strong></td>
			<td style="background-color:#efefef">130 mm (5.12 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Dry Weight</strong></td>
			<td style="background-color:#efefef">203 kg (448 lb)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Fuel Capacity</strong></td>
			<td style="background-color:#efefef">11 litres (2.91 gallons)</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Performance</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Power</strong></td>
			<td style="background-color:#efefef">31.00 HP (22.6 kW) at 7500 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Torque</strong></td>
			<td style="background-color:#efefef">33.00 Nm (24.26 ft*lbs) at 6000 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Power/Weight Ratio</strong></td>
			<td style="background-color:#efefef">0.14 Hp/Kg</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Top Speed</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Acceleration (dart, speedup) time</strong></td>
			<td style="background-color:#efefef">&nbsp;</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-100 km/h</strong></td>
			<td style="background-color:#efefef">11.1 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-60 mph</strong></td>
			<td style="background-color:#efefef">10.5 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>1/4 mile</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>60 to 140 km/h, highest gear</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
	</tbody>
</table>
</div>`,
  },
  {
    id: 'travel-by-motorcycle-honda-rebel-250cc',
    title: 'TRAVEL BY MOTORCYCLE HONDA REBEL 250cc',
    thumbnail: Rungsu1,
    date: '14.07.2015 09:09',
    excerpt:
      'The Honda Rebel 250 is the perfect bike for you if you prefer more of a cruiser style motorcycle instead of a sportbike – light, easy, and dependable.',
    content: [
      'A great beginner-friendly motorcycle with classic style and low seat height, ideal for city and highway cruising.',
    ],
    contentHtml: `<div class="DetailC" bis_skin_checked="1"><div style="text-align: justify;" bis_skin_checked="1">HONDA Rebel 250cc&nbsp;<br>
<br>
The Honda Rebel 250 is the perfect bike for you if you prefer more of a cruiser style motorcycle instead of a sportbike like the&nbsp;Kawasaki Ninja 250. It is light weight and very easy to handle, plus its relaxed riding position allows you to cruise around all day in comfort. The Honda rebel is powered by an air cooled 234cc V-twin engine, this engine has been around for decades and the engineers at honda have perfected every inch of it. Unfortunately since this engine design has been around, it may look a little bit dated, which can be a plus or a minus depending on your perspective.<br>
&nbsp;
<div class="flex justify-center gap-2" style="text-align: center; " bis_skin_checked="1"><img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/prd_42_IMG_3467.JPG" style="height:375px; width:500px"></div>

<div class="flex justify-center gap-2 pb-2" style="text-align: center;" bis_skin_checked="1"><img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/IMG_2170.JPG" style="height:375px; width:500px"></div>

<table border="0" cellpadding="0" cellspacing="2" style="width:100%">
	<tbody>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">TECHNICAL SPECIFICATION</th>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Model ID</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Manufacturer (Make)</strong></td>
			<td style="background-color:#efefef">Honda</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Model Name</strong></td>
			<td style="background-color:#efefef">Rebel 250 ED/Rebel 250 G</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Year</strong></td>
			<td style="background-color:#efefef">2008</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Category(class)</strong></td>
			<td style="background-color:#efefef">Cruiser / Chopper / Custom</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Engine</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Capacity (Displacement)</strong></td>
			<td style="background-color:#efefef">234 ccm (14.28 cubic inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Type</strong></td>
			<td style="background-color:#efefef">Twin</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Stroke</strong></td>
			<td style="background-color:#efefef">4</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Cooling System</strong></td>
			<td style="background-color:#efefef">Air</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Powertrain</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Gearbox</strong></td>
			<td style="background-color:#efefef">5 speed</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Chassis/Suspension/Brakes</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Brakes</strong></td>
			<td style="background-color:#efefef">Dual disc</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Brakes</strong></td>
			<td style="background-color:#efefef">Single disc</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Dimensions</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Seat Height</strong></td>
			<td style="background-color:#efefef">675 mm (26.57 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Dry Weight</strong></td>
			<td style="background-color:#efefef">141 kg (311 lb)</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Performance</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Power</strong></td>
			<td style="background-color:#efefef">17.00 HP (12.4 kW) at 8250 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Torque</strong></td>
			<td style="background-color:#efefef">18.00 Nm (13.24 ft*lbs) at 5500 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Power/Weight Ratio</strong></td>
			<td style="background-color:#efefef">0.11 Hp/Kg</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Top Speed</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Acceleration (dart, speedup) time</strong></td>
			<td style="background-color:#efefef">&nbsp;</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-100 km/h</strong></td>
			<td style="background-color:#efefef">13.9 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-60 mph</strong></td>
			<td style="background-color:#efefef">13.2 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>1/4 mile</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>60 to 140 km/h, highest gear</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
	</tbody>
</table>
</div>
</div>`,
  },
  {
    id: 'honda-sh-150cc',
    title: 'Motorbike Rental HONDA SH 150cc',
    thumbnail: Nhasan,
    date: '14.07.2015 09:03',
    excerpt: 'When it comes to choosing a scooter, the SH 150cc stands out for reliability and urban practicality.',
    content: [
      'Powerful for its class, with roomy storage and excellent fuel economy – perfect for city errands and short trips.',
    ],
    contentHtml: `<div class="TinDetailC" bis_skin_checked="1">
    <h1 style="padding-bottom: 10px;">Motorbike Rental HONDA SH 150cc</h1>
    <div class="DetailC" bis_skin_checked="1"><p style="text-align:left">HONDA SH 150cc&nbsp;</p>

<p style="text-align:left">When it comes to choosing a scooter, certain decisions must be made. First and foremost is to consider what you actually plan on doing with the scooter. Is it purely a commuter for short inner-city dashes? Or would you like the option of getting off the back streets and covering a few extra kilometres, perhaps with an occasional freeway jaunt?</p>

<p style="text-align:left">In some cases you might find yourself looking at two totally different scooters for these roles, and perhaps a maxi-scooter to cover the longer trips. Not so with the new Honda SH150i.&nbsp;&nbsp;</p>

<p class="flex justify-center items-center flex-wrap gap-2" style="text-align:center"><img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/prd_43_IMG_2189.jpg" style="height:375px; width:500px"><br>
</p>
<div class="text-center">
<em class="text-center">Easy rider &amp; Honda SH150i.</em>&nbsp;
</div>

<table border="0" cellpadding="0" cellspacing="2" style="width:100%">
	<tbody>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">TECHNICAL SPECIFICATION</th>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Model ID</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Manufacturer (Make)</strong></td>
			<td style="background-color:#efefef">Honda</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Model Name</strong></td>
			<td style="background-color:#efefef">SH 150i Sport</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Year</strong></td>
			<td style="background-color:#efefef">2008</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Category(class)</strong></td>
			<td style="background-color:#efefef">Scooter</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Engine</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Capacity (Displacement)</strong></td>
			<td style="background-color:#efefef">153 ccm (9.34 cubic inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Engine Type</strong></td>
			<td style="background-color:#efefef">Single cylinder</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Bore x Stroke</strong></td>
			<td style="background-color:#efefef">Ø58.0 mm x 57.8 mm (Ø2.28 inches x 2.28 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Bore/Stroke Ratio</strong></td>
			<td style="background-color:#efefef">1</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Compression Ratio</strong></td>
			<td style="background-color:#efefef">11.0:1</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Stroke</strong></td>
			<td style="background-color:#efefef">4</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Fuel System(Carburetion)</strong></td>
			<td style="background-color:#efefef">Injection. PGM-FI electronic fuel injection</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Ignition</strong></td>
			<td style="background-color:#efefef">Digital transistorised with electronic advance</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Starter System</strong></td>
			<td style="background-color:#efefef">Electric</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Cooling System</strong></td>
			<td style="background-color:#efefef">Liquid</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Powertrain</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Gearbox</strong></td>
			<td style="background-color:#efefef">4 speed</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Transmission (Final Drive)</strong></td>
			<td style="background-color:#efefef">Belt</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Chassis/Suspension/Brakes</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Suspension</strong></td>
			<td style="background-color:#efefef">33mm telescopic fork, 90mm axle travel</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Suspension</strong></td>
			<td style="background-color:#efefef">Dual damper unit swingarm, 82mm axle travel</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Brakes</strong></td>
			<td style="background-color:#efefef">Single disc</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Front Brakes Diameter</strong></td>
			<td style="background-color:#efefef">Ø220 mm (Ø8.66 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Brakes</strong></td>
			<td style="background-color:#efefef">Expanding brake (drum brake)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Rear Brakes Diameter</strong></td>
			<td style="background-color:#efefef">Ø130 mm (Ø5.12 inches)</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Dimensions</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Overall Length</strong></td>
			<td style="background-color:#efefef">2020 mm (79.53 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Overall Width</strong></td>
			<td style="background-color:#efefef">700 mm (27.56 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Seat Height</strong></td>
			<td style="background-color:#efefef">790 mm (31.1 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Wheelbase</strong></td>
			<td style="background-color:#efefef">1335 mm (52.56 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Ground Clearance</strong></td>
			<td style="background-color:#efefef">149 mm (5.87 inches)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Dry Weight</strong></td>
			<td style="background-color:#efefef">127.0 kg (280 lb)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Curb Weight</strong></td>
			<td style="background-color:#efefef">133.9 kg (295 lb)</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Fuel Capacity</strong></td>
			<td style="background-color:#efefef">7.50 litres (1.98 gallons)</td>
		</tr>
		<tr>
			<th colspan="2" style="background-color:#d8d6d5">Performance</th>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Power</strong></td>
			<td style="background-color:#efefef">15.55 HP (11.4 kW) at 8500 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Max Torque</strong></td>
			<td style="background-color:#efefef">14.00 Nm (10.29 ft*lbs) at 7000 RPM</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Power/Weight Ratio</strong></td>
			<td style="background-color:#efefef">0.12 Hp/Kg</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Top Speed</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>Acceleration (dart, speedup) time</strong></td>
			<td style="background-color:#efefef">&nbsp;</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-100 km/h</strong></td>
			<td style="background-color:#efefef">13 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>0-60 mph</strong></td>
			<td style="background-color:#efefef">12.3 seconds</td>
		</tr>
		<tr>
			<td style="background-color:#efefef">
			<div bis_skin_checked="1"><strong>1/4 mile</strong></div>
			</td>
			<td style="background-color:#efefef">-</td>
		</tr>
		<tr>
			<td style="background-color:#efefef"><strong>60 to 140 km/h, highest gear</strong></td>
			<td style="background-color:#efefef">-</td>
		</tr>
	</tbody>
</table>
</div>    
<div class="detailspmxh" bis_skin_checked="1">    
    <div id="fb-root" bis_skin_checked="1"></div>
    <div class="fb-like fb_iframe_widget" data-href="https://www.danangmotorbiketours.com:443/news/motorbike-rental-honda-sh-150cc-99.html" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true" fb-xfbml-state="rendered" fb-iframe-plugin-query="action=like&amp;app_id=377657819060938&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fmotorbike-rental-honda-sh-150cc-99.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false" bis_skin_checked="1"><span style="vertical-align: bottom; width: 150px; height: 28px;"><iframe name="f82e26f5b6b5326a2" width="1000px" height="1000px" data-testid="fb:like Facebook Social Plugin" title="fb:like Facebook Social Plugin" frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no" allow="encrypted-media" src="https://www.facebook.com/v2.2/plugins/like.php?action=like&amp;app_id=377657819060938&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Dfd6d5bff99c6791b1%26domain%3Dwww.danangmotorbiketours.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fwww.danangmotorbiketours.com%252Ffde9aac18a1e5cbf0%26relation%3Dparent.parent&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fmotorbike-rental-honda-sh-150cc-99.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false" style="border: none; visibility: visible; width: 150px; height: 28px;" class=""></iframe></span></div>
    <div id="___plusone_0" bis_skin_checked="1" style="position: absolute; width: 450px; left: -10000px;"><iframe ng-non-bindable="" frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position:absolute;top:-10000px;width:450px;margin:0px;border-style:none" tabindex="0" vspace="0" width="100%" id="I0_1762344797687" name="I0_1762344797687" src="https://apis.google.com/u/0/se/0/_/+1/fastbutton?usegapi=1&amp;size=medium&amp;origin=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;url=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fmotorbike-rental-honda-sh-150cc-99.html&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fabc-static%2F_%2Fjs%2Fk%3Dgapi.lb.vi.dfUoPKVtW8k.O%2Fd%3D1%2Frs%3DAHpOoo-EelOTsT5jA9beOCHKm2TW7kNNcQ%2Fm%3D__features__#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1762344797687&amp;_gfid=I0_1762344797687&amp;parent=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;pfname=&amp;rpctoken=10064775" data-gapiattached="true"></iframe></div><div class="g-plusone" data-size="medium" data-gapiscan="true" data-onload="true" data-gapistub="true" bis_skin_checked="1"></div>
</div>    </div>`,
  },
  {
    id: 'exploration-of-vietnam-by-motorbike',
    title: 'A real exploration of Vietnam by motorbike',
    thumbnail: Rungsu2,
    date: '07.07.2015 08:55',
    excerpt:
      'A spontaneous change of itinerary turned into a months‑long journey, discovering Vietnam from north to south by two wheels.',
    content: ['From mountain passes to riverside towns, a motorbike opens up Vietnam in the most intimate way.'],
    contentHtml: `<div class="TinDetailC" bis_skin_checked="1">
    <h1 style="padding-bottom: 10px;">A real exploration of Vietnam by motorbike</h1>
    <div class="DetailC" bis_skin_checked="1"><strong>I was meant to travel Vietnam a lot earlier, right after my Cambodia trip, but a rather spontaneous change of my itinerary forced me to postpone this adventure by more than three months.<br>
<a class="flex justify-center pt-2" href="http://thanghanoi.com/tin-tuc/ban-dat-duong-an-thuong-31-26.html" bis_size="{&quot;x&quot;:316,&quot;y&quot;:1284,&quot;w&quot;:690,&quot;h&quot;:19,&quot;abs_x&quot;:316,&quot;abs_y&quot;:1284}"><img alt="" src="https://www.danangmotorbiketours.com/uploads/image/images/ha-giang-motorbike-trip-escapology-eu-12.jpg" bis_size="{&quot;x&quot;:316,&quot;y&quot;:783,&quot;w&quot;:690,&quot;h&quot;:511,&quot;abs_x&quot;:316,&quot;abs_y&quot;:783}" bis_id="bn_jli6v26xffa8zy9wo0groc"></a></strong><br>
Having finally booked my ticket to Hanoi and a rough outline of places to visit in my head, I wasn’t quite sure what to expect. A good amount of fellow travelers told me a lot of good things about the country. Others said that they didn’t like the people and their attitude and that the country has already become too touristy. By that time I had already been to 7 other countries and I was worried that Vietnam would just not be able to fascinate me anymore. Luckily I was very wrong and it turned out to be a great trip, with all kinds of different adventures, beautiful places and memorable encounters with the locals.<br>
<br>
For many, arriving in&nbsp;Hanoi&nbsp;is sort of a huge culture shock. It is loud, it is busy and it can be quiet dirty at times. I wasn’t too overwhelmed and actually got to like it pretty much right away. It’s a very dynamic city, the street food is marvelous and, contrary to what I have heard before, I found the locals very friendly. What I found very striking and what accompanied me as we traveled across the country was Vietnam’s ambivalent relation to the past and present. On the one hand the country’s history plays a very important role and sometimes seems to even dominate its society. The colonial times, the Vietnam War but also all of the ancient history – in an abstract way it is something that is ever-present wherever you go. On the other hand you will see a country that is on the move, values change, a new middle-class is emerging and the young people want to advance, leave things behind and move forward. In Hanoi this interesting mix became most evident.<br>
<br>
So what about the tourism in Vietnam? It is said that Vietnam is the touristiestSoutheast Asian&nbsp;country just after&nbsp;Thailand. It is true that these days the country gets a huge influx of tourists of all kinds – backpackers as well as all inclusive tours from Europe, the US and China. But there are still ways to dodge the crowds. Our&nbsp;motorbike trip&nbsp;across the mountains of&nbsp;Ha Giang&nbsp;was a perfect example for this. It is a bit out of the way, it takes some time, it might be inconvenient for some but for us the adventure we got in exchange was more than rewarding. Beautiful scenery, authentic hill tribes and yet not a lot of tourists made it one of the best trips of my entire journey.<br>
<br>
At the same time, things can become very touristy. Good examples would be the tours of&nbsp;Halong Bay&nbsp;(which I did but did not even cover here), in my opinion one of the most overrated things ever, the still picturesque&nbsp;Hoi An&nbsp;and beach getaways like&nbsp;Nha Trang. I guess it depends what you are after and how you define a great holiday. The good thing about Vietnam is, that it offers a little bit of everything.<br>
<br>
One thing is for sure though; Vietnam is the perfect country to be explored bymotorbike. As most of you might know by now, it is my preferred type of transport anyhow. But Vietnam offers a great variety of exciting and interesting&nbsp;motorbike tours. At first my plan was to buy a bike in Hanoi and then drive down all the way toSaigon&nbsp;to sell it. But I soon realized that, in order to travel without time pressure, this endeavor would take more than a month. Some people do it in 2-3 weeks but I think besides the riding and a severe butt pain at the end, a trip like that wouldn’t be that enjoyable. I opted for renting here and there, either for day trips or extended road trips. Looking back at it, this was the best decision and enabled us to make the most out of the 4 weeks we had. I can recommend doing the Ha Giang loop in the North, going from&nbsp;Hue&nbsp;to&nbsp;Hoi An&nbsp;and via&nbsp;Danang&nbsp;and day tours in&nbsp;Dalat&nbsp;or the&nbsp;Mekong Delta. Every one of these trips was worth it and with an average price of about 5-7 USD per day for a bike, it’s affordable as well.<br>
<br>
I was positively surprised by the Vietnamese people as I heard a few bad stories before. Everyone was friendly and helpful and we had some great encounters with the locals. They can be very straight forward and they do let it show if they are not content with something. But once you learn how to interpret this, everything is fine. What I found frustrating at times was the fact that you had to haggle for literally everything. Transport, goods and sometimes even a bottle of water. To a certain degree this can be found in all of Southeast Asia and it’s normal but here it was a little too much. It seemed like people perceive Western tourists as moneybags and always try to extract the biggest amount of money as possible. As I later learned, this as well has its roots in former governmental policies and is only slowly changing. At the end of my trip the constant haggling and the abstract feeling of being overcharged just became very tiring.<br>
<br>
I finished my journey in the&nbsp;Mekong Delta&nbsp;which somehow felt like coming home or the end of an important part of my trip. I had followed this “Mother of Waters” all the way down from Thailand, through Laos and Cambodia before making it here, where the stream empties into the South China Sea. The river had accompanied me for a long time and it made for some great memories along its banks. As different as the countries are the Mekong flows through, as different are the many faces of the river itself. From a slow and lazy stream to wild and roaring waterfalls and finally branching out into a network of small distributaries – the Mekong represents the many facets of South East Asia and I am sure that one day I will explore its origins in China and Tibet.</div>
    
<div class="detailspmxh" bis_skin_checked="1">    
    <div id="fb-root" bis_skin_checked="1"></div>
    <div class="fb-like fb_iframe_widget" data-href="https://www.danangmotorbiketours.com:443/news/a-real-exploration-of-vietnam-by-motorbike-26.html" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true" bis_skin_checked="1" fb-xfbml-state="rendered" fb-iframe-plugin-query="action=like&amp;app_id=377657819060938&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fa-real-exploration-of-vietnam-by-motorbike-26.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false"><span style="vertical-align: bottom; width: 150px; height: 28px;"><iframe name="fe43cee8e54ecdcb8" width="1000px" height="1000px" data-testid="fb:like Facebook Social Plugin" title="fb:like Facebook Social Plugin" frameborder="0" allowtransparency="true" allowfullscreen="true" scrolling="no" allow="encrypted-media" src="https://www.facebook.com/v2.2/plugins/like.php?action=like&amp;app_id=377657819060938&amp;channel=https%3A%2F%2Fstaticxx.facebook.com%2Fx%2Fconnect%2Fxd_arbiter%2F%3Fversion%3D46%23cb%3Df7fc0d12cf6bae1c8%26domain%3Dwww.danangmotorbiketours.com%26is_canvas%3Dfalse%26origin%3Dhttps%253A%252F%252Fwww.danangmotorbiketours.com%252Ff53a880e017578600%26relation%3Dparent.parent&amp;container_width=0&amp;href=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fa-real-exploration-of-vietnam-by-motorbike-26.html&amp;layout=button_count&amp;locale=en_US&amp;sdk=joey&amp;share=true&amp;show_faces=false" style="border: none; visibility: visible; width: 150px; height: 28px;" class=""></iframe></span></div>
    <div id="___plusone_0" bis_skin_checked="1" style="position: absolute; width: 450px; left: -10000px;"><iframe ng-non-bindable="" frameborder="0" hspace="0" marginheight="0" marginwidth="0" scrolling="no" style="position:absolute;top:-10000px;width:450px;margin:0px;border-style:none" tabindex="0" vspace="0" width="100%" id="I0_1762344944902" name="I0_1762344944902" src="https://apis.google.com/u/0/se/0/_/+1/fastbutton?usegapi=1&amp;size=medium&amp;origin=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;url=https%3A%2F%2Fwww.danangmotorbiketours.com%2Fnews%2Fa-real-exploration-of-vietnam-by-motorbike-26.html&amp;gsrc=3p&amp;ic=1&amp;jsh=m%3B%2F_%2Fscs%2Fabc-static%2F_%2Fjs%2Fk%3Dgapi.lb.vi.dfUoPKVtW8k.O%2Fd%3D1%2Frs%3DAHpOoo-EelOTsT5jA9beOCHKm2TW7kNNcQ%2Fm%3D__features__#_methods=onPlusOne%2C_ready%2C_close%2C_open%2C_resizeMe%2C_renderstart%2Concircled%2Cdrefresh%2Cerefresh%2Conload&amp;id=I0_1762344944902&amp;_gfid=I0_1762344944902&amp;parent=https%3A%2F%2Fwww.danangmotorbiketours.com&amp;pfname=&amp;rpctoken=11839302" data-gapiattached="true"></iframe></div><div class="g-plusone" data-size="medium" data-gapiscan="true" data-onload="true" data-gapistub="true" bis_skin_checked="1"></div>
</div>    </div>`,
  },
];

// Mock tours and prices used by Tour pages
export type Tour = {
  id: string;
  title: string;
  duration: string; // e.g. "5 days and 4 nights"
  routes: string;
  type: string;
  priceUsd?: number | string; // undefined means "Call"
  thumbnail: string;
  departFrom: string; // e.g. "Sai Gon"
};

export const tours: Tour[] = [
  {
    id: 'sm6-sg-hcmc-central-highland-mui-ne',
    title: 'TOUR SM6: SAI GON - HO CHI MINH TRAIL - CENTRAL HIGHLAND - MUI NE',
    duration: '5 days and 4 nights',
    routes: 'Dai Ninh mountain pass, Hw 27, Hw 14 (Ho Chi Minh trail)',
    type: 'saigon motorbikes, saigon motorbike tours, easy rider saigon',
    priceUsd: 450,
    thumbnail: Mytho2,
    departFrom: 'Sai Gon',
  },
  {
    id: 'sm4-sg-hcmc-central-highland-nha-trang',
    title: 'TOUR SM4: SAI GON - HO CHI MINH TRAIL - CENTRAL HIGHLAND - NHA TRANG',
    duration: '4 days and 3 nights',
    routes: 'Hw 26, Hw 27, Hw 14 (HCM trail)',
    type: 'Saigon motorbikes, saigon motorbike tours, easy rider saigon',
    priceUsd: 380,
    thumbnail: Rungsu1,
    departFrom: 'Sai Gon',
  },
  {
    id: 'srg3-sg-mekong-delta-rach-gia',
    title: 'TOUR SRG3: SAI GON - MEKONG DELTA - RACH GIA',
    duration: '3 days and 2 nights',
    routes: 'Sai Gon - Ben Tre - Can Tho - Rach Gia',
    type: 'Saigon motorbikes/ motorbike tours, easy rider saigon',
    priceUsd: 290,
    thumbnail: Mytho1,
    departFrom: 'Sai Gon',
  },
  {
    id: 'shn14-sg-central-highland-hcmc-trail-ha-noi',
    title: 'TOUR SHN14: SAI GON - CENTRAL HIGHLAND - HO CHI MINH TRAIL - HA NOI',
    duration: '14 days and 13 nights',
    routes:
      'Sai Gon - Dong Xoai - Dakmil - Lak lake - Pleiku - Kon Tum - Kham Duc - Hoi An - Hue - DMZ - Phong Nha cave - Nghe An - Thanh Hoa - Hoa Binh - Ha Noi',
    type: 'Saigon motorbikes/ motorbike tours, easy rider saigon',
    priceUsd: 1500,
    thumbnail: Rungsu3,
    departFrom: 'Sai Gon',
  },
  {
    id: 'mn2-mui-ne-sand-dunes-phan-thiet',
    title: 'TOUR MN2: MUI NE - RED & WHITE SAND DUNES - PHAN THIET',
    duration: '2 days and 1 night',
    routes: 'Mui Ne - Red Sand Dunes - White Sand Dunes - Phan Thiet - Mui Ne',
    type: 'Mui Ne day trips, sand dunes, coastal ride',
    priceUsd: 150,
    thumbnail: Mytho3,
    departFrom: 'Mui Ne',
  },
  {
    id: 'dn1-da-nang-city-tour',
    title: 'TOUR DN1: DA NANG CITY DISCOVERY',
    duration: '1 day',
    routes: 'Marble Mountains - Son Tra Peninsula - Dragon Bridge',
    type: 'City tour, sightseeing',
    priceUsd: 65,
    thumbnail: Hotel1,
    departFrom: 'Da Nang',
  },
  {
    id: 'dn3-da-nang-hue-hoi-an',
    title: 'TOUR DN3: HERITAGE ROAD DA NANG - HUE - HOI AN',
    duration: '3 days and 2 nights',
    routes: 'Da Nang - Hai Van Pass - Hue - Hoi An',
    type: 'Heritage tour, coastal ride',
    priceUsd: 320,
    thumbnail: Cungdinhhue,
    departFrom: 'Da Nang',
  },
  {
    id: 'ha1-hoi-an-countryside',
    title: 'TOUR HA1: HOI AN COUNTRYSIDE EXPERIENCE',
    duration: '1 day',
    routes: 'Hoi An - Tra Que Village - Cam Thanh Coconut Forest',
    type: 'Eco tour, culture',
    priceUsd: 55,
    thumbnail: Lehoi,
    departFrom: 'Hoi An',
  },
  {
    id: 'ha2-hoi-an-my-son',
    title: 'TOUR HA2: HOI AN - MY SON SANCTUARY',
    duration: '1 day',
    routes: 'Hoi An - My Son - Hoi An',
    type: 'History, culture',
    priceUsd: 70,
    thumbnail: Myson,
    departFrom: 'Hoi An',
  },
  {
    id: 'dl2-da-lat-waterfalls',
    title: 'TOUR DL2: DA LAT WATERFALLS ADVENTURE',
    duration: '2 days and 1 night',
    routes: 'Da Lat - Elephant Waterfall - Pongour Waterfall',
    type: 'Nature, adventure',
    priceUsd: 180,
    thumbnail: Suoivoi,
    departFrom: 'Da Lat',
  },
  {
    id: 'dl3-da-lat-nha-trang',
    title: 'TOUR DL3: DA LAT TO NHA TRANG COASTAL RIDE',
    duration: '3 days and 2 nights',
    routes: 'Da Lat - Khanh Vinh Pass - Nha Trang',
    type: 'Mountain pass, coastal',
    priceUsd: 250,
    thumbnail: Taynguyen,
    departFrom: 'Da Lat',
  },
  {
    id: 'hn1-ha-noi-city-food',
    title: 'TOUR HN1: HA NOI CITY & STREET FOOD',
    duration: '1 day',
    routes: 'Old Quarter - Ho Chi Minh Mausoleum - West Lake',
    type: 'City tour, food tour',
    priceUsd: 60,
    thumbnail: Baotang,
    departFrom: 'Ha Noi',
  },
  {
    id: 'hn3-ha-noi-mai-chau',
    title: 'TOUR HN3: HA NOI - MAI CHAU VALLEY',
    duration: '2 days and 1 night',
    routes: 'Ha Noi - Hoa Binh - Mai Chau',
    type: 'Valley, homestay, culture',
    priceUsd: 190,
    thumbnail: Nhasan,
    departFrom: 'Ha Noi',
  },
  {
    id: 'hg4-ha-giang-loop',
    title: 'TOUR HG4: HA GIANG LOOP ADVENTURE',
    duration: '4 days and 3 nights',
    routes: 'Ha Giang - Dong Van - Meo Vac - Ma Pi Leng Pass',
    type: 'Adventure, mountain pass, scenery',
    priceUsd: 420,
    thumbnail: Thapco,
    departFrom: 'Ha Giang',
  },
  {
    id: 'sp3-sapa-trekking-homestay',
    title: 'TOUR SP3: SAPA TREKKING & HOMESTAY',
    duration: '3 days and 2 nights',
    routes: 'Sapa - Cat Cat - Lao Chai - Ta Van',
    type: 'Trekking, culture, homestay',
    priceUsd: 280,
    thumbnail: Taynguyen,
    departFrom: 'Sapa',
  },
  {
    id: 'nb2-ninh-binh-trang-an',
    title: 'TOUR NB2: NINH BINH - TRANG AN - BAI DINH',
    duration: '2 days and 1 night',
    routes: 'Ninh Binh - Trang An - Bai Dinh Pagoda',
    type: 'Nature, culture, boat trip',
    priceUsd: 160,
    thumbnail: Dithuyen,
    departFrom: 'Ha Noi',
  },
  {
    id: 'pq3-phu-quoc-island-explorer',
    title: 'TOUR PQ3: PHU QUOC ISLAND EXPLORER',
    duration: '3 days and 2 nights',
    routes: 'Duong Dong - An Thoi - Bai Sao - Ham Ninh',
    type: 'Island, beach, relaxation',
    priceUsd: 350,
    thumbnail: Hotel2,
    departFrom: 'Phu Quoc',
  },
  {
    id: 'ct2-can-tho-floating-market',
    title: 'TOUR CT2: CAN THO - CAI RANG FLOATING MARKET',
    duration: '2 days and 1 night',
    routes: 'Sai Gon - Can Tho - Cai Rang',
    type: 'Culture, river life',
    priceUsd: 140,
    thumbnail: Mytho2,
    departFrom: 'Sai Gon',
  },
  {
    id: 'vt1-vung-tau-beach-escape',
    title: 'TOUR VT1: VUNG TAU BEACH ESCAPE',
    duration: '1 day',
    routes: 'Sai Gon - Vung Tau - Sai Gon',
    type: 'Beach, short trip',
    priceUsd: 80,
    thumbnail: Hotel3,
    departFrom: 'Sai Gon',
  },
  {
    id: 'cc1-cu-chi-tunnels-half-day',
    title: 'TOUR CC1: CU CHI TUNNELS HISTORY',
    duration: '1/2 day',
    routes: 'Sai Gon - Cu Chi - Sai Gon',
    type: 'History, war remnants',
    priceUsd: 45,
    thumbnail: Cuchi,
    departFrom: 'Sai Gon',
  },
];
