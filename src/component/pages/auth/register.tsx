"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import Swal from 'sweetalert2';

import { Controller, useForm } from 'react-hook-form';
import z from 'zod'
import axios from 'axios';


const formDataSchema = z.object({
  firstname: z.string().min(1, "กรุณากรอกชื่อ"),
  lastname: z.string().min(1, "กรุณากรอกนามสกุล"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
  confirmPassword: z.string().min(8, "รหัสผ่านไม่ตรงกัน"),
  privacyPolicy: z.boolean().refine((val) => val === true, "กรุณายอมรับนโยบายความเป็นส่วนตัว"),
  newsletter: z.boolean(),
  providers: z.string().optional(),
});


const defaultFormData: FormData = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    privacyPolicy: false,
    newsletter: false,
    providers: 'local'
};

type FormData = z.infer<typeof formDataSchema>;
// type FormData = z.infer<typeof createSignUpSchema>; เอามาแทน สร้าง Schema แยก


const FORM_STORAGE_KEY = 'registrationFormData';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(defaultFormData);
    const {control,setValue,} = useForm<FormData>({defaultValues: defaultFormData});
    const [submitError, setSubmitError] = useState<string>('');
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [privacyPolicyRead, setPrivacyPolicyRead] = useState(false);



    useEffect(() => {
        const handleStorageChange = () => {
            const isPolicyRead = localStorage.getItem("privacyPolicyRead") === "true";
            setPrivacyPolicyRead(isPolicyRead);
        };

        const handleMessage = (event: MessageEvent) => {
            if (event.data === "privacyPolicyRead") {
                localStorage.setItem("privacyPolicyRead", "true");
                setPrivacyPolicyRead(true);
                const savedFormData = localStorage.getItem('registrationFormData');
                if (savedFormData) {
                    setFormData(JSON.parse(savedFormData));
                    localStorage.removeItem('registrationFormData');
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("message", handleMessage);

        handleStorageChange();

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("message", handleMessage);
        };
    }, []);



    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (name: string, value: boolean): void => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        setSubmitError('');
        
        const validationResult = formDataSchema.safeParse(formData)
        console.log(validationResult.error);
        
        console.log(validationResult)
        if (!validationResult.success) {
          // หากการตรวจสอบล้มเหลว
          const newErrors = validationResult.error.errors.reduce((acc, error) => {
              acc[error.path[0] as keyof FormData] = error.message;
              return acc;
          }, {} as Record<string, string>);
  
          setErrors(newErrors);  // ตั้งค่า errors ให้แสดงในฟอร์ม
          return;  // หยุดการทำงานหาก validation ล้มเหลว
      }
        

        try {
            const formDataToSend = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                email: formData.email,
                password: formData.password,
                privacyPolicy: formData.privacyPolicy,
                newsletter: formData.newsletter,
                providers: 'local'
            };
            console.log(formDataToSend);
            
            const response = await axios.post('/api/register', formDataToSend);

            const data = response.data;
            console.log(data);
            console.log(data.jwt)
            console.log(data.ok);
            ;
            
            if (!data.user) {
                setSubmitError(data.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
                return;
            }

            if (!data.jwt) {
                console.error('No JWT in response:', data);
                setSubmitError('เกิดข้อผิดพลาดในการลงทะเบียน: ไม่พบ token');
                return;
            }

            setCookie('token', data.jwt, {
                maxAge: 7 * 24 * 60 * 60,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            await Swal.fire({
                icon: 'success',
                title: 'ลงทะเบียนสำเร็จ',
                text: 'กำลังพาคุณไปยังหน้าหลัก...',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    popup: 'rounded-3xl',
                    title: 'text-2xl font-bold',
                    htmlContainer: 'text-gray-600'
                }
            });
            router.push('/');

        } catch (error) {
            console.error('Error:', error);
            setSubmitError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
        }
    };

    const handlePrivacyPolicyClick = () => {
        sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
        localStorage.removeItem("privacyPolicyRead");
        setPrivacyPolicyRead(false);
        router.push("./privacy");
    };

    useEffect(() => {
        const storedFormData = sessionStorage.getItem(FORM_STORAGE_KEY);
        if (storedFormData) {
            try {
                const parsedData = JSON.parse(storedFormData);
                setFormData(parsedData);
                sessionStorage.removeItem(FORM_STORAGE_KEY);
            } catch (error) {
                console.error('Error parsing stored form data:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (!document.referrer.includes('./privacy')) {
            sessionStorage.removeItem(FORM_STORAGE_KEY);
        }
    }, []);

    return (
        <div>
          <div className ="h-full bg-gray-400 dark:bg-gray-900">
	
        <div className ="mx-auto">
          <div className ="flex justify-center px-6 py-12">
          
            <div className ="w-full xl:w-3/4 lg:w-11/12 flex">
              
                  <div className ="w-full h-auto bg-gray-400 dark:bg-gray-800 hidden lg:block lg:w-5/12 bg-cover rounded-l-lg"
                    style={{ backgroundImage: "url('https://source.unsplash.com/Mv9hjnEUHR4/600x800')" }}></div>
                  
                  <div className ="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
                    <h3 className ="py-4 text-2xl text-center text-gray-800 dark:text-white">Create an Account!</h3>
                    <form onSubmit={handleSubmit} className ="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded">

                      <div className ="mb-4 md:flex md:justify-between">
                        <div className ="mb-4 md:mr-2 md:mb-0">
                          <label className ="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="firstName">
                                              First Name
                                          </label>
                          <input
                                              className ="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                              id="firstname"
                                              name="firstname"
                                              type="text"
                                              placeholder="First Name"
                                              value={formData.firstname}
                                              onChange={handleChange}
                                          />
                                          {errors.firstname && <div style={{ color: 'red' }}>{errors.firstname}</div>}
                        </div>
                        <div className ="md:ml-2">
                          <label className ="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="lastName">
                                              Last Name
                                          </label>
                          <input
                                              className ="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                              id="lastname"
                                              name="lastname"
                                              type="text"
                                              placeholder="Last Name"
                                              value={formData.lastname}
                                              onChange={handleChange}
                                          />
                                          {errors.lastname && <div style={{ color: 'red' }}>{errors.lastname}</div>}
                        </div>
                      </div>
                      <div className ="mb-4">
                        <label className ="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="email">
                                          Email
                                      </label>
                        <input
                                          className ="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                          id="email"
                                          name="email"
                                          type="email"
                                          placeholder="Email"
                                          value={formData.email}
                                              onChange={handleChange}
                                      />
                                      {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                      </div>
                      <div className ="mb-4 md:flex md:justify-between">
                        <div className ="mb-4 md:mr-2 md:mb-0">
                          <label className ="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="password">
                                              Password
                                          </label>
                          <input
                                              className ="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border  rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                              id="password"
                                              name="password"
                                              type="password"
                                              placeholder="******************"
                                              value={formData.password}
                                              onChange={handleChange}
                                          />
                                          {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
                        </div>
                        <div className ="md:ml-2">
                          <label className ="block mb-2 text-sm font-bold text-gray-700 dark:text-white" htmlFor="c_password">
                                              Confirm Password
                                          </label>
                          <input
                                              className ="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                              id="c_password"
                                              name="confirmPassword"
                                              type="password"
                                              placeholder="******************"
                                              value={formData.confirmPassword}
                                              onChange={handleChange}
                                          />
                                          {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}
                        </div>
                      </div>
                      {!privacyPolicyRead && (
                        <button
                            onClick={handlePrivacyPolicyClick}
                            className="mb-2 text-blue-600 underline"
                        >
                            อ่านนโยบายความเป็นส่วนตัว
                        </button>
                    )}

                    <Controller
                        name="privacyPolicy"
                        control={control}
                        render={({ field }) => (
                          
                          <div className="flex items-center space-x-2">
                        
                          <input
                              type="checkbox"
                              id="privacyPolicy"
                              checked={formData.privacyPolicy}
                              onChange={(e) => {
                                  const isSelected = e.target.checked;
                                  field.onChange(isSelected);
                                  handleCheckboxChange('privacyPolicy', isSelected);
                                  setValue('privacyPolicy', isSelected);
                              }}
                              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              disabled={!privacyPolicyRead}
                          />
                          <label htmlFor="privacyPolicy" className="text-sm text-gray-700 dark:text-white">
                              ฉันได้อ่านและยอมรับนโยบายความเป็นส่วนตัวแล้ว
                          </label>
                      </div>
                        )}
                    />
                    {errors.privacyPolicy && (
                        <p className="text-red-600 text-sm">{errors.privacyPolicy}</p>
                    )}

                    <Controller
                        name="newsletter"
                        control={control}
                        render={({ field }) => (
                          
                          <div className="flex items-center space-x-2">
                        
                          <input
                              type="checkbox"
                              id="newsletter"
                              checked={formData.newsletter}
                              onChange={(e) => {
                                  const isSelected = e.target.checked;
                                  field.onChange(isSelected);
                                  handleCheckboxChange('newsletter', isSelected);
                                  setValue('newsletter', isSelected);
                              }}
                              className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                             
                          />
                          <label htmlFor="privacyPolicy" className="text-sm text-gray-700 dark:text-white">
                          ฉันต้องการรับข่าวสารและอัพเดทผ่านทางอีเมล
                          </label>
                      </div>
                        )}
                    />

                      <div className ="mb-6 text-center">
                        <button
                                          className ="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                                          type="submit" onClick={() => console.log("🛠 ปุ่ม Register ถูกคลิก")}
                                      >
                                          Register Account
                                      </button>
                      </div>
                      <hr className ="mb-6 border-t" />
                      <div className ="text-center">
                        <a className ="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                          href="#">
                          Forgot Password?
                        </a>
                      </div>
                      <div className ="text-center">
                        <a className ="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
                          href="./index.html">
                          Already have an account? Login!
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
</div>

        </div>
    );
};

export default RegistrationForm;