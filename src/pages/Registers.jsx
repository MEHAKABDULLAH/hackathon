import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const Registers = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onFinish = async (e) => {
    e.preventDefault();
    const form = e.target;
    const values = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      image: "user.png",
    };

    try {
      await axios.post("https://backendd-one.vercel.app/api/auth/register", values);
      window.alert('Signup SucessFully! please login')
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #6e00ff, #9d4edd, #c77dff)",
        backgroundColor: "rgba(255,255,255,0.1)",
        backgroundSize: "400% 400%",
        animation: "gradient 12s ease infinite",
      }}
    >
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px",
        }}
      >
        <h3 className="text-white text-center mb-4">Sign Up</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onFinish}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Username</Form.Label>
            <Form.Control type="text" name="username"    placeholder="Enter your username" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Email</Form.Label>
            <Form.Control type="email" name="email"    placeholder="Enter your email"  required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Password</Form.Label>
            <Form.Control type="password" name="password"   placeholder="Enter your password" required />
          </Form.Group>
          <Button type="submit" variant="light"  className="w-100">
            Register
          </Button>
          <br /><br />
          <p className="text-center text-white">if you have already account <Link to={'/login'}>Login</Link></p>
        </Form>
      </div>
    </div>
  );
};

export default Registers;
