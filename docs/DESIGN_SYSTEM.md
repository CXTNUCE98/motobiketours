# Design system — ANDAGO

Phong cách tạp chí du lịch: nhiều khoảng trắng, tiêu đề serif lớn (in nghiêng để nhấn), ảnh thật làm chủ đạo,
không icon/số liệu trang trí, đường kẻ mảnh thay cho khung/bóng đổ.

## 1. Biến global — sửa một chỗ

| File | Vai trò |
| --- | --- |
| `src/assets/css/tokens.css` | **Nguồn duy nhất**: màu (light + dark), font, cỡ chữ, khoảng cách, bo góc, bóng, chuyển động |
| `src/assets/css/base.css` | Style gốc + primitive dùng chung (`.shell`, `.ui-control`, `.visually-hidden`) + trỏ biến Element Plus về token |
| `uno.config.ts` | Utility UnoCSS trỏ về token: `text-ink`, `text-muted`, `bg-page`, `bg-subtle`, `bg-surface`, `border-line`, `text-accent`, `bg-accent`, `font-serif`, `rounded-md`… |

Quy tắc:

- **Không viết mã màu** (`#fff`, `rgb()`, `bg-blue-500`, `text-gray-700`…) trong component. Dùng `var(--color-*)`.
- **Không viết `dark:`**. Dark mode đổi màu tự động qua token (`:root.dark` trong `tokens.css`).
- Cỡ chữ dùng `var(--text-*)`, khoảng cách `var(--space-*)`, bo góc `var(--radius-*)`, transition `var(--transition-*)`.
- Element Plus (dialog, message, select, date picker…) đã nhận màu từ token, không cần ghi đè thủ công.

### Token hay dùng

| Nhóm | Token |
| --- | --- |
| Nền | `--color-bg` (trang), `--color-bg-subtle` (section xen kẽ, khung ảnh chờ), `--color-surface` (thẻ, input, popover) |
| Chữ | `--color-text`, `--color-text-muted` |
| Đường kẻ | `--color-border` (mảnh), `--color-border-strong` (kẻ đậm dưới tiêu đề/toolbar) |
| Nhấn | `--color-accent`, `--color-accent-hover`, `--color-on-accent` |
| Trạng thái | `--color-danger`, `--color-success`, `--color-warning` |
| Section tối | `--color-inverse-bg`, `--color-inverse-text`, `--color-inverse-muted`, `--color-inverse-border`, `--color-inverse-accent` |
| Lớp phủ | `--color-scrim` (gradient dưới chữ trên ảnh), `--color-backdrop` (nền sau dialog) |
| Font | `--font-serif` (Newsreader — tiêu đề, số, tên), `--font-sans` (Be Vietnam Pro — nội dung) |
| Cỡ chữ | `--text-xs` (nhãn viết hoa) · `--text-sm` (meta) · `--text-ui` (menu, nút) · `--text-base` · `--text-lead` · `--text-title` (tiêu đề thẻ) · `--text-title-lg` · `--text-h3` · `--text-h2` (tiêu đề section) · `--text-display` (tiêu đề trang) |
| Chữ khác | `--leading-*`, `--tracking-label` (nhãn viết hoa), `--tracking-tight` (tiêu đề), `--weight-*` |
| Khoảng cách | `--space-1…12`, `--space-fluid-sm/md/lg/xl`, `--space-block`, `--section-space`, `--gutter` |
| Bố cục | `--content-max`, `--header-height` (dùng cho `position: sticky; top: calc(var(--header-height) + …)`) |
| Khác | `--radius-sm/md/lg/pill`, `--shadow-popover` (chỉ cho lớp nổi), `--focus-ring`, `--transition-fast/base/slow` |

## 2. Component dùng chung (`src/components/ui/`, tự import)

| Component | Dùng cho |
| --- | --- |
| `<UiPageHero eyebrow title emphasis intro size="lg|xl">` | Phần đầu mỗi trang. Slot `#actions` (nút), slot mặc định (ảnh, ô tìm kiếm…) |
| `<UiSectionHeading eyebrow title emphasis lead :level>` | Tiêu đề section. `emphasis` = cụm in nghiêng màu nhấn |
| `<UiEyebrow>` | Nhãn nhỏ viết hoa + gạch ngang màu nhấn |
| `<UiEmphasis :text match>` | In nghiêng một cụm trong chuỗi dịch (vd. "ANDAGO") |
| `<UiButton variant="accent|outline|ink|ghost" size="md|sm" :to :href block>` | Mọi nút. `to` → NuxtLink, `href` → `<a>`, còn lại `<button>` |
| `<UiChip :active>` | Nút lọc dạng viên thuốc |
| `<UiField label error v-slot="{ id, describedBy, invalid }">` | Nhãn + ô nhập + lỗi; gắn `class="ui-control"` cho input/select/textarea |
| `<UiPagination :page :total-pages @update:page>` | Phân trang |
| `<UiEmptyState title description>` | Trạng thái rỗng (slot cho nút) |
| `<UiSkeletonCard ratio>` | Khung chờ khi tải |

Component nội dung: `ArticleCard` (tin tức/blog, variant `card|feature`), `tour/TourListingCard` (tour dạng lưới/danh sách),
`NewsletterSignup`, `TourFilter`, `SearchableSelect`. Thông tin liên hệ: `src/constants/contact.ts`.

## 3. Mẫu bố cục

- Khung nội dung: `<div class="shell">`.
- Lưới responsive: `grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr))` — không đặt width cố định.
  Danh sách kết quả có thể ít phần tử thì dùng `auto-fill` để thẻ không giãn quá to.
- Section: `padding-block: var(--section-space)`. Section nền tối: `background: var(--color-inverse-bg)` +
  `--em-color: var(--color-inverse-accent)` để phần in nghiêng đổi màu theo.
- Thẻ: ảnh bo `--radius-md` (tỉ lệ 4:3 hoặc 3:2), dưới ảnh là nhãn nhỏ màu nhấn, tiêu đề serif, mô tả `--color-text-muted`.
  Không khung, không bóng; ngăn cách bằng `1px solid var(--color-border)`.
- Thẻ bấm được: dùng "link trải rộng" (`.card__link::after { position:absolute; inset:0 }`), nút phụ đặt
  `position: relative; z-index: 1` — không lồng nút trong `<a>`.
- Chữ trên ảnh: gradient `var(--color-scrim)` ở đáy ảnh, chữ `var(--color-inverse-text)`.
- Danh sách thông tin (lịch trình, giá, liên hệ): `<dl>` với nhãn `--text-xs` viết hoa, giá trị serif, ngăn bằng đường kẻ.
- Dialog/bottom sheet: nền `--color-surface`, backdrop `--color-backdrop`, tiêu đề serif, nút đóng là chữ "Đóng".
- Focus: `outline: var(--focus-ring); outline-offset: 2px–3px` cho mọi phần tử tương tác.

## 4. Không dùng

Gradient trang trí, glow, `shadow-lg/2xl`, `hover:scale-105`, `animate-ping/bounce/pulse`, sóng SVG, badge nhấp nháy,
số liệu trang trí ("50k+ người đọc"), icon trang trí cạnh mỗi dòng chữ. Icon chỉ giữ khi có chức năng mà chữ không
thay được (play video, phóng to bản đồ…) và phải có `aria-label`.

## 5. i18n

Chuỗi hiển thị đặt trong `i18n/locales/{vi,en}.json`. Nhãn menu `nav.*` viết hoa trong i18n nhưng hiển thị dạng câu nhờ CSS
(`text-transform: lowercase` + `::first-letter { text-transform: uppercase }`).
