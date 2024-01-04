"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Form = () => {
  // const [email, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [data, setData] = useState({ email: "", password: "" });
  const handleSubmits = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_URL}/api/collectorAuth/signin`,
        data
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          // window.location.href = "/collectorDashboard";
          console.log("success");
          // alert("Login Successful");
          toast.success("Login Successful", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        } else {
          // alert("Invalid Credentials");
          toast.error("Login Failed", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        // alert("Invalid Credentials");
        toast.error("Login Failed", {
          position: toast.POSITION.BOTTOM_RIGHT,
          // onClose: () => {
          //   window.location.href = "/collectorLogin";
          // },
        });
      });
    // console.log("submit");
    console.log(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    // <div className="flex items-center justify-center h-screen bg-gray-200">
    <form
      className="w-full max-w-xl shadow-md rounded px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmits}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          loading="lazy"
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Login for E-Waste Collectors
        </h2>
      </div>
      <div className="mb-4">
        <label
          className="block text-sm font-medium leading-6 text-gray-900"
          htmlFor="email"
        >
          E-mail
        </label>
        <input
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          id="email"
          onChange={handleChange}
          name="email"
          value={data.email}
          type="text"
          placeholder="E-mail"
        />
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <label
            className="block text-sm font-medium leading-6 text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Forgot password?
            </a>
          </div>
        </div>
        <div className="mt-2">
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            id="password"
            onChange={handleChange}
            name="password"
            value={data.password}
            type="password"
            placeholder="*********"
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign in
        </button>
      </div>
      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{" "}
        <a
          href="/collectorSignUp"
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          Sign up now
        </a>
      </p>
    </form>
  );
};

export default Form;
