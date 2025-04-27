import axios from "axios";
import { useNavigate,Link } from "react-router-dom";
import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const onFinish = async (e) => {
    e.preventDefault();
    const form = e.target;
    const values = {
      email: form.email.value,
      password: form.password.value,
    };

    try {
      const res = await axios.post("https://backendd-one.vercel.app/api/auth/login", values);
      window.alert('login sucessfully! welcome back')

      // Debug: Log the entire response to see the data returned
      console.log("Login Response:", res.data);

      // Store the user data in localStorage
     // In your login function (assuming successful login response)
localStorage.setItem("jwtToken", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      

      // Redirect based on user role (Admin or regular user)
      res.data.user.isAdmin ? navigate("/dashboard") : navigate("/hackathon");

    } catch (err) {
      // Catch any errors and show them in the UI
      setError(err.response?.data?.message || "Login failed");
      console.error("Login Error:", err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "",
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
          background: "linear-gradient(135deg, #6e00ff, #9d4edd, #c77dff)", 
          backgroundColor: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px",
        }}
      >
        <h3 className="text-white text-center mb-4">Login</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onFinish}>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="Enter your email" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="text-white">Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Enter your password" required />
          </Form.Group>
          <Button type="submit" variant="light" className="w-100">
            Login
          </Button> <br /><br />
          <p className="text-center text-white">if you have no account <Link to={'/registers'}>Create One</Link></p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
