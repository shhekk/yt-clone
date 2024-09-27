import { useState } from "react";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/Inputbos";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils/toast";
export function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  // method 2 https://www.youtube.com/watch?v=SaEc7jLWvGY
  const handleChange = (e) => {
    // console.log(e.target.value);
    const { name, value } = e.target;
    const signupData = { ...signupInfo };
    signupData[name] = value;
    setSignupInfo(signupData);
    console.log(signupData);
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    const { username, email, password } = signupInfo;
    if (!username || !email || !password)
      return handleError("all fields are required");
    // console.log(signupInfo);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      // console.log(response.status);
      if (response.status === 200)
        return handleSuccess("user signup successfull");
      if (result.status !== 200) return handleError(result.msg);
    } catch (error) {
      return handleError(error);
    }
  };
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-2xl flex flex-col items-center justify-evenly">
        <Heading value={"Signup"} />
        <form className=" my-2">
          <InputBox
            name={"username"}
            placeholder={"Username"}
            onChange={handleChange}
          />
          <InputBox
            name={"email"}
            placeholder={"Email"}
            onChange={handleChange}
          />
          <InputBox
            name={"password"}
            placeholder={"Password"}
            onChange={handleChange}
          />

          <Button type={"submit"} value={"Signup"} onClick={submitHandler} />
        </form>
        <p>
          Already have an account.
          <u>
            <a href="/signup">Login</a>
          </u>
        </p>
      </div>

      <ToastContainer />
    </div>
  );
}
