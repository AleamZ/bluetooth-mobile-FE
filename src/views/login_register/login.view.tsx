import ButtonMedia from "@/components/basicUI/button-media";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../../services/auth.service";
import { Spin } from "antd";
import { handleError } from "@/utils/catch-error";
import LogoImg from "@/assets/LogoBluetooth.png";

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const credentials = { username, password };
      const response = await loginService(credentials);
      console.log("User role:", response.role); // Log role
      localStorage.setItem("accessToken", response.access_token);
      localStorage.setItem("username", response.username);
      localStorage.setItem("role", response.role); // Save role to localStorage
      if (response.role === "customer") {
        navigate("/");
      }
      if (response.role === "admin") {
        navigate("/dashboard");
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Spin spinning={isLoading}>
      <div className="login-container">
        <div className="login-sub-container">
          <div className="login-title">
            <div className="login-img-intro">
              <img className="login-img" src={LogoImg} />
            </div>
            <h2 className="login-title">Đăng nhập với</h2>
          </div>
          <div className="login-button-media">
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
          <div className="login-line-through">
            <div className="login-line-through-hr"></div>
            <p className="login-line-through-p">Hoặc</p>
            <div className="login-line-through-hr"></div>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-input-group">
              <input
                type="text"
                name="username"
                className="login-input"
                required
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className="login-user-label">Nhập tài khoản của bạn</label>
            </div>
            <div className="login-input-group">
              <input
                type="password"
                name="password"
                className="login-input"
                required
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label className="login-user-label">Nhập mật khẩu của bạn</label>
            </div>
            {error && <p className="login-error">{error}</p>}
            <Link to="/" className="login-forgot-pw-container">
              <p className="login-forgot-pw">Quên mật khẩu?</p>
            </Link>
            <button type="submit" className="login-button">
              Đăng nhập
            </button>
            <p className="login-register-question">
              Bạn chưa có tài khoản?{" "}
              <Link to="/register" className="login-register">
                <span className="login-register">Đăng ký ngay</span>
              </Link>
            </p>
            <Link to="/">
              <p className="login-promotion">Chính sách ưu đãi của chúng tôi</p>
            </Link>
          </form>
        </div>
      </div>
    </Spin>
  );
};

export default Login;
