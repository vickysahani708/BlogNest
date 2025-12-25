import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import logo from '@/assets/images/logo.png'
import { IoHomeOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComment } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import { RouteBlog, RouteBlogByCategory, RouteCategoryDetails, RouteCommentsDetails, RouteIndex, RouteUser } from "@/helper/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getenv } from "@/helper/getenv";
import { useSelector } from "react-redux";





export function AppSidebar() {
  const user = useSelector(state => state.user)
  const { data: categoryData } = useFetch(`${getenv('VITE_API_BASE_URL')}/category/all-category`, {
    method: 'GET',
    credentials: 'include'
  },)
  return (
    <Sidebar>
      <SidebarHeader className='h-18'>
        <img src={logo} alt="Blognest Logo"
          className='h-20 w-20 mb-20' />
      </SidebarHeader>
      <SidebarContent className='bg-white'>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <IoHomeOutline />
                <Link to={RouteIndex}>Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>


            {user && user.isLoggedIn
              ? <><SidebarMenuItem>
                <SidebarMenuButton>
                  <GrBlog />
                  <Link to={RouteBlog}>Blogs</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FaRegComment />
                    <Link to={RouteCommentsDetails}>Comments</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
              :
              <></>
            }

            {user && user.isLoggedIn && user.user.role === 'admin'
              ?
              <><SidebarMenuItem>
                <SidebarMenuButton>
                  <BiCategory />
                  <Link to={RouteCategoryDetails}>Categories</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LuUsers />
                    <Link to={RouteUser}>Users</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
              :
              <></>
            }

          </SidebarMenu>
        </SidebarGroup>


        <SidebarGroup>
          <SidebarGroupLabel>
            Categories
          </SidebarGroupLabel>
          <SidebarMenu>
            {categoryData?.category?.length > 0 && categoryData.category.map(category =>
              <SidebarMenuItem key={category._id}>
                <SidebarMenuButton>
                  <GoDot />
                  <Link to={RouteBlogByCategory(category.slug)}>{category.slug}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>)
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}