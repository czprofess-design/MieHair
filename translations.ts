
import { Translation } from "./types";

export const t: Translation = {
  // Header
  facebookAria: "Hồ Sơ Facebook",
  phoneAria: "Điện Thoại/Zalo",
  telegramAria: "Hồ Sơ Telegram",
  backToTopAria: "Quay Về Đầu Trang",
  scrollToTopAria: "Cuộn Lên Đầu Trang",
  settingsAria: "Mở Cài Đặt",
  openUserGuideAria: "Mở Hướng Dẫn Sử Dụng",
  howToUseThisApp: "Hướng Dẫn Sử Dụng Ứng Dụng",
  adminDashboard: "Trang Quản Lý",
  employeeDashboard: "Hiệu Suất Của Tôi",

  // ThemeToggle & Controller
  toggleThemeAria: "Chuyển Đổi Giao Diện",
  appearanceSettingsAria: "Giao Diện",
  themeLabel: "Giao Diện",
  lightTheme: "Sáng",
  darkTheme: "Tối",
  accentColorLabel: "Màu Nhấn",

  // LanguageSwitcher
  language: "Ngôn Ngữ",

  // Footer
  copyright: (year) => `© ${year} Mie Hair. Đã Đăng Ký Bản Quyền.`,
  contactUs: "Liên Hệ",

  // TopBar
  yourSession: "Phiên Của Bạn",
  ipAddress: "IP",
  sessionTime: "Thời Gian",
  liveActivity: "Hoạt Động",
  liveActivityIdle: "Nghỉ",
  liveActivityOnShift: "Trong Ca",
  activeSubs: "Nhân Viên Đang Làm Việc",
  totalHoursTicker: "Tổng Giờ Hôm Nay",
  userMonthlyHours: "Giờ Của Tôi Tháng Này",
  
  // Auth
  authHeader: "Chào Mừng Đến Với Mie Hair",
  authPrompt: "Đăng Nhập Để Tiếp Tục.",
  authPromptLogin: "Chưa Có Tài Khoản?",
  emailLabel: "Địa Chỉ Email",
  passwordLabel: "Mật Khẩu",
  signIn: "Đăng Nhập",
  signUp: "Đăng Ký",
  signOut: "Đăng Xuất",
  signingIn: "Đang Đăng Nhập...",
  signingUp: "Đang Đăng Ký...",
  magicLinkSent: "Kiểm tra email của bạn để lấy liên kết đăng nhập!",
  signInToContinue: "Đăng Nhập Để Tiếp Tục",
  cancel: "Hủy",

  // Account Modal
  accountSettings: "Cài Đặt Tài Khoản",
  profile: "Hồ Sơ",
  password: "Mật Khẩu",
  updateProfile: "Cập Nhật Hồ Sơ",
  fullName: "Họ Và Tên",
  avatar: "Ảnh Đại Diện",
  uploading: "Đang tải lên...",
  uploadAvatar: "Tải Ảnh Đại Diện",
  update: "Cập Nhật",
  updating: "Đang cập nhật...",
  profileUpdated: "Hồ sơ đã được cập nhật thành công!",
  changePassword: "Đổi Mật Khẩu",
  newPassword: "Mật Khẩu Mới",
  confirmNewPassword: "Xác Nhận Mật Khẩu Mới",
  passwordUpdated: "Mật khẩu đã được cập nhật thành công!",
  passwordsDoNotMatch: "Mật khẩu không khớp.",
  
  // Calendar Timesheet
  dashboardTitle: "Lịch Hiệu Suất",
  startShift: "Bắt Đầu Ca",
  endShift: "Kết Thúc Ca",
  shiftInProgress: "Đang Trong Ca Làm Việc",
  shiftStartedAt: (time) => `Bắt đầu lúc ${time}`,
  currentDuration: "Thời Gian",
  totalHours: "Giờ",
  signInToTrackTime: "Vui lòng đăng nhập để chấm công.",

  // Revenue Tracking
  revenue: "Doanh Số",
  totalRevenue: "Tổng Doanh Số",
  revenuePlaceholder: "Nhập doanh số...",
  currencySymbol: "₫",

  // Calendar
  monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
  dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm Nay",

  // Date Range Selector
  dateRange: "Phạm Vi Ngày",
  thisWeek: "Tuần Này",
  lastWeek: "Tuần Trước",
  thisMonth: "Tháng Này",
  lastMonth: "Tháng Trước",
  year: "Năm",
  month: "Tháng",

  // Monthly Summary
  monthlySummary: "Thống Kê Hiệu Suất",
  totalHoursWorked: "Tổng Giờ Làm Việc",
  totalWorkDays: "Tổng Số Ngày Làm",
  totalShifts: "Tổng Số Ca",
  averageHoursPerDay: "Giờ Trung Bình/Ngày",
  dailyHoursOverview: "Tổng Quan Giờ Hàng Ngày",
  
  // Admin Dashboard
  allEmployees: "Tất Cả Nhân Viên",
  selectEmployeePrompt: "Chọn một nhân viên để xem hiệu suất.",
  timeEntriesFor: (name: string) => `Hiệu Suất Của ${name}`,
  noEntriesFound: "Không tìm thấy dữ liệu cho khoảng thời gian này.",
  addEntry: "Thêm Ca",
  editEntry: "Sửa Ca",
  manageEntries: "Quản Lý Ca",
  deleteEntry: "Xóa Ca",
  confirmDelete: "Xác Nhận Xóa",
  deleteConfirmationMessage: (entryInfo: string) => `Bạn có chắc muốn xóa ca làm việc này không? ${entryInfo}`,
  confirmDeleteEmployee: "Xác Nhận Xóa Nhân Viên",
  deleteEmployeeConfirmationMessage: (name: string) => `Bạn có chắc chắn muốn xóa ${name} không? Thao tác này sẽ xóa vĩnh viễn hồ sơ, tất cả các mục chấm công và ghi chú của họ.`,
  date: "Ngày",
  startTime: "Giờ Bắt Đầu",
  endTime: "Giờ Kết Thúc",
  actions: "Hành Động",
  workDays: "Ngày Làm Việc",
  avgHours: "Giờ TB/Ngày",
  overallSummary: "Tổng Quan Chung",
  employeeLeaderboard: "Bảng Xếp Hạng Nhân Viên",
  todaysShifts: "Các Ca Làm Việc Hôm Nay",

  // Generic Actions
  close: "Đóng",
  save: "Lưu",
  reset: "Làm Mới",

  // Add/Edit Time Entry Modal
  addNewTimeEntry: "Thêm Ca Làm Việc Mới",

  // Performance Review Modal
  editPerformanceReview: "Chỉnh Sửa Đánh Giá Hiệu Suất",
  score: "Điểm",
  comments: "Bình Luận",

  // Cart & Checkout
  yourCart: "Giỏ Hàng Của Bạn",
  remove: "Xóa",
  emptyCart: "Giỏ Hàng Của Bạn Đang Trống",
  emptyCartPrompt: "Có vẻ như bạn chưa thêm gì vào giỏ hàng.",
  subtotal: "Tạm Tính",
  checkout: "Tiến Hành Thanh Toán",
  addToCart: "Thêm Vào Giỏ",
  addedToCart: "Đã Thêm!",
  purchaseSuccessful: "Mua Hàng Thành Công!",
  purchaseSuccessfulMessage: "Cảm ơn bạn đã đặt hàng.",
  checkoutTitle: "Xác Nhận Đơn Hàng",
  quantity: "Số Lượng",
  total: "Tổng Cộng",
  confirmPurchase: "Xác Nhận Mua Hàng",

  // Admin Modals
  employee: "Nhân Viên",
  selectEmployee: "Chọn Một Nhân Viên",
  editEmployeeProfile: "Chỉnh Sửa Hồ Sơ Nhân Viên",
  role: "Chức Vụ",
  admin: "Quản Lý",

  // User Guide (Brief update for consistency)
  userGuide_s1_title: "Bắt Đầu",
  userGuide_s1_l1_strong: "Đăng Nhập:",
  userGuide_s1_l1_text: "Sử dụng thông tin đăng nhập được cung cấp.",
  userGuide_s1_l2_strong: "Tổng Quan Trang Chính:",
  userGuide_s1_l2_text: "Hiển thị lịch hiệu suất hàng tháng.",
  userGuide_s1_l3_strong: "Bắt Đầu/Kết Thúc Ca:",
  userGuide_s1_l3_text: "Sử dụng các nút trên thanh tiêu đề.",
  userGuide_s1_l4_strong: "Thông Số Trực Tiếp:",
  userGuide_s1_l4_text: "Hiển thị dữ liệu nhân viên đang làm việc.",

  userGuide_s2_title: "Quản Lý Thời Gian",
  userGuide_s2_l1_strong: "Xem Lịch:",
  userGuide_s2_l1_text: "Theo dõi số giờ làm việc hàng ngày.",
  userGuide_s2_l2_strong: "Thêm Ca:",
  userGuide_s2_l2_text: "Thêm thủ công các ca làm việc bị thiếu.",
  userGuide_s2_l3_strong: "Sửa Ca:",
  userGuide_s2_l3_text: "Chỉnh sửa thời gian bắt đầu hoặc kết thúc.",
  userGuide_s2_l4_strong: "Ghi Chú Hàng Ngày:",
  userGuide_s2_l4_text: "Lưu lại nội dung công việc và tệp đính kèm.",
  userGuide_s2_l5_strong: "Thống Kê Hiệu Suất:",
  userGuide_s2_l5_text: "Xem tổng hợp giờ làm và doanh số.",

  userGuide_s3_title: "Trang Quản Lý",
  userGuide_s3_l1_strong: "Chế Độ Quản Lý:",
  userGuide_s3_l1_text: "Chuyển đổi sang bảng điều khiển của quản trị viên.",
  userGuide_s3_l2_strong: "Xem Dữ Liệu Nhân Viên:",
  userGuide_s3_l2_text: "Theo dõi chi tiết hiệu suất của từng cá nhân.",
  userGuide_s3_l3_strong: "Tổng Quan Chung:",
  userGuide_s3_l3_text: "Bảng xếp hạng và thống kê toàn bộ cửa hàng.",
  userGuide_s3_l4_strong: "Quản Lý Ca Làm:",
  userGuide_s3_l4_text: "Sửa đổi ca làm cho nhân viên nếu cần.",

  userGuide_s4_title: "Tài Khoản & Cài Đặt",
  userGuide_s4_l1_strong: "Cài Đặt Tài Khoản:",
  userGuide_s4_l1_text: "Cập nhật tên và ảnh đại diện.",
  userGuide_s4_l2_strong: "Đổi Mật Khẩu:",
  userGuide_s4_l2_text: "Thay đổi thông tin bảo mật.",
  userGuide_s4_l3_strong: "Giao Diện:",
  userGuide_s4_l3_text: "Thay đổi chế độ sáng/tối và ngôn ngữ.",

  userGuide_s5_title: "Thiết Lập Cơ Sở Dữ Liệu",
  userGuide_s5_l1_strong: "Supabase:",
  userGuide_s5_l1_text: "Cấu hình URL và Key trong lib/supabase.ts.",
  userGuide_s5_l2_strong: "Lược Đồ:",
  userGuide_s5_l2_text: "Chạy tập lệnh SQL để tạo bảng.",
  userGuide_s5_l3_strong: "Lưu Trữ:",
  userGuide_s5_l3_text: "Tạo storage bucket 'daily_attachments'.",
};
