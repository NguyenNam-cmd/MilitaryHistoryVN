-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 07, 2026 lúc 05:56 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `militaryhistoryvn`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `adminlogs`
--

CREATE TABLE `adminlogs` (
  `id` int(11) NOT NULL,
  `type` int(10) NOT NULL,
  `action` int(10) NOT NULL,
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `adminlogs`
--

INSERT INTO `adminlogs` (`id`, `type`, `action`, `item_id`, `item_name`, `created_at`) VALUES
(48, 1, 2, 2, '321321', '2026-04-02 22:43:16'),
(49, 1, 3, 2, '321321', '2026-04-02 22:43:38'),
(50, 1, 3, 1, '102', '2026-04-02 22:43:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `battlefields`
--

CREATE TABLE `battlefields` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `youtube_url` varchar(500) NOT NULL,
  `video_id` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `battlefields`
--

INSERT INTO `battlefields` (`id`, `title`, `youtube_url`, `video_id`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 'dien bien phu', 'https://www.youtube.com/watch?v=jy7Z3oYOp7w', 'jy7Z3oYOp7w', 'fvfd', NULL, '2026-04-07 02:51:05', '2026-04-07 02:51:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `battlefield_images`
--

CREATE TABLE `battlefield_images` (
  `id` int(11) NOT NULL,
  `battlefield_id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `upload_order` int(11) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `battlefield_images`
--

INSERT INTO `battlefield_images` (`id`, `battlefield_id`, `image_url`, `filename`, `upload_order`, `created_at`) VALUES
(6, 2, '/uploads/battlefields/1775530265914-891722447.jpg', '1775530265914-891722447.jpg', 1, '2026-04-07 02:51:05'),
(7, 2, '/uploads/battlefields/1775530265940-242180932.jpg', '1775530265940-242180932.jpg', 2, '2026-04-07 02:51:05'),
(8, 2, '/uploads/battlefields/1775530265941-469686226.jpg', '1775530265941-469686226.jpg', 3, '2026-04-07 02:51:05'),
(9, 2, '/uploads/battlefields/1775530265942-968872039.jpg', '1775530265942-968872039.jpg', 4, '2026-04-07 02:51:05');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `historicalfigurecontents`
--

CREATE TABLE `historicalfigurecontents` (
  `id` int(11) NOT NULL,
  `figure_id` int(11) NOT NULL,
  `lang` enum('vi','en') NOT NULL,
  `bio` text NOT NULL,
  `contributions` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `historicalfigurecontents`
--

INSERT INTO `historicalfigurecontents` (`id`, `figure_id`, `lang`, `bio`, `contributions`) VALUES
(1, 1, 'vi', 'Hồ Chí Minh (1890-1969), tên thật là Nguyễn Sinh Cung, là lãnh tụ vĩ đại của dân tộc Việt Nam, người sáng lập Đảng Cộng sản Việt Nam và nước Việt Nam Dân chủ Cộng hòa. Ông là nhà cách mạng, nhà văn hóa lớn, người đã dành cả cuộc đời cho sự nghiệp giải phóng dân tộc và xây dựng đất nước.', 'Chủ tịch Hồ Chí Minh lãnh đạo cách mạng Tháng Tám thành công, khai sinh nước Việt Nam Dân chủ Cộng hòa năm 1945. Ông là người đặt nền móng cho đường lối kháng chiến chống Pháp và chống Mỹ, là biểu tượng của tinh thần yêu nước và độc lập dân tộc.'),
(2, 1, 'en', 'Ho Chi Minh (1890-1969), real name Nguyen Sinh Cung, was the great leader of the Vietnamese nation, founder of the Communist Party of Vietnam and the Democratic Republic of Vietnam. He was a revolutionary, great cultural figure, who dedicated his life to the cause of national liberation and country building.', 'President Ho Chi Minh led the successful August Revolution, founding the Democratic Republic of Vietnam in 1945. He laid the foundation for the resistance policy against France and America, becoming the symbol of patriotism and national independence.'),
(3, 2, 'vi', 'Đại tướng Võ Nguyên Giáp (1911-2013) là vị tướng tài ba của Quân đội Nhân dân Việt Nam, người được mệnh danh là \"Napoleon đỏ\". Ông là Tổng Tư lệnh Quân đội Nhân dân Việt Nam trong các cuộc kháng chiến chống Pháp và chống Mỹ.', 'Đại tướng Võ Nguyên Giáp chỉ huy Chiến dịch Điện Biên Phủ (1954) và Chiến dịch Hồ Chí Minh (1975), góp phần quan trọng vào hai chiến thắng lịch sử của dân tộc Việt Nam.'),
(4, 2, 'en', 'General Vo Nguyen Giap (1911-2013) was the brilliant general of the Vietnam People\'s Army, known as the \"Red Napoleon\". He was the Commander-in-Chief of the Vietnam People\'s Army during the resistance wars against France and America.', 'General Vo Nguyen Giap commanded the Dien Bien Phu Campaign (1954) and the Ho Chi Minh Campaign (1975), making significant contributions to two historic victories of the Vietnamese nation.'),
(5, 19, 'vi', 'vfdvdvsdv', 'vfdvd'),
(6, 19, 'en', 'fdvfd', 'vdfvfd1mhj'),
(7, 18, 'vi', 'vsdvđvds', 'vfdvdf'),
(8, 18, 'en', 'sdvdfvd', 'vdfvd');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `historicalfigures`
--

CREATE TABLE `historicalfigures` (
  `id` int(11) NOT NULL,
  `full_name_vi` varchar(500) NOT NULL,
  `full_name_en` varchar(500) NOT NULL,
  `birth_year` int(11) DEFAULT NULL,
  `death_year` int(11) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `historicalfigures`
--

INSERT INTO `historicalfigures` (`id`, `full_name_vi`, `full_name_en`, `birth_year`, `death_year`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Hồ Chí Minh', 'Ho Chi Minh', 1890, 1969, '/uploads/hochiminh.jpg', '2026-03-04 19:53:01', '2026-03-04 19:53:01'),
(2, 'Võ Nguyên Giáp', 'Vo Nguyen Giap', 1911, 2012, '/uploads/vonguyengiap.jpg', '2026-03-04 19:53:01', '2026-03-31 19:10:36'),
(18, 'Trần Quốc Tuan', 'Tran Quoc Tuan', 1555, 1666, NULL, '2026-03-31 19:14:25', '2026-03-31 19:14:25'),
(19, 'Nguyen DInh CHinh', 'NDC', 2002, 2100, NULL, '2026-03-31 19:24:02', '2026-04-02 15:42:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `historyperiods`
--

CREATE TABLE `historyperiods` (
  `id` int(11) NOT NULL,
  `period_name_vi` varchar(500) NOT NULL,
  `period_name_en` varchar(500) NOT NULL,
  `start_year` int(11) NOT NULL,
  `end_year` int(11) DEFAULT NULL,
  `content_vi` text NOT NULL,
  `content_en` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `historyperiods`
--

INSERT INTO `historyperiods` (`id`, `period_name_vi`, `period_name_en`, `start_year`, `end_year`, `content_vi`, `content_en`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'Kháng chiến chống Pháp (1945-1954)', 'Resistance against France (1945-1954)', 19466, 1954, 'Sau Cách mạng Tháng Tám thành công, thực dân Pháp quay lại xâm lược nước ta. Dưới sự lãnh đạo của Đảng Cộng sản Đông Dương và Chủ tịch Hồ Chí Minh, toàn dân tộc đã tiến hành cuộc kháng chiến trường kỳ 9 năm. Từ chiến tranh du kích đến chiến tranh chính quy, từ xây dựng lực lượng đến mở các chiến dịch lớn, đỉnh cao là Chiến dịch Điện Biên Phủ \"lừng lẫy năm châu, chấn động địa cầu\". Ngày 7/5/1954, quân ta giành thắng lợi hoàn toàn, buộc Pháp phải ký Hiệp định Genève ngày 21/7/1954, công nhận độc lập, chủ quyền và toàn vẹn lãnh thổ của Việt Nam, Lào, Campuchia. Chiến thắng này là minh chứng sống động cho sức mạnh của chiến tranh nhân dân, đường lối kháng chiến toàn dân, toàn diện, trường kỳ, dựa vào sức mình là chính.', 'After the successful August Revolution, French colonialists returned to invade our country. Under the leadership of the Indochinese Communist Party and President Ho Chi Minh, the entire nation waged a 9-year prolonged resistance war. From guerrilla warfare to conventional warfare, from building forces to launching major campaigns, culminating in the Dien Bien Phu Campaign \"resounding throughout five continents, shaking the globe\". On May 7, 1954, our army won complete victory, forcing France to sign the Geneva Accords on July 21, 1954, recognizing the independence, sovereignty and territorial integrity of Vietnam, Laos and Cambodia. This victory was vivid proof of the power of people\'s war, the policy of nationwide, comprehensive, prolonged resistance, relying mainly on our own strength.', '/uploads/khangchienchongphap.jpg', '2026-03-04 19:53:01', '2026-04-02 15:03:30'),
(2, 'Kháng chiến chống Mỹ cứu nước (1954-1975)', 'Resistance against America to save the country (1954-1975)', 1954, 1975, 'Sau Hiệp định Genève, Mỹ thay chân Pháp can thiệp vào miền Nam, dựng lên chính quyền tay sai Ngô Đình Diệm. Dưới sự lãnh đạo của Đảng Lao động Việt Nam, nhân dân cả nước tiến hành cuộc kháng chiến chống Mỹ cứu nước. Miền Bắc xây dựng hậu phương lớn, miền Nam tiến hành đấu tranh chính trị kết hợp vũ trang, phát triển lực lượng cách mạng. Từ phong trào Đồng khởi (1959-1960), cao trào chống Mỹ (1961-1965), đến Tổng tiến công và nổi dậy Xuân Mậu Thân 1968, và đỉnh cao là Chiến dịch Hồ Chí Minh lịch sử năm 1975. Ngày 30/4/1975, quân giải phóng tiến vào Sài Gòn, chính quyền Việt Nam Cộng hòa đầu hàng vô điều kiện. Cuộc kháng chiến chống Mỹ cứu nước đã hoàn toàn thắng lợi, non sông thu về một mối, cả nước bước vào kỷ nguyên hòa bình, thống nhất và xây dựng chủ nghĩa xã hội.?...\nSau Hiệp định Genève, Mỹ thay chân Pháp can thiệp vào miền Nam, dựng lên chính quyền tay sai Ngô Đình Diệm. Dưới sự lãnh đạo của Đảng Lao động Việt Nam, nhân dân cả nước tiến hành cuộc kháng chiến chống Mỹ cứu nước. Miền Bắc xây dựng hậu phương lớn, miền Nam tiến hành đấu tranh chính trị kết hợp vũ trang, phát triển lực lượng cách mạng. Từ phong trào Đồng khởi (1959-1960), cao trào chống Mỹ (1961-1965), đến Tổng tiến công và nổi dậy Xuân Mậu Thân 1968, và đỉnh cao là Chiến dịch Hồ Chí Minh lịch sử năm 1975. Ngày 30/4/1975, quân giải phóng tiến vào Sài Gòn, chính quyền Việt Nam Cộng hòa đầu hàng vô điều kiện. Cuộc kháng chiến chống Mỹ cứu nước đã hoàn toàn thắng lợi, non sông thu về một mối, cả nước bước vào kỷ nguyên hòa bình, thống nhất và xây dựng chủ nghĩa xã hội.?...', 'After the Geneva Accords, the United States replaced France in intervening in the South, establishing the puppet Ngo Dinh Diem regime. Under the leadership of the Vietnam Workers\' Party, the entire nation waged the resistance war against America to save the country. The North built a great rear base, the South carried out political struggle combined with armed struggle, developing revolutionary forces. From the Dong Khoi movement (1959-1960), the anti-American high tide (1961-1965), to the Tet General Offensive and Uprising in 1968, and culminating in the Ho Chi Minh Campaign in 1975. On April 30, 1975, liberation forces entered Saigon, the Republic of Vietnam regime unconditionally surrendered. The resistance war against America to save the nation completely triumphed, the country was reunified, and the entire nation entered the era of peace, unity and socialist construction.', '/uploads/khangchienchongmy.jpg', '2026-03-04 19:53:01', '2026-04-02 15:37:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `timelineevents`
--

CREATE TABLE `timelineevents` (
  `id` int(11) NOT NULL,
  `event_year` int(11) NOT NULL,
  `year_display_vi` varchar(100) NOT NULL,
  `year_display_en` varchar(100) NOT NULL,
  `title_vi` varchar(500) NOT NULL,
  `title_en` varchar(500) NOT NULL,
  `description_vi` text NOT NULL,
  `description_en` text NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'admin',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(1, 'admin', 'admin123', 'admin', '2026-03-09 00:35:29');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `adminlogs`
--
ALTER TABLE `adminlogs`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `battlefields`
--
ALTER TABLE `battlefields`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `battlefield_images`
--
ALTER TABLE `battlefield_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_battlefield_id` (`battlefield_id`),
  ADD KEY `idx_upload_order` (`battlefield_id`,`upload_order`);

--
-- Chỉ mục cho bảng `historicalfigurecontents`
--
ALTER TABLE `historicalfigurecontents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_figure_lang` (`figure_id`,`lang`);

--
-- Chỉ mục cho bảng `historicalfigures`
--
ALTER TABLE `historicalfigures`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `historyperiods`
--
ALTER TABLE `historyperiods`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `timelineevents`
--
ALTER TABLE `timelineevents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event_year` (`event_year`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `adminlogs`
--
ALTER TABLE `adminlogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `battlefields`
--
ALTER TABLE `battlefields`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `battlefield_images`
--
ALTER TABLE `battlefield_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `historicalfigurecontents`
--
ALTER TABLE `historicalfigurecontents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `historicalfigures`
--
ALTER TABLE `historicalfigures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `historyperiods`
--
ALTER TABLE `historyperiods`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `timelineevents`
--
ALTER TABLE `timelineevents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `battlefield_images`
--
ALTER TABLE `battlefield_images`
  ADD CONSTRAINT `battlefield_images_ibfk_1` FOREIGN KEY (`battlefield_id`) REFERENCES `battlefields` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `historicalfigurecontents`
--
ALTER TABLE `historicalfigurecontents`
  ADD CONSTRAINT `historicalfigurecontents_ibfk_1` FOREIGN KEY (`figure_id`) REFERENCES `historicalfigures` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
