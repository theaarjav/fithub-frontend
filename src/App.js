import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Home } from './components/Home';
import { NavbarApp } from './components/Navbar';
import { UserRegister } from './components/UserRegister';
import { UserLogin } from './components/UserLogin';
import { Users } from './components/Users';
import { UserProfile } from './components/UserProfile';
import { EditProfile } from './components/EditProfile';
import { NewEd } from './components/NewEd';
import { NewExp } from './components/NewExp';
import { CreateProfile } from './components/CreateProfile';
import { Feed } from './components/Feed';
import { FollowersList } from './components/FollowersList';
import { FollowingList } from './components/FollowingList';
import { MyPosts } from './components/MyPosts';
import { SelectedPost } from './components/SelectedPost';
function App() {
  return (
    <BrowserRouter>
      <NavbarApp/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/user/register' element={<UserRegister/>}></Route>
        <Route path='/user/login' element={<UserLogin/>}></Route>
        <Route path='/editProfile' element={<EditProfile/>}></Route>
        <Route path='/users' element={<Users/>}></Route>
        <Route path='/users/:profileID' element={<UserProfile/>}></Route>
        <Route path='/addEducation' element={<NewEd/>}></Route>
        <Route path='/addExperience' element={<NewExp/>}></Route>
        {/* <Route path='/createProfile' element={<CreateProfile/>}></Route> */}
        <Route path='/feed' element={<Feed/>}></Route>
        <Route path='/followers' element={<FollowersList/>}></Route>
        <Route path='/following' element={<FollowingList/>}></Route>
        <Route path='/yourPosts' element={<MyPosts/>}></Route>
        <Route path='/p/:postID' element={<SelectedPost/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
