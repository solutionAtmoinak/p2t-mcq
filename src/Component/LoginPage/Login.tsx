import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useAuthenticateUserMutation, useLoginUserMutation } from "../../Api/authApi";
import { useGetCaptchaQuery } from "../../Api/CapchaApi";
import rtkErrorRead from "../../Helper/rtkErrorRead";
import { MainLoader } from "../Common";
import IconEye from "../Icon/IconEye";
import IconEyeOff from "../Icon/IconEyeOff";
import ApiResponse from "../../interface/ApiResponse";
import { isValidJWT } from "./TokenLogin";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()
  const jwtSearchParam = searchParams.get('jwt')
  const tokenSearchParam = searchParams.get('token')
  const examTypeParam = searchParams.get('examType')
  const examIdParam = searchParams.get('examId')
  const packageIdParam = searchParams.get('packageId');

  const [loginApi, { isLoading }] = useLoginUserMutation()
  const [authenticateApi, { isLoading: authenticateLoading }] = useAuthenticateUserMutation()
  const getCaptcha = useGetCaptchaQuery(null);

  const [captcha, setCaptcha] = useState({ captchaId: "", captchaImg: "" });
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const initialValues = {
    userName: "",
    password: "",
    code: "",
  };


  useEffect(() => {
    if (getCaptcha.isError) {
      rtkErrorRead(getCaptcha.error);
    } else if (!getCaptcha.isLoading) {
      setCaptcha({
        captchaId: getCaptcha.data.result?.captchaId,
        captchaImg: getCaptcha.data.result?.captchaImg,
      });
    }
  }, [getCaptcha]);

  useEffect(() => {
    // console.log({ examTypeParam, examIdParam, packageIdParam })

    const searchToken = jwtSearchParam || tokenSearchParam || "";
    const storageToken = localStorage.getItem("token") || "";

    // Priority: Search token > LocalStorage token
    const finalToken = searchToken || storageToken;

    if (!finalToken) {
      navigate('/');
      return;
    }

    if (!isValidJWT(finalToken)) {
      navigate('/');
      return;
    }

    authenticateApi(finalToken).then((res) => {
      if (!res.data) {
        console.log(res.error);
        navigate('/');
        return;
      }

      const data: ApiResponse = res.data;

      if (!data.isSuccess) {
        navigate('/');
        return;
      }

      // If token came from search, overwrite localStorage (higher priority)
      if (finalToken) {
        if (finalToken !== storageToken)
          localStorage.setItem('token', finalToken);

        if (examTypeParam === 'mcq') {
          navigate('/mcq', {
            state: { examId: examIdParam, packageId: packageIdParam }
          });
          return;
        }

        if (examTypeParam === 'theory') {
          navigate('/theory', {
            state: { examId: examIdParam, packageId: packageIdParam }
          });
          return;
        }
      }

      // Fallback: valid local token → homepage
      // navigate('/HomePage');
      navigate('/mcq');
    })
      .catch((err) => {
        console.log(err);
        navigate('/');
      });

  }, [jwtSearchParam, tokenSearchParam, examIdParam, examTypeParam, packageIdParam, navigate]);




  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const validationSchema = Yup.object().shape({
    Username: Yup.string().required("Required"),
    Password: Yup.string().required("Required"),
    code: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: any) => {
    const res = await loginApi({
      username: values.Username,
      password: values.Password,
      userEnteredCaptchaCode: values.code,
      captchaId: captcha.captchaId,
    })

    if (res.error) {
      rtkErrorRead(res.error)
    } else {
      const { token } = res.data?.result
      localStorage.setItem('token', token)
      // navigate("/HomePage")
      navigate('/mcq')
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <div className=" w-full h-screen grid grid-cols-1 md:grid-cols-3">
          {(isLoading || authenticateLoading) && <MainLoader />}
          <div className="flex items-center justify-center bg-gray-100 w-full">
            <div className="w-full max-w-md bg-gray-200 rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <img src="assets\logi.png" alt="Logo" className="w-48 h-16" />
              </div>
              <div className="flex justify-around mb-6 text-2xl font-bold text-gray-800">
                Log in
              </div>
              <Form>
                <div className="mb-4">
                  <label
                    htmlFor="Username"
                    className="block text-lg font-medium text-gray-600 mb-1"
                  >
                    Username/Email/Phone
                  </label>
                  <Field
                    id="Username"
                    name="Username"
                    placeholder="Enter Your Username or Email or Phone"
                    className="w-full bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="Username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4 relative">
                  <label
                    htmlFor="Password"
                    className="block text-lg font-medium text-gray-600 mb-1"
                  >
                    Password
                  </label>
                  <Field
                    id="Password"
                    name="Password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Password"
                    className="w-full bg-white px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-[53px] transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  >
                    {isPasswordVisible ? (
                      <IconEyeOff className="w-5 h-5" />
                    ) : (
                      <IconEye className="w-5 h-5" />
                    )}
                  </button>

                  <ErrorMessage
                    name="Password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4 relative">
                  <div className="w-full">
                    <img
                      src={captcha.captchaImg}
                      className="w-full h-full object-cover"
                      alt="captcha"
                    />
                  </div>
                  <div className="relative text-white-dark mt-4">
                    <div className="relative">
                      <Field
                        placeholder="Enter Captcha"
                        className="w-full bg-white px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name="code"
                        autoComplete="off"
                      />
                      <div
                        className="absolute right-0 top-0 mt-2 mr-3"
                        title="Reload Captcha"
                      >
                        <FontAwesomeIcon
                          icon={faSyncAlt}
                          onClick={async () => {
                            getCaptcha.refetch();
                            setFieldValue("code", "");
                          }}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <ErrorMessage
                    name="code"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700"
                  >
                    Login
                  </button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <span>Recover your Password?</span>{" "}
                  <a href="#" className="text-blue-500 hover:underline">
                    FORGOT PASSWORD
                  </a>
                </div>
              </Form>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-[#DBE9F8] w-full login-font md:col-span-2">
            <h1 className="text-5xl font-bold mb-4 text-blue-900">Login to your</h1>
            <h2 className="text-4xl font-semibold mb-6 text-blue-900">Online Exam Portal</h2>
            <img
              src="assets\Frame.png"
              alt="Student Illustration"
              className="w-[70%] h-[500px] "
            />
          </div>
        </div>
      )}
    </Formik>
  );
};

export default LoginPage;
