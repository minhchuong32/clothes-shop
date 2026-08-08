import React from "react";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import NewsletterBox from "../components/NewlesterBox";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"LIÊN HỆ"} text2={"CHÚNG TÔI"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          src={assets.contact_img}
          alt="Liên Hệ Chúng Tôi"
          className="w-full md:max-w-[450px]"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">
            Nếu bạn có bất kỳ câu hỏi nào, xin vui lòng liên hệ với chúng tôi
            qua email hoặc số điện thoại dưới đây.
          </p>
          <p className="text-gray-600">Email: haihan.291118@gmail.com</p>
          <p className="text-gray-600">Điện thoại:<b>+84 934 916 255</b> </p>
          <p className="text-gray-600">
            Địa chỉ: Tiệm may Xuân Hải, KDC 24, Thôn Thạch Thang, xã Lân Phong, huyện Mộ
            Đức, tỉnh Quảng Ngãi
          </p>
        </div>
      </div>

      {/* Google Maps Section */}
      <div className="my-10 mb-20">
        <div className="text-center text-2xl py-4">
          <Title text1={"BẢN ĐỒ"} text2={"CỬA HÀNG"} />
        </div>
        <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <iframe
            id="ggmap-frame"
            title="Bản đồ vị trí Xuân Hải"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.7570997193616!2d108.93285927576595!3d14.925426899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3168f9f6e18a52ed%3A0x1e7e472aca0e7e67!2sXu%C3%A2n%20H%E1%BA%A3i!5e0!3m2!1svi!2svn!4v1723110000000!5m2!1svi!2svn"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
