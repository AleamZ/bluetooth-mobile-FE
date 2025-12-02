import ButtonMedia from "@/components/basicUI/button-media";
import { register } from "@/services/auth.service";
import { handleError } from "@/utils/catch-error";
import { message, Spin } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImgRegister from "@/assets/LogoBluetooth.png";
interface IFormDataRegister {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
}
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formDataRegister, setFormDataRegister] = useState<IFormDataRegister>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
  });
  const handleChangeFormData = (e: any) => {
    setFormDataRegister((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleRegister = async (e: any) => {
    e.preventDefault();
    const { username, password, confirmPassword, phone, email } =
      formDataRegister;
    if (password !== confirmPassword) {
      return message.warning("Mật khẩu không khớp");
    }
    try {
      setIsLoading(true);

      const payload = {
        username,
        password,
        phone,
        email: email || null,
      };
      await register(payload);
      message.success("Đăng ký thành công");
      setFormDataRegister({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
      });
      navigate("/login");
    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Spin spinning={isLoading}>
      <div className="register-container">
        <div className="register-sub-container">
          <div className="register-title">
            <div className="register-img-intro">
              <img className="register-img" src={ImgRegister} />
            </div>
            <h2 className="register-title">Đăng ký với</h2>
          </div>
          <div className="register-button-media">
            <ButtonMedia
              icon="https://static-account.cellphones.com.vn/_nuxt/img/image45.93ceca6.png"
              title="Google"
              link="/"
            />
            <ButtonMedia
              icon="https://static-account.cellphones.com.vn/_nuxt/img/Logo-Zalo-Arc.a36365b.png"
              title="Zalo"
              link="/"
            />
          </div>
          <div className="register-line-through">
            <div className="register-line-through-hr"></div>
            <p className="register-line-through-p">Hoặc</p>
            <div className="register-line-through-hr"></div>
          </div>
          <form className="register-form" onSubmit={handleRegister}>
            {/* <div className="register-input-group">
            <input
              type="text"
              name="text"
              className="register-input"
              required
              autoComplete="off"
            />
            <label className="register-user-label">Nhập họ và tên</label>
          </div> */}
            <div className="register-input-group">
              <input
                type="text"
                name="username"
                onChange={handleChangeFormData}
                value={formDataRegister.username}
                className="register-input"
                required
                autoComplete="off"
              />
              <label className="register-user-label">Nhập tài khoản</label>
            </div>
            <div className="register-input-group">
              <input
                type="text"
                name="phone"
                onChange={handleChangeFormData}
                value={formDataRegister.phone}
                className="register-input"
                required
                autoComplete="off"
              />
              <label className="register-user-label">Nhập số điện thoại</label>
            </div>
            <div className="register-input-group">
              <input
                type="text"
                name="email"
                onChange={handleChangeFormData}
                value={formDataRegister.email}
                className="register-input"
                autoComplete="off"
              />
              <label className="register-user-label">
                Nhập email(không bắt buộc)
              </label>
            </div>
            {/* <div className="register-input-group">
                    <input 
                        type="text" 
                        name="text" 
                        className="register-input" 
                        required 
                        autoComplete="off" 
                    />
                    <label className="register-user-label">Nhập ngày sinh</label>
                </div> */}

            <div className="register-input-group">
              <input
                type="text"
                name="password"
                onChange={handleChangeFormData}
                value={formDataRegister.password}
                className="register-input"
                required
                autoComplete="off"
              />
              <label className="register-user-label">Nhập mật khẩu</label>
            </div>
            <div className="register-input-group">
              <input
                type="text"
                name="confirmPassword"
                onChange={handleChangeFormData}
                value={formDataRegister.confirmPassword}
                className="register-input"
                required
                autoComplete="off"
              />
              <label className="register-user-label">Nhập lại mật khẩu</label>
            </div>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" required />
                Tôi đồng ý với các điều khoản sử dụng
              </label>
            </div>
            <button className="register-button">Đăng ký</button>
            <p className="register-registe-question">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="register-register">
                <span className="register-register">Đăng nhập nhập ngay</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Spin>
  );
};

export default Register;
