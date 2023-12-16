import google_logo from "../../public/google.png";
import Router from "next/router";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useRequest from "../../hooks/use-request";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const genmap = { Male: "M", Female: "F", Other: "O" };
    const genderList = ["Male", "Female", "Other"];

    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: {
            name,
            email,
            password,
            dob,
            gender,
        },
        onSuccess: () => Router.push("/"),
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    };

    return (
        <section className='mt-8'>
            <ToastContainer />
            <h1 className='text-center text-primary text-4xl'>Sign Up</h1>
            <form className='block max-w-xs mx-auto' onSubmit={onSubmit}>
                <input
                    name='name'
                    id='name'
                    className='block w-full my-2 rounded-xl border p-2 border-gray-400 bg-gray-200'
                    type='name'
                    required
                    placeholder='name'
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <input
                    id='email'
                    name='email'
                    className='block w-full my-2 rounded-xl border p-2 border-gray-400 bg-gray-200'
                    type='email'
                    placeholder='email'
                    value={email}
                    required
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <input
                    name='password'
                    className='block w-full my-2 rounded-xl border p-2 border-gray-400 bg-gray-200'
                    type='password'
                    placeholder='password'
                    value={password}
                    required
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <input
                    name='date'
                    className='block w-full my-2 rounded-xl border p-2 border-gray-400 bg-gray-200'
                    type='date'
                    placeholder='DOB'
                    value={dob}
                    required
                    onChange={(e) => {
                        setDob(e.target.value);
                    }}
                />
                <select
                    name='gender'
                    className='block w-full my-2 rounded-xl border p-2 border-gray-400 bg-gray-200'
                    type='select'
                    placeholder='gender'
                    value={gender}
                    required
                    onChange={(e) => {
                        setGender(e.target.value);
                    }}>
                    <option value='' />
                    {genderList.map((gender) => (
                        <option key={uuidv4()} value={genmap[gender]}>
                            {gender}
                        </option>
                    ))}
                </select>
                <button
                    className='w-full font-semibold border-gray-500 rounded-xl px-6 py-2 border-0 bg-primary text-white'
                    type='submit'>
                    Register
                </button>
                <div className='my-4 text-center text-gray-500'>or login with provider</div>
                <button className='flex gap-4 justify-center w-full text-gray-700 font-semibold border border-gray-500 rounded-xl px-6 py-2'>
                    <Image src={google_logo} width={30} height={30} alt='google' />
                    login with Google
                </button>
            </form>
        </section>
    );
}
