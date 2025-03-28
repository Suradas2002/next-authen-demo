"use client";

import { AuthContext, useAuthContext } from "@/้hooks/useAuth";
import Link from "next/link";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Navbar() {
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement | null>(null);
   const [DropdownUser,setDropdownUser] = useState(false)
 
   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
   const toggleDropdownUser = () => setDropdownUser(!DropdownUser)
   const toggleMenu = () => setIsMenuOpen(!isMenuOpen) 
   const closeMenu = () => setIsMenuOpen(false);
   
   const { user, status } = useAuthContext();
   const session = useAuthContext()


      const handleLogout = async () => {
        await fetch('./api/logout')
        window.location.href = '/'
        
      };
      
   
 
   useEffect(() => {
     const handleClickOutside = (event: { target: any }) => {
       if (menuRef.current && !menuRef.current.contains(event.target)) {
         closeMenu();
         
       }
       if (!event.target.closest(".language-dropdown") && isDropdownOpen) {
         setIsDropdownOpen(false);
       }
     };
 
     document.addEventListener("mousedown", handleClickOutside);
     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, [isDropdownOpen]);
   
   useLayoutEffect(() => {
    
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = ''; 
    }
  
    return () => {
      document.body.style.overflow = ''; 
    };
  }, [isMenuOpen]);
 
   return (
     <div className="fixed top-0 left-0 right-0  bg-[#83898f]  z-50 opacity-75">
      
       <div className="flex justify-between ">
       <div className="max-w-full max-h-full flex justify-center items-center xl:w-1/6 lg:w-1/6 sm:max-w-full  ">
          <img
            src="https://tat-image.sgp1.cdn.digitaloceanspaces.com/workation_2024/8e7dae89ef6e80ca200dbf170ec54060.png"
            alt="workation"
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="max-w-full max-h-full flex justify-center items-center lg:w-6/6">
          <ul className="hidden lg:flex flex-row text-white p-7 space-x-2 overflow-x-auto max-w-full flex-wrap ">
            <li>
              <a href="#" className="p-4 border-r-1 border-gray-200 hover:text-black">
                หน้าหลัก
              </a>
            </li>
            <li>
              <a href="#" className="p-4 border-r-1 border-gray-200 hover:text-black">
                Pop-Up Store
              </a>
            </li>
            <li>
              <a href="#" className="p-4 border-r-1 border-gray-200 hover:text-black">
                100 เดียวเที่ยวได้งาน
              </a>
            </li>
            <li>
              <a href="#" className="p-4 border-r-1 border-gray-200 hover:text-black">
                สิทธิพิเศษ
              </a>
            </li>
            <li>
              <a href="#" className="p-4 border-r-1 border-gray-200 hover:text-black">
                แบบสอบถาม
              </a>
            </li>
          </ul>
        </div>

         <div className="flex flex-row p-5 lg:pl-0">
          <div className="relative">
          {status === "authorized" && user ? (
        <button
          type="button"
          onClick={toggleDropdownUser}
          className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-[14px] px-4 py-2 text-center me-2 mb-2 flex items-center w-30 h-8"
        >
          <span className="flex flex-grow justify-center items-center ">{user.username}</span>
        </button>
      ) : (
            <Link href={"./local/pages/login"}>
            <button
                type="button"
                className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-[14px] px-4 py-2 text-center me-2 mb-2 flex items-center w-30 h-8"
              >
                <img src="/padlock-svgrepo-com.svg" alt="padLock" className="w-5 h-5 mr-2" />
                เข้าสู่ระบบ
              </button>
            </Link>
      )}
            {DropdownUser && status === "authorized" && (
                  <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-40">
                    <ul className="pb-4 text-sm text-gray-700 dark:text-gray-200">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        >
                          ออกจากระบบ
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
    
          </div>
         
              <div className="relative inline-block language-dropdown">
                <button
                  onClick={toggleDropdown}
                  type="button"
                  className=" w-20 h-8 lg:flex hidden items-center font-medium justify-center px-4 py-2 text-sm text-white dark:text-black rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black hover:text-black group"
                >
                  <p className="text-white group-hover:text-black">ไทย</p>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-20 h-15 p-1 text-white group-hover:text-black"
                  >
                    <path
                      d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M3 12H21M12 3C14.5 5.5 16 8.5 16 12C16 15.5 14.5 18.5 12 21C9.5 18.5 8 15.5 8 12C8 8.5 9.5 5.5 12 3Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>
                <div
                  id="dropdown"
                  className={`${isDropdownOpen ? "block" : "hidden"} absolute left-0 mt-2 w-25 bg-white border border-gray-300 rounded-lg shadow-lg z-40`}
                >
                  <ul className="pb-4 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <a
                        href="#"
                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        <div className="inline-flex items-center space-x-2">
                          <img
                            src="/united-kingdom-uk-svgrepo-com.svg"
                            alt="united-kingdom"
                            className="w-5 h-5"
                          />
                          <span>English</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        <div className="inline-flex items-center space-x-3">
                          <img
                            src="/flag-for-flag-thailand-svgrepo-com.svg"
                            alt="Thailand"
                            className="w-5 h-5"
                          />
                          <span>ไทย</span>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
    

              <button className="lg:hidden text-white text-2xl" onClick={toggleMenu}>
                {isMenuOpen ? "" : "☰"}
              </button>
                <div
                  ref={menuRef}
                  className= {`absolute top-0 right-0  h-screen bg-black  text-white flex flex-col p-6 z-60 
                   transition-transform duration-300 ease-in-out transform  ${isMenuOpen ? "translate-x-0" : "translate-x-full"} ` }
                >
                  <div className="flex flex-row items-center space-x-2">
                      <a href="#" className="p-4 hover:text-gray-300 flex items-center">
                        <img src="/united-kingdom-uk-svgrepo-com.svg" alt="united-kingdom" className="w-5 h-5 mr-2" />
                        English
                      </a>
                      <a href="#" className="p-4 hover:text-gray-300 flex items-center">
                        <img src="/flag-for-flag-thailand-svgrepo-com.svg" alt="Thailand" className="w-5 h-5 mr-2" />
                        ไทย
                      </a>
                  </div>
                  <div className="flex flex-col ">
                  <a href="#" className="flex items-center p-4 hover:text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                  <path fill="white" stroke="white"  strokeWidth="1"    d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 11 21 L 11 15 L 13 15 L 13 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z M 12 4.7910156 L 18 10.191406 L 18 11 L 18 19 L 15 19 L 15 13 L 9 13 L 9 19 L 6 19 L 6 10.191406 L 12 4.7910156 z"></path>
                  </svg>
                    หน้าหลัก
                  </a>
                  <a href="#" className="flex items-center p-4 hover:text-gray-300">
                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" className="w-5 h-5 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0 1.5C0 1.22386 0.223858 1 0.5 1H2.5C2.77614 1 3 1.22386 3 1.5C3 1.77614 2.77614 2 2.5 2H0.5C0.223858 2 0 1.77614 0 1.5ZM4 1.5C4 1.22386 4.22386 1 4.5 1H14.5C14.7761 1 15 1.22386 15 1.5C15 1.77614 14.7761 2 14.5 2H4.5C4.22386 2 4 1.77614 4 1.5ZM4 4.5C4 4.22386 4.22386 4 4.5 4H11.5C11.7761 4 12 4.22386 12 4.5C12 4.77614 11.7761 5 11.5 5H4.5C4.22386 5 4 4.77614 4 4.5ZM0 7.5C0 7.22386 0.223858 7 0.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H4.5C4.22386 11 4 10.7761 4 10.5ZM0 13.5C0 13.2239 0.223858 13 0.5 13H2.5C2.77614 13 3 13.2239 3 13.5C3 13.7761 2.77614 14 2.5 14H0.5C0.223858 14 0 13.7761 0 13.5ZM4 13.5C4 13.2239 4.22386 13 4.5 13H14.5C14.7761 13 15 13.2239 15 13.5C15 13.7761 14.7761 14 14.5 14H4.5C4.22386 14 4 13.7761 4 13.5Z" fill="currentColor"></path></svg>
                    Pop-Up Store
                  </a>
                  <a href="#" className="flex items-center p-4 hover:text-gray-300">
                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" className="w-5 h-5 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0 1.5C0 1.22386 0.223858 1 0.5 1H2.5C2.77614 1 3 1.22386 3 1.5C3 1.77614 2.77614 2 2.5 2H0.5C0.223858 2 0 1.77614 0 1.5ZM4 1.5C4 1.22386 4.22386 1 4.5 1H14.5C14.7761 1 15 1.22386 15 1.5C15 1.77614 14.7761 2 14.5 2H4.5C4.22386 2 4 1.77614 4 1.5ZM4 4.5C4 4.22386 4.22386 4 4.5 4H11.5C11.7761 4 12 4.22386 12 4.5C12 4.77614 11.7761 5 11.5 5H4.5C4.22386 5 4 4.77614 4 4.5ZM0 7.5C0 7.22386 0.223858 7 0.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H4.5C4.22386 11 4 10.7761 4 10.5ZM0 13.5C0 13.2239 0.223858 13 0.5 13H2.5C2.77614 13 3 13.2239 3 13.5C3 13.7761 2.77614 14 2.5 14H0.5C0.223858 14 0 13.7761 0 13.5ZM4 13.5C4 13.2239 4.22386 13 4.5 13H14.5C14.7761 13 15 13.2239 15 13.5C15 13.7761 14.7761 14 14.5 14H4.5C4.22386 14 4 13.7761 4 13.5Z" fill="currentColor"></path></svg>
                    100 เดียวเที่ยวได้งาน
                  </a>
                  <a href="#" className="flex items-center p-4 hover:text-gray-300">
                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" className="w-5 h-5 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0 1.5C0 1.22386 0.223858 1 0.5 1H2.5C2.77614 1 3 1.22386 3 1.5C3 1.77614 2.77614 2 2.5 2H0.5C0.223858 2 0 1.77614 0 1.5ZM4 1.5C4 1.22386 4.22386 1 4.5 1H14.5C14.7761 1 15 1.22386 15 1.5C15 1.77614 14.7761 2 14.5 2H4.5C4.22386 2 4 1.77614 4 1.5ZM4 4.5C4 4.22386 4.22386 4 4.5 4H11.5C11.7761 4 12 4.22386 12 4.5C12 4.77614 11.7761 5 11.5 5H4.5C4.22386 5 4 4.77614 4 4.5ZM0 7.5C0 7.22386 0.223858 7 0.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H4.5C4.22386 11 4 10.7761 4 10.5ZM0 13.5C0 13.2239 0.223858 13 0.5 13H2.5C2.77614 13 3 13.2239 3 13.5C3 13.7761 2.77614 14 2.5 14H0.5C0.223858 14 0 13.7761 0 13.5ZM4 13.5C4 13.2239 4.22386 13 4.5 13H14.5C14.7761 13 15 13.2239 15 13.5C15 13.7761 14.7761 14 14.5 14H4.5C4.22386 14 4 13.7761 4 13.5Z" fill="currentColor"></path></svg>
                    สิทธิพิเศษ
                  </a>
                  <a href="#" className="flex items-center p-4 hover:text-gray-300">
                  <svg stroke="currentColor" fill="none" strokeWidth="0" viewBox="0 0 15 15" className="w-5 h-5 mr-2" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0 1.5C0 1.22386 0.223858 1 0.5 1H2.5C2.77614 1 3 1.22386 3 1.5C3 1.77614 2.77614 2 2.5 2H0.5C0.223858 2 0 1.77614 0 1.5ZM4 1.5C4 1.22386 4.22386 1 4.5 1H14.5C14.7761 1 15 1.22386 15 1.5C15 1.77614 14.7761 2 14.5 2H4.5C4.22386 2 4 1.77614 4 1.5ZM4 4.5C4 4.22386 4.22386 4 4.5 4H11.5C11.7761 4 12 4.22386 12 4.5C12 4.77614 11.7761 5 11.5 5H4.5C4.22386 5 4 4.77614 4 4.5ZM0 7.5C0 7.22386 0.223858 7 0.5 7H2.5C2.77614 7 3 7.22386 3 7.5C3 7.77614 2.77614 8 2.5 8H0.5C0.223858 8 0 7.77614 0 7.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H14.5C14.7761 7 15 7.22386 15 7.5C15 7.77614 14.7761 8 14.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H4.5C4.22386 11 4 10.7761 4 10.5ZM0 13.5C0 13.2239 0.223858 13 0.5 13H2.5C2.77614 13 3 13.2239 3 13.5C3 13.7761 2.77614 14 2.5 14H0.5C0.223858 14 0 13.7761 0 13.5ZM4 13.5C4 13.2239 4.22386 13 4.5 13H14.5C14.7761 13 15 13.2239 15 13.5C15 13.7761 14.7761 14 14.5 14H4.5C4.22386 14 4 13.7761 4 13.5Z" fill="currentColor"></path></svg>
                    แบบสอบถาม
                  </a>    
                  </div>
                  
                </div>
             
         </div>
       </div>
     </div>
   );
 }
 
