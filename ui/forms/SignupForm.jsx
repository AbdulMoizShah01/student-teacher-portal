"use client";
import React, { useEffect, useState } from "react";
import InputField from "../inputs/NormalInputs";
import moment from "moment";

const SignupForm = ({ onSubmit,role }) => {
    const createdAt =Date.parse(new Date());

  const [form, setForm] = useState({ email: "", name:"", role:role??"" , password: "" ,status:"pending", createdAt:createdAt});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(form);
    }
  };

useEffect(()=>{
  setForm((prev)=>({...prev,role:role??""}))
},[role])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
          Welcome
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />


            <InputField
            label="name"
            type="text"
            name="name"
            placeholder="Enter your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

            <InputField
            label="Select your role"
            type="select"
            name="role"
            placeholder="Select Role"
            value={form.role}
            onChange={handleChange}
            required
            options={["student", "teacher", "admin"]}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
