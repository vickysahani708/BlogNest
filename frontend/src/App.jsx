
import  Layout  from '@/Layout/Layout'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RouteAddCategory, RouteBlog, RouteBlogAdd, RouteBlogByCategory, RouteBlogDetails, RouteBlogEdit, RouteCategoryDetails, RouteCommentsDetails, RouteEditCategory, RouteIndex, RouteProfile, RouteSearch, RouteSignin,RouteSignUp, RouteUser } from "./helper/RouteName"
import Index from "./Pages/Index"
import Signin from './Pages/Signin'
import SignUp from './Pages/SignUp'
import Profile from './Pages/Profile'
import AddCategory from './Pages/Category/AddCategory'
import CategoryDetails from './Pages/Category/CategoryDetails'
import EditCategory from './Pages/Category/EditCategory'
import AddBlog from './Pages/Blog/AddBlog'
import BlogDetails from './Pages/Blog/BlogDetails'
import EditBlog from './Pages/Blog/EditBlog'
import BlogHome from './Pages/BlogHome'
import BlogByCategory from './Pages/Blog/BlogByCategory'
import SearchResult from './Pages/SearchResult'
import Comments from './Pages/Comments'
import Users from './Pages/Users'
import AuthRouteProtection from './components/AuthRouteProtection'
import AuthRouteAdmin from './components/AutoRouteAdmin'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path={RouteIndex} element={<Layout/>}>

             <Route index element={<Index/>}/>
             
            
             {/*Home*/}
            <Route path={RouteBlogDetails()} element={<BlogHome/>}/>
            <Route path={RouteBlogByCategory()} element={<BlogByCategory/>}/>
            <Route path={RouteSearch()} element={<SearchResult/>}/>
             
             
             <Route element={<AuthRouteProtection/>}> 
              <Route path={RouteProfile} element={<Profile/>}/>
             {/* Blog */}
             <Route path={RouteBlogAdd} element={<AddBlog/>}/>
             <Route path={RouteBlog} element={<BlogDetails/>}/>
             <Route path={RouteBlogEdit()} element={<EditBlog/>}/>
             {/* Comments */}
             <Route path={RouteCommentsDetails} element={<Comments/>}/>
             </Route>
             {/* Admin  */}
             <Route element = {<AuthRouteAdmin/>} > 
              {/* Blog Category*/}
             <Route path={RouteAddCategory} element={<AddCategory/>}/>
             <Route path={RouteCategoryDetails} element={<CategoryDetails/>}/>
             <Route path={RouteEditCategory()} element={<EditCategory/>}/>
              <Route path={RouteUser} element={<Users/>}/>
             </Route>

           </Route>
          <Route path={RouteSignin} element={<Signin/>}/>
           <Route path={RouteSignUp} element={<SignUp/>}/>
         
        </Routes>
    </BrowserRouter>
  )
}

export default App