import React, { useState } from 'react'
import logo from '@/assets/images/logo.png'
import { Button } from './ui/button'
import { MdLogin } from "react-icons/md";
import { Link } from 'react-router-dom'
import SearchBox from './SearchBox';
import { RouteBlogAdd, RouteIndex, RouteProfile, RouteSignin } from '@/helper/RouteName';
import { useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user_icon.svg'
import { FaRegUser } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { removeUser } from '@/redux/user/user.slice';
import { showToast } from '@/helper/showtoast';
import { getenv } from '@/helper/getenv';
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from "react-icons/io";
import { MdMenu } from "react-icons/md";
import { useSidebar } from './ui/sidebar';

function topbar() {
  const { toggleSidebar } = useSidebar()

  const [showSearch,setShowSearch] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
const handleLogout = async () => {
  try {
    const res = await fetch(`${getenv('VITE_API_BASE_URL')}/auth/logout`, {
      method: 'GET',
      credentials: 'include',
    });

    const data = await res.json();

    if (!res.ok) {
      return showToast('error',data.message)
    }

    dispatch(removeUser());
    navigate(RouteIndex);
    showToast('success', 'Logout successful');
    
  } catch (err) {
    showToast('error', err.message || 'Something went wrong');
  }
};

 const toggleSearch = () =>{
   setShowSearch(!showSearch)
 }
  return (
    <div className='flex justify-between items-center h-18  fixed w-full z-20 bg-white px-5 border-b'>
      <div className='flex justify-center items-center gap-2'>
        <button onClick={toggleSidebar} className='md:hidden' type='button'>
          <MdMenu/>
        </button>
        <Link to={RouteIndex}><img src={logo} alt="Logo" className="h-20 w-20" /></Link>
        
      </div>
      <div className='w-[500]px'>
<div
  className={`absolute bg-white left-0 w-full top-15 md:top-0 p-3 md:p-0 
    ${showSearch ? 'block' : 'hidden'} 
    md:block md:relative`}
>
  <SearchBox />

          </div>  
        
      </div>
      <div className='flex items-center gap-5'>
        <button  onClick={toggleSearch}type='button' className='md:hidden block'>
          <IoMdSearch size={25}/>
        </button>

       
        {!user.isLoggedIn ?
          <Button  asChild className='rounded-full'>

            <Link to={RouteSignin}>
              <MdLogin />
              Sign In
            </Link>
          </Button>
          :
          <DropdownMenu>
            <DropdownMenuTrigger><Avatar>
              <AvatarImage src={user.user.avatar || usericon} />
              
            </Avatar></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel><p>{user.user.name}</p>
                <p className='text-sm'>{user.user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link to={RouteProfile}><FaRegUser /> Profile
              </Link></DropdownMenuItem >
              <DropdownMenuItem asChild><Link to={RouteBlogAdd}><FaPlus /> Create blog
              </Link></DropdownMenuItem >


              <DropdownMenuSeparator />
              <DropdownMenuItem  onClick={handleLogout}><IoLogOutOutline color='red' /> LogOut
             </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
    </div>
  )
}

export default topbar
